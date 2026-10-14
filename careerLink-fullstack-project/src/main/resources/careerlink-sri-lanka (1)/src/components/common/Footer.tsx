import React from 'react';
import { ScreenType } from '../../types/career.ts';

interface FooterProps {
  onScreenChange?: (screen: ScreenType) => void;
  variant?: 'compact' | 'full';
}

export const Footer: React.FC<FooterProps> = ({ onScreenChange, variant = 'compact' }) => {
  return (
    <footer className="bg-[#0B1B36] border-t border-slate-800 text-slate-400 text-xs py-5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Copyright */}
        <div className="flex items-center gap-2">
          <span>&copy; 2026 CareerLink &middot; All Rights Reserved</span>
        </div>

        {/* Right: Site Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-slate-300 text-[11px]">
          <button 
            onClick={() => onScreenChange?.('landing')} 
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            About Us
          </button>
          <button 
            onClick={() => onScreenChange?.('platform-overview')} 
            className="hover:text-blue-400 transition-colors cursor-pointer"
          >
            Platform Admin
          </button>
          <button 
            onClick={() => onScreenChange?.('job-seeker-dashboard')} 
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            Job Seeker Portal
          </button>
          <button 
            onClick={() => onScreenChange?.('job-posting-management')} 
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            Job Postings
          </button>
          <button 
            onClick={() => onScreenChange?.('interview-scheduling')} 
            className="hover:text-emerald-400 transition-colors cursor-pointer"
          >
            Interviews Console
          </button>
          <button 
            onClick={() => onScreenChange?.('hr-overview')} 
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            For Employers
          </button>
          <a href="#terms" className="hover:text-amber-400 transition-colors">
            Terms
          </a>
          <a href="#privacy" className="hover:text-amber-400 transition-colors">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
};
