import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotModal, setForgotModal] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.error || 'Login failed. Please verify credentials.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setResetSent(true);
    setTimeout(() => {
      setResetSent(false);
      setForgotModal(false);
    }, 2000);
  };

  const isNewUserError = error.includes('sign up first') || error.includes('No account found');

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 bg-[#F7F3ED]">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#E7E0D8] shadow-card p-6 sm:p-8 space-y-6 card-interactive">
        
        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="w-10 h-10 rounded-xl bg-[#222222] text-[#F7F3ED] flex items-center justify-center mx-auto mb-2 shadow-xs">
            <Lock size={18} />
          </div>
          <h1 className="text-2xl font-bold text-[#222222] tracking-tight">
            Log in to RecallMe
          </h1>
          <p className="text-xs text-[#706B66]">
            Enter your registered credentials to resume your active recall studies.
          </p>
        </div>

        {/* First time notice notice */}
        <div className="p-3 bg-[#FAF8F5] border border-[#E7E0D8] rounded-xl text-xs text-[#706B66] flex items-center justify-between gap-2">
          <span>First time on RecallMe?</span>
          <Link
            to="/signup"
            className="text-xs font-bold text-[#C65D32] hover:text-[#983E1A] inline-flex items-center gap-1"
          >
            <span>Sign up first</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-[#FDF1F1] border border-[#F2C6C6] text-[#B93838] text-xs rounded-xl font-medium space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="text-[#B93838] shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
            {isNewUserError && (
              <div className="pt-1 border-t border-[#F2C6C6]/60">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-1 font-bold text-[#C65D32] hover:underline"
                >
                  <UserPlus size={13} />
                  <span>Click here to create your free account now →</span>
                </Link>
              </div>
            )}
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
                className="w-full pl-9 pr-3.5 py-2 text-sm bg-white border border-[#E7E0D8] rounded-xl text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#C65D32] focus:border-transparent transition-all input-glow"
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
                className="w-full pl-9 pr-10 py-2 text-sm bg-white border border-[#E7E0D8] rounded-xl text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#C65D32] focus:border-transparent transition-all input-glow"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#706B66] hover:text-[#222222]"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-[#C65D32] hover:bg-[#B64E24] text-white text-xs font-bold tracking-wide transition-colors flex items-center justify-center gap-2 shadow-xs btn-tactile disabled:opacity-50"
          >
            <span>{loading ? 'Verifying account...' : 'Log In'}</span>
            <ArrowRight size={14} />
          </button>
        </form>

        {/* Signup Link */}
        <div className="text-center text-xs text-[#706B66] pt-1">
          Don't have an account yet?{' '}
          <Link to="/signup" className="text-[#C65D32] hover:text-[#983E1A] font-bold">
            Sign up first
          </Link>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {forgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#222222]/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E7E0D8] shadow-card max-w-sm w-full p-6 space-y-4">
            <h3 className="text-sm font-bold text-[#222222]">Reset Your Password</h3>
            <p className="text-xs text-[#706B66] leading-relaxed">
              Enter your registered study email address and we'll send you instructions to reset your password.
            </p>

            {resetSent ? (
              <div className="p-3 bg-[#EDF5F1] border border-[#C0DCD0] text-[#38765C] text-xs rounded-xl font-semibold">
                Password reset instructions dispatched to your email!
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <input
                  type="email"
                  defaultValue={email}
                  placeholder="student@university.edu"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E7E0D8] rounded-xl text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#C65D32] input-glow"
                  required
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setForgotModal(false)}
                    className="px-3 py-1.5 text-xs text-[#706B66] hover:bg-[#F7F3ED] rounded-lg font-medium btn-tactile"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#C65D32] hover:bg-[#B64E24] rounded-lg shadow-xs btn-tactile"
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
