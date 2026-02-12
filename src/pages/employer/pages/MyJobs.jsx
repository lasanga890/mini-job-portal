
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getEmployerJobs, deleteJob, updateJob } from '../../../services/jobService';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';
import Modal from '../../../components/common/Modal';
import JobForm from '../../../components/employer/JobForm';

const MyJobs = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getEmployerJobs(user.uid);
        setJobs(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load your jobs.");
      } finally {
        setLoading(false);
      }
    };

    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }
    fetchJobs();
  }, [user, authLoading, navigate]);

  const handleViewClick = (job) => {
    setSelectedJob(job);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = (job) => {
    setSelectedJob(job);
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (job) => {
    setSelectedJob(job);
    setIsEditModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsSaving(true);
    try {
      await deleteJob(selectedJob.id);
      setJobs(jobs.filter(job => job.id !== selectedJob.id));
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete job.");
    } finally {
      setIsSaving(false);
      setSelectedJob(null);
    }
  };

  const handleUpdateJob = async (formData) => {
    setIsSaving(true);
    try {
      await updateJob(selectedJob.id, formData);
      setJobs(jobs.map(job => job.id === selectedJob.id ? { ...job, ...formData } : job));
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update job.");
    } finally {
      setIsSaving(false);
      setSelectedJob(null);
    }
  };

  if (authLoading || loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-primary-bg pt-24 px-4 sm:px-6 lg:px-8 font-sans text-text-main pb-12">
      <div className="max-w-5xl mx-auto space-y-8">

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">My Job Postings</h1>
            <p className="text-text-dim mt-1">Manage and track your active job listings</p>
          </div>
          {/* <Button variant="primary" onClick={() => navigate('/employer/post-job')}>
            Post New Job
          </Button> */}
        </div>

        {error && <p className="text-red-500">{error}</p>}

        {jobs.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <h2 className="text-xl font-semibold text-white mb-2">No jobs posted yet</h2>
            <p className="text-text-dim mb-6">Start growing your team by posting your first job listing.</p>
            <Button variant="primary" onClick={() => navigate('/employer/post-job')}>
              Post a Job
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {jobs.map(job => (
              <Card key={job.id} className="p-6 hover:border-white/20 transition-all group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <h3 className="text-xl font-bold text-white group-hover:text-accent-purple transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-text-dim/80">
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        {job.type}
                      </span>
                      {job.salary && (
                        <span className="flex items-center gap-1.5">
                          <svg className="w-4 h-4 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" /></svg>
                          {job.salary}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5 opacity-60">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>
                        {job.createdAt?.toDate().toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-row items-center gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      // Removed w-full, kept w-24 for consistent sizing
                      className="w-24 bg-accent-purple/10 text-accent-purple hover:bg-accent-purple hover:text-white border border-accent-purple/20"
                      onClick={() => handleViewClick(job)}
                    >
                      View
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      // Removed w-full, kept w-24
                      className="w-24"
                      onClick={() => handleEditClick(job)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      // Removed w-full, kept w-24
                      className="w-24 border-red-500/30 text-red-500 hover:bg-red-500/10 hover:border-red-500 transition-all font-medium"
                      onClick={() => handleDeleteClick(job)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* View Modal */}
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => { setIsViewModalOpen(false); setSelectedJob(null); }}
          title="Job Details"
        >
          {selectedJob && (
            <div className="space-y-6">
              <div className="pb-6 border-b border-white/5">
                <h2 className="text-2xl font-bold text-white mb-4">{selectedJob.title}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <p className="text-xs text-text-dim uppercase tracking-wider mb-1 font-semibold">Location</p>
                    <p className="text-white flex items-center gap-2">📍 {selectedJob.location}</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <p className="text-xs text-text-dim uppercase tracking-wider mb-1 font-semibold">Job Type</p>
                    <p className="text-white flex items-center gap-2">💼 {selectedJob.type}</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <p className="text-xs text-text-dim uppercase tracking-wider mb-1 font-semibold">Salary</p>
                    <p className="text-white flex items-center gap-2">💰 {selectedJob.salary || 'Not specified'}</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <p className="text-xs text-text-dim uppercase tracking-wider mb-1 font-semibold">Posted On</p>
                    <p className="text-white flex items-center gap-2">📅 {selectedJob.createdAt?.toDate().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-bold text-white">Job Description</h3>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                  <p className="text-text-dim whitespace-pre-wrap leading-relaxed">
                    {selectedJob.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* Edit Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => { setIsEditModalOpen(false); setSelectedJob(null); }}
          title="Edit Job Posting"
        >
          <JobForm
            key={selectedJob?.id}
            initialData={selectedJob}
            onSubmit={handleUpdateJob}
            onCancel={() => { setIsEditModalOpen(false); setSelectedJob(null); }}
            isSaving={isSaving}
          />
        </Modal>

        {/* Delete Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => { setIsDeleteModalOpen(false); setSelectedJob(null); }}
          title="Delete Job Posting"
          footer={
            <>
              <Button
                variant="secondary"
                onClick={() => { setIsDeleteModalOpen(false); setSelectedJob(null); }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="bg-red-500 shadow-red-500/30 hover:bg-red-600 border-none"
                onClick={confirmDelete}
                loading={isSaving}
              >
                Confirm Delete
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-white text-lg font-semibold">Are you sure?</p>
              <p className="text-text-dim mt-1">
                You are about to delete <span className="text-white font-medium">"{selectedJob?.title}"</span>.
                This action cannot be undone.
              </p>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default MyJobs;

