import React from 'react';
import { ScreenType } from '../../types/career';
import { Users, Building2, Award, LogIn } from 'lucide-react';

interface LandingScreenProps {
  onScreenChange: (screen: ScreenType) => void;
  onOpenRegister?: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onScreenChange,
  onOpenRegister,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section matching Image 1 */}
      <div className="relative w-full overflow-hidden bg-slate-900 min-h-[460px] md:min-h-[520px] flex items-center">
        {/* Realistic High-Fidelity Office Background with Sri Lankan Tech Team */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80"
            alt="CareerLink Professional Team Colombo Sri Lanka"
            className="w-full h-full object-cover object-center filter brightness-90"
            referrerPolicy="no-referrer"
          />
          {/* Subtle Ambient Lighting and Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/60 to-slate-900/40" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
          {/* Floating White/Frosted Card matching Image 1 */}
          <div className="max-w-xl bg-white/95 backdrop-blur-md rounded-2xl p-7 sm:p-9 shadow-2xl border border-white/60">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              CareerLink: Your Gateway to Professional Success in Sri Lanka.
            </h1>
            <p className="mt-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Connect, Collaborate, and Launch Your Career with Top Employers.
            </p>

            {/* Two Action Buttons matching Image 1 */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onScreenChange('login')}
                className="px-6 py-2.5 bg-[#E87A24] hover:bg-[#D96B1C] text-white text-xs sm:text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                Find Your Dream Job
              </button>
              <button
                onClick={() => onScreenChange('login')}
                className="px-6 py-2.5 bg-[#0E1E38] hover:bg-[#1A315C] text-white text-xs sm:text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                Find Top Talent
              </button>
            </div>

            {/* Quick Access Account Actions: Sign In near Register */}
            <div className="mt-5 pt-3.5 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2.5 text-xs">
              <span className="text-slate-600 font-medium">Already have an account?</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onScreenChange('login')}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 text-xs"
                  title="Sign in to your account"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={onOpenRegister}
                  className="px-4 py-1.5 border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold rounded-lg transition-colors cursor-pointer text-xs"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Page Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 flex-1 w-full">
        {/* Platform Statistics Section matching Image 1 */}
        <section>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4 tracking-tight">
            Platform Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: Total Job Seekers */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-700 shrink-0">
                <Users className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-700">Total Job Seekers</span>
                <span className="text-xl font-bold text-slate-900 tracking-tight tabular-nums">28,495+</span>
                <span className="block text-[11px] text-emerald-600 font-medium mt-0.5">Active candidates in Sri Lanka</span>
              </div>
            </div>

            {/* Card 2: Active Employers */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-700 shrink-0">
                <Building2 className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-700">Active Employers</span>
                <span className="text-xl font-bold text-slate-900 tracking-tight tabular-nums">1,480+</span>
                <span className="block text-[11px] text-slate-500 mt-0.5">Tech enterprises & conglomerates</span>
              </div>
            </div>

            {/* Card 3: Successful Placements */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-700 shrink-0">
                <Award className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-700">Successful Placements</span>
                <span className="text-xl font-bold text-slate-900 tracking-tight tabular-nums">12,350+</span>
                <span className="block text-[11px] text-emerald-600 font-medium mt-0.5">94% Retention rate</span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Sri Lankan Employers Banner */}
        <section className="bg-slate-100/80 rounded-2xl p-6 border border-slate-200">
          <div className="text-center max-w-xl mx-auto mb-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Trusted by Sri Lanka's Leading Tech & Industrial Employers
            </h3>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-80">
            <span className="font-extrabold text-slate-700 tracking-tight text-base sm:text-lg">virtusa</span>
            <span className="font-black text-slate-800 tracking-tighter text-base sm:text-lg">brandix</span>
            <span className="font-black text-[#FF7300] tracking-tight text-base sm:text-lg">WSO2</span>
            <span className="font-black italic text-slate-700 text-base sm:text-lg">HCLTech</span>
            <span className="font-extrabold text-slate-800 text-base sm:text-lg">Dialog</span>
            <span className="font-black tracking-widest text-slate-800 text-base sm:text-lg">MAS</span>
            <span className="font-bold tracking-tight text-slate-800 text-base sm:text-lg">LSEG</span>
          </div>
        </section>
      </div>
    </div>
  );
};
