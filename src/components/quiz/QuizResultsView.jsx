import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  Flame
} from 'lucide-react';

export default function QuizResultsView({ 
  result, 
  onRetryQuiz, 
  onReviewNotes 
}) {
  const navigate = useNavigate();

  if (!result) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <p className="text-slate-600">No recent quiz session found.</p>
        <button
          onClick={() => navigate('/library')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
        >
          Browse Study Library
        </button>
      </div>
    );
  }

  const { score, totalQuestions, percentage, timeTaken, reviewDetails, topicTitle, subject, topicId } = result;

  const getQualitativeFeedback = () => {
    if (percentage === 100) {
      return "Exemplary active recall! Complete conceptual mastery demonstrated over mechanisms and theoretical invariants.";
    } else if (percentage >= 75) {
      return "Strong retention. The core invariants are well grasped. Review the flagged question below to close minor conceptual gaps.";
    } else if (percentage >= 50) {
      return "Moderate conceptual recall. Several fundamental definitions or mechanisms require re-synthesis in the study notes.";
    } else {
      return "Initial exposure phase. We recommend re-reading the Structured Notes tab and attempting the recall deck again.";
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <button
          onClick={() => navigate('/library')}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>My Study Library</span>
        </button>

        <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
          Active Session Evaluation
        </span>
      </div>

      {/* 1. Score Summary Header Card */}
      <header className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
            {subject}
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-xs text-slate-500 font-medium">
            {topicTitle}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-100 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Quiz Completed!
              </h1>
              {percentage >= 80 && (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                  <Flame size={14} className="text-amber-500 fill-amber-500" />
                  <span>Streak Maintained</span>
                </div>
              )}
            </div>
            <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
              {getQualitativeFeedback()}
            </p>
          </div>

          {/* Score Badge */}
          <div className="p-5 bg-slate-50/80 border border-slate-200/80 rounded-2xl text-right min-w-[170px] shadow-xs shrink-0">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
              Retention Score
            </div>
            <div className="flex items-baseline justify-end gap-1.5 mt-0.5">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                {score}
              </span>
              <span className="text-lg text-slate-400 font-medium">/</span>
              <span className="text-lg text-slate-500 font-medium">{totalQuestions}</span>
            </div>
            <div className="text-xs font-mono text-indigo-600 font-bold mt-1">
              {percentage}% Accuracy • {timeTaken}
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-3 flex-wrap pt-1">
          <button
            onClick={() => {
              if (onRetryQuiz) onRetryQuiz();
              navigate(`/quiz/${topicId}`);
            }}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold tracking-wide transition-all flex items-center gap-2 shadow-md shadow-indigo-600/20"
          >
            <RotateCcw size={14} />
            <span>Retry Quiz</span>
          </button>

          <button
            onClick={() => {
              if (onReviewNotes) onReviewNotes();
              navigate(`/study/${topicId}`);
            }}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-200 transition-colors flex items-center gap-2 shadow-xs"
          >
            <BookOpen size={14} />
            <span>Review Study Notes</span>
          </button>

          <button
            onClick={() => navigate('/library')}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            Back to Library
          </button>
        </div>
      </header>

      {/* 2. Answer Review Section */}
      <section className="space-y-4">
        <div className="border-b border-slate-200/80 pb-2 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Item-by-Item Answer Review ({totalQuestions} Questions)
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            {score} Correct • {totalQuestions - score} Incorrect
          </span>
        </div>

        <div className="space-y-4">
          {reviewDetails?.map((item, idx) => {
            const isCorrect = item.isCorrect;
            return (
              <div
                key={item.questionId || idx}
                className={`p-6 rounded-2xl border bg-white shadow-subtle transition-all space-y-3.5 ${
                  isCorrect
                    ? 'border-slate-200 border-l-4 border-l-emerald-500'
                    : 'border-slate-200 border-l-4 border-l-rose-500'
                }`}
              >
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400 font-bold">
                    Question 0{idx + 1}
                  </span>
                  
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    {isCorrect ? (
                      <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 size={14} />
                        <span>Correct</span>
                      </span>
                    ) : (
                      <span className="text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200 flex items-center gap-1">
                        <XCircle size={14} />
                        <span>Incorrect</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Prompt */}
                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                  {item.question}
                </h3>

                {/* Options Breakdown */}
                <div className="space-y-2 pt-1">
                  {item.options?.map((opt, optIdx) => {
                    const isSelected = item.selectedOption === optIdx;
                    const isTheCorrect = item.correctOption === optIdx;
                    const letter = String.fromCharCode(65 + optIdx);

                    let optStyle = "bg-slate-50 border-slate-200 text-slate-600";
                    if (isTheCorrect) {
                      optStyle = "bg-emerald-50/80 border-emerald-300 text-emerald-950 font-semibold";
                    } else if (isSelected && !isTheCorrect) {
                      optStyle = "bg-rose-50/80 border-rose-300 text-rose-950 line-through opacity-80";
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`text-xs sm:text-sm p-3 rounded-xl border flex items-start gap-3 ${optStyle}`}
                      >
                        <span className="font-mono text-xs font-bold shrink-0">
                          {letter}.
                        </span>
                        <span className="flex-1 leading-relaxed">{opt}</span>
                        {isTheCorrect && (
                          <span className="text-[10px] font-mono text-emerald-700 uppercase tracking-wider font-bold">
                            Correct Answer
                          </span>
                        )}
                        {isSelected && !isTheCorrect && (
                          <span className="text-[10px] font-mono text-rose-700 uppercase tracking-wider font-bold">
                            Your Selection
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Callout */}
                {item.explanation && (
                  <div className="text-xs sm:text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-4 leading-relaxed mt-2">
                    <strong className="text-slate-900 font-bold block mb-1">
                      Active Retrieval Rationale:
                    </strong>
                    {item.explanation}
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
