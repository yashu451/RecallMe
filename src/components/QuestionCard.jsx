import React, { useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check, Send, Sparkles, BookOpen } from 'lucide-react';

/**
 * QuestionCard Component
 * Displays the current multiple-choice question, option choices,
 * and navigation in RecallMe's burnt orange and warm ivory style.
 * Displays the source study note badge for active retrieval verification.
 */
export default function QuestionCard({
  question,
  currentIndex = 0,
  totalQuestions = 1,
  selectedAnswer,
  onSelectOption,
  onPrev,
  onNext,
  onSubmit,
}) {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalQuestions - 1;
  const isAnswered = selectedAnswer !== undefined && selectedAnswer !== null && selectedAnswer !== '';

  const options = question?.options || [];

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      const key = e.key.toLowerCase();

      // Number keys 1-4
      if (['1', '2', '3', '4'].includes(key)) {
        const idx = parseInt(key, 10) - 1;
        if (options[idx] !== undefined) {
          onSelectOption(options[idx]);
        }
      }
      // Letter keys a-d
      else if (['a', 'b', 'c', 'd'].includes(key)) {
        const idx = key.charCodeAt(0) - 97;
        if (options[idx] !== undefined) {
          onSelectOption(options[idx]);
        }
      }
      // Navigation keys
      else if (e.key === 'ArrowLeft') {
        if (!isFirst) onPrev();
      } else if (e.key === 'ArrowRight') {
        if (!isLast) onNext();
      } else if (e.key === 'Enter') {
        if (isLast) {
          onSubmit();
        } else {
          onNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isFirst, isLast, options, onSelectOption, onPrev, onNext, onSubmit]);

  if (!question) {
    return (
      <div className="bg-white border border-[#E7E0D8] rounded-2xl p-8 text-center text-[#706B66]">
        No question data available.
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E7E0D8] rounded-2xl p-6 sm:p-8 shadow-card transition-all duration-200 space-y-6">
      
      {/* Question Header & Prompt */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C65D32]">
            <Sparkles size={14} />
            <span>Active Recall Question</span>
          </div>
          {question.sourceNoteTitle && (
            <div 
              className="inline-flex items-center gap-1 text-[11px] font-mono text-[#706B66] bg-[#FAF8F5] px-2.5 py-0.5 rounded-full border border-[#E7E0D8] max-w-[280px] truncate" 
              title={`Question drawn from: ${question.sourceNoteTitle}`}
            >
              <BookOpen size={11} className="text-[#C65D32] shrink-0" />
              <span className="truncate">Source: {question.sourceNoteTitle}</span>
            </div>
          )}
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-[#222222] leading-snug tracking-tight">
          {question.question}
        </h2>
      </div>

      {/* Multiple-Choice Options List */}
      <div className="space-y-3" role="radiogroup" aria-label="Multiple choice options">
        {options.map((optionText, optIdx) => {
          const letter = String.fromCharCode(65 + optIdx); // A, B, C, D
          const isSelected = selectedAnswer === optionText;

          return (
            <button
              key={optIdx}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelectOption(optionText)}
              className={`quiz-option-btn ${isSelected ? 'selected' : ''}`}
            >
              <div className="flex items-center gap-3">
                {/* Option Letter Pill */}
                <span className={`quiz-option-pill ${isSelected ? 'selected' : ''}`}>
                  {letter}
                </span>

                {/* Option Text */}
                <span className="text-sm sm:text-base font-semibold leading-relaxed text-left flex-1">
                  {optionText}
                </span>
              </div>

              {/* Selection Checkmark Indicator */}
              {isSelected && (
                <div className="shrink-0 text-[#C65D32] animate-in fade-in zoom-in duration-150">
                  <Check size={18} strokeWidth={2.5} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Card Footer: Keyboard Shortcut Hint & Navigation Buttons */}
      <div className="pt-4 border-t border-[#E7E0D8] flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Keyboard Helper */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-[#706B66] font-mono">
          <span>Keys:</span>
          <span className="px-1.5 py-0.5 bg-[#FAF8F5] border border-[#E7E0D8] rounded text-[#222222] font-semibold">1-4</span>
          <span>or</span>
          <span className="px-1.5 py-0.5 bg-[#FAF8F5] border border-[#E7E0D8] rounded text-[#222222] font-semibold">A-D</span>
          <span>to choose •</span>
          <span className="px-1.5 py-0.5 bg-[#FAF8F5] border border-[#E7E0D8] rounded text-[#222222] font-semibold">Enter</span>
          <span>to advance</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
          {/* Previous Button */}
          <button
            type="button"
            onClick={onPrev}
            disabled={isFirst}
            className="quiz-nav-btn secondary flex items-center gap-1.5"
            aria-label="Previous question"
          >
            <ArrowLeft size={16} />
            <span>Previous</span>
          </button>

          {/* Next / Submit Button */}
          {isLast ? (
            <button
              type="button"
              onClick={onSubmit}
              className="quiz-nav-btn primary flex items-center gap-1.5"
              aria-label="Submit quiz session"
            >
              <span>Submit Quiz</span>
              <Send size={15} />
            </button>
          ) : (
            <button
              type="button"
              onClick={onNext}
              className="quiz-nav-btn primary flex items-center gap-1.5"
              aria-label="Next question"
            >
              <span>Next</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
