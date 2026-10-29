import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle, 
  RotateCcw, 
  Clock, 
  AlertCircle,
  Flag,
  X
} from 'lucide-react';

export default function RecallQuizView({ 
  topic, 
  onCompleteQuiz, 
  onExitQuiz 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [questionIndex]: selectedOptionIndex }
  const [startTime] = useState(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const questions = topic.quiz || [];
  const currentQuestion = questions[currentIndex];
  const total = questions.length;
  const progressPercent = total > 0 ? ((currentIndex + 1) / total) * 100 : 0;

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}m ${rem < 10 ? '0' : ''}${rem}s`;
  };

  // Keyboard shortcut listener for options (1,2,3,4 or A,B,C,D) and Enter
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is in an input
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      const key = e.key.toLowerCase();
      if (key === '1' || key === 'a') handleSelectOption(0);
      else if (key === '2' || key === 'b') handleSelectOption(1);
      else if (key === '3' || key === 'c') handleSelectOption(2);
      else if (key === '4' || key === 'd') handleSelectOption(3);
      else if (key === 'enter') {
        if (userAnswers[currentIndex] !== undefined) {
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, userAnswers, total]);

  const handleSelectOption = (optionIndex) => {
    if (optionIndex < (currentQuestion?.options?.length || 0)) {
      setUserAnswers(prev => ({
        ...prev,
        [currentIndex]: optionIndex
      }));
    }
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Final submit
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Calculate final score
    let score = 0;
    const reviewDetails = questions.map((q, idx) => {
      const selected = userAnswers[idx];
      const isCorrect = selected === q.correctIndex;
      if (isCorrect) score += 1;
      return {
        questionId: q.id || `q-${idx}`,
        question: q.question,
        options: q.options,
        selectedOption: selected,
        correctOption: q.correctIndex,
        isCorrect: isCorrect,
        explanation: q.explanation
      };
    });

    const percentage = Math.round((score / total) * 100);
    const timeSpent = formatTime(elapsedSeconds);

    onCompleteQuiz({
      topicId: topic.id,
      topicTitle: topic.title,
      subject: topic.subject,
      score,
      totalQuestions: total,
      percentage,
      timeTaken: timeSpent,
      reviewDetails,
      date: new Date().toISOString().slice(0, 16).replace('T', ' ')
    });
  };

  if (!currentQuestion) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <p className="text-charcoal-600">No questions found for this topic.</p>
        <button
          onClick={onExitQuiz}
          className="px-4 py-2 bg-[#312E81] text-white rounded text-sm"
        >
          Return to Notes
        </button>
      </div>
    );
  }

  const selectedAnswer = userAnswers[currentIndex];
  const isAnswered = selectedAnswer !== undefined;
  const isLastQuestion = currentIndex === total - 1;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-8 select-none">
      
      {/* Top Controls & Meta */}
      <div className="flex items-center justify-between border-b border-[#E8E6DE] pb-4">
        <button
          onClick={onExitQuiz}
          className="text-xs font-medium text-charcoal-500 hover:text-charcoal-900 flex items-center gap-1.5 transition-colors"
        >
          <X size={15} />
          <span>Exit Session</span>
        </button>

        <div className="flex items-center gap-3 text-xs font-mono text-charcoal-500">
          <span className="flex items-center gap-1">
            <Clock size={12} className="text-charcoal-400" />
            {formatTime(elapsedSeconds)}
          </span>
          <span>•</span>
          <span className="text-charcoal-700 font-semibold">
            {topic.subject}
          </span>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-charcoal-500">
            Question <strong className="text-charcoal-900">{currentIndex + 1}</strong> of {total}
          </span>
          <span className="text-[#312E81] font-medium">
            {Math.round(progressPercent)}% Completed
          </span>
        </div>

        {/* Slim Linear Progress Bar */}
        <div className="w-full bg-[#E5E3DB] h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-[#312E81] h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card (Editorial, uncluttered) */}
      <div className="space-y-6 pt-2">
        
        {/* Question Text */}
        <div className="space-y-2">
          <div className="text-[11px] font-mono uppercase tracking-wider text-charcoal-400">
            Active Recall Prompt
          </div>
          <h2 className="font-serif text-xl sm:text-2xl text-charcoal-900 font-normal leading-relaxed">
            {currentQuestion.question}
          </h2>
        </div>

        {/* Options List */}
        <div className="space-y-2.5 pt-2">
          {currentQuestion.options.map((option, optIdx) => {
            const isSelected = selectedAnswer === optIdx;
            const letter = String.fromCharCode(65 + optIdx); // A, B, C, D

            return (
              <button
                key={optIdx}
                type="button"
                onClick={() => handleSelectOption(optIdx)}
                className={`w-full p-4 rounded-md border text-left transition-all duration-150 flex items-start gap-3.5 ${
                  isSelected
                    ? 'bg-[#EEF2FF] border-[#312E81] text-[#1E1B4B] shadow-xs ring-1 ring-[#312E81]'
                    : 'bg-white border-[#E2E0D8] text-charcoal-800 hover:bg-[#FAF9F5] hover:border-[#D0CDC2]'
                }`}
              >
                {/* Letter Key Pill */}
                <span
                  className={`w-6 h-6 rounded flex items-center justify-center font-mono text-xs font-semibold shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-[#312E81] text-white'
                      : 'bg-[#F0EDE4] text-charcoal-600 border border-[#E0DDCF]'
                  }`}
                >
                  {letter}
                </span>

                <span className="text-sm font-sans leading-relaxed pt-0.5">
                  {option}
                </span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Bottom Controls */}
      <div className="pt-6 border-t border-[#E8E6DE] flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-3.5 py-2 rounded text-xs font-medium text-charcoal-600 hover:text-charcoal-900 border border-transparent hover:border-[#E2E0D8] transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
        >
          <ArrowLeft size={13} />
          <span>Previous</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-charcoal-400 font-mono hidden sm:inline">
            Press [1-4] or [Enter]
          </span>

          <button
            type="button"
            onClick={handleNext}
            disabled={!isAnswered}
            className="px-5 py-2 rounded-md bg-[#312E81] hover:bg-[#282566] text-white text-xs font-semibold tracking-wide transition-colors flex items-center gap-2 shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>{isLastQuestion ? 'Submit & View Score' : 'Next Question'}</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

    </div>
  );
}
