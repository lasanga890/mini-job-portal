
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';

// Mock API helpers
const getProfile = async (token) => {
  return {
    name: 'John Doe',
    phone: '+1 555-0123',
    location: 'San Francisco, CA',
    bio: 'Experienced frontend developer with a passion for building intuitive user interfaces.',
    skills: ['React', 'JavaScript', 'Tailwind CSS', 'Next.js'],
    cvUrl: '/resumes/john_doe.pdf'
  };
};

const updateProfile = async (token, data) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return data;
};

const uploadCV = async (token, file) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  return '/resumes/new_cv.pdf';
};

function CandidateProfile() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', phone: '', location: '', bio: '', skills: '',
  });
  const [cvFile, setCvFile] = useState(null);
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
        const token = 'mock-token'; // Replace with actual token
        const profile = await getProfile(token);
        
        // If real user data exists in context/firestore, use that preference, otherwise mock
        const initialData = {
            name: user.name || profile.name || '',
            phone: profile.phone || '',
            location: profile.location || '',
            bio: profile.bio || '',
            skills: (profile.skills || []).join(', '),
        };

        setForm(initialData);
      } catch (err) {
        setError(err.message);
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
      const token = 'mock-token';
      // Upload CV first if provided
      if (cvFile) {
        await uploadCV(token, cvFile);
      }

      const data = {
        ...form,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      };
      
      await updateProfile(token, data);
      // In a real app, update context user here: updateUser(updated);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-primary-bg p-4">
          <div className="w-full max-w-sm rounded-2xl border border-border-dim bg-card-bg backdrop-blur-xl p-8 shadow-glow">
            <div className="flex animate-pulse space-x-4">
              <div className="size-12 rounded-full bg-white/10"></div>
              <div className="flex-1 space-y-6 py-1">
                <div className="h-3 rounded-full bg-white/10 w-3/4"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 h-3 rounded-full bg-white/10"></div>
                    <div className="col-span-1 h-3 rounded-full bg-white/10"></div>
                  </div>
                  <div className="h-3 rounded-full bg-white/10"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
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
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
            </div>
        )}
        
        {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-500 px-4 py-3 rounded-xl flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {success}
            </div>
        )}

        <Card className="p-8 animate-slide-up">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-text-dim">Full Name</label>
                        <input 
                            type="text" 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })} 
                            required 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-text-dim">Phone</label>
                        <input 
                            type="tel" 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all"
                            placeholder="+1234567890" 
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-text-dim">Location</label>
                    <input 
                        type="text" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all"
                        placeholder="City, Country" 
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })} 
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-text-dim">Skills (comma-separated)</label>
                    <input 
                        type="text" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all"
                        placeholder="JavaScript, React, Node.js, Python"
                        value={form.skills} 
                        onChange={(e) => setForm({ ...form, skills: e.target.value })} 
                    />
                    {form.skills && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {form.skills.split(',').map(s => s.trim()).filter(Boolean).map((skill, i) => (
                                <span key={i} className="px-2 py-1 bg-accent-purple/10 text-accent-purple border border-accent-purple/20 rounded-md text-xs font-medium">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-text-dim">Bio</label>
                    <textarea 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all h-32 resize-none"
                        placeholder="Tell employers about yourself..."
                        value={form.bio} 
                        onChange={(e) => setForm({ ...form, bio: e.target.value })} 
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-text-dim">Upload CV (PDF)</label>
                    <div 
                        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                            cvFile ? 'border-accent-purple bg-accent-purple/5' : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                        }`}
                        onClick={() => document.getElementById('cv-upload').click()}
                    >
                        <input id="cv-upload" type="file" accept=".pdf" onChange={(e) => setCvFile(e.target.files[0])} className="hidden" />
                        {cvFile ? (
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-2xl">📎</span>
                                <p className="text-white font-medium">{cvFile.name}</p>
                                <p className="text-xs text-text-dim">Click to change file</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-2xl opacity-50">📄</span>
                                <p className="text-text-dim group-hover:text-white transition-colors">Click to upload your CV</p>
                                {user?.cvUrl && <p className="text-xs text-green-400">✓ CV already uploaded</p>}
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-4">
                    <Button 
                        type="submit" 
                        variant="primary" 
                        size="lg" 
                        className="w-full"
                        loading={saving}
                    >
                        Save Profile
                    </Button>
                </div>

            </form>
        </Card>
      </div>
    </div>
  );
}

export default CandidateProfile;
