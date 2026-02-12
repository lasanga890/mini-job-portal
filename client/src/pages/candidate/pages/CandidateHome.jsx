
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Card from '../../../components/common/Card';
import JobCard from '../../../components/common/JobCard';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';

import { getAllJobs } from '../../../services/jobService';
import { getCandidateApplications } from '../../../services/applicationService';

function CandidateHome() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [apps, jobs] = await Promise.all([
          getCandidateApplications(user.uid),
          getAllJobs(),
        ]);
        setApplications(apps);
        setRecentJobs(jobs.slice(0, 6)); // Show latest 6 jobs
      } catch (err) {
        console.error("Error loading candidate dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }

    loadData();
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return <Loading />;
  }

  const statusCounts = {
    pending: applications.filter(a => a.status === 'pending').length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'shortlisted': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'rejected': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-text-dim bg-white/5 border-white/10';
    }
  };

  return (
    <div className="min-h-screen bg-primary-bg pt-24 px-4 sm:px-6 lg:px-8 font-sans text-text-main pb-12">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-text-dim mb-2">
            Welcome, {user?.name?.split(' ')[0] || user?.email?.split('@')[0]} 👋
          </h1>
          <p className="text-text-dim text-lg">Here's your job search overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 flex flex-col items-center justify-center text-center hover:border-white/20 transition-colors">
            <div className="text-4xl font-bold text-white mb-2">{applications.length}</div>
            <div className="text-text-dim text-sm font-medium uppercase tracking-wider">Total Applications</div>
          </Card>
          <Card className="p-6 flex flex-col items-center justify-center text-center hover:border-yellow-400/30 transition-colors group">
            <div className="text-4xl font-bold text-yellow-400 mb-2 group-hover:scale-110 transition-transform">{statusCounts.pending}</div>
            <div className="text-text-dim text-sm font-medium uppercase tracking-wider">Pending</div>
          </Card>
          <Card className="p-6 flex flex-col items-center justify-center text-center hover:border-green-400/30 transition-colors group">
            <div className="text-4xl font-bold text-green-400 mb-2 group-hover:scale-110 transition-transform">{statusCounts.shortlisted}</div>
            <div className="text-text-dim text-sm font-medium uppercase tracking-wider">Shortlisted</div>
          </Card>
          <Card className="p-6 flex flex-col items-center justify-center text-center hover:border-red-400/30 transition-colors group">
            <div className="text-4xl font-bold text-red-400 mb-2 group-hover:scale-110 transition-transform">{statusCounts.rejected}</div>
            <div className="text-text-dim text-sm font-medium uppercase tracking-wider">Rejected</div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" onClick={() => navigate('/candidate/jobs')}>
            🔍 Browse Jobs
          </Button>
          <Button variant="secondary" onClick={() => navigate('/candidate/profile')}>
            👤 Edit Profile
          </Button>
          <Button variant="secondary" onClick={() => navigate('/candidate/applications')}>
            📋 My Applications
          </Button>
        </div>

        {/* Recent Applications */}
        {applications.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Recent Applications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {applications.slice(0, 4).map(app => {
                const date = app.createdAt?.toDate ? app.createdAt.toDate() : new Date(app.createdAt || Date.now());
                return (
                  <Card key={app.id || app._id} className="p-5 hover:bg-white/5 transition-colors cursor-pointer border border-white/5" onClick={() => navigate('/candidate/applications')}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-white">
                        {app.jobTitle || app.job?.title || 'Applied Job'}
                      </h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusColor(app.status)} uppercase`}>
                        {app.status}
                      </span>
                    </div>
                    <p className="text-sm text-text-dim">
                      {app.employerName || app.job?.employer?.companyName || 'Company'} • Applied {date.toLocaleDateString()}
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Latest Jobs */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Latest Openings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentJobs.map(job => (
              <div key={job.id} onClick={() => navigate(`/jobs/${job.id}`)} className="cursor-pointer">
                <JobCard job={job} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default CandidateHome;