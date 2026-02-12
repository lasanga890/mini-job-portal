
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';

import { getEmployerJobs } from '../../../services/jobService';
import { getEmployerApplications } from '../../../services/applicationService';

const EmployerHome = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    shortlisted: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch jobs and applications in parallel
        const [jobs, applications] = await Promise.all([
          getEmployerJobs(user.uid),
          getEmployerApplications(user.uid)
        ]);

        const activeJobsCount = jobs.filter(job => job.status === 'active').length;
        const totalAppsCount = applications.length;
        const shortlistedCount = applications.filter(app => app.status === 'shortlisted').length;

        setStats({
          activeJobs: activeJobsCount,
          totalApplications: totalAppsCount,
          shortlisted: shortlistedCount,
        });
      } catch (err) {
        console.error("Error fetching employer stats:", err);
      } finally {
        setLoading(false);
      }
    };

    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }

    fetchStats();
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-primary-bg pt-24 px-4 sm:px-6 lg:px-8 font-sans text-text-main pb-12">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-text-dim mb-2">
            Hi {user.name},
          </h1>
          <p className="text-text-dim text-lg">Manage your job postings and applications</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="p-6 text-center hover:border-accent-purple/50 transition-colors">
            <h3 className="text-4xl font-bold text-accent-purple mb-1">{stats.activeJobs}</h3>
            <p className="text-text-dim text-sm uppercase tracking-wider font-semibold">Active Jobs</p>
          </Card>
          <Card className="p-6 text-center hover:border-blue-400/50 transition-colors">
            <h3 className="text-4xl font-bold text-blue-400 mb-1">{stats.totalApplications}</h3>
            <p className="text-text-dim text-sm uppercase tracking-wider font-semibold">Total Applications</p>
          </Card>
          <Card className="p-6 text-center hover:border-green-400/50 transition-colors">
            <h3 className="text-4xl font-bold text-green-400 mb-1">{stats.shortlisted}</h3>
            <p className="text-text-dim text-sm uppercase tracking-wider font-semibold">Shortlisted Caps</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" onClick={() => navigate('/employer/post-job')}>
            ➕ Post a New Job
          </Button>
          <Button variant="secondary" onClick={() => navigate('/employer/my-jobs')}>
            📋 Manage My Jobs
          </Button>
        </div>

        {/* Latest Activity Placeholder */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
          <Card className="p-8 text-center bg-white/5 border-dashed">
            <p className="text-text-dim italic">No recent activity to show yet. Start by posting a job!</p>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default EmployerHome;
