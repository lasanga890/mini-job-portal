import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';
import { getCandidateProfile, updateCandidateProfile, uploadCV } from '../../../services/candidateService';

const CandidateProfile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    location: '',
    bio: '',
    skills: '',
  });

  const [cvFile, setCvFile] = useState(null);
  const [cvUrl, setCvUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }
    const loadProfile = async () => {
      try {
        const profile = await getCandidateProfile(user.uid);
        
        const initialData = {
            name: profile?.name || user.displayName || user.name || '',
            phone: profile?.phone || '',
            location: profile?.location || '',
            bio: profile?.bio || '',
            skills: Array.isArray(profile?.skills) ? profile.skills.join(', ') : (profile?.skills || ''),
        };

        setForm(initialData);
        setCvUrl(profile?.cvUrl || user.cvUrl || "");
      } catch (err) {
        console.error("Failed to load profile", err);
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      let currentCvUrl = cvUrl; // Use current state cvUrl

      // 1. If a new CV file is selected, upload it first
      if (cvFile) {
        try {
          currentCvUrl = await uploadCV(user.uid, cvFile);
          setCvUrl(currentCvUrl); // Update local state
          setCvFile(null); // Clear file selection
        } catch (uploadErr) {
          throw new Error(`CV Upload failed: ${uploadErr.message}`);
        }
      }

      // 2. Update profile with details and (potentially new) CV URL
      const data = {
        ...form,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        cvUrl: currentCvUrl || user.cvUrl || ""
      };
      
      await updateCandidateProfile(user.uid, data);
      setSuccess('Profile and CV updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
     return <Loading />;
  }

  return (
    <div className="min-h-screen bg-primary-bg pt-24 px-4 sm:px-6 lg:px-8 font-sans text-text-main pb-12">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-text-dim mb-2">
            My Profile
            </h1>
            <p className="text-text-dim text-lg">Keep your profile up to date to attract employers</p>
        </div>

        {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="text-sm font-medium">{error}</span>
            </div>
        )}
        
        {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-500 px-4 py-3 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-sm font-medium">{success}</span>
            </div>
        )}

        <Card className="p-8 animate-slide-up">
            <div className="space-y-8">
                {/* Unified Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-text-dim ml-1">Full Name</label>
                            <input 
                                type="text" 
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all placeholder:text-white/20"
                                placeholder="Your full name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })} 
                                required 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-text-dim ml-1">Phone</label>
                            <input 
                                type="tel" 
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all placeholder:text-white/20"
                                placeholder="+1234567890" 
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-text-dim ml-1">Location</label>
                        <input 
                            type="text" 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all placeholder:text-white/20"
                            placeholder="City, Country" 
                            value={form.location}
                            onChange={(e) => setForm({ ...form, location: e.target.value })} 
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-text-dim ml-1">Skills (comma-separated)</label>
                        <input 
                            type="text" 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all placeholder:text-white/20"
                            placeholder="JavaScript, React, Node.js, Python"
                            value={form.skills} 
                            onChange={(e) => setForm({ ...form, skills: e.target.value })} 
                        />
                        {form.skills && (
                            <div className="flex flex-wrap gap-2 mt-2 ml-1">
                                {form.skills.split(',').map(s => s.trim()).filter(Boolean).map((skill, i) => (
                                    <span key={i} className="px-2 py-1 bg-accent-purple/10 text-accent-purple border border-accent-purple/20 rounded-lg text-xs font-semibold">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-text-dim ml-1">Bio</label>
                        <textarea 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all h-32 resize-none placeholder:text-white/20"
                            placeholder="Tell employers about yourself..."
                            value={form.bio} 
                            onChange={(e) => setForm({ ...form, bio: e.target.value })} 
                        />
                    </div>

                    {/* CV Upload - Moved inside form and above button */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-text-dim ml-1">Curriculum Vitae (PDF)</label>
                        <div className="flex flex-col gap-4">
                            <div 
                                className={`group relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                                    cvFile ? 'border-accent-purple bg-accent-purple/5' : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                                }`}
                                onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-accent-purple', 'bg-accent-purple/5'); }}
                                onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-accent-purple', 'bg-accent-purple/5'); }}
                                onDrop={(e) => { e.preventDefault(); setCvFile(e.dataTransfer.files[0]); }}
                                onClick={() => document.getElementById('cv-upload').click()}
                            >
                                <input id="cv-upload" type="file" accept=".pdf" onChange={(e) => setCvFile(e.target.files[0])} className="hidden" />
                                
                                <div className="flex flex-col items-center gap-3">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${cvFile ? 'bg-accent-purple text-white' : 'bg-white/5 text-text-dim group-hover:scale-110'}`}>
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    
                                    {cvFile ? (
                                        <div className="space-y-1">
                                            <p className="text-white font-bold">{cvFile.name}</p>
                                            <p className="text-xs text-text-dim">{(cvFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to save</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-1">
                                            <p className="text-white font-semibold">Click or drag PDF to update CV</p>
                                            <p className="text-xs text-text-dim">Max file size: 2MB</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {cvUrl && !cvFile && (
                                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-bold text-white">Current CV Active</p>
                                            <p className="text-xs text-text-dim">Visible to employers</p>
                                        </div>
                                    </div>
                                    <a 
                                        href={cvUrl} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-bold transition-all"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        View
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button 
                            type="submit" 
                            variant="primary" 
                            size="lg" 
                            className="w-full shadow-accent-purple/40"
                            loading={saving}
                            disabled={saving}
                        >
                            Save Profile & CV
                        </Button>
                    </div>
                </form>
            </div>
        </Card>
      </div>
    </div>
  );
};

export default CandidateProfile;
