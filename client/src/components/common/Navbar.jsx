import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';
import { useAuth } from '../../context/AuthContext';
import Button from './Button';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `${isActive ? 'text-white font-bold border-b-2 border-accent-purple' : 'text-text-dim hover:text-white transition-colors font-medium'} cursor-pointer px-1 py-1 `;
  };

  const renderNavLinks = () => {
    if (!user) {
      return (
        <div className="hidden md:flex items-center gap-4">
          <span onClick={() => navigate('/login')} className="text-text-dim hover:text-white transition-colors font-medium cursor-pointer">
            Sign In
          </span>
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => navigate('/register')}
          >
            Get Started
          </Button>
        </div>
      );
    }

    // Role-based links
    return (
      <div className="hidden md:flex items-center gap-6">
        {role === 'candidate' && (
          <>
            <span onClick={() => navigate('/candidate')} className={getLinkClass('/candidate')}>Home</span>
            <span onClick={() => navigate('/candidate/applications')} className={getLinkClass('/candidate/applications')}>My Applications</span>
          </>
        )}
        
        {role === 'employer' && (
          <>
            <span onClick={() => navigate('/employer')} className={getLinkClass('/employer')}>Home</span>
            <span onClick={() => navigate('/employer/post-job')} className={getLinkClass('/employer/post-job')}>Post Job</span>
            <span onClick={() => navigate('/employer/my-jobs')} className={getLinkClass('/employer/my-jobs')}>My Jobs</span>
          </>
        )}

        {role === 'admin' && (
          <span onClick={() => navigate('/admin')} className={getLinkClass('/admin')}>Dashboard</span>
        )}

        <div className="h-6 w-px bg-white/10 mx-2"></div>
         
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate(`/${role}/profile`)}>
            <div className="w-8 h-8 rounded-full bg-accent-purple flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-accent-purple/20">
              {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-text-main font-medium hidden">
              {user.name || user.email}
            </span>
          </div>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    );
  };

  const renderMobileLinks = () => {
    if (!user) {
      return (
        <>
          <span 
            onClick={() => {
              navigate('/login');
              setIsMobileMenuOpen(false);
            }} 
            className="text-text-dim hover:text-white transition-colors font-medium text-lg cursor-pointer"
          >
            Sign In
          </span>
          <Button 
            variant="primary" 
            size="md"
            className="w-full max-w-xs"
            onClick={() => {
              navigate('/register');
              setIsMobileMenuOpen(false);
            }}
          >
            Get Started
          </Button>
        </>
      );
    }

    return (
      <>
        {role === 'candidate' && (
          <>
            <span onClick={() => { navigate('/candidate/home'); setIsMobileMenuOpen(false); }} className={`text-lg ${getLinkClass('/candidate/home')}`}>Home</span>
            <span onClick={() => { navigate('/candidate/applications'); setIsMobileMenuOpen(false); }} className={`text-lg ${getLinkClass('/candidate/applications')}`}>My Applications</span>
          </>
        )}

        {role === 'employer' && (
          <>
             <span onClick={() => { navigate('/employer'); setIsMobileMenuOpen(false); }} className={`text-lg ${getLinkClass('/employer')}`}>Home</span>
             <span onClick={() => { navigate('/employer/post-job'); setIsMobileMenuOpen(false); }} className={`text-lg ${getLinkClass('/employer/post-job')}`}>Post Job</span>
             <span onClick={() => { navigate('/employer/my-jobs'); setIsMobileMenuOpen(false); }} className={`text-lg ${getLinkClass('/employer/my-jobs')}`}>My Jobs</span>
          </>
        )}

        {role === 'admin' && (
          <span onClick={() => { navigate('/admin'); setIsMobileMenuOpen(false); }} className={`text-lg ${getLinkClass('/admin')}`}>Dashboard</span>
        )}
        
        <div className="w-full h-px bg-white/10 my-2"></div>

        <div className="flex flex-col items-center gap-2 mb-2 cursor-pointer" onClick={() => { navigate(`/${role}/profile`); setIsMobileMenuOpen(false); }}>
          <div className="w-12 h-12 rounded-full bg-accent-purple flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-accent-purple/20">
            {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-text-dim">{user.name || user.email}</span>
        </div>

        <Button 
          variant="secondary" 
          size="md"
          className="w-full max-w-xs"
          onClick={() => {
            handleLogout();
            setIsMobileMenuOpen(false);
          }}
        >
          Logout
        </Button>
      </>
    );
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-primary-bg/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <span onClick={() => navigate('/')} className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-text-dim hover:opacity-80 transition-opacity cursor-pointer">
          JobPortal
        </span>
        
        {renderNavLinks()}

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-text-dim hover:text-white transition-colors focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-card-bg/95 backdrop-blur-xl border-t border-white/5 absolute w-full left-0 animate-slide-up shadow-glow">
          <div className="px-4 py-6 space-y-4 flex flex-col items-center">
            {renderMobileLinks()}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
