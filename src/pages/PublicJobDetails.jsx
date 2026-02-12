import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getJobById } from '../services/jobService';
import Navbar from '../components/common/Navbar';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';
import JobDetailsView from '../components/common/JobDetailsView';

const PublicJobDetails = () => {
  const { jobId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const jobData = await getJobById(jobId);
        if (!jobData) {
          setError('Job not found');
        } else {
          setJob(jobData);
        }
      } catch (err) {
        console.error('Error fetching job:', err);
        setError('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleApply = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role === 'candidate') {
      navigate(`/candidate/job/${jobId}`);
    } else {
      alert('Only candidates can apply for jobs');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-primary-bg pt-24 px-4 sm:px-6 lg:px-8 pb-12">
          <Loading />
        </div>
      </>
    );
  }

  if (error || !job) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-primary-bg pt-24 px-4 sm:px-6 lg:px-8 pb-12 flex items-center justify-center">
          <Card className="p-8 text-center max-w-md">
            <div className="mb-4 text-5xl">😞</div>
            <h2 className="text-2xl font-bold text-white mb-2">Oops!</h2>
            <p className="text-text-dim mb-6">{error || 'Job not found'}</p>
            <Button variant="primary" onClick={() => navigate('/')}>
              Back to Jobs
            </Button>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-primary-bg pt-24 px-4 sm:px-6 lg:px-8 pb-12 font-sans text-text-main">
        <div className="max-w-4xl mx-auto">
          <JobDetailsView
            job={job}
            applied={false}
            onBack={() => navigate('/')}
            onApply={handleApply}
            onViewCompanyProfile={() => { /* optional: show public company info or navigate */ }}
          />

          {/* CTA Section */}
          <div className="mt-8">
            <Card className="p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Ready to Apply?</h2>
              <p className="text-text-dim mb-6">
                {user
                  ? user.role === 'candidate'
                    ? 'Click the button below to submit your application.'
                    : 'Only candidates can apply for jobs.'
                  : 'Sign in to your account to apply for this job.'}
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={handleApply}
              >
                {user ? 'Apply Now' : 'Login to Apply'}
              </Button>
            </Card>

            {/* Similar Jobs Section */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">More Opportunities</h2>
              <div className="text-center text-text-dim">
                <p className="mb-4">Interested in more jobs?</p>
                <Button variant="secondary" onClick={() => navigate('/')}>
                  Browse All Jobs
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicJobDetails;
