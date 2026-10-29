import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [forgotModal, setForgotModal] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please provide a valid study or university email address.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    const res = login(email, password);
    if (res.success) {
      navigate('/dashboard');
    }
  };

  const handleDemoLogin = () => {
    login('alex.chen@stanford.edu', 'password123');
    navigate('/dashboard');
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setResetSent(true);
    setTimeout(() => {
      setResetSent(false);
      setForgotModal(false);
    }, 2000);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 bg-[#F7F3ED]">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#E7E0D8] shadow-card p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="w-10 h-10 rounded-xl bg-[#222222] text-[#F7F3ED] flex items-center justify-center mx-auto mb-2 shadow-xs">
            <Lock size={18} />
          </div>
          <h1 className="text-2xl font-bold text-[#222222] tracking-tight">
            Log in to RecallMe
          </h1>
          <p className="text-xs text-[#706B66]">
            Welcome back! Resume your active recall and study streaks.
          </p>
        </div>

        {/* Demo Fast-Login Pill (Warm Sand / Burnt Tint) */}
        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full py-2.5 px-3 bg-[#FBF4EE] hover:bg-[#F6E7DE] border border-[#ECD0C0] rounded-xl text-xs font-bold text-[#983E1A] flex items-center justify-center gap-2 transition-colors shadow-xs"
        >
          <Sparkles size={14} className="text-[#C65D32]" />
          <span>One-Click Demo Account Login (Alex Chen)</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#E7E0D8] w-full"></div>
          <span className="bg-white px-2.5 text-[11px] uppercase tracking-wider text-[#706B66] font-bold absolute">
            or with credentials
          </span>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-[#FDF1F1] border border-[#F2C6C6] text-[#B93838] text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#252525]">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#706B66]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g., student@university.edu"
                className="w-full pl-9 pr-3.5 py-2 text-sm bg-white border border-[#E7E0D8] rounded-xl text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#C65D32] focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#252525]">Password</label>
              <button
                type="button"
                onClick={() => setForgotModal(true)}
                className="text-xs text-[#C65D32] hover:text-[#983E1A] font-semibold"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#706B66]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2 text-sm bg-white border border-[#E7E0D8] rounded-xl text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#C65D32] focus:border-transparent transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#706B66] hover:text-[#222222] p-0.5"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-[#C65D32] hover:bg-[#B64E24] text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>Log In to Dashboard</span>
            <ArrowRight size={14} />
          </button>
        </form>

        {/* Signup Link */}
        <div className="text-center text-xs text-[#706B66] pt-1">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#C65D32] hover:text-[#983E1A] font-bold">
            Create an account for free
          </Link>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {forgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#222222]/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E7E0D8] shadow-card max-w-sm w-full p-6 space-y-4">
            <h3 className="text-sm font-bold text-[#222222]">Reset Your Password</h3>
            <p className="text-xs text-[#706B66] leading-relaxed">
              Enter your study email address and we'll send you a secure link to reset your password.
            </p>

            {resetSent ? (
              <div className="p-3 bg-[#EDF5F1] border border-[#C0DCD0] text-[#38765C] text-xs rounded-xl flex items-center gap-2 font-semibold">
                <CheckCircle2 size={16} className="text-[#38765C]" />
                <span>Password reset instructions dispatched to your email!</span>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <input
                  type="email"
                  defaultValue={email}
                  placeholder="student@university.edu"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E7E0D8] rounded-xl text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#C65D32]"
                  required
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setForgotModal(false)}
                    className="px-3 py-1.5 text-xs text-[#706B66] hover:bg-[#F7F3ED] rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#C65D32] hover:bg-[#B64E24] rounded-lg shadow-xs"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
