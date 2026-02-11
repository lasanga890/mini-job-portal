
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Card from '../../../components/common/Card';
import JobCard from '../../../components/common/JobCard';
import Button from '../../../components/common/Button';

// Mock data helpers (replace with actual API calls later)
const getMyApplications = async (token) => {
  return [
    { _id: '1', job: { title: 'Frontend Developer', employer: { companyName: 'TechCorp' } }, status: 'pending', createdAt: '2024-02-10' },
    { _id: '2', job: { title: 'React Engineer', employer: { companyName: 'WebSolutions' } }, status: 'shortlisted', createdAt: '2024-02-08' },
    { _id: '3', job: { title: 'UI Designer', employer: { companyName: 'CreativeStudio' } }, status: 'rejected', createdAt: '2024-02-05' },
    { _id: '4', job: { title: 'Full Stack Dev', employer: { companyName: 'StartupInc' } }, status: 'pending', createdAt: '2024-02-12' },
  ];
};

const getJobs = async ({ limit }) => {
  return {
    jobs: [
        {
            id: 1,
            title: "Senior Frontend Developer",
            company: "TechCorp",
            location: "Remote",
            type: "Full-time",
            salary: "$120k - $150k",
            posted: "2 days ago"
        },
        {
            id: 2,
            title: "Backend Engineer",
            company: "DataSystems",
            location: "New York, NY",
            type: "Full-time",
            salary: "$130k - $160k",
            posted: "1 day ago"
        },
        {
            id: 3,
            title: "Product Designer",
            company: "CreativeStudio",
            location: "San Francisco, CA",
            type: "Contract",
            salary: "$80k - $100k",
            posted: "3 days ago"
        },
        {
            id: 4,
            title: "Marketing Manager",
            company: "GrowthHacker",
            location: "Remote",
            type: "Part-time",
            salary: "$40k - $60k",
            posted: "5 days ago"
        }
    ]
  };
};

function CandidateHome() {
  const { user, loading: authLoading } = useAuth(); // token is not consistently exposed in context yet, mocking for now
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { // Role check is handled by ProtectedRoute usually, but good to have
      navigate('/login');
      return;
    }
    
    const loadData = async () => {
      try {
        // Mock token for now
        const token = 'mock-token'; 
        const [apps, jobsData] = await Promise.all([
          getMyApplications(token),
          getJobs({ limit: 4 }),
        ]);
        setApplications(apps);
        setRecentJobs(jobsData.jobs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-primary-bg p-4">
          <div className="w-full max-w-sm rounded-2xl border border-border-dim bg-card-bg backdrop-blur-xl p-8 shadow-glow">
            <div className="flex animate-pulse space-x-4">
              <div className="size-12 rounded-full bg-white/10"></div>
              <div className="flex-1 space-y-6 py-1">
                <div className="h-3 rounded-full bg-white/10 w-3/4"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 h-3 rounded-full bg-white/10"></div>
                    <div className="col-span-1 h-3 rounded-full bg-white/10"></div>
                  </div>
                  <div className="h-3 rounded-full bg-white/10"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
  }

  const statusCounts = {
    pending: applications.filter(a => a.status === 'pending').length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  const getStatusColor = (status) => {
      switch(status) {
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
                {applications.slice(0, 4).map(app => (
                <Card key={app._id} className="p-5 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => navigate('/candidate/applications')}>
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-white">{app.job?.title || 'Unknown Job'}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getStatusColor(app.status)} uppercase`}>
                            {app.status}
                        </span>
                    </div>
                    <p className="text-sm text-text-dim">
                        {app.job?.employer?.companyName || ''} • Applied {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                </Card>
                ))}
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