
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getEmployerJobs, deleteJob } from '../../../services/jobService';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';

const MyJobs = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getEmployerJobs(user.uid);
        console.log(user.uid)
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

  const handleDelete = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job posting?")) {
      try {
        await deleteJob(jobId);
        setJobs(jobs.filter(job => job.id !== jobId));
      } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete job.");
      }
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
          <Button variant="primary" onClick={() => navigate('/employer/post-job')}>
            Post New Job
          </Button>
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
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white group-hover:text-accent-purple transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-dim">
                        {job.description}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-dim">
                      <span>📍 {job.location}</span>
                      <span>💼 {job.type}</span>
                      {job.salary && <span>💰 {job.salary}</span>}
                      <span>📅 {job.createdAt?.toDate().toLocaleDateString() || 'Recently'}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => navigate(`/employer/edit-job/${job.id}`)}
                    >
                      Edit
                    </Button>
                    <Button 
                        variant="outline" 
                        size="sm"
                        className="border-red-500/50 text-red-500 hover:bg-red-500/10 hover:border-red-500"
                        onClick={() => handleDelete(job.id)}
                    >
                      Delete
                    </Button>
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

export default MyJobs;
