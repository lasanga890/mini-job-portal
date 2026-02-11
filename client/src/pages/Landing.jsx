
import React from 'react';
import Navbar from '../components/common/Navbar';
import HeroSection from '../components/landing/HeroSection';
import JobSection from '../components/landing/JobSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import Footer from '../components/landing/Footer';

const Landing = () => {
  return (
    <div className="min-h-screen bg-primary-bg overflow-x-hidden font-sans text-text-main selection:bg-accent-purple selection:text-white">
      <Navbar />
      
      <main>
        <HeroSection />
        <JobSection />
        <FeaturesSection />
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
