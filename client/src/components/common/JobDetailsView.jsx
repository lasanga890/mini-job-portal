import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import Button from './Button';

const JobDetailsView = ({ job, applied = false, onBack, onApply, onViewCompanyProfile, loadingCompany = false }) => {
  const navigate = useNavigate();
  if (!job) return null;

  const postedDate = job.createdAt?.toDate ? job.createdAt.toDate().toLocaleDateString() : 'Recently';

  const handleBack = () => {
    if (onBack) return onBack();
    navigate(-1);
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <Button variant="secondary" size="sm" onClick={handleBack} className="mb-4">← Back to Jobs</Button>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">{job.title}</h1>
          <p className="text-xl text-accent-purple font-medium">{job.employerName || 'Unknown Company'}</p>
        </div>

        <div className="shrink-0">
          {applied ? (
            <div className="flex items-center gap-2 px-6 py-3 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl font-bold">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Applied
            </div>
          ) : (
            <Button variant="primary" size="lg" className="px-10 shadow-accent-purple/40 font-bold" onClick={onApply}>
              Apply Now
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-8">
            <h2 className="text-xl font-bold text-white mb-6 border-b border-white/5 pb-4">Job Description</h2>
            <div className="prose prose-invert max-w-none text-text-dim leading-relaxed whitespace-pre-wrap">
              {job.description}
            </div>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="p-6 space-y-6">
            <h3 className="text-lg font-bold text-white">Job Details</h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-white/40 mt-1">📍</span>
                <div>
                  <p className="text-xs text-text-dim uppercase font-bold tracking-wider">Location</p>
                  <p className="text-white font-medium">{job.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-white/40 mt-1">💼</span>
                <div>
                  <p className="text-xs text-text-dim uppercase font-bold tracking-wider">Job Type</p>
                  <p className="text-white font-medium">{job.type}</p>
                </div>
              </div>

              {job.salary && (
                <div className="flex items-start gap-3">
                  <span className="text-white/40 mt-1">💰</span>
                  <div>
                    <p className="text-xs text-text-dim uppercase font-bold tracking-wider">Salary</p>
                    <p className="text-white font-medium">{job.salary}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <span className="text-white/40 mt-1">📅</span>
                <div>
                  <p className="text-xs text-text-dim uppercase font-bold tracking-wider">Posted On</p>
                  <p className="text-white font-medium">{postedDate}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Company Card Mini */}
          <Card className="p-6 bg-accent-purple/5 border-accent-purple/10">
            <h3 className="text-lg font-bold text-white mb-2">About the Company</h3>
            <p className="text-text-dim text-sm mb-4">{job.companyDescription || `${job.employerName || 'This company'} is looking for talented individuals to join their team.`}</p>
            <Button variant="secondary" size="sm" className="w-full" onClick={onViewCompanyProfile} loading={loadingCompany}>View Company Profile</Button>
          </Card>
        </div>
      </div>

      {/* Requirements */}
      {job.requirements && (
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Requirements</h2>
          <div className="text-text-dim space-y-4 leading-relaxed whitespace-pre-wrap">{job.requirements}</div>
        </Card>
      )}

    </div>
  );
};

export default JobDetailsView;
