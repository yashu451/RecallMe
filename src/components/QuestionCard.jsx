import React, { useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check, Send, Sparkles } from 'lucide-react';

/**
 * QuestionCard Component
 * Displays the current multiple-choice question, option choices,
 * and navigation in RecallMe's burnt orange and warm ivory style.
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
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C65D32]">
          <Sparkles size={14} />
          <span>Active Retrieval Invariant</span>
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
              {/* Option Letter Pill */}
              <span className="quiz-option-badge">
                {letter}
              </span>

              {/* Option Text */}
              <span className="flex-1 pt-0.5 text-sm sm:text-base leading-relaxed text-[#252525]">
                {optionText}
              </span>

              {/* Selected Checkmark Indicator */}
              {isSelected && (
                <span className="w-6 h-6 rounded-full bg-[#C65D32] text-white flex items-center justify-center shrink-0 shadow-xs animate-in fade-in zoom-in-75 duration-150">
                  <Check size={14} strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Controls / Navigation */}
      <div className="pt-4 border-t border-[#E7E0D8] flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Previous Button */}
        <button
          type="button"
          onClick={onPrev}
          disabled={isFirst}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#E7E0D8] text-xs font-bold text-[#706B66] hover:text-[#222222] bg-white hover:bg-[#FAF8F5] transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          aria-label="Previous question"
        >
          <ArrowLeft size={15} />
          <span>Previous</span>
        </button>

        {/* Keyboard Hints (Desktop only) */}
        <div className="hidden md:flex items-center gap-1.5 text-[11px] font-mono text-[#706B66]">
          <kbd className="px-1.5 py-0.5 bg-[#FAF8F5] border border-[#E7E0D8] rounded text-[#222222]">1-4</kbd>
          <span>or</span>
          <kbd className="px-1.5 py-0.5 bg-[#FAF8F5] border border-[#E7E0D8] rounded text-[#222222]">A-D</kbd>
          <span>select</span>
          <span className="mx-1">•</span>
          <kbd className="px-1.5 py-0.5 bg-[#FAF8F5] border border-[#E7E0D8] rounded text-[#222222]">Enter</kbd>
          <span>advance</span>
        </div>

        {/* Next or Submit Button */}
        {isLast ? (
          <button
            type="button"
            onClick={onSubmit}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all shadow-xs flex items-center justify-center gap-2 ${
              isAnswered
                ? 'bg-[#38765C] hover:bg-[#2F634D] text-white ring-2 ring-[#C0DCD0]'
                : 'bg-[#C65D32] hover:bg-[#B64E24] text-white'
            }`}
            aria-label="Submit quiz"
          >
            <span>Submit Quiz</span>
            <Send size={14} />
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#C65D32] hover:bg-[#B64E24] text-white text-xs font-bold tracking-wide transition-colors shadow-xs flex items-center justify-center gap-2"
            aria-label="Next question"
          >
            <span>Next Question</span>
            <ArrowRight size={15} />
          </button>
        )}

      </div>

    </div>
  );
}
