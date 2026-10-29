import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  RotateCcw, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
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
        <p className="text-[#706B66]">No recent quiz session found.</p>
        <button
          onClick={() => navigate('/library')}
          className="px-4 py-2 bg-[#C65D32] hover:bg-[#B64E24] text-white rounded-xl text-xs font-bold"
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
      <div className="flex items-center justify-between border-b border-[#E7E0D8] pb-4">
        <button
          onClick={() => navigate('/library')}
          className="text-xs font-bold text-[#706B66] hover:text-[#222222] flex items-center gap-1.5 transition-colors btn-tactile"
        >
          <ArrowLeft size={14} />
          <span>My Study Library</span>
        </button>

        <span className="text-xs font-mono text-[#706B66] bg-white border border-[#E7E0D8] px-2.5 py-1 rounded-md">
          Active Session Evaluation
        </span>
      </div>

      {/* 1. Score Summary Header Card */}
      <header className="bg-white border border-[#E7E0D8] rounded-2xl p-6 sm:p-8 shadow-card space-y-6 card-interactive">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#FBF4EE] text-[#C65D32] border border-[#ECD0C0]">
            {subject}
          </span>
          <span className="text-[#E7E0D8]">•</span>
          <span className="text-xs text-[#706B66] font-medium">
            {topicTitle}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[#E7E0D8] pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222222] tracking-tight">
                Quiz Completed!
              </h1>
              {percentage >= 80 && (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAF5EF] text-[#7A3216] text-xs font-bold border border-[#E8B786] shadow-xs">
                  <Flame size={14} className="text-[#C65D32] fill-[#C65D32]" />
                  <span>Streak Maintained</span>
                </div>
              )}
            </div>
            <p className="text-sm text-[#706B66] max-w-xl leading-relaxed">
              {getQualitativeFeedback()}
            </p>
          </div>

          {/* Score Badge */}
          <div className="p-5 bg-[#FAF8F5] border border-[#E7E0D8] rounded-2xl text-right min-w-[170px] shadow-xs shrink-0 card-interactive">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#706B66] font-bold">
              Retention Score
            </div>
            <div className="flex items-baseline justify-end gap-1.5 mt-0.5">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#222222]">
                {score}
              </span>
              <span className="text-lg text-[#706B66] font-medium">/</span>
              <span className="text-lg text-[#706B66] font-medium">{totalQuestions}</span>
            </div>
            <div className="text-xs font-mono text-[#C65D32] font-bold mt-1">
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
            className="px-5 py-2.5 rounded-xl bg-[#C65D32] hover:bg-[#B64E24] text-white text-xs font-bold tracking-wide transition-colors flex items-center gap-2 shadow-xs btn-tactile"
          >
            <RotateCcw size={14} />
            <span>Retry Quiz</span>
          </button>

          <button
            onClick={() => {
              if (onReviewNotes) onReviewNotes();
              navigate(`/study/${topicId}`);
            }}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#252525] text-xs font-bold border border-[#E7E0D8] transition-colors flex items-center gap-2 shadow-xs btn-tactile"
          >
            <BookOpen size={14} />
            <span>Review Study Notes</span>
          </button>

          <button
            onClick={() => navigate('/library')}
            className="px-4 py-2.5 rounded-xl bg-[#F7F3ED] hover:bg-[#EFE9DF] text-[#222222] text-xs font-bold transition-colors btn-tactile"
          >
            Back to Library
          </button>
        </div>
      </header>

      {/* 2. Answer Review Section */}
      <section className="space-y-4">
        <div className="border-b border-[#E7E0D8] pb-2 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#706B66]">
            Item-by-Item Answer Review ({totalQuestions} Questions)
          </h2>
          <span className="text-xs text-[#706B66] font-mono">
            {score} Correct • {totalQuestions - score} Incorrect
          </span>
        </div>

        <div className="space-y-4">
          {reviewDetails?.map((item, idx) => {
            const isCorrect = item.isCorrect;
            return (
              <div
                key={item.questionId || idx}
                className={`p-6 rounded-2xl border bg-white shadow-subtle transition-all space-y-3.5 card-interactive ${
                  isCorrect
                    ? 'border-[#E7E0D8] border-l-4 border-l-[#38765C]'
                    : 'border-[#E7E0D8] border-l-4 border-l-[#B93838]'
                }`}
              >
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#706B66] font-bold">
                    Question 0{idx + 1}
                  </span>
                  
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    {isCorrect ? (
                      <span className="text-[#38765C] bg-[#EDF5F1] px-2.5 py-0.5 rounded-md border border-[#C0DCD0] flex items-center gap-1">
                        <CheckCircle2 size={14} />
                        <span>Correct</span>
                      </span>
                    ) : (
                      <span className="text-[#B93838] bg-[#FDF1F1] px-2.5 py-0.5 rounded-md border border-[#F2C6C6] flex items-center gap-1">
                        <XCircle size={14} />
                        <span>Incorrect</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Prompt */}
                <h3 className="text-sm sm:text-base font-bold text-[#222222] leading-relaxed">
                  {item.question}
                </h3>

                {/* Options Breakdown */}
                <div className="space-y-2 pt-1">
                  {item.options?.map((opt, optIdx) => {
                    const isSelected = item.selectedOption === optIdx;
                    const isTheCorrect = item.correctOption === optIdx;
                    const letter = String.fromCharCode(65 + optIdx);

                    let optStyle = "bg-[#FAF8F5] border-[#E7E0D8] text-[#706B66]";
                    if (isTheCorrect) {
                      optStyle = "bg-[#EDF5F1] border-[#C0DCD0] text-[#38765C] font-bold";
                    } else if (isSelected && !isTheCorrect) {
                      optStyle = "bg-[#FDF1F1] border-[#F2C6C6] text-[#B93838] line-through opacity-85";
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
                          <span className="text-[10px] font-mono text-[#38765C] uppercase tracking-wider font-bold">
                            Correct Answer
                          </span>
                        )}
                        {isSelected && !isTheCorrect && (
                          <span className="text-[10px] font-mono text-[#B93838] uppercase tracking-wider font-bold">
                            Your Selection
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Callout */}
                {item.explanation && (
                  <div className="text-xs sm:text-sm text-[#252525] bg-[#FAF8F5] border border-[#E7E0D8] rounded-xl p-4 leading-relaxed mt-2">
                    <strong className="text-[#222222] font-bold block mb-1">
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
