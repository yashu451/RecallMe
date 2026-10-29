import React from 'react';
import { CheckCircle2 } from 'lucide-react';

/**
 * QuizProgress Component
 * Progress indicator and jump palette aligned with RecallMe's burnt orange styling.
 */
export default function QuizProgress({
  currentIndex = 0,
  totalQuestions = 1,
  questions = [],
  userAnswers = {},
  onJumpToQuestion,
}) {
  const answeredCount = Object.keys(userAnswers).filter(
    (qId) => userAnswers[qId] !== undefined && userAnswers[qId] !== null && userAnswers[qId] !== ''
  ).length;

  const progressPercent = totalQuestions > 0 ? Math.round(((currentIndex + 1) / totalQuestions) * 100) : 0;

  return (
    <div className="mb-6 space-y-3 bg-white p-4 sm:p-5 rounded-2xl border border-[#E7E0D8] shadow-xs">
      {/* Top progress text */}
      <div className="flex items-center justify-between text-xs font-semibold">
        <div className="flex items-center gap-2 text-[#706B66]">
          <span className="font-bold text-[#222222]">
            Progress: {currentIndex + 1} of {totalQuestions}
          </span>
          <span className="text-[#E7E0D8]">•</span>
          <span className="text-[#C65D32] flex items-center gap-1 font-medium">
            <CheckCircle2 size={13} />
            <span>{answeredCount} answered</span>
          </span>
        </div>

        <span className="font-mono font-bold text-[#C65D32]">
          {progressPercent}% Complete
        </span>
      </div>

      {/* Progress Bar Track */}
      <div 
        className="w-full h-2.5 bg-[#FAF8F5] rounded-full overflow-hidden border border-[#E7E0D8] relative"
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div
          className="h-full bg-gradient-to-r from-[#C65D32] to-[#E8B786] rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Interactive Question Jump Palette */}
      {questions.length > 0 && (
        <div className="pt-2 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#706B66] shrink-0 mr-1">
            Jump to:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {questions.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              const isAnswered = userAnswers[q.id] !== undefined && userAnswers[q.id] !== null && userAnswers[q.id] !== '';

              let pillStyle = "bg-white text-[#706B66] border-[#E7E0D8] hover:border-[#ECD0C0] hover:text-[#222222]";
              if (isAnswered && !isCurrent) {
                pillStyle = "bg-[#FBF4EE] text-[#C65D32] border-[#ECD0C0] font-bold";
              } else if (isCurrent) {
                pillStyle = "bg-[#C65D32] text-white border-[#C65D32] shadow-xs font-extrabold ring-2 ring-[#ECD0C0]";
              }

              return (
                <button
                  key={q.id || idx}
                  type="button"
                  onClick={() => onJumpToQuestion && onJumpToQuestion(idx)}
                  className={`w-7 h-7 rounded-lg text-xs flex items-center justify-center border transition-all ${pillStyle}`}
                  title={`Question ${idx + 1} (${isAnswered ? 'Answered' : 'Unanswered'})`}
                  aria-label={`Jump to question ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
