import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (role: 'seeker' | 'employer' | 'admin', name: string) => void;
  onNavigateRegister: () => void;
  onNavigateHome: () => void;
  onToast: (msg: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onNavigateRegister,
  onNavigateHome,
  onToast,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      onToast('Please enter your email address.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      let detectedRole: 'seeker' | 'employer' | 'admin' = 'seeker';
      let userName = 'Candidate';

      const lowerEmail = email.toLowerCase();
      if (lowerEmail.includes('admin')) {
        detectedRole = 'admin';
        userName = 'Super Admin';
      } else if (
        lowerEmail.includes('hr') ||
        lowerEmail.includes('company') ||
        lowerEmail.includes('virtusa') ||
        lowerEmail.includes('brandix') ||
        lowerEmail.includes('employer')
      ) {
        detectedRole = 'employer';
        userName = 'Virtusa Talent HR';
      } else {
        detectedRole = 'seeker';
        userName = 'Amila Perera';
      }

      onLoginSuccess(detectedRole, userName);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex flex-col justify-between select-none antialiased">
      {/* Top Header matching image.png */}
      <div className="pt-6 sm:pt-8 pb-3 px-4 max-w-3xl mx-auto w-full flex items-center justify-between">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs"
          title="Back to CareerLink Home"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>
        <button
          onClick={onNavigateHome}
          className="inline-block group cursor-pointer focus:outline-hidden"
          title="Back to CareerLink Home"
        >
          <span className="text-3xl sm:text-4xl font-extrabold text-[#0B1B36] tracking-tight hover:opacity-90 transition-opacity">
            CareerLink
          </span>
        </button>
        <button
          onClick={onNavigateRegister}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs"
        >
          Register
        </button>
      </div>

      {/* Main Center Area: Login Card matching image.png */}
      <div className="flex-1 flex items-center justify-center px-4 py-6 sm:py-8">
        <div className="w-full max-w-[430px] bg-[#16253D] rounded-2xl shadow-2xl p-7 sm:p-9 text-white border border-[#223554]/60">
          {/* Card Title & Subtitle */}
          <div className="text-center mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-[#DE9E4B] tracking-tight">
              Welcome to CareerLink
            </h1>
            <p className="text-xs sm:text-sm text-[#8FA3BF] mt-1.5 font-normal">
              Login to your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Address Field */}
            <div>
              <label className="block text-xs font-medium text-[#8FA3BF] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-white text-slate-900 text-xs sm:text-sm rounded-lg pl-10 pr-3.5 py-2.5 sm:py-3 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#DE9E4B] border border-slate-300 font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-medium text-[#8FA3BF] mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white text-slate-900 text-xs sm:text-sm rounded-lg pl-10 pr-10 py-2.5 sm:py-3 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#DE9E4B] border border-slate-300 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Forgot Password Link matching image.png */}
              <div className="text-right mt-1.5">
                <button
                  type="button"
                  onClick={() => onToast('Password reset link has been dispatched to your email address.')}
                  className="text-xs text-[#5D8AC2] hover:text-[#7DAAE3] underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            {/* Login Button matching image.png (Warm golden amber) */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-[#D89B57] hover:bg-[#CA8D47] active:bg-[#BC7F39] text-white font-semibold text-sm rounded-xl shadow-md transition-all duration-150 cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2"
              >
                <span>{isLoading ? 'Logging in...' : 'Login'}</span>
              </button>
            </div>

            {/* Don't have an account yet? Sign Up Now matching image.png */}
            <div className="text-center pt-3 text-xs text-[#8FA3BF]">
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={onNavigateRegister}
                className="text-[#DE9E4B] underline font-semibold hover:text-[#EEB367] cursor-pointer"
              >
                Sign Up Now
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Full Width Dark Bottom Footer matching image.png */}
      <footer className="w-full bg-[#0B1B36] text-[#8FA3BF] text-xs py-5 px-4 text-center border-t border-[#162744]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <button
            onClick={() => onToast('CareerLink: Sri Lanka Premier Talent & Recruitment Platform')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            About Us
          </button>
          <button
            onClick={() => onToast('Contact CareerLink Support at info@careerlink.lk')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Contact
          </button>
          <button
            onClick={() => onToast('Terms of Service: CareerLink Enterprise Guidelines')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Terms of Service
          </button>
          <button
            onClick={() => onToast('Privacy Policy: Data security and protection standards')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>
          <span className="text-[#64748B] font-medium">
            &copy; 2028 CareerLink
          </span>
        </div>
      </footer>
    </div>
  );
};
