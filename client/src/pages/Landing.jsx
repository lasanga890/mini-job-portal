
import React from 'react';
import Navbar from '../components/common/Navbar';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import Footer from '../components/landing/Footer';

const Landing = () => {
  return (
    <div className="min-h-screen bg-primary-bg overflow-x-hidden font-sans text-text-main selection:bg-accent-purple selection:text-white">
      <Navbar />
      
     
        <HeroSection />
        <FeaturesSection />
     

      <Footer />
    </div>
  );
};

export default Landing;
