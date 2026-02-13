import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getEmployerJobs } from '../../../services/jobService';
// 1. IMPORT THE NEW FUNCTION HERE
import { getFreshCvUrl } from '../../../services/applicationService';
import useEmployerApplications from '../../../hooks/useEmployerApplications';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';

const EmployerApplications = () => {
    // ... (Keep existing state and useEffects exactly as they are) ...
    const { user, loading: authLoading } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [jobsLoading, setJobsLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedJobId, setSelectedJobId] = useState(null);
    const { applications, loading: appsLoading, updatingId, updateStatus } = useEmployerApplications(user?.uid);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setJobsLoading(true);
                const jobsData = await getEmployerJobs(user.uid);
                setJobs(jobsData);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setJobsLoading(false);
            }
        };

        if (!authLoading && user) {
            fetchJobs();
        }
    }, [user, authLoading]);

    // 2. ADD THIS NEW HANDLER FUNCTION
    const handleViewResume = async (candidateId) => {
        try {
            // This gets a brand new token from Firebase
            const freshUrl = await getFreshCvUrl(candidateId);
            window.open(freshUrl, '_blank');
        } catch (error) {
            alert("Unable to open CV. The file may be missing or access is denied.");
            console.error(error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            case 'shortlisted': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'rejected': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-text-dim bg-white/5 border-white/10';
        }
    };

    if (authLoading || appsLoading || jobsLoading) return <Loading />;

    // ... (Keep jobGroups logic exactly as is) ...
    const jobGroups = {};
    jobs.forEach(job => {
        jobGroups[job.id] = { title: job.title, apps: [] };
    });

    applications.forEach(app => {
        const jobId = app.jobId;
        if (jobGroups[jobId]) {
            jobGroups[jobId].apps.push(app);
        } else {
            if (!jobGroups[jobId || 'general']) {
                jobGroups[jobId || 'general'] = { title: app.jobTitle || 'General Application', apps: [] };
            }
            jobGroups[jobId || 'general'].apps.push(app);
        }
    });

    const filteredApps = filter === 'all'
        ? (selectedJobId ? jobGroups[selectedJobId]?.apps || [] : applications)
        : (selectedJobId
            ? (jobGroups[selectedJobId]?.apps || []).filter(app => app.status === filter)
            : applications.filter(app => app.status === filter));

    return (
        <div className="min-h-screen bg-primary-bg pt-24 px-4 sm:px-6 lg:px-8 font-sans text-text-main pb-12">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* ... (Keep Header Section and Job Summary Cards exactly as is) ... */}

                {/* Header Section Code Omitted for brevity - Keep it the same */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1">
                        {/* ... Header content ... */}
                        <div className="flex items-center gap-4 mb-3">
                            {selectedJobId && (
                                <button
                                    onClick={() => { setSelectedJobId(null); setFilter('all'); }}
                                    className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-accent-purple transition-all group border border-white/5 hover:border-white/10"
                                >
                                    <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                            )}
                            <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-text-dim capitalize">
                                {selectedJobId ? jobGroups[selectedJobId]?.title : 'Job Applications'}
                            </h1>
                        </div>
                        <p className="text-text-dim text-lg">
                            {selectedJobId
                                ? `Viewing detailed applicant list for this role`
                                : 'Select a job to manage incoming candidate applications'}
                        </p>
                    </div>
                    {/* ... Filter buttons ... */}
                    {selectedJobId && (
                        <div className="flex gap-2 flex-wrap bg-white/5 p-1.5 rounded-2xl border border-white/5">
                            {['all', 'pending', 'shortlisted', 'rejected'].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setFilter(s)}
                                    className={`px-5 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${filter === s
                                        ? 'bg-accent-purple text-white shadow-lg shadow-accent-purple/20'
                                        : 'text-text-dim hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {s} <span className="ml-1 opacity-60">({s === 'all' ? jobGroups[selectedJobId].apps.length : jobGroups[selectedJobId].apps.filter(a => a.status === s).length})</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {jobs.length === 0 ? (
                    /* ... No Jobs View ... */
                    <div className="text-center py-20 bg-card-bg/50 rounded-3xl border border-white/5 backdrop-blur-sm">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl"></div>
                        <h3 className="text-2xl font-bold text-white mb-2">No jobs posted yet</h3>
                        <p className="text-text-dim max-w-md mx-auto">Once you post a job, it will appear here for you to manage incoming applications.</p>
                        <Button
                            variant="primary"
                            className="mt-6"
                            onClick={() => window.location.href = '/employer/post-job'}
                        >
                            Post Your First Job
                        </Button>
                    </div>
                ) : !selectedJobId ? (
                    /* ... Dashboard Cards View ... */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-700">
                        {Object.entries(jobGroups).map(([jobId, { title, apps }]) => (
                            <Card key={jobId} className="p-7 border border-white/5 hover:border-accent-purple/30 transition-all group relative overflow-hidden flex flex-col bg-card-bg/40 backdrop-blur-md">
                                {/* ... Card content ... */}
                                <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent-purple/10 blur-3xl rounded-full group-hover:bg-accent-purple/20 transition-all duration-500" />

                                <h3 className="text-xl font-bold text-white mb-6 pr-4 line-clamp-2 min-h-[3.5rem] group-hover:text-accent-purple transition-colors">{title}</h3>

                                <div className="space-y-4 mb-8 flex-1">
                                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <span className="text-text-dim text-sm font-bold uppercase tracking-widest">Total Candidates</span>
                                        <span className="text-3xl font-black text-white">{apps.length}</span>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="bg-white/5 border border-white/5 rounded-2xl p-3 text-center hover:bg-yellow-400/5 hover:border-yellow-400/20 transition-colors">
                                            <p className="text-xl font-black text-yellow-400">{apps.filter(a => a.status === 'pending').length}</p>
                                            <p className="text-[10px] text-text-dim font-black uppercase tracking-widest">New</p>
                                        </div>
                                        <div className="bg-white/5 border border-white/5 rounded-2xl p-3 text-center hover:bg-green-400/5 hover:border-green-400/20 transition-colors">
                                            <p className="text-xl font-black text-green-400">{apps.filter(a => a.status === 'shortlisted').length}</p>
                                            <p className="text-[10px] text-text-dim font-black uppercase tracking-widest">Short</p>
                                        </div>
                                        <div className="bg-white/5 border border-white/5 rounded-2xl p-3 text-center hover:bg-red-400/5 hover:border-red-400/20 transition-colors">
                                            <p className="text-xl font-black text-red-400">{apps.filter(a => a.status === 'rejected').length}</p>
                                            <p className="text-[10px] text-text-dim font-black uppercase tracking-widest">Rej</p>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    variant="primary"
                                    className="w-full font-bold shadow-xl shadow-accent-purple/5 group-hover:shadow-accent-purple/20 transition-all py-4 rounded-xl"
                                    onClick={() => setSelectedJobId(jobId)}
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        Review Applicants
                                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                                    </span>
                                </Button>
                            </Card>
                        ))}
                    </div>
                ) : (
                    /* Detailed View */
                    <div className="space-y-6 animate-in slide-in-from-bottom-6 fade-in duration-700">
                        {filteredApps.length === 0 ? (
                            <div className="text-center py-20 bg-white/2 rounded-3xl border border-dashed border-white/10">
                                <p className="text-text-dim text-lg italic">No {filter !== 'all' ? filter : ''} applications found for this role.</p>
                                <Button variant="secondary" className="mt-4" onClick={() => setFilter('all')}>View All Applications</Button>
                            </div>
                        ) : (
                            filteredApps.map(app => (
                                <Card key={app.id} className="p-0 border border-white/5 hover:border-white/10 transition-all overflow-hidden flex flex-col lg:row gap-0 bg-card-bg/30">
                                    <div className="flex flex-col lg:flex-row">
                                        <div className="flex-1 p-7 space-y-6">
                                            {/* ... (Keep candidate info exactly as is) ... */}
                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                                                <div>
                                                    <h3 className="text-2xl font-black text-white mb-2 tracking-tight">{app.candidateName}</h3>
                                                    <div className="flex flex-wrap gap-3">
                                                        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-sm text-text-dim font-medium">
                                                            <span className="text-accent-purple">@</span> {app.candidateEmail}
                                                        </div>
                                                        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-sm text-text-dim font-medium">
                                                            <span>📅</span> {app.createdAt?.toDate ? app.createdAt.toDate().toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : 'Recent'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className={`px-5 py-2 rounded-xl text-[10px] font-black border uppercase tracking-[0.2em] shadow-sm ${getStatusColor(app.status)}`}>
                                                    {app.status}
                                                </span>
                                            </div>

                                            {app.message && (
                                                <div className="bg-white/2 rounded-2xl p-6 border border-white/5 relative group/msg">
                                                    <div className="absolute -top-3 left-6 px-4 py-0.5 bg-primary-bg border border-white/10 rounded-full text-[10px] font-black text-accent-purple uppercase tracking-[0.15em]">
                                                        Cover Note
                                                    </div>
                                                    <p className="text-sm text-text-main italic leading-relaxed font-medium opacity-90">"{app.message}"</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="lg:w-80 flex flex-col gap-3 justify-center p-7 lg:border-l border-white/5 bg-white/2 backdrop-blur-xl">
                                            {/* 3. UPDATED BUTTON: Calls handleViewResume with candidateId */}
                                            <Button
                                                variant="secondary"
                                                className="w-full font-black py-4 border-2 border-white/5 hover:border-white/10 group/cv"
                                                onClick={() => handleViewResume(app.candidateId)}
                                            >
                                                <span className="flex items-center justify-center gap-2">
                                                    <span className="text-lg group-hover/cv:scale-110 transition-transform">📄</span>
                                                    <span>View Full CV</span>
                                                </span>
                                            </Button>

                                            {/* ... (Keep Status Update buttons exactly as is) ... */}
                                            <div className="grid grid-cols-2 gap-3 mt-2">
                                                <button
                                                    onClick={() => updateStatus(app.id, 'shortlisted')}
                                                    disabled={updatingId === app.id || app.status === 'shortlisted'}
                                                    className={`py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${app.status === 'shortlisted'
                                                        ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/20'
                                                        : 'bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500 hover:text-white hover:border-green-500'
                                                        } disabled:opacity-50`}
                                                >
                                                    {updatingId === app.id ? '...' : 'Shortlist'}
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(app.id, 'rejected')}
                                                    disabled={updatingId === app.id || app.status === 'rejected'}
                                                    className={`py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${app.status === 'rejected'
                                                        ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20'
                                                        : 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500'
                                                        } disabled:opacity-50`}
                                                >
                                                    {updatingId === app.id ? '...' : 'Reject'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployerApplications;