
import React, { useState } from 'react';
import Button from '../common/Button';

const JobForm = ({ initialData, onSubmit, onCancel, isSaving }) => {
  const [form, setForm] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    location: initialData?.location || '',
    type: initialData?.type || 'Full-time',
    salary: initialData?.salary || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-text-dim ml-1">Job Title</label>
        <input
          type="text"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all placeholder:text-white/20"
          placeholder="e.g. Senior Software Engineer"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-dim ml-1">Location</label>
          <input
            type="text"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all placeholder:text-white/20"
            placeholder="e.g. Remote or City, Country"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-dim ml-1">Job Type</label>
          <select
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="Full-time" className="bg-white text-black">Full-time</option>
            <option value="Internship" className="bg-white text-black">Internship</option>
            <option value="Part-time" className="bg-white text-black">Part-time</option>
            <option value="Contract" className="bg-white text-black">Contract</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-text-dim ml-1">Salary Range (Optional)</label>
        <input
          type="text"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all placeholder:text-white/20"
          placeholder="e.g. $100k - $120k / year"
          value={form.salary}
          onChange={(e) => setForm({ ...form, salary: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-text-dim ml-1">Job Description</label>
        <textarea
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all h-48 resize-none placeholder:text-white/20"
          placeholder="Describe the role, responsibilities, and requirements..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
      </div>

      <div className="flex gap-3 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          className="flex-1 shadow-accent-purple/40 font-bold"
          loading={isSaving}
          disabled={isSaving}
        >
          {initialData ? 'Update Job' : 'Post Job'}
        </Button>
      </div>
    </form>
  );
};

export default JobForm;
