
import React, { useState } from 'react';

const HeroSection = ({ onFilter, jobTypes, locations }) => {
  const [keyword, setKeyword] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const handleSearch = () => {
    onFilter({
      keyword,
      location: selectedLocation,
      type: selectedType
    });
  };

  const handleInputChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-[85vh] relative pt-24 pb-16 sm:pt-40 sm:pb-24 overflow-hidden flex items-center">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8 animate-slide-up">
            <span className="block text-text-main">Find Your Dream Job</span>
            <span className="block text-transparent bg-clip-text bg-accent-gradient mt-2">
              Build Your Future
            </span>
          </h1>
          
          <p className="mt-4 max-w-2xl mx-auto text-xl text-text-dim mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Connect with top employers and discover opportunities that match your skills and aspirations.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-card-bg/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Keyword Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-text-dim mb-2">Job Title or Keyword</label>
              <input
                type="text"
                placeholder="Frontend Developer, Designer, etc..."
                value={keyword}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-text-dim focus:outline-none focus:border-accent-purple focus:bg-white/10 transition-all"
              />
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-semibold text-text-dim mb-2">Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-purple focus:bg-white/10 transition-all appearance-none cursor-pointer"
              >
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* Job Type Filter */}
            <div>
              <label className="block text-sm font-semibold text-text-dim mb-2">Job Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-purple focus:bg-white/10 transition-all appearance-none cursor-pointer"
              >
                <option value="">All Types</option>
                {jobTypes.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="w-full mt-4 px-6 py-3 bg-accent-gradient text-white font-bold rounded-xl hover:opacity-90 transition-all transform active:scale-[0.98] focus:outline-none"
          >
            Search Jobs
          </button>
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-purple/20 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
};

export default HeroSection;
