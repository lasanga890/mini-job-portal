
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import Navbar from '../components/common/Navbar';
import HeroSection from '../components/landing/HeroSection';
import JobSection from '../components/landing/JobSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import Footer from '../components/landing/Footer';

const Landing = () => {
  const [filters, setFilters] = useState({});
  const [jobTypes, setJobTypes] = useState([]);
  const [locations, setLocations] = useState([]);

  // Fetch job types and locations on mount
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const q = query(
          collection(db, 'jobs'),
          where('status', '==', 'active')
        );
        const querySnapshot = await getDocs(q);
        const jobs = querySnapshot.docs.map(doc => doc.data());

        const types = [...new Set(jobs.map(job => job.type).filter(Boolean))];
        const locs = [...new Set(jobs.map(job => job.location).filter(Boolean))];

        setJobTypes(types);
        setLocations(locs);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };

    fetchFilterData();
  }, []);

  const handleFilter = (filterData) => {
    setFilters({
      keyword: filterData.keyword || '',
      location: filterData.location || '',
      type: filterData.type || ''
    });
  };

  return (
    <div className="min-h-screen bg-primary-bg overflow-x-hidden font-sans text-text-main selection:bg-accent-purple selection:text-white">
      <Navbar />
      
      <main>
        <HeroSection 
          onFilter={handleFilter}
          jobTypes={jobTypes}
          locations={locations}
        />
        <JobSection filters={filters} />
        <FeaturesSection />
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
