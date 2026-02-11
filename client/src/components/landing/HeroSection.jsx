
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[85vh] relative pt-24 pb-16 sm:pt-40 sm:pb-24 overflow-x-hidden flex items-center">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8 animate-slide-up">
          <span className="block text-text-main">Find Your Dream Job</span>
          <span className="block text-transparent bg-clip-text bg-accent-gradient mt-2">
            Build Your Future
          </span>
        </h1>
        
        <p className="mt-4 max-w-2xl mx-auto text-xl text-text-dim mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Connect with top employers and discover opportunities that match your skills and aspirations. simple, fast, and transparent.
        </p>

        <div className="flex justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => navigate('/register')}
          >
            Get Started
          </Button>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-purple/20 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
};

export default HeroSection;
