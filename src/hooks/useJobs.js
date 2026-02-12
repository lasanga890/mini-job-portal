import { useState, useEffect, useCallback, useMemo } from 'react';
import { getAllJobs } from '../services/jobService';

const DEFAULT_PER_PAGE = 9;

/**
 * useJobs
 * - Fetches all active jobs
 * - Provides client-side filtering and pagination
 *
 * Usage: const {
 *   jobs, filteredJobs, paginatedJobs, loading, error, refresh,
 *   filters, setFilters, resetFilters,
 *   page, setPage, perPage, setPerPage, totalItems, totalPages
 * } = useJobs({ initialFilters, initialPage, initialPerPage })
 */
const useJobs = ({ initialFilters = {}, initialPage = 1, initialPerPage = DEFAULT_PER_PAGE } = {}) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFiltersState] = useState({
    keyword: '',
    location: 'all',
    type: 'all',
    ...initialFilters,
  });

  const [page, setPage] = useState(initialPage);
  const [perPage, setPerPage] = useState(initialPerPage);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllJobs();
      setJobs(data || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const setFilters = (patch) => {
    setFiltersState(prev => ({ ...prev, ...patch }));
    setPage(1); // reset to first page on filter change
  };

  const resetFilters = (keep = {}) => {
    setFiltersState({ keyword: '', location: 'all', type: 'all', ...keep });
    setPage(1);
  };

  const filteredJobs = useMemo(() => {
    if (!jobs || jobs.length === 0) return [];
    const { keyword, location, type } = filters;
    const kw = (keyword || '').toString().trim().toLowerCase();

    return jobs.filter(job => {
      let ok = true;

      if (kw) {
        const hay = (`${job.title || ''} ${job.description || ''} ${job.employerName || ''}`).toLowerCase();
        ok = ok && hay.includes(kw);
      }

      if (ok && location && location !== 'all') {
        ok = ok && (job.location || '').toLowerCase().includes((location || '').toLowerCase());
      }

      if (ok && type && type !== 'all') {
        ok = ok && ((job.type || '').toLowerCase() === (type || '').toLowerCase());
      }

      return ok;
    });
  }, [jobs, filters]);

  const totalItems = filteredJobs.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / (perPage || DEFAULT_PER_PAGE)));

  // ensure current page is within bounds
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginatedJobs = useMemo(() => {
    const start = (Math.max(1, page) - 1) * (perPage || DEFAULT_PER_PAGE);
    return filteredJobs.slice(start, start + (perPage || DEFAULT_PER_PAGE));
  }, [filteredJobs, page, perPage]);

  return {
    // raw
    jobs,
    // derived
    filteredJobs,
    paginatedJobs,

    // state
    filters,
    setFilters,
    resetFilters,
    page,
    setPage,
    perPage,
    setPerPage,

    // meta
    totalItems,
    totalPages,

    // control
    loading,
    error,
    refresh: fetchJobs,
  };
};

export default useJobs;
