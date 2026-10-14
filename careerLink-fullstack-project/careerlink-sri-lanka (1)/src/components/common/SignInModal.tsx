import React, { useState } from 'react';
import { X, CheckCircle2, User, Building, Shield, LogIn, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { CareerLinkLogo } from './CareerLinkLogo';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (role: 'seeker' | 'employer' | 'admin', name: string) => void;
  onSwitchToRegister?: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onSwitchToRegister,
}) => {
  if (!isOpen) return null;

  const [role, setRole] = useState<'seeker' | 'employer' | 'admin'>('seeker');
  const [email, setEmail] = useState('amila.perera@example.lk');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Quick switch role preset
  const handleSelectRole = (selectedRole: 'seeker' | 'employer' | 'admin') => {
    setRole(selectedRole);
    if (selectedRole === 'seeker') {
      setEmail('amila.perera@example.lk');
    } else if (selectedRole === 'employer') {
      setEmail('hr.recruitment@virtusa.lk');
    } else {
      setEmail('superadmin@careerlink.lk');
    }
    setPassword('CareerLink2026!');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        let userName = 'Candidate';
        if (role === 'seeker') userName = 'Amila Perera';
        else if (role === 'employer') userName = 'Virtusa Talent HR';
        else userName = 'Super Admin';

        onSuccess(role, userName);
        setIsSuccess(false);
        onClose();
      }, 900);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-[#0B1B36] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CareerLinkLogo showEmblem={true} textSize="text-base" />
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-in zoom-in-75 duration-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Signed In Successfully!</h4>
            <p className="text-xs text-slate-600">
              Welcome back to CareerLink Sri Lanka. Directing to your workspace...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Sign In to Your Account</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Select your account role and enter your credentials to access CareerLink
              </p>
            </div>

            {/* Role selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Sign in as:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectRole('seeker')}
                  className={`p-2 rounded-lg border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    role === 'seeker'
                      ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-2xs ring-1 ring-blue-600'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <User className={`w-4 h-4 ${role === 'seeker' ? 'text-blue-600' : 'text-slate-500'}`} />
                  <span className="text-[11px]">Job Seeker</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectRole('employer')}
                  className={`p-2 rounded-lg border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    role === 'employer'
                      ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-2xs ring-1 ring-blue-600'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Building className={`w-4 h-4 ${role === 'employer' ? 'text-blue-600' : 'text-slate-500'}`} />
                  <span className="text-[11px]">Employer</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectRole('admin')}
                  className={`p-2 rounded-lg border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    role === 'admin'
                      ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-2xs ring-1 ring-blue-600'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Shield className={`w-4 h-4 ${role === 'admin' ? 'text-blue-600' : 'text-slate-500'}`} />
                  <span className="text-[11px]">Admin</span>
                </button>
              </div>
            </div>

            {/* Email input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.lk"
                  className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Password input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full text-xs pl-9 pr-9 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Remember me on this browser</span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 text-white font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
              </button>
            </div>

            {/* Switch to Register */}
            <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
              Don't have a CareerLink account?{' '}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSwitchToRegister?.();
                }}
                className="text-blue-600 font-bold hover:underline cursor-pointer"
              >
                Register
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
