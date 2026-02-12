
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
  const [recentJobs, setRecentJobs] = useState([]);
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

        // Get latest 3 jobs
        setRecentJobs(jobs.slice(0, 3));
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
        {/* Change the outer div className to this: */}
        {/* Changed grid-cols-1 to grid-cols-3, reduced gap to gap-2 */}
        <div className="grid grid-cols-3 gap-2 sm:gap-6">

          {/* Reduced padding from p-6 to p-2 on mobile */}
          <Card className="p-2 sm:p-6 text-center hover:border-accent-purple/50 transition-colors">
            <h3 className="text-2xl sm:text-4xl font-bold text-accent-purple mb-1">{stats.activeJobs}</h3>
            {/* Smaller text size for mobile label */}
            <p className="text-text-dim text-xs sm:text-sm uppercase tracking-wider font-semibold">Active Jobs</p>
          </Card>

          <Card className="p-2 sm:p-6 text-center hover:border-blue-400/50 transition-colors">
            <h3 className="text-2xl sm:text-4xl font-bold text-blue-400 mb-1">{stats.totalApplications}</h3>
            <p className="text-text-dim text-xs sm:text-sm uppercase tracking-wider font-semibold">Applications</p>
          </Card>

          <Card className="p-2 sm:p-6 text-center hover:border-green-400/50 transition-colors">
            <h3 className="text-2xl sm:text-4xl font-bold text-green-400 mb-1">{stats.shortlisted}</h3>
            <p className="text-text-dim text-xs sm:text-sm uppercase tracking-wider font-semibold">Shortlisted</p>
          </Card>

        </div>



        {/* Latest Activity Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Recent Postings</h2>
          {recentJobs.length === 0 ? (
            <Card className="p-8 text-center bg-white/5 border-dashed">
              <p className="text-text-dim italic">No recent activity to show yet. Start by posting a job!</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {recentJobs.map(job => (
                <Card key={job.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer border border-white/5" onClick={() => navigate(`/employer/my-jobs`)}>
                  <div className="flex items-center gap-4">
                    {/* <div className="size-10 rounded-full bg-accent-purple/10 flex items-center justify-center text-accent-purple font-bold">
                      {job.title.charAt(0).toUpperCase()}
                    </div> */}
                    <div>
                      <p className="text-white font-medium">{job.title}</p>
                      <p className="text-xs text-text-dim">{job.location} • {job.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-text-dim font-bold">Status</p>
                    <p className={`text-xs font-bold uppercase ${job.status === 'active' ? 'text-green-400' : 'text-accent-purple'}`}>
                      {job.status}
                    </p>
                  </div>
                </Card>
              ))}
              <button
                onClick={() => navigate('/employer/my-jobs')}
                className="text-accent-purple hover:text-accent-purple/80 text-sm font-semibold transition-colors w-max"
              >
                View all postings →
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default EmployerHome;
