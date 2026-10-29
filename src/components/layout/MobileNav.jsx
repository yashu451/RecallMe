import React, { useState } from 'react';
import { 
  Home, 
  PenLine, 
  Library, 
  History, 
  Menu, 
  X, 
  Flame, 
  Plus 
} from 'lucide-react';

export default function MobileNav({ currentView, setCurrentView, libraryCount = 0 }) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home Dashboard', icon: Home },
    { id: 'create', label: 'Create Study Notes', icon: PenLine },
    { id: 'library', label: `My Library (${libraryCount})`, icon: Library },
    { id: 'history', label: 'Quiz History', icon: History },
  ];

  const handleSelect = (id) => {
    setCurrentView(id);
    setIsOpen(false);
  };

  return (
    <div className="md:hidden sticky top-0 z-40 bg-[#FAF9F5] border-b border-[#E5E3DB]">
      {/* Top Bar */}
      <div className="px-4 py-3 flex items-center justify-between">
        <button 
          onClick={() => handleSelect('home')}
          className="flex items-center gap-2"
        >
          <div className="w-7 h-7 rounded bg-[#312E81] text-white flex items-center justify-center">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
              <path d="M6 6h10"/>
              <path d="M6 10h7"/>
            </svg>
          </div>
          <span className="font-serif font-semibold text-lg text-charcoal-900">
            RecallMe
          </span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSelect('create')}
            className="p-1.5 rounded-md bg-[#312E81] text-white text-xs flex items-center gap-1 font-medium px-2.5"
          >
            <Plus size={14} />
            <span>Create</span>
          </button>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md text-charcoal-700 hover:bg-[#EFECE4] transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Slide-down Drawer Navigation */}
      {isOpen && (
        <div className="border-t border-[#E8E6DE] bg-[#FAF9F5] px-4 py-4 space-y-2 shadow-lg">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-left ${
                    isActive
                      ? 'bg-[#EAE8E0] text-[#312E81] font-semibold'
                      : 'text-charcoal-700 hover:bg-[#F2EFE8]'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-[#312E81]' : 'text-charcoal-500'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#E8E6DE] flex items-center justify-between text-xs text-charcoal-600 px-1">
            <span className="font-medium">Alex Chen (alex@stanford.edu)</span>
            <div className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              <Flame size={12} className="text-amber-600 fill-amber-500" />
              <span>7-day streak</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

