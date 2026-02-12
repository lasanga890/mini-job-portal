import { useState, useEffect, useCallback } from 'react';
import { getEmployerProfile, updateEmployerProfile } from '../services/employerService';

const useEmployerProfile = (uid) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(Boolean(uid));
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    if (!uid) { setProfile(null); setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const p = await getEmployerProfile(uid);
      setProfile(p || null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const updateProfile = async (data) => {
    setUpdating(true);
    try {
      const updated = await updateEmployerProfile(uid, data);
      setProfile(prev => ({ ...prev, ...updated }));
      return updated;
    } finally {
      setUpdating(false);
    }
  };

  return { profile, loading, updating, error, fetchProfile, updateProfile };
};

export default useEmployerProfile;
