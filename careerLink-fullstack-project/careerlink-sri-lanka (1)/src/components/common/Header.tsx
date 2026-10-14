import React, { useState } from 'react';
import { ScreenType } from '../../types/career';
import { CareerLinkLogo } from './CareerLinkLogo';
import { Search, Bell, ChevronDown, Check, User, Shield, Briefcase, Globe, FileText, Users, CalendarDays, LogIn } from 'lucide-react';

interface HeaderProps {
  currentScreen: ScreenType;
  onScreenChange: (screen: ScreenType) => void;
  onOpenSignIn?: () => void;
  onOpenRegister?: () => void;
  onOpenNotifications?: () => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onScreenChange,
  onOpenSignIn,
  onOpenRegister,
  onOpenNotifications,
  unreadCount = 3,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const screens: { id: ScreenType; label: string; icon: React.ReactNode; badge: string }[] = [
    { id: 'landing', label: '1. Landing Page', icon: <Globe className="w-3.5 h-3.5" />, badge: 'Public' },
    { id: 'login', label: '2. Login Page', icon: <LogIn className="w-3.5 h-3.5" />, badge: 'Auth' },
    { id: 'hr-overview', label: '3. Candidate Management', icon: <Briefcase className="w-3.5 h-3.5" />, badge: 'Candidates' },
    { id: 'platform-overview', label: '4. Platform Admin', icon: <Shield className="w-3.5 h-3.5" />, badge: 'Admin' },
    { id: 'browse-jobs', label: '5. Browse Jobs', icon: <Search className="w-3.5 h-3.5" />, badge: 'Jobs' },
    { id: 'job-seeker-dashboard', label: '6. Seeker Dashboard', icon: <User className="w-3.5 h-3.5" />, badge: 'Portal' },
    { id: 'job-posting-management', label: '7. Job Postings', icon: <FileText className="w-3.5 h-3.5" />, badge: 'Postings' },
    { id: 'interview-scheduling', label: '8. Interview Console', icon: <CalendarDays className="w-3.5 h-3.5" />, badge: 'Console' },
  ];

  return (
    <header className="bg-[#0B1B36] border-b border-slate-800 text-white sticky top-0 z-50">
      {/* Top Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Wordmark */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onScreenChange('landing')}
            className="cursor-pointer focus:outline-hidden text-left"
          >
            <CareerLinkLogo showEmblem={currentScreen !== 'landing'} textSize="text-xl" />
          </button>
        </div>

        {/* Center: Search Bar for Screens 2, 3, 4 */}
        {currentScreen !== 'landing' && (
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidates, jobs, or metrics..."
                className="w-full bg-[#13274A] border border-slate-700/60 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>
          </div>
        )}

        {/* Right Area: Dynamic per screen */}
        <div className="flex items-center gap-3">
          {currentScreen === 'landing' ? (
            // Landing page actions matching Image 1: Sign In & Register
            <div className="flex items-center gap-2.5">
              <button
                onClick={onOpenSignIn}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                title="Sign in to your account"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <button
                onClick={onOpenRegister}
                className="px-4 py-1.5 text-xs font-semibold text-slate-200 border border-slate-600 rounded-lg hover:bg-slate-800/80 hover:text-white transition-colors cursor-pointer"
              >
                Register
              </button>
            </div>
          ) : (
            // Dashboard / Browse Jobs actions matching Images 2, 3, 4
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <button
                onClick={onOpenNotifications}
                className="relative p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer"
                title="Notifications"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-[#0B1B36]" />
                )}
              </button>

              {/* User Profile */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 py-1 px-2 rounded-lg hover:bg-slate-800/60 text-left transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 overflow-hidden flex items-center justify-center shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                      alt="Admin Avatar"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        // Fallback container
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <User className="w-4 h-4 text-slate-300" />
                  </div>
                  <div className="hidden sm:block text-left leading-tight">
                    <span className="block text-xs font-semibold text-white">
                      {currentScreen === 'job-seeker-dashboard' || currentScreen === 'job-posting-management'
                        ? 'Amila Perera'
                        : 'CareerLink'}
                    </span>
                    <span className="block text-[10px] text-slate-400">
                      {currentScreen === 'platform-overview'
                        ? 'Admin'
                        : currentScreen === 'hr-overview'
                        ? 'Admin / HR'
                        : currentScreen === 'job-posting-management'
                        ? 'Recruiter'
                        : currentScreen === 'job-seeker-dashboard'
                        ? 'Candidate'
                        : 'Member'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Profile Menu Dropdown */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-slate-800 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="font-semibold text-slate-900">
                        {currentScreen === 'job-seeker-dashboard' || currentScreen === 'job-posting-management'
                          ? 'Amila Perera'
                          : 'CareerLink Administrator'}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {currentScreen === 'job-seeker-dashboard' || currentScreen === 'job-posting-management'
                          ? 'amila.perera@example.lk'
                          : 'dlshnmalinga00@gmail.com'}
                      </p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          onScreenChange('interview-scheduling');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                      >
                        <span className="font-medium text-emerald-700">Interview Scheduling Console</span>
                        {currentScreen === 'interview-scheduling' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                      </button>
                      <button
                        onClick={() => {
                          onScreenChange('job-seeker-dashboard');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                      >
                        <span className="font-medium">Job Seeker Portal (Amila)</span>
                        {currentScreen === 'job-seeker-dashboard' && <Check className="w-3.5 h-3.5 text-amber-600" />}
                      </button>
                      <button
                        onClick={() => {
                          onScreenChange('job-posting-management');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                      >
                        <span>Job Posting Management</span>
                        {currentScreen === 'job-posting-management' && <Check className="w-3.5 h-3.5 text-amber-600" />}
                      </button>
                      <button
                        onClick={() => {
                          onScreenChange('hr-overview');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                      >
                        <span>HR & Recruiting Portal</span>
                        {currentScreen === 'hr-overview' && <Check className="w-3.5 h-3.5 text-amber-600" />}
                      </button>
                      <button
                        onClick={() => {
                          onScreenChange('platform-overview');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                      >
                        <span>Platform Admin</span>
                        {currentScreen === 'platform-overview' && <Check className="w-3.5 h-3.5 text-amber-600" />}
                      </button>
                      <button
                        onClick={() => {
                          onScreenChange('browse-jobs');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                      >
                        <span>Browse Job Listings</span>
                        {currentScreen === 'browse-jobs' && <Check className="w-3.5 h-3.5 text-amber-600" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Screen Switcher Bar: Seamlessly explore all 4 screens from the user images */}
      <div className="bg-[#081429] border-t border-slate-800/80 px-4 sm:px-6 lg:px-8 py-1.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs overflow-x-auto gap-2 no-scrollbar">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] shrink-0 mr-2">
            <span className="font-semibold text-slate-300">View Screen:</span>
          </div>

          <div className="flex items-center gap-1.5">
            {screens.map((screen) => {
              const isActive = currentScreen === screen.id;
              return (
                <button
                  key={screen.id}
                  onClick={() => onScreenChange(screen.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-xs font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  {screen.icon}
                  <span>{screen.label}</span>
                  <span className={`text-[9px] px-1 py-0.2 rounded ${
                    isActive ? 'bg-amber-700/80 text-amber-100' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {screen.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
