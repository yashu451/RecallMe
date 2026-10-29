import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Flame, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Plus, 
  BookOpen, 
  LayoutDashboard, 
  PenLine, 
  Library, 
  History,
  ChevronDown,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import SettingsModal from './SettingsModal';

export default function Navbar() {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Create', path: '/create', icon: PenLine },
    { name: 'My Library', path: '/library', icon: Library },
    { name: 'Quiz History', path: '/history', icon: History },
  ];

  const isPublicPage = ['/', '/login', '/signup'].includes(location.pathname);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-8">
            <Link 
              to={isAuthenticated ? "/dashboard" : "/"} 
              className="flex items-center gap-2.5 group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-blue-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 transition-transform group-hover:scale-105">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
                  <path d="M6 6h10"/>
                  <path d="M6 10h7"/>
                </svg>
              </div>
              <div>
                <span className="font-sans font-bold text-lg text-slate-900 tracking-tight leading-none block">
                  Recall<span className="text-indigo-600">Me</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase leading-none block mt-0.5">
                  EdTech Platform
                </span>
              </div>
            </Link>

            {/* Middle Nav Links for Logged-In Users */}
            {isAuthenticated && !isPublicPage && (
              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path || 
                    (link.path === '/library' && location.pathname.startsWith('/study')) ||
                    (link.path === '/create' && location.pathname.startsWith('/generate'));

                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                      }`}
                    >
                      <Icon size={15} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </nav>
            )}

            {/* Public Links when on Landing / Logged Out */}
            {(!isAuthenticated || isPublicPage) && (
              <nav className="hidden md:flex items-center gap-6">
                <a href="/#features" className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors">
                  Features
                </a>
                <a href="/#how-it-works" className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors">
                  How It Works
                </a>
                <a href="/#science" className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors">
                  The Science
                </a>
                <a href="/#faq" className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors">
                  FAQ
                </a>
              </nav>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Duolingo-inspired Streak Banner */}
                <div 
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-semibold shadow-xs"
                  title="7-Day Active Recall Streak! Keep reviewing daily to maintain momentum."
                >
                  <Flame size={15} className="text-amber-500 fill-amber-500 animate-pulse" />
                  <span>{currentUser?.streak || 7} Days</span>
                </div>

                {/* Quick Create Button */}
                <Link
                  to="/create"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-all hover:shadow-indigo-500/20"
                >
                  <Plus size={14} />
                  <span>Create Notes</span>
                </Link>

                {/* Profile Avatar Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    aria-label="User Profile Menu"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      {currentUser?.avatar || 'AC'}
                    </div>
                    <span className="hidden lg:block text-xs font-semibold text-slate-800 max-w-[120px] truncate">
                      {currentUser?.name || 'Alex Chen'}
                    </span>
                    <ChevronDown size={14} className="text-slate-400" />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-slate-200/80 shadow-popover py-1 z-50 animate-fadeIn">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <div className="text-xs font-semibold text-slate-900 truncate">
                          {currentUser?.name || 'Alex Chen'}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {currentUser?.email || 'alex.chen@stanford.edu'}
                        </div>
                        <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-medium">
                          <span>{currentUser?.institution || 'Student Account'}</span>
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <LayoutDashboard size={14} className="text-slate-400" />
                          <span>Dashboard</span>
                        </Link>
                        
                        <Link
                          to="/library"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Library size={14} className="text-slate-400" />
                          <span>My Study Library</span>
                        </Link>

                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            setSettingsModalOpen(true);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors text-left"
                        >
                          <Settings size={14} className="text-slate-400" />
                          <span>Settings & Preferences</span>
                        </button>
                      </div>

                      <div className="border-t border-slate-100 py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors text-left font-medium"
                        >
                          <LogOut size={14} />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Public Header Actions */
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs hover:shadow-indigo-500/20 transition-all"
                >
                  Get Started Free
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2 shadow-lg animate-fadeIn">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 p-2 border-b border-slate-100 pb-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                    {currentUser?.avatar || 'AC'}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900">{currentUser?.name}</div>
                    <div className="text-[11px] text-slate-500">{currentUser?.email}</div>
                  </div>
                  <div className="ml-auto flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-semibold">
                    <Flame size={13} className="text-amber-500 fill-amber-500" />
                    <span>{currentUser?.streak || 7}d</span>
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.name}
                        to={link.path}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      >
                        <Icon size={16} />
                        <span>{link.name}</span>
                      </Link>
                    );
                  })}

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setSettingsModalOpen(true);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 text-left"
                  >
                    <Settings size={16} />
                    <span>Settings & Goals</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 text-left pt-2 border-t border-slate-100"
                  >
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-2 py-2">
                <a 
                  href="/#features" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Features
                </a>
                <a 
                  href="/#how-it-works" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  How It Works
                </a>
                <a 
                  href="/#science" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  The Science
                </a>
                <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                  <Link
                    to="/login"
                    className="w-full text-center py-2 text-xs font-semibold text-slate-700 border border-slate-200 rounded-lg"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="w-full text-center py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg shadow-sm"
                  >
                    Get Started Free
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={settingsModalOpen} 
        onClose={() => setSettingsModalOpen(false)} 
      />
    </>
  );
}
