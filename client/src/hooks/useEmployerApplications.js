import { useState, useEffect } from 'react';
import { getEmployerApplications, updateApplicationStatus } from '../services/applicationService';

/**
 * Hook to fetch employer applications and update their status.
 * @param {string} employerId
 */
const useEmployerApplications = (employerId) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (!employerId) return;
    let mounted = true;
    setLoading(true);

    const fetchApps = async () => {
      try {
        const apps = await getEmployerApplications(employerId);
        if (mounted) setApplications(apps || []);
      } catch (err) {
        console.error('Error fetching employer applications:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchApps();
    return () => { mounted = false; };
  }, [employerId]);

  const updateStatus = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      await updateApplicationStatus(appId, newStatus);
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    } catch (err) {
      console.error('Failed to update status:', err);
      throw err;
    } finally {
      setUpdatingId(null);
    }
  };

  return { applications, loading, updatingId, updateStatus };
};

export default useEmployerApplications;
