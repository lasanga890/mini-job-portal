import { useState, useEffect, useCallback } from 'react';
import { getJobById } from '../services/jobService';

const useJob = (jobId) => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(Boolean(jobId));
  const [error, setError] = useState(null);

  const fetchJob = useCallback(async () => {
    if (!jobId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getJobById(jobId);
      setJob(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => { fetchJob(); }, [fetchJob]);

  return { job, loading, error, refresh: fetchJob };
};

export default useJob;
