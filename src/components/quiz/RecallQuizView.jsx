import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  X, 
  Zap
} from 'lucide-react';

export default function RecallQuizView({ 
  topic, 
  onCompleteQuiz, 
  onExitQuiz 
}) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [questionIndex]: selectedOptionIndex }
  const [startTime] = useState(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const questions = topic?.quiz || [];
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
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
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

    const result = {
      topicId: topic.id,
      topicTitle: topic.title,
      subject: topic.subject,
      score,
      totalQuestions: total,
      percentage,
      timeTaken: timeSpent,
      reviewDetails,
      date: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };

    onCompleteQuiz(result);
    navigate('/results');
  };

  if (!currentQuestion) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <p className="text-[#706B66]">No questions found for this topic.</p>
        <button
          onClick={onExitQuiz || (() => navigate('/library'))}
          className="px-4 py-2 bg-[#C65D32] hover:bg-[#B64E24] text-white rounded-xl text-sm font-bold"
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8 select-none animate-fadeIn">
      
      {/* Top Controls & Meta */}
      <div className="flex items-center justify-between border-b border-[#E7E0D8] pb-4">
        <button
          onClick={onExitQuiz || (() => navigate(`/study/${topic.id}`))}
          className="text-xs font-bold text-[#706B66] hover:text-[#222222] flex items-center gap-1.5 transition-colors"
        >
          <X size={16} />
          <span>Exit Session</span>
        </button>

        <div className="flex items-center gap-3 text-xs font-mono text-[#706B66]">
          <span className="flex items-center gap-1 bg-white border border-[#E7E0D8] px-2.5 py-0.5 rounded">
            <Clock size={12} className="text-[#706B66]" />
            {formatTime(elapsedSeconds)}
          </span>
          <span>•</span>
          <span className="text-[#222222] font-bold">
            {topic.subject}
          </span>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-[#706B66]">
            Question <strong className="text-[#222222]">{currentIndex + 1}</strong> of {total}
          </span>
          <span className="text-[#C65D32] font-mono">
            {Math.round(progressPercent)}% Completed
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white border border-[#E7E0D8] h-2.5 rounded-full overflow-hidden">
          <div 
            className="progress-bar-smooth bg-[#C65D32] h-full rounded-full"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card with subtle 3D lift */}
      <div className="card-interactive bg-white border border-[#E7E0D8] rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
        
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#C65D32] flex items-center gap-1.5">
            <Zap size={14} />
            <span>Active Retrieval Prompt</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-bold text-[#222222] leading-snug">
            {currentQuestion.question}
          </h2>
        </div>

        {/* Options List */}
        <div className="space-y-3 pt-2">
          {currentQuestion.options.map((option, optIdx) => {
            const isSelected = selectedAnswer === optIdx;
            const letter = String.fromCharCode(65 + optIdx); // A, B, C, D

            return (
              <button
                key={optIdx}
                type="button"
                onClick={() => handleSelectOption(optIdx)}
                className={`btn-tactile w-full p-4 rounded-xl border text-left flex items-start gap-3.5 ${
                  isSelected
                    ? 'bg-[#FBF4EE] border-[#C65D32] text-[#252525] ring-1 ring-[#C65D32] shadow-xs scale-[1.006]'
                    : 'bg-white border-[#E7E0D8] text-[#252525] hover:bg-[#FAF8F5] hover:border-[#D8CFC5] hover:translate-x-1'
                }`}
              >
                {/* Letter Key Pill */}
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-transform ${
                    isSelected
                      ? 'bg-[#C65D32] text-white shadow-xs scale-105'
                      : 'bg-[#F7F3ED] text-[#222222] border border-[#E7E0D8]'
                  }`}
                >
                  {letter}
                </span>

                <span className="text-sm font-medium leading-relaxed pt-0.5">
                  {option}
                </span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Bottom Controls */}
      <div className="pt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="btn-tactile px-4 py-2.5 rounded-xl text-xs font-bold text-[#706B66] hover:text-[#222222] border border-[#E7E0D8] bg-white hover:bg-[#FAF8F5] disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
        >
          <ArrowLeft size={14} />
          <span>Previous</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[#706B66] font-mono hidden sm:inline">
            Press [1-4] or [Enter]
          </span>

          <button
            type="button"
            onClick={handleNext}
            disabled={!isAnswered}
            className="btn-tactile px-6 py-2.5 rounded-xl bg-[#C65D32] hover:bg-[#B64E24] text-white text-xs font-bold tracking-wide flex items-center gap-2 shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>{isLastQuestion ? 'Submit & View Score' : 'Next Question'}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

    </div>
  );
}
