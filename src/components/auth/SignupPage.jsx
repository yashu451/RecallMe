import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify both inputs.');
      return;
    }

    const res = signup(name, email, password);
    if (res.success) {
      navigate('/dashboard');
    }
  };

  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    return score;
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 bg-[#F7F3ED]">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#E7E0D8] shadow-card p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="w-10 h-10 rounded-xl bg-[#222222] text-[#F7F3ED] flex items-center justify-center mx-auto mb-2 shadow-xs">
            <User size={18} />
          </div>
          <h1 className="text-2xl font-bold text-[#222222] tracking-tight">
            Create your RecallMe Account
          </h1>
          <p className="text-xs text-[#706B66]">
            Join thousands mastering complex subjects through active recall.
          </p>
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
            <label className="text-xs font-bold text-[#252525]">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#706B66]" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Alex Chen"
                className="w-full pl-9 pr-3.5 py-2 text-sm bg-white border border-[#E7E0D8] rounded-xl text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#C65D32] focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#252525]">Study / University Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#706B66]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@stanford.edu"
                className="w-full pl-9 pr-3.5 py-2 text-sm bg-white border border-[#E7E0D8] rounded-xl text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#C65D32] focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#252525]">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#706B66]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
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

            {/* Password strength meter with Sand & Burnt Orange */}
            {password && (
              <div className="space-y-1 pt-1">
                <div className="flex gap-1 h-1">
                  <div className={`flex-1 rounded-full ${strength >= 1 ? 'bg-[#E8B786]' : 'bg-[#E7E0D8]'}`}></div>
                  <div className={`flex-1 rounded-full ${strength >= 2 ? 'bg-[#E8B786]' : 'bg-[#E7E0D8]'}`}></div>
                  <div className={`flex-1 rounded-full ${strength >= 3 ? 'bg-[#C65D32]' : 'bg-[#E7E0D8]'}`}></div>
                  <div className={`flex-1 rounded-full ${strength >= 4 ? 'bg-[#38765C]' : 'bg-[#E7E0D8]'}`}></div>
                </div>
                <div className="text-[10px] text-[#706B66] font-medium text-right">
                  {strength <= 2 ? 'Moderate password' : 'Strong password'}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#252525]">Confirm Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#706B66]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full pl-9 pr-3.5 py-2 text-sm bg-white border border-[#E7E0D8] rounded-xl text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#C65D32] focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-[#C65D32] hover:bg-[#B64E24] text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>Create Free Account</span>
            <ArrowRight size={14} />
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center text-xs text-[#706B66] pt-1">
          Already have an account?{' '}
          <Link to="/login" className="text-[#C65D32] hover:text-[#983E1A] font-bold">
            Log in here
          </Link>
        </div>

      </div>
    </div>
  );
}
