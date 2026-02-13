
import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-white/5 bg-black/20 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <span className="text-2xl font-bold text-white">JobPortal</span>
          <p className="mt-2 text-sm text-text-dim">
            &copy; {new Date().getFullYear()} Lasanga Dissanayaka. All rights reserved.
          </p>
        </div>

        <div className="flex gap-8 text-sm text-text-dim">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
