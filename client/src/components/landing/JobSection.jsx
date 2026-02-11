
import React from 'react';
import JobCard from '../common/JobCard';

const jobs = [
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
    },
     {
        id: 5,
        title: "DevOps Engineer",
        company: "CloudScale",
        location: "Austin, TX",
        type: "Full-time",
        salary: "$140k - $170k",
        posted: "12 hours ago"
    },
    {
        id: 6,
        title: "QA Automation Engineer",
        company: "QualityFirst",
        location: "Remote",
        type: "Contract",
        salary: "$90k - $110k",
        posted: "1 week ago"
    }
];

const JobSection = () => {
  return (
    <div className="py-20 bg-secondary-bg/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-main sm:text-4xl">
            Featured Opportunities
          </h2>
          <p className="mt-4 text-lg text-text-dim">
            Hand-picked jobs from top companies to jumpstart your career.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobSection;
