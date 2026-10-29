import React from 'react';
import { 
  RotateCcw, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  Clock, 
  Award, 
  ChevronRight,
  Sparkles,
  Share2
} from 'lucide-react';

export default function QuizResultsView({ 
  result, 
  onRetryQuiz, 
  onReviewNotes, 
  onGoLibrary 
}) {
  if (!result) return null;

  const { score, totalQuestions, percentage, timeTaken, reviewDetails, topicTitle, subject } = result;

  const getQualitativeFeedback = () => {
    if (percentage === 100) {
      return "Exemplary active recall. You have demonstrated complete conceptual mastery over the core mechanisms and formulas.";
    } else if (percentage >= 75) {
      return "Strong retention. The core invariants are well understood. Review the flagged items below to close minor conceptual gaps.";
    } else if (percentage >= 50) {
      return "Moderate conceptual recall. Several fundamental definitions or mechanisms require re-synthesis in the study notes.";
    } else {
      return "Initial exposure phase. We recommend re-reading the Structured Notes tab and attempting the recall deck again.";
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8 space-y-10">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between border-b border-[#E8E6DE] pb-4">
        <button
          onClick={onGoLibrary}
          className="text-xs font-medium text-charcoal-500 hover:text-charcoal-900 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>My Library</span>
        </button>

        <span className="text-xs font-mono text-charcoal-400">
          Session Evaluation
        </span>
      </div>

      {/* 1. Score Summary Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#F0EDE4] text-charcoal-800 border border-[#E5E2D8]">
            {subject}
          </span>
          <span className="text-charcoal-300">•</span>
          <span className="text-xs text-charcoal-500">
            {topicTitle}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-[#E8E6DE] pb-6">
          <div className="space-y-1">
            <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-900 font-normal tracking-tight">
              Quiz Completed
            </h1>
            <p className="text-sm text-charcoal-600 max-w-xl leading-relaxed">
              {getQualitativeFeedback()}
            </p>
          </div>

          {/* Simple, high-typography score badge */}
          <div className="p-4 bg-white border border-[#E2E0D8] rounded-md text-right min-w-[150px] shadow-subtle shrink-0">
            <div className="text-[10px] font-mono uppercase tracking-wider text-charcoal-400 font-semibold">
              Retention Score
            </div>
            <div className="flex items-baseline justify-end gap-1.5 mt-0.5">
              <span className="font-serif text-3xl font-semibold text-charcoal-900">
                {score}
              </span>
              <span className="text-base text-charcoal-400 font-serif">/</span>
              <span className="text-base text-charcoal-500 font-serif">{totalQuestions}</span>
            </div>
            <div className="text-xs font-mono text-[#312E81] font-semibold mt-0.5">
              {percentage}% Accuracy • {timeTaken}
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-2.5 flex-wrap pt-1">
          <button
            onClick={onRetryQuiz}
            className="px-4 py-2 rounded-md bg-[#312E81] hover:bg-[#282566] text-white text-xs font-semibold tracking-wide transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <RotateCcw size={13} />
            <span>Retry Quiz</span>
          </button>

          <button
            onClick={onReviewNotes}
            className="px-4 py-2 rounded-md bg-white hover:bg-[#FAF9F5] text-charcoal-800 text-xs font-medium border border-[#E2E0D8] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <BookOpen size={13} />
            <span>Review Study Notes</span>
          </button>

          <button
            onClick={onGoLibrary}
            className="px-4 py-2 rounded-md bg-[#F4F2EC] hover:bg-[#EAE7DC] text-charcoal-700 text-xs font-medium border border-[#E2DFD6] transition-colors"
          >
            Back to Library
          </button>
        </div>
      </header>

      {/* 2. Answer Review Section */}
      <section className="space-y-4">
        <div className="border-b border-[#E8E6DE] pb-2 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
            Item-by-Item Answer Review ({totalQuestions} Questions)
          </h2>
          <span className="text-xs text-charcoal-400 font-mono">
            {score} Correct • {totalQuestions - score} Incorrect
          </span>
        </div>

        <div className="space-y-4">
          {reviewDetails?.map((item, idx) => {
            const isCorrect = item.isCorrect;
            return (
              <div
                key={item.questionId || idx}
                className={`p-5 rounded-md border bg-white transition-all space-y-3 ${
                  isCorrect
                    ? 'border-[#E2E0D8] border-l-4 border-l-emerald-600'
                    : 'border-[#E2E0D8] border-l-4 border-l-rose-500'
                }`}
              >
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-charcoal-400 font-medium">
                    Question 0{idx + 1}
                  </span>
                  
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    {isCorrect ? (
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 size={13} />
                        <span>Correct</span>
                      </span>
                    ) : (
                      <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 flex items-center gap-1">
                        <XCircle size={13} />
                        <span>Incorrect</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Prompt */}
                <h3 className="text-sm font-semibold text-charcoal-900 font-sans leading-relaxed">
                  {item.question}
                </h3>

                {/* Options Breakdown */}
                <div className="space-y-1.5 pt-1">
                  {item.options?.map((opt, optIdx) => {
                    const isSelected = item.selectedOption === optIdx;
                    const isTheCorrect = item.correctOption === optIdx;
                    const letter = String.fromCharCode(65 + optIdx);

                    let optStyle = "bg-[#FAF9F5] border-[#EAE7DC] text-charcoal-600";
                    if (isTheCorrect) {
                      optStyle = "bg-emerald-50/70 border-emerald-300 text-emerald-900 font-medium";
                    } else if (isSelected && !isTheCorrect) {
                      optStyle = "bg-rose-50/70 border-rose-300 text-rose-900 line-through opacity-80";
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`text-xs p-2.5 rounded border flex items-start gap-2.5 ${optStyle}`}
                      >
                        <span className="font-mono text-[11px] font-semibold shrink-0">
                          {letter}.
                        </span>
                        <span className="flex-1 leading-relaxed">{opt}</span>
                        {isTheCorrect && (
                          <span className="text-[10px] font-mono text-emerald-700 uppercase tracking-wider font-semibold">
                            Correct Answer
                          </span>
                        )}
                        {isSelected && !isTheCorrect && (
                          <span className="text-[10px] font-mono text-rose-700 uppercase tracking-wider font-semibold">
                            Your Selection
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Callout */}
                {item.explanation && (
                  <div className="text-xs text-charcoal-700 bg-[#FAF9F5] border border-[#E8E6DE] rounded p-3 leading-relaxed mt-2">
                    <strong className="text-charcoal-900 font-semibold block mb-0.5">
                      Conceptual Rationale:
                    </strong>
                    {item.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer Return */}
      <div className="pt-4 border-t border-[#E8E6DE] flex items-center justify-between text-xs text-charcoal-500">
        <span>Completed on {result.date}</span>
        <button
          onClick={onRetryQuiz}
          className="text-[#312E81] hover:underline font-semibold flex items-center gap-1"
        >
          <span>Retake Quiz Now</span>
          <ChevronRight size={13} />
        </button>
      </div>

    </div>
  );
}

