
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';
import { getEmployerProfile, updateEmployerProfile } from '../../../services/employerService';

const EmployerProfile = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        companyName: '',
        description: '',
        website: '',
        location: '',
        industry: '',
    });

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
                const profile = await getEmployerProfile(user.uid);

                // Initialize form with existing profile data or fallback to auth user data (stored in local storage)
                setForm({
                    companyName: profile?.companyName || user.name || user.displayName || '',
                    description: profile?.description || '',
                    website: profile?.website || '',
                    location: profile?.location || profile?.address || user.location || '',
                    industry: profile?.industry || '',
                });
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
            await updateEmployerProfile(user.uid, form);
            setSuccess('Profile updated successfully!');
        } catch (err) {
            console.error("Error updating profile:", err);
            setError(err.message || 'Failed to update profile.');
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
                        Company Profile
                    </h1>
                    <p className="text-text-dim text-lg">Manage your company details and brand identity</p>
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
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-text-dim ml-1">Company Name</label>
                            <input
                                type="text"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all placeholder:text-white/20"
                                placeholder="e.g. Acme Corp"
                                value={form.companyName}
                                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-text-dim ml-1">Industry</label>
                                <input
                                    type="text"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all placeholder:text-white/20"
                                    placeholder="e.g. Technology"
                                    value={form.industry}
                                    onChange={(e) => setForm({ ...form, industry: e.target.value })}
                                />
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
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-text-dim ml-1">Website (Optional)</label>
                            <input
                                type="url"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all placeholder:text-white/20"
                                placeholder="https://acme.com"
                                value={form.website}
                                onChange={(e) => setForm({ ...form, website: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-text-dim ml-1">Company Description</label>
                            <textarea
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all h-48 resize-none placeholder:text-white/20"
                                placeholder="Tell candidates about your company mission, culture, and values..."
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                required
                            />
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="w-full shadow-accent-purple/40 font-bold"
                                loading={saving}
                                disabled={saving}
                            >
                                Save Company Profile
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default EmployerProfile;
