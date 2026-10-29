import React, { useState } from 'react';
import { X, User, Bell, Clock, Award, Shield, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function SettingsModal({ isOpen, onClose }) {
  const { currentUser, updateProfile } = useAuth();
  
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [dailyGoal, setDailyGoal] = useState(currentUser?.dailyGoal || 5);
  const [spacedInterval, setSpacedInterval] = useState(currentUser?.spacedInterval || '48h');
  const [notifications, setNotifications] = useState(currentUser?.notifications ?? true);
  const [savedToast, setSavedToast] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      dailyGoal: Number(dailyGoal),
      spacedInterval,
      notifications
    });
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#222222]/50 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl border border-[#E7E0D8] shadow-card w-full max-w-md overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E7E0D8] flex items-center justify-between bg-[#F7F3ED]/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FBF4EE] border border-[#ECD0C0] flex items-center justify-center text-[#C65D32]">
              <User size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#222222]">Student Profile & Settings</h3>
              <p className="text-xs text-[#706B66]">Manage active recall preferences</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-[#706B66] hover:text-[#222222] p-1 rounded-md transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {savedToast && (
            <div className="p-3 bg-[#EDF5F1] border border-[#C0DCD0] text-[#38765C] text-xs rounded-xl flex items-center gap-2 font-semibold">
              <Check size={14} className="text-[#38765C]" />
              <span>Settings saved successfully!</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#252525]">Full Name</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-[#E7E0D8] rounded-xl text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#C65D32] focus:border-transparent input-glow"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#252525]">Study Email</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-[#E7E0D8] rounded-xl text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#C65D32] focus:border-transparent input-glow"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#252525]">Daily Concept Target</label>
              <select
                value={dailyGoal}
                onChange={(e) => setDailyGoal(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-[#E7E0D8] rounded-xl text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#C65D32] input-glow"
              >
                <option value={3}>3 Concepts / day</option>
                <option value={5}>5 Concepts / day</option>
                <option value={10}>10 Concepts / day</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#252525]">Spaced Repetition</label>
              <select
                value={spacedInterval}
                onChange={(e) => setSpacedInterval(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-[#E7E0D8] rounded-xl text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#C65D32] input-glow"
              >
                <option value="24h">Daily (24 hours)</option>
                <option value="48h">Optimal (48 hours)</option>
                <option value="7d">Weekly (7 days)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E7E0D8] flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-[#222222]">Recall Reminders</div>
              <div className="text-[11px] text-[#706B66]">Alerts when topics are due for review</div>
            </div>
            <input 
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="h-4 w-4 rounded border-[#E7E0D8] text-[#C65D32] focus:ring-[#C65D32]"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-[#E7E0D8] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-bold text-[#706B66] hover:text-[#222222] hover:bg-[#F7F3ED] rounded-xl transition-colors btn-tactile"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-[#C65D32] hover:bg-[#B64E24] rounded-xl shadow-xs transition-colors btn-tactile"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
