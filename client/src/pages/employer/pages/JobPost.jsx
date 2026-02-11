
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { createJob, getJobById, updateJob } from '../../../services/jobService';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';

const JobPost = () => {
  const { user, loading: authLoading } = useAuth();
  const { jobId } = useParams(); // For Edit mode
  const navigate = useNavigate();
  const isEditMode = !!jobId;

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    type: 'Full-time',
    salary: '',
  });

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
          const jobData = await getJobById(jobId);
          if (jobData) {
            // Security check: ensure this job belongs to the logged-in employer
            if (jobData.employerId !== user.uid) {
              navigate('/employer/home');
              return;
            }
            setForm({
              title: jobData.title || '',
              description: jobData.description || '',
              location: jobData.location || '',
              type: jobData.type || 'Full-time',
              salary: jobData.salary || '',
            });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (isEditMode) {
        await updateJob(jobId, form);
        setSuccess('Job updated successfully!');
      } else {
        await createJob(user.uid, {
            ...form,
            employerName: user.name || user.displayName || 'Company Name', // Cached for listing
        });
        setSuccess('Job posted successfully!');
        // Reset form after successful post
        setForm({
            title: '',
            description: '',
            location: '',
            type: 'Full-time',
            salary: '',
        });
      }
      
      // Navigate back after a short delay
      setTimeout(() => {
          navigate('/employer/my-jobs');
      }, 2000);

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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-dim ml-1">Job Title</label>
              <input 
                type="text" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all placeholder:text-white/20"
                placeholder="e.g. Senior Software Engineer"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })} 
                required 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-text-dim ml-1">Location</label>
                    <input 
                        type="text" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all placeholder:text-white/20"
                        placeholder="e.g. Remote or City, Country" 
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })} 
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-text-dim ml-1">Job Type</label>
                    <select 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all"
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                    >
                        <option value="Full-time" className="bg-primary-bg text-white">Full-time</option>
                        <option value="Internship" className="bg-primary-bg text-white">Internship</option>
                        <option value="Part-time" className="bg-primary-bg text-white">Part-time</option>
                        <option value="Contract" className="bg-primary-bg text-white">Contract</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-dim ml-1">Salary Range (Optional)</label>
              <input 
                type="text" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all placeholder:text-white/20"
                placeholder="e.g. $100k - $120k / year"
                value={form.salary}
                onChange={(e) => setForm({ ...form, salary: e.target.value })} 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-dim ml-1">Job Description</label>
              <textarea 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all h-64 resize-none placeholder:text-white/20"
                placeholder="Describe the role, responsibilities, and requirements..."
                value={form.description} 
                onChange={(e) => setForm({ ...form, description: e.target.value })} 
                required
              />
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                variant="primary" 
                size="lg" 
                className="w-full shadow-accent-purple/40 font-bold"
                loading={saving}
                disabled={saving}
              >
                {isEditMode ? 'Update Job Listing' : 'Post Job Now'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default JobPost;