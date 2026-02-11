
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { createJob, getJobById, updateJob } from '../../../services/jobService';
import Card from '../../../components/common/Card';
import Loading from '../../../components/common/Loading';
import JobForm from '../../../components/employer/JobForm';

const JobPost = () => {
  const { user, loading: authLoading } = useAuth();
  const { jobId } = useParams(); // For Edit mode
  const navigate = useNavigate();
  const isEditMode = !!jobId;

  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }

    if (isEditMode) {
      const fetchJob = async () => {
        try {
          const data = await getJobById(jobId);
          if (data) {
            // Security check
            if (data.employerId !== user.uid) {
              navigate('/employer/home');
              return;
            }
            setJobData(data);
          }
        } catch (err) {
          console.error("Error fetching job:", err);
          setError("Failed to load job details.");
        } finally {
          setLoading(false);
        }
      };
      fetchJob();
    }
  }, [user, authLoading, jobId, isEditMode, navigate]);

  const handleFormSubmit = async (formData) => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (isEditMode) {
        await updateJob(jobId, formData);
        setSuccess('Job updated successfully!');
      } else {
        await createJob(user.uid, {
            ...formData,
            employerName: user.name || user.displayName || 'Company Name',
        });
        setSuccess('Job posted successfully!');
      }
      
      setTimeout(() => {
          navigate('/employer/my-jobs');
      }, 1500);

    } catch (err) {
      setError(err.message || 'Failed to save job.');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-primary-bg pt-24 px-4 sm:px-6 lg:px-8 font-sans text-text-main pb-12">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-text-dim mb-2">
            {isEditMode ? 'Edit Job' : 'Post a New Job'}
          </h1>
          <p className="text-text-dim text-lg">
            {isEditMode ? 'Update your job listing details' : 'Fill in the details to find your next great hire'}
          </p>
        </div>

        {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="text-sm font-medium">{error}</span>
            </div>
        )}
        
        {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-500 px-4 py-3 rounded-xl flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-sm font-medium">{success}</span>
            </div>
        )}

        <Card className="p-8 animate-slide-up">
          <JobForm 
            key={jobData?.id || 'new'}
            initialData={jobData}
            onSubmit={handleFormSubmit}
            isSaving={saving}
          />
        </Card>
      </div>
    </div>
  );
};

export default JobPost;