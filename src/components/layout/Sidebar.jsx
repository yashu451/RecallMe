import React from 'react';
import { 
  Home, 
  PenLine, 
  BookMarked, 
  History, 
  Sparkles, 
  Plus, 
  GraduationCap, 
  Flame,
  ChevronRight,
  Library
} from 'lucide-react';

export default function Sidebar({ currentView, setCurrentView, libraryCount = 0 }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home, badge: null },
    { id: 'create', label: 'Create', icon: PenLine, badge: 'New' },
    { id: 'library', label: 'My Library', icon: Library, badge: libraryCount > 0 ? libraryCount : null },
    { id: 'history', label: 'Quiz History', icon: History, badge: null },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-[#E5E3DB] bg-[#FAF9F5] h-screen sticky top-0 select-none z-20">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#EBE9E1] flex items-center justify-between">
        <button 
          onClick={() => setCurrentView('home')} 
          className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-700 rounded"
        >
          {/* Logo Mark: Minimalist open book / folded ledger */}
          <div className="w-8 h-8 rounded-md bg-[#312E81] text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
              <path d="M6 6h10"/>
              <path d="M6 10h7"/>
            </svg>
          </div>
          <div>
            <span className="font-serif font-semibold text-lg text-charcoal-900 tracking-tight block leading-tight">
              RecallMe
            </span>
            <span className="text-[11px] font-medium tracking-wide text-charcoal-500 uppercase">
              Active Recall
            </span>
          </div>
        </button>

        {/* Quick Create Button */}
        <button
          onClick={() => setCurrentView('create')}
          title="Create new study notes"
          className="p-1.5 rounded-md text-charcoal-600 hover:text-indigo-900 hover:bg-[#EFECE4] transition-colors border border-transparent hover:border-[#E2E0D8]"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-charcoal-400">
          Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id || 
            (item.id === 'library' && currentView === 'study') ||
            (item.id === 'create' && currentView === 'generate');
          
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 text-left ${
                isActive
                  ? 'bg-[#EAE8E0] text-[#1E1B4B] font-semibold border-l-2 border-[#312E81]'
                  : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-[#F2EFE8]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon 
                  size={17} 
                  className={isActive ? 'text-[#312E81]' : 'text-charcoal-500'} 
                  strokeWidth={isActive ? 2.3 : 1.9}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[11px] px-1.5 py-0.5 rounded font-mono ${
                  isActive 
                    ? 'bg-[#DFDCD2] text-[#1E1B4B]' 
                    : 'bg-[#EDEAE1] text-charcoal-500'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Learning Focus Section */}
        <div className="pt-6 pb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-charcoal-400">
          Current Focus
        </div>
        <div className="px-3 py-2.5 bg-[#F4F2EC] rounded-md border border-[#E8E6DE] text-xs space-y-1.5">
          <div className="flex items-center justify-between text-charcoal-700">
            <span className="font-medium">Recall Target</span>
            <span className="font-mono text-[11px] text-[#312E81] font-semibold">4 / 5 Topics</span>
          </div>
          <div className="w-full bg-[#E2DFD6] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#312E81] h-full rounded-full" style={{ width: '80%' }}></div>
          </div>
          <p className="text-[11px] text-charcoal-500 leading-relaxed pt-0.5">
            80% weekly retention threshold met.
          </p>
        </div>
      </div>

      {/* User & Session Footer */}
      <div className="p-3 border-t border-[#EBE9E1] bg-[#FAF9F5]">
        <div className="flex items-center justify-between p-2 rounded-md hover:bg-[#F2EFE8] transition-colors cursor-pointer">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E6E2D8] border border-[#D8D4C8] text-charcoal-800 flex items-center justify-center font-serif font-semibold text-xs">
              AC
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold text-charcoal-900 leading-tight">Alex Chen</div>
              <div className="text-[11px] text-charcoal-500 leading-tight">alex@stanford.edu</div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50/90 border border-amber-200/80 px-2 py-0.5 rounded font-mono">
            <Flame size={12} className="text-amber-600 fill-amber-500" />
            <span>7d</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

