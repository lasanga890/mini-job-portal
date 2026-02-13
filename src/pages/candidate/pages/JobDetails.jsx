
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getJobById } from '../../../services/jobService';
import { applyToJob, hasAppliedToJob } from '../../../services/applicationService';
import { getEmployerProfile } from '../../../services/employerService';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';
import Modal from '../../../components/common/Modal';
import JobDetailsView from '../../../components/common/JobDetailsView';

const JobDetails = () => {
    const { jobId } = useParams();
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
    const [companyProfile, setCompanyProfile] = useState(null);
    const [loadingCompany, setLoadingCompany] = useState(false);
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
            // Step 1: Create application first to get its ID for storage path
            let applicationId;
            
            // Step 2: Prepare CV for this application
            let finalCvUrl = null;
            
            if (cvFile) {
                // User uploading a new CV for this application
                // We'll upload after creating the application to get its ID
            } else if (!user.cvUrl) {
                // User has no existing CV and didn't provide one
                setError('Please upload your CV before applying.');
                setApplying(false);
                return;
            } else {
                // Use existing profile CV
                finalCvUrl = user.cvUrl;
            }

            // Step 3: Create the application document (gets an ID)
            const appData = {
                jobId,
                candidateId: user.uid,
                candidateName: applicationForm.name,
                candidateEmail: applicationForm.email,
                message: applicationForm.message,
                jobTitle: job.title,
                employerId: job.employerId,
                employerName: job.employerName || 'Company',
                cvUrl: finalCvUrl, // Will be updated if new CV uploaded
                status: 'pending',
            };

            applicationId = await applyToJob(appData);

            // Step 4: If new CV was selected, upload it to applications/{applicationId}/
            if (cvFile) {
                try {
                    const { uploadApplicationCV } = await import('../../../services/candidateService');
                    const uploadRes = await uploadApplicationCV(applicationId, user.uid, cvFile);
                    finalCvUrl = uploadRes.url;

                    // Update the application document with the new CV URL
                    const { doc, updateDoc } = await import('firebase/firestore');
                    const { db } = await import('../../../firebase/firebaseConfig');
                    await updateDoc(doc(db, 'applications', applicationId), { cvUrl: finalCvUrl });
                } catch (uploadErr) {
                    throw new Error(`CV Upload for application failed: ${uploadErr.message}`);
                }
            }

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

    const handleViewCompanyProfile = async () => {
        if (companyProfile) {
            setIsCompanyModalOpen(true);
            return;
        }

        setLoadingCompany(true);
        try {
            const profile = await getEmployerProfile(job.employerId);
            setCompanyProfile(profile);
            setIsCompanyModalOpen(true);
        } catch (err) {
            console.error("Failed to fetch company profile:", err);
        } finally {
            setLoadingCompany(false);
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
                {success && (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-500 px-4 py-3 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        <span className="text-sm font-medium">{success}</span>
                    </div>
                )}
                <JobDetailsView
                    job={job}
                    applied={applied}
                    onBack={() => navigate(-1)}
                    onApply={() => user ? setIsModalOpen(true) : navigate('/login')}
                    onViewCompanyProfile={handleViewCompanyProfile}
                    loadingCompany={loadingCompany}
                />
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

            {/* Company Profile Modal */}
            <Modal
                isOpen={isCompanyModalOpen}
                onClose={() => setIsCompanyModalOpen(false)}
                title="Company Profile"
            >
                {companyProfile ? (
                    <div className="space-y-6">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-2xl font-bold text-white">{companyProfile.companyName || job.employerName}</h2>
                            {companyProfile.industry && (
                                <p className="text-accent-purple font-medium uppercase tracking-wider text-xs">{companyProfile.industry}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {companyProfile.location && (
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <p className="text-xs text-text-dim uppercase font-bold tracking-widest mb-1">Headquarters</p>
                                    <p className="text-white font-medium flex items-center gap-2">
                                        <span>📍</span> {companyProfile.location}
                                    </p>
                                </div>
                            )}
                            {companyProfile.website && (
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <p className="text-xs text-text-dim uppercase font-bold tracking-widest mb-1">Official Website</p>
                                    <a
                                        href={companyProfile.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-accent-purple hover:underline font-medium flex items-center gap-2 truncate"
                                    >
                                        <span>🌐</span> {companyProfile.website.replace(/^https?:\/\//, '')}
                                    </a>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <p className="text-xs text-text-dim uppercase font-bold tracking-widest px-1">About the Mission</p>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-text-dim leading-relaxed whitespace-pre-wrap">
                                {companyProfile.description || "No company description provided."}
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button
                                variant="primary"
                                className="w-full font-bold"
                                onClick={() => setIsCompanyModalOpen(false)}
                            >
                                Close Overview
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-text-dim italic">Profile details are currently unavailable.</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default JobDetails;
