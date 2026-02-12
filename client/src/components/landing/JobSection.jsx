
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import JobCard from '../common/JobCard';
import Button from '../common/Button';
import Loading from '../common/Loading';

const JOBS_PER_PAGE = 6;

const JobSection = ({ filters = {} }) => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all active jobs from Firebase
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, 'jobs'),
          where('status', '==', 'active'),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const jobsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setJobs(jobsData);
        setError('');
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Apply filters when filters change
  useEffect(() => {
    let filtered = jobs;

    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      filtered = filtered.filter(job =>
        job.title?.toLowerCase().includes(keyword) ||
        job.description?.toLowerCase().includes(keyword) ||
        job.employerName?.toLowerCase().includes(keyword)
      );
    }

    if (filters.location) {
      filtered = filtered.filter(job =>
        job.location?.toLowerCase() === filters.location.toLowerCase()
      );
    }

    if (filters.type) {
      filtered = filtered.filter(job =>
        job.type?.toLowerCase() === filters.type.toLowerCase()
      );
    }

    setFilteredJobs(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, jobs]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
  const endIndex = startIndex + JOBS_PER_PAGE;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="py-20 bg-secondary-bg/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-secondary-bg/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-main sm:text-4xl">
            {Object.keys(filters).length > 0 && Object.values(filters).some(v => v) ? 'Search Results' : 'Featured Opportunities'}
          </h2>
          <p className="mt-4 text-lg text-text-dim">
            {filteredJobs.length > 0
              ? `Found ${filteredJobs.length} job${filteredJobs.length !== 1 ? 's' : ''}`
              : 'No jobs found matching your criteria'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 mb-8">
            {error}
          </div>
        )}

        {currentJobs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {currentJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="secondary"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  ← Previous
                </Button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all ${currentPage === page
                          ? 'bg-accent-gradient text-white shadow-lg shadow-accent-purple/20'
                          : 'bg-white/5 text-text-dim hover:text-white hover:bg-white/10'
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <Button
                  variant="secondary"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next →
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-text-dim text-lg mb-4">No jobs found matching your criteria.</p>
            <p className="text-text-dim">Try adjusting your search filters or check back later for new opportunities.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSection;
