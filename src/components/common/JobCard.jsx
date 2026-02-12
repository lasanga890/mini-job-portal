
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from './Card';
import Button from './Button';

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const diff = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    return `${diff} days ago`;
  };

  const handleViewDetails = () => {
    navigate(`/job/${job.id}`);
  };

  const handleApplyNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role === 'candidate') {
      navigate(`/candidate/job/${job.id}`);
    } else {
      alert('Only candidates can apply for jobs');
    }
  };

  return (
    <Card className="p-6 hover:border-accent-purple/50 transition-all duration-300 group relative overflow-hidden flex flex-col h-full cursor-pointer">
      <div onClick={handleViewDetails} className="flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-text-main group-hover:text-accent-purple transition-colors line-clamp-1">
              {job.title}
            </h3>
            <p className="text-text-dim mt-1 font-medium">{job.employerName || 'Unknown Company'}</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-accent-purple/10 text-accent-purple border border-accent-purple/20">
            {job.type}
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-text-dim mb-6">
          <span className="flex items-center gap-1">
            📍 {job.location}
          </span>
          {job.salary && (
            <span className="flex items-center gap-1">
              💰 {job.salary}
            </span>
          )}
        </div>

        <div className="text-sm text-text-dim line-clamp-2 mb-4">
          {job.description}
        </div>
      </div>

      <div className="flex justify-between items-center mt-auto">
        <span className="text-xs text-text-dim">Posted {formatDate(job.createdAt)}</span>
        <Button 
          variant="outline" 
          size="sm" 
          className="group-hover:bg-accent-purple group-hover:text-white font-bold transition-all"
          onClick={handleApplyNow}
          disabled={authLoading}
        >
          Apply Now
        </Button>
      </div>
    </Card>
  );
};

export default JobCard;
