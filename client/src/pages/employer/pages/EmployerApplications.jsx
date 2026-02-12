
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getEmployerApplications, updateApplicationStatus } from '../../../services/applicationService';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';

const EmployerApplications = () => {
    const { user, loading: authLoading } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const data = await getEmployerApplications(user.uid);
                setApplications(data);
            } catch (error) {
                console.error("Error fetching applications:", error);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading && user) {
            fetchApplications();
        }
    }, [user, authLoading]);

    const handleStatusUpdate = async (appId, newStatus) => {
        setUpdatingId(appId);
        try {
            await updateApplicationStatus(appId, newStatus);
            setApplications(prev => prev.map(app =>
                app.id === appId ? { ...app, status: newStatus } : app
            ));
        } catch (error) {
            console.error("Failed to update status:", error);
        } finally {
            setUpdatingId(null);
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

    if (authLoading || loading) return <Loading />;

    const filteredApps = filter === 'all'
        ? applications
        : applications.filter(app => app.status === filter);

    return (
        <div className="min-h-screen bg-primary-bg pt-24 px-4 sm:px-6 lg:px-8 font-sans text-text-main pb-12">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-text-dim mb-2">
                            Job Applications
                        </h1>
                        <p className="text-text-dim text-lg">Manage all incoming applications for your postings</p>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                        {['all', 'pending', 'shortlisted', 'rejected'].map(s => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border uppercase tracking-wider ${filter === s
                                        ? 'bg-accent-purple text-white border-accent-purple'
                                        : 'bg-white/5 text-text-dim border-white/10 hover:bg-white/10'
                                    }`}
                            >
                                {s} ({s === 'all' ? applications.length : applications.filter(a => a.status === s).length})
                            </button>
                        ))}
                    </div>
                </div>

                {filteredApps.length === 0 ? (
                    <div className="text-center py-20 bg-card-bg/50 rounded-2xl border border-white/5">
                        <h3 className="text-xl font-medium text-white mb-2">No applications found</h3>
                        <p className="text-text-dim">When candidates apply to your jobs, they will appear here.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {filteredApps.map(app => (
                            <Card key={app.id} className="p-6 border border-white/5 hover:border-white/10 transition-all">
                                <div className="flex flex-col lg:flex-row gap-6">
                                    {/* Candidate Info */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-1">{app.candidateName}</h3>
                                                <p className="text-accent-purple font-medium text-sm flex items-center gap-2">
                                                    🎯 {app.jobTitle}
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase self-start ${getStatusColor(app.status)}`}>
                                                {app.status}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-text-dim">
                                            <div className="flex items-center gap-2">
                                                <span>📧</span> {app.candidateEmail}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span>📅</span> Applied {app.createdAt?.toDate ? app.createdAt.toDate().toLocaleDateString() : 'Recently'}
                                            </div>
                                        </div>

                                        {app.message && (
                                            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                                <p className="text-xs text-text-dim uppercase font-bold tracking-widest mb-2">Message</p>
                                                <p className="text-sm text-text-main italic leading-relaxed">"{app.message}"</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="lg:w-64 flex flex-col gap-3 justify-center border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0 lg:pl-6">
                                        <Button
                                            variant="secondary"
                                            className="w-full text-xs font-bold"
                                            onClick={() => window.open(app.cvUrl, '_blank')}
                                        >
                                            📄 View Resume
                                        </Button>

                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                className={`bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500 hover:text-white transition-all text-[10px] font-bold uppercase ${app.status === 'shortlisted' ? 'ring-2 ring-green-500' : ''}`}
                                                onClick={() => handleStatusUpdate(app.id, 'shortlisted')}
                                                loading={updatingId === app.id}
                                                disabled={app.status === 'shortlisted'}
                                            >
                                                Shortlist
                                            </Button>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                className={`bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500 hover:text-white transition-all text-[10px] font-bold uppercase ${app.status === 'rejected' ? 'ring-2 ring-red-500' : ''}`}
                                                onClick={() => handleStatusUpdate(app.id, 'rejected')}
                                                loading={updatingId === app.id}
                                                disabled={app.status === 'rejected'}
                                            >
                                                Reject
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployerApplications;
