
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';

// Mock data helper (replace with actual API call later)
const getMyApplications = async () => {
  return [
    { _id: '1', job: { title: 'Frontend Developer', employer: { companyName: 'TechCorp' }, location: 'Remote' }, status: 'pending', message: 'Looking forward to hearing back!', createdAt: '2024-02-10', cvUrl: '/cvs/frontend.pdf' },
    { _id: '2', job: { title: 'React Engineer', employer: { companyName: 'WebSolutions' }, location: 'New York, NY' }, status: 'shortlisted', message: '', createdAt: '2024-02-08', cvUrl: '/cvs/react.pdf' },
    { _id: '3', job: { title: 'UI Designer', employer: { companyName: 'CreativeStudio' }, location: 'San Francisco, CA' }, status: 'rejected', message: 'Not enough experience.', createdAt: '2024-02-05', cvUrl: '/cvs/ui.pdf' },
    { _id: '4', job: { title: 'Full Stack Dev', employer: { companyName: 'StartupInc' }, location: 'Austin, TX' }, status: 'pending', message: '', createdAt: '2024-02-12', cvUrl: '/cvs/fullstack.pdf' },
    { _id: '5', job: { title: 'Backend Developer', employer: { companyName: 'DataCo' }, location: 'Remote' }, status: 'pending', message: '', createdAt: '2024-02-14', cvUrl: '/cvs/backend.pdf' },
  ];
};

function CandidateApplications() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }
    const loadApps = async () => {
      try {
        const data = await getMyApplications();
        setApplications(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadApps();
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return <Loading />;
  }

  const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter);

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
            My Applications
            </h1>
            <p className="text-text-dim text-lg">Track the status of all your job applications</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'shortlisted', 'rejected'].map(s => (
          <button 
            key={s} 
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border ${
                filter === s 
                ? 'bg-accent-purple text-white border-accent-purple shadow-lg shadow-accent-purple/20' 
                : 'bg-white/5 text-text-dim border-white/10 hover:bg-white/10 hover:text-white'
            }`}
            onClick={() => setFilter(s)}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
            <span className="ml-2 opacity-60 text-xs">
                {s === 'all' ? `(${applications.length})` : `(${applications.filter(a => a.status === s).length})`}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-card-bg/50 rounded-2xl border border-white/5">
          <h3 className="text-xl font-medium text-white mb-2">
            No applications {filter !== 'all' ? `with status "${filter}"` : 'yet'}
          </h3>
          <p className="text-text-dim mb-6">Start by browsing available jobs</p>
          <Button variant="primary" onClick={() => navigate('/candidate/jobs')}>
            Browse Jobs
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map(app => (
            <Card key={app._id} className="p-6 hover:border-white/20 transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div>
                    <div 
                        onClick={() => navigate(`/jobs/${app.job?._id}`)} 
                        className="group cursor-pointer"
                    >
                        <h3 className="text-xl font-bold text-white group-hover:text-accent-purple transition-colors">
                        {app.job?.title || 'Unknown Job'}
                        </h3>
                    </div>
                  <p className="text-sm text-text-dim mt-1">
                    🏢 {app.job?.employer?.companyName || 'Unknown'} • 📍 {app.job?.location || ''}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(app.status)} uppercase self-start`}>
                    {app.status}
                </span>
              </div>

              {app.message && (
                <div className="bg-white/5 rounded-lg p-3 mb-4 border border-white/5">
                  <p className="text-sm text-text-dim italic">
                    &ldquo;{app.message}&rdquo;
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                <span className="text-xs text-text-dim">
                  Applied {new Date(app.createdAt).toLocaleDateString()}
                </span>
                {app.cvUrl && (
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="py-1.5! px-3! text-xs!"
                    onClick={() => window.open(`http://localhost:5000${app.cvUrl}`, '_blank')}
                  >
                    📄 View CV
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

export default CandidateApplications;