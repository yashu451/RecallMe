import React from 'react';
import { 
  RotateCcw, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  Award, 
  ArrowLeft,
  AlertCircle,
  Flame,
  LayoutGrid,
  Library
} from 'lucide-react';

/**
 * QuizResults Component
 * Displays the final evaluation after submission:
 * - Score (e.g. 8/10) & percentage
 * - Correct & incorrect counts
 * - Performance feedback message
 * - Item-by-item breakdown with user answer, correct answer, and explanation
 * - "Try Again" and "Back to Practice Quiz" buttons
 */
export default function QuizResults({
  result,
  topicTitle = 'Practice Quiz',
  domain = '',
  onTryAgain,
  onBackToHub,
  onBackToNotes,
  onBackToLibrary,
}) {
  if (!result) {
    return (
      <div className="bg-white border border-[#E7E0D8] rounded-2xl p-8 text-center space-y-4">
        <p className="text-[#706B66]">No recent quiz result available.</p>
        <button
          onClick={onBackToHub}
          className="px-4 py-2 bg-[#C65D32] hover:bg-[#B64E24] text-white text-xs font-bold rounded-xl"
        >
          Back to Practice Quiz Hub
        </button>
      </div>
    );
  }

  const {
    score = 0,
    totalQuestions = 0,
    percentage = 0,
    reviewDetails = [],
    timeTaken = '',
  } = result;

  const correctCount = score;
  const incorrectCount = Math.max(0, totalQuestions - score);

  // Performance message generator
  const getFeedback = (pct) => {
    if (pct === 100) {
      return {
        badge: 'Perfect Mastery',
        badgeColor: 'bg-[#EDF5F1] text-[#38765C] border-[#C0DCD0]',
        title: 'Outstanding Memory Retention!',
        desc: 'Flawless recall across all core concepts and invariants. Your active retrieval pathways for this topic are thoroughly reinforced.',
      };
    } else if (pct >= 75) {
      return {
        badge: 'Strong Retention',
        badgeColor: 'bg-[#FBF4EE] text-[#983E1A] border-[#ECD0C0]',
        title: 'Great Job! Solid Foundation',
        desc: 'You demonstrated strong conceptual understanding. Review the highlighted items below to solidify the remaining nuances.',
      };
    } else if (pct >= 50) {
      return {
        badge: 'Moderate Recall',
        badgeColor: 'bg-[#FAF5EF] text-[#7A3216] border-[#E8B786]',
        title: 'Good Effort! Some Gaps Remain',
        desc: 'You have grasped the general ideas, but several core definitions or mechanisms need another review in the study notes.',
      };
    } else {
      return {
        badge: 'Needs Review',
        badgeColor: 'bg-[#FDF1F1] text-[#B93838] border-[#F2C6C6]',
        title: 'Active Learning Opportunity',
        desc: 'Retrieval practice is most effective when confronting challenging gaps. Read the explanations below and try the quiz again.',
      };
    }
  };

  const feedback = getFeedback(percentage);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header Row with Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E7E0D8]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBackToHub}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#706B66] hover:text-[#222222] bg-white hover:bg-[#FAF8F5] border border-[#E7E0D8] rounded-xl transition-colors shadow-2xs"
          >
            <LayoutGrid size={14} className="text-[#C65D32]" />
            <span>Back to Practice Quiz Hub</span>
          </button>

          {onBackToNotes && (
            <button
              type="button"
              onClick={onBackToNotes}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#706B66] hover:text-[#222222] bg-white hover:bg-[#FAF8F5] border border-[#E7E0D8] rounded-xl transition-colors"
            >
              <BookOpen size={14} />
              <span>Notes</span>
            </button>
          )}

          {onBackToLibrary && (
            <button
              type="button"
              onClick={onBackToLibrary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#706B66] hover:text-[#222222] bg-white hover:bg-[#FAF8F5] border border-[#E7E0D8] rounded-xl transition-colors"
            >
              <Library size={14} />
              <span>Library</span>
            </button>
          )}
        </div>

        <span className="text-xs font-mono font-medium text-[#706B66]">
          Session Completed • {timeTaken}
        </span>
      </div>

      {/* Main Score Overview Card */}
      <div className="bg-white border border-[#E7E0D8] rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
        
        {/* Header with Title and Streak */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E0D8] pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${feedback.badgeColor}`}>
                <Award size={13} />
                <span>{feedback.badge}</span>
              </span>
              <span className="text-xs text-[#706B66] font-mono">
                {domain ? `${domain} • ` : ''}{topicTitle}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#222222] tracking-tight">
                {feedback.title}
              </h2>
              {percentage >= 75 && (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAF5EF] text-[#7A3216] text-xs font-bold border border-[#E8B786]">
                  <Flame size={14} className="text-[#C65D32] fill-[#C65D32]" />
                  <span>Streak Maintained</span>
                </div>
              )}
            </div>
            <p className="text-sm text-[#706B66] max-w-xl leading-relaxed">
              {feedback.desc}
            </p>
          </div>

          {/* Big Score Callout */}
          <div className="bg-[#FAF8F5] border border-[#E7E0D8] rounded-2xl p-5 text-center min-w-[170px] shrink-0 shadow-xs">
            <div className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#706B66]">
              Final Score
            </div>
            <div className="flex items-baseline justify-center gap-1 my-1">
              <span className="text-4xl font-extrabold text-[#222222]">{score}</span>
              <span className="text-[#706B66] font-semibold text-lg">/</span>
              <span className="text-[#706B66] font-bold text-lg">{totalQuestions}</span>
            </div>
            <div className="text-xs font-mono font-bold text-[#C65D32]">
              {percentage}% Accuracy
              {timeTaken ? ` • ${timeTaken}` : ''}
            </div>
          </div>
        </div>

        {/* Stats Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3.5 bg-[#EDF5F1] border border-[#C0DCD0] rounded-xl">
            <div className="text-[11px] uppercase tracking-wider font-bold text-[#38765C] flex items-center gap-1">
              <CheckCircle2 size={13} />
              <span>Correct Answers</span>
            </div>
            <div className="text-xl font-extrabold text-[#38765C] mt-0.5">
              {correctCount}
            </div>
          </div>

          <div className="p-3.5 bg-[#FDF1F1] border border-[#F2C6C6] rounded-xl">
            <div className="text-[11px] uppercase tracking-wider font-bold text-[#B93838] flex items-center gap-1">
              <XCircle size={13} />
              <span>Incorrect Answers</span>
            </div>
            <div className="text-xl font-extrabold text-[#B93838] mt-0.5">
              {incorrectCount}
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3.5 bg-[#FBF4EE] border border-[#ECD0C0] rounded-xl">
            <div className="text-[11px] uppercase tracking-wider font-bold text-[#983E1A]">
              Topic Assessed
            </div>
            <div className="text-sm font-bold text-[#222222] mt-1 truncate" title={topicTitle}>
              {topicTitle}
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onTryAgain}
            className="px-5 py-2.5 rounded-xl bg-[#C65D32] hover:bg-[#B64E24] text-white text-xs font-bold tracking-wide transition-colors flex items-center gap-2 shadow-xs"
          >
            <RotateCcw size={15} />
            <span>Try Again (Same Quiz)</span>
          </button>

          <button
            type="button"
            onClick={onBackToHub}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#222222] text-xs font-bold border border-[#E7E0D8] transition-colors flex items-center gap-2 shadow-xs"
          >
            <LayoutGrid size={15} className="text-[#C65D32]" />
            <span>Choose Different Topic</span>
          </button>
        </div>

      </div>

      {/* Item-by-Item Review Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#E7E0D8] pb-2">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#706B66]">
            Question-by-Question Review ({reviewDetails.length} Questions)
          </h3>
          <span className="text-xs font-mono text-[#706B66]">
            {correctCount} / {totalQuestions} Correct
          </span>
        </div>

        <div className="space-y-4">
          {reviewDetails.map((item, idx) => {
            const isCorrect = item.isCorrect;

            return (
              <div
                key={item.questionId || idx}
                className={`bg-white border rounded-2xl p-6 shadow-xs space-y-4 transition-all ${
                  isCorrect
                    ? 'border-[#E7E0D8] border-l-4 border-l-[#38765C]'
                    : 'border-[#E7E0D8] border-l-4 border-l-[#B93838]'
                }`}
              >
                {/* Question index & correct/incorrect indicator */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#706B66]">
                    Question {idx + 1}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#38765C] bg-[#EDF5F1] border border-[#C0DCD0] px-2.5 py-0.5 rounded-md">
                        <CheckCircle2 size={13} />
                        <span>Correct</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#B93838] bg-[#FDF1F1] border border-[#F2C6C6] px-2.5 py-0.5 rounded-md">
                        <XCircle size={13} />
                        <span>Incorrect</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Question text */}
                <h4 className="text-base font-bold text-[#222222] leading-snug">
                  {item.question}
                </h4>

                {/* Options display with indicators */}
                <div className="space-y-2 pt-1">
                  {item.options.map((optText, optIdx) => {
                    const letter = String.fromCharCode(65 + optIdx);
                    const isTheCorrect = optText === item.correctAnswer;
                    const isUserSelection = optText === item.selectedAnswer;

                    let optClass = 'bg-[#FAF8F5] border-[#E7E0D8] text-[#706B66]';
                    if (isTheCorrect) {
                      optClass = 'bg-[#EDF5F1] border-[#C0DCD0] text-[#38765C] font-semibold';
                    } else if (isUserSelection && !isTheCorrect) {
                      optClass = 'bg-[#FDF1F1] border-[#F2C6C6] text-[#B93838] line-through opacity-85';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`text-xs sm:text-sm p-3 rounded-xl border flex items-center justify-between gap-3 ${optClass}`}
                      >
                        <div className="flex items-center gap-2.5 flex-1">
                          <span className="font-mono font-bold text-xs shrink-0 w-5">
                            {letter}.
                          </span>
                          <span className="leading-relaxed">{optText}</span>
                        </div>

                        <div className="shrink-0">
                          {isTheCorrect && (
                            <span className="text-[10px] font-mono font-bold text-[#38765C] bg-[#EDF5F1] px-2 py-0.5 rounded uppercase border border-[#C0DCD0]">
                              Correct Answer
                            </span>
                          )}
                          {isUserSelection && !isTheCorrect && (
                            <span className="text-[10px] font-mono font-bold text-[#B93838] bg-[#FDF1F1] px-2 py-0.5 rounded uppercase border border-[#F2C6C6]">
                              Your Selection
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation rationale */}
                {item.explanation && (
                  <div className="p-4 bg-[#FAF8F5] border border-[#E7E0D8] rounded-xl text-xs sm:text-sm text-[#252525] leading-relaxed space-y-1">
                    <div className="font-bold text-[#222222] flex items-center gap-1.5">
                      <AlertCircle size={14} className="text-[#C65D32]" />
                      <span>Active Retrieval Rationale:</span>
                    </div>
                    <p className="text-[#706B66] pl-5">
                      {item.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
