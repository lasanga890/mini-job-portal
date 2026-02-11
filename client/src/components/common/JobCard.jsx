
import React from 'react';
import Card from './Card';
import Button from './Button';

const JobCard = ({ job }) => {
  return (
    <Card className="p-6 hover:border-accent-purple/50 transition-all duration-300 group relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-text-main group-hover:text-accent-purple transition-colors">
            {job.title}
          </h3>
          <p className="text-text-dim mt-1">{job.company}</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-text-dim border border-white/10">
          {job.type}
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm text-text-dim mb-6">
        <span className="flex items-center gap-1">
          📍 {job.location}
        </span>
        <span className="flex items-center gap-1">
          💰 {job.salary}
        </span>
      </div>

      <div className="flex justify-between items-center mt-auto">
        <span className="text-xs text-text-dim">Posted {job.posted}</span>
        <Button variant="outline" size="sm" className="group-hover:bg-accent-purple group-hover:text-white">
          Apply Now
        </Button>
      </div>
    </Card>
  );
};

export default JobCard;
