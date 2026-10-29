import React from 'react';
import { LogOut, Clock, Layers, ArrowLeft } from 'lucide-react';

/**
 * QuizHeader Component
 * Styled in RecallMe's signature warm Ivory, Charcoal & Burnt Orange palette.
 * Displays domain, topic, question counter, timer, and exit controls.
 */
export default function QuizHeader({
  topic = 'Practice Quiz',
  domain = '',
  currentIndex = 0,
  totalQuestions = 1,
  onExitClick,
  elapsedSeconds = 0,
}) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <header className="mb-6 space-y-4">
      {/* Top navigation row: Exit button & Timer */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E7E0D8]">
        <button
          type="button"
          onClick={onExitClick}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#706B66] hover:text-[#222222] bg-white hover:bg-[#FAF8F5] border border-[#E7E0D8] rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-[#C65D32]"
          aria-label="Exit quiz session"
        >
          <LogOut size={14} className="text-[#706B66]" />
          <span>Exit Quiz</span>
        </button>

        {/* Elapsed Timer */}
        <div 
          className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-medium text-[#706B66] bg-white border border-[#E7E0D8] rounded-xl shadow-2xs"
          title="Elapsed quiz time"
        >
          <Clock size={13} className="text-[#C65D32]" />
          <span>{formatTime(elapsedSeconds)}</span>
        </div>
      </div>

      {/* Main Title, Domain Breadcrumb & Question Counter */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          {domain && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#C65D32] uppercase tracking-wider">
              <Layers size={13} />
              <span>{domain}</span>
            </div>
          )}

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222222] tracking-tight">
            {topic}
          </h1>

          <p className="text-xs sm:text-sm text-[#706B66] font-medium">
            Test Your Memory • Active Retrieval Session
          </p>
        </div>

        {/* Question Counter Pill */}
        <div className="flex items-baseline gap-1 text-sm font-semibold text-[#706B66] bg-white border border-[#E7E0D8] px-3.5 py-2 rounded-xl shadow-xs self-start sm:self-end">
          <span className="text-xs uppercase tracking-wide text-[#706B66] font-bold">Question</span>
          <span className="text-lg font-extrabold text-[#C65D32] leading-none">
            {currentIndex + 1}
          </span>
          <span className="text-xs text-[#706B66]">/</span>
          <span className="text-sm font-bold text-[#222222] leading-none">
            {totalQuestions}
          </span>
        </div>
      </div>
    </header>
  );
}
