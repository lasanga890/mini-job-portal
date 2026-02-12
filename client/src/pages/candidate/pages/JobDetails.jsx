
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getJobById } from '../../../services/jobService';
import { applyToJob, hasAppliedToJob } from '../../../services/applicationService';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';
import Modal from '../../../components/common/Modal';

const JobDetails = () => {
    const { jobId } = useParams();
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cvFile, setCvFile] = useState(null);
    const [applicationForm, setApplicationForm] = useState({
        name: '',
        email: '',
        message: '',
    });

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [applied, setApplied] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchJobData = async () => {
            try {
                const [jobData, alreadyApplied] = await Promise.all([
                    getJobById(jobId),
                    user ? hasAppliedToJob(user.uid, jobId) : false
                ]);

                if (!jobData) {
                    setError('Job not found.');
                } else {
                    setJob(jobData);
                    setApplied(alreadyApplied);
                    if (user) {
                        setApplicationForm({
                            name: user.name || user.displayName || '',
                            email: user.email || '',
                            message: '',
                        });
                    }
                }
            } catch (err) {
                console.error('Error fetching job details:', err);
                setError('Failed to load job details.');
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            fetchJobData();
        }
    }, [jobId, user, authLoading]);

    const handleApply = async (e) => {
        e.preventDefault();

        if (!user.cvUrl && !cvFile) {
            setError('Please upload your CV before applying.');
            return;
        }

        setApplying(true);
        setError('');
        setSuccess('');

        try {
            let finalCvUrl = user.cvUrl;

            // 1. If a new CV file is selected, upload it first
            if (cvFile) {
                try {
                    const { uploadCV } = await import('../../../services/candidateService');
                    finalCvUrl = await uploadCV(user.uid, cvFile);
                } catch (uploadErr) {
                    throw new Error(`CV Upload failed: ${uploadErr.message}`);
                }
            }

            // 2. Submit application
            await applyToJob({
                jobId,
                candidateId: user.uid,
                candidateName: applicationForm.name,
                candidateEmail: applicationForm.email,
                message: applicationForm.message,
                jobTitle: job.title,
                employerId: job.employerId,
                employerName: job.employerName || 'Company',
                cvUrl: finalCvUrl,
            });

            setSuccess('Application submitted successfully!');
            setApplied(true);
            setIsModalOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error('Error submitting application:', err);
            setError(err.message || 'Failed to submit application. Please try again.');
        } finally {
            setApplying(false);
        }
    };

    if (authLoading || loading) {
        return <Loading />;
    }

    if (error && !job) {
        return (
            <div className="min-h-screen bg-primary-bg pt-24 px-4 text-center">
                <Card className="max-w-md mx-auto p-8">
                    <h2 className="text-xl font-bold text-red-500 mb-4">{error}</h2>
                    <Button onClick={() => navigate(-1)}>Go Back</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary-bg pt-24 px-4 sm:px-6 lg:px-8 font-sans text-text-main pb-12">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => navigate(-1)}
                            className="mb-4"
                        >
                            ← Back to Jobs
                        </Button>
                        <h1 className="text-3xl sm:text-4xl font-bold text-white">
                            {job.title}
                        </h1>
                        <p className="text-xl text-accent-purple font-medium">
                            {job.employerName || 'Unknown Company'}
                        </p>
                    </div>

                    <div className="shrink-0">
                        {applied ? (
                            <div className="flex items-center gap-2 px-6 py-3 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl font-bold">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                Applied
                            </div>
                        ) : (
                            <Button
                                variant="primary"
                                size="lg"
                                className="px-10 shadow-accent-purple/40 font-bold"
                                onClick={() => user ? setIsModalOpen(true) : navigate('/login')}
                            >
                                Apply Now
                            </Button>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="text-sm font-medium">{error} {error.includes('CV') && <span className="underline cursor-pointer ml-1" onClick={() => navigate('/candidate/profile')}>Go to Profile</span>}</span>
                    </div>
                )}

                {success && (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-500 px-4 py-3 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        <span className="text-sm font-medium">{success}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="p-8">
                            <h2 className="text-xl font-bold text-white mb-6 border-b border-white/5 pb-4">Job Description</h2>
                            <div className="prose prose-invert max-w-none text-text-dim leading-relaxed whitespace-pre-wrap">
                                {job.description}
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <Card className="p-6 space-y-6">
                            <h3 className="text-lg font-bold text-white">Job Details</h3>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <span className="text-white/40 mt-1">📍</span>
                                    <div>
                                        <p className="text-xs text-text-dim uppercase font-bold tracking-wider">Location</p>
                                        <p className="text-white font-medium">{job.location}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <span className="text-white/40 mt-1">💼</span>
                                    <div>
                                        <p className="text-xs text-text-dim uppercase font-bold tracking-wider">Job Type</p>
                                        <p className="text-white font-medium">{job.type}</p>
                                    </div>
                                </div>

                                {job.salary && (
                                    <div className="flex items-start gap-3">
                                        <span className="text-white/40 mt-1">💰</span>
                                        <div>
                                            <p className="text-xs text-text-dim uppercase font-bold tracking-wider">Salary</p>
                                            <p className="text-white font-medium">{job.salary}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start gap-3">
                                    <span className="text-white/40 mt-1">📅</span>
                                    <div>
                                        <p className="text-xs text-text-dim uppercase font-bold tracking-wider">Posted On</p>
                                        <p className="text-white font-medium">
                                            {job.createdAt?.toDate ? job.createdAt.toDate().toLocaleDateString() : 'Recently'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Company Card Mini */}
                        <Card className="p-6 bg-accent-purple/5 border-accent-purple/10">
                            <h3 className="text-lg font-bold text-white mb-2">About the Company</h3>
                            <p className="text-text-dim text-sm mb-4">
                                {job.employerName} is looking for talented individuals to join their team.
                            </p>
                            <Button variant="secondary" size="sm" className="w-full">
                                View Company Profile
                            </Button>
                        </Card>
                    </div>
                </div>

            </div>

            {/* Application Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`Apply for ${job.title}`}
            >
                <form onSubmit={handleApply} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-dim">Full Name</label>
                            <input
                                type="text"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent-purple transition-all"
                                value={applicationForm.name}
                                onChange={(e) => setApplicationForm({ ...applicationForm, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-dim">Email</label>
                            <input
                                type="email"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white/50 cursor-not-allowed outline-none"
                                value={applicationForm.email}
                                readOnly
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-dim">Message to Recruiter (Optional)</label>
                        <textarea
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple transition-all h-32 resize-none"
                            placeholder="Tell them why you're a good fit..."
                            value={applicationForm.message}
                            onChange={(e) => setApplicationForm({ ...applicationForm, message: e.target.value })}
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-text-dim">CV / Resume</label>

                        {/* Current CV Preview */}
                        {user.cvUrl && !cvFile && (
                            <div className="flex items-center justify-between p-3 bg-green-500/5 border border-green-500/10 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <p className="text-sm font-medium text-white truncate max-w-[200px]">
                                        {user.cvName || 'resume.pdf'}
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => document.getElementById('modal-cv-upload').click()}
                                >
                                    Change
                                </Button>
                            </div>
                        )}

                        <div
                            className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${cvFile ? 'border-accent-purple bg-accent-purple/5' : 'border-white/10 hover:border-white/20'
                                }`}
                            onClick={() => document.getElementById('modal-cv-upload').click()}
                        >
                            <input
                                id="modal-cv-upload"
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                onChange={(e) => setCvFile(e.target.files[0])}
                            />
                            {cvFile ? (
                                <div className="text-sm">
                                    <p className="text-white font-bold">{cvFile.name}</p>
                                    <p className="text-xs text-text-dim">Click to replace</p>
                                </div>
                            ) : !user.cvUrl ? (
                                <div className="text-sm text-text-dim">
                                    <p>Upload your PDF CV</p>
                                    <p className="text-xs">Required to apply</p>
                                </div>
                            ) : (
                                <p className="text-xs text-text-dim">Upload new PDF to replace stored CV</p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="secondary"
                            className="flex-1"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            className="flex-1 shadow-accent-purple/40 font-bold"
                            loading={applying}
                        >
                            Submit Application
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default JobDetails;
