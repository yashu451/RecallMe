import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import QuizHeader from '../components/QuizHeader';
import QuizProgress from '../components/QuizProgress';
import QuestionCard from '../components/QuestionCard';
import QuizResults from '../components/QuizResults';
import { fetchQuiz, submitQuizAttempt } from '../services/quizService';
import '../styles/quiz.css';
import { AlertTriangle, RotateCcw, AlertCircle, ArrowLeft, BookOpen, PlusCircle } from 'lucide-react';

/**
 * QuizPage Component
 * Coordinates an active practice quiz session strictly based on the user's saved notes.
 * Handles configuration from QuizHubPage (noteIds, notes, difficulty, count)
 * or a single noteId from URL params (/quiz/:id).
 */
export default function QuizPage({
  noteId: propNoteId,
  topic: propTopic,
  notes: propNotes,
  onCompleteQuiz: propOnCompleteQuiz,
  onExitQuiz: propOnExitQuiz,
}) {
  const { id: urlParamId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract configuration from location.state (passed from QuizHubPage) or props
  const hubConfig = location.state || {};
  const activeNoteId = urlParamId || propNoteId || null;

  // Resolve notes and configuration
  const passedNotes = hubConfig.notes || propNotes || (propTopic ? [propTopic] : []);
  const passedNoteIds = hubConfig.noteIds || (activeNoteId ? [activeNoteId] : []);
  const targetDifficulty = hubConfig.difficulty || 'Medium';
  const targetCount = hubConfig.count || 5;

  // Core quiz state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [questionId]: selectedOptionString }
  
  // Results & submission state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  // Timer & Session state
  const [startTime, setStartTime] = useState(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Dialog / Modal state
  const [showExitModal, setShowExitModal] = useState(false);
  const [showUnansweredModal, setShowUnansweredModal] = useState(false);
  const [unansweredIndices, setUnansweredIndices] = useState([]);

  // Fetch quiz questions strictly grounded in selected notes
  const loadQuizQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchQuiz({
        noteId: activeNoteId,
        noteIds: passedNoteIds,
        notes: passedNotes,
        difficulty: targetDifficulty,
        count: targetCount
      });

      setQuizData(data);
      setCurrentIndex(0);
      setUserAnswers({});
      setIsSubmitted(false);
      setSubmissionResult(null);
      setStartTime(Date.now());
      setElapsedSeconds(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('[QuizPage] Error generating quiz from notes:', err);
      setError(err.message || 'Failed to generate quiz from your selected study notes.');
    } finally {
      setLoading(false);
    }
  }, [activeNoteId, JSON.stringify(passedNoteIds), passedNotes?.length, targetDifficulty, targetCount]);

  useEffect(() => {
    loadQuizQuestions();
  }, [loadQuizQuestions]);

  // Timer interval
  useEffect(() => {
    if (isSubmitted || loading || error) return;

    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, isSubmitted, loading, error]);

  const questions = quizData?.questions || [];
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  // Format elapsed time string
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}m ${rem < 10 ? '0' : ''}${rem}s`;
  };

  // Option selection handler - allows modifying answer at any time before submission
  const handleSelectOption = (optionText) => {
    if (!currentQuestion) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionText,
    }));
  };

  // Navigation handlers
  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleJumpToQuestion = (index) => {
    if (index >= 0 && index < totalQuestions) {
      setCurrentIndex(index);
    }
  };

  // Check unanswered questions
  const getMissingAnswerIndices = () => {
    const missing = [];
    questions.forEach((q, idx) => {
      if (!userAnswers[q.id]) {
        missing.push(idx);
      }
    });
    return missing;
  };

  // Pre-submission check
  const handleRequestSubmit = () => {
    const missing = getMissingAnswerIndices();
    if (missing.length > 0) {
      setUnansweredIndices(missing);
      setShowUnansweredModal(true);
      return;
    }
    executeSubmit();
  };

  // Actual submission execution
  const executeSubmit = async () => {
    setShowUnansweredModal(false);
    setIsSubmitting(true);

    const formattedAnswers = questions.map((q) => ({
      questionId: q.id,
      selectedAnswer: userAnswers[q.id] || null,
    }));

    try {
      const topicTitle = quizData?.topic || (passedNotes?.[0]?.title) || 'Study Notes Quiz';
      const subject = quizData?.subject || (passedNotes?.[0]?.subject) || 'Study Deck';
      const noteIdRef = activeNoteId || passedNoteIds.join(',') || 'notes-quiz';

      const result = await submitQuizAttempt({
        noteId: noteIdRef,
        topic: topicTitle,
        subject: subject,
        difficulty: targetDifficulty,
        answers: formattedAnswers,
        questions: questions,
      });

      const fullResult = {
        ...result,
        topicId: noteIdRef,
        topicTitle: topicTitle,
        subject: subject,
        timeTaken: formatTime(elapsedSeconds),
        date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      };

      setSubmissionResult(fullResult);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Notify parent app if attached to update topic mastery and history
      if (typeof propOnCompleteQuiz === 'function') {
        propOnCompleteQuiz(fullResult);
      }
    } catch (err) {
      console.error('[QuizPage] Submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset / Try again with the exact same questions
  const handleTryAgain = () => {
    setUserAnswers({});
    setCurrentIndex(0);
    setIsSubmitted(false);
    setSubmissionResult(null);
    setStartTime(Date.now());
    setElapsedSeconds(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Exit Quiz / Back to Hub
  const handleConfirmExit = () => {
    setShowExitModal(false);
    if (typeof propOnExitQuiz === 'function') {
      propOnExitQuiz();
    } else {
      navigate('/quiz');
    }
  };

  const handleBackToHub = () => {
    navigate('/quiz');
  };

  const handleBackToNotes = () => {
    if (activeNoteId) {
      navigate(`/study/${activeNoteId}`);
    } else if (passedNoteIds.length > 0) {
      navigate(`/study/${passedNoteIds[0]}`);
    } else {
      navigate('/library');
    }
  };

  const handleBackToLibrary = () => {
    navigate('/library');
  };

  const displayTopic = quizData?.topic || (passedNotes?.[0]?.title) || 'Study Material Quiz';
  const displaySubject = quizData?.subject || (passedNotes?.[0]?.subject) || 'Study Deck';

  return (
    <div className="quiz-container">
      <div className="quiz-wrapper">

        {/* 1. Loading State */}
        {loading && (
          <div className="bg-white border border-[#E7E0D8] rounded-2xl p-12 text-center space-y-4 shadow-card animate-pulse">
            <div className="w-12 h-12 rounded-full border-4 border-[#C65D32] border-t-transparent animate-spin mx-auto" />
            <h2 className="text-lg font-bold text-[#222222]">
              Synthesizing Questions from Your Study Notes...
            </h2>
            <p className="text-xs text-[#706B66] max-w-sm mx-auto leading-relaxed">
              Extracting active recall multiple-choice questions grounded in the key concepts, definitions, and takeaways of your selected notes.
            </p>
          </div>
        )}

        {/* 2. Error State with Retry (Shows useful message, no generic questions) */}
        {!loading && error && (
          <div className="bg-white border border-[#F2C6C6] rounded-2xl p-8 sm:p-10 text-center space-y-5 shadow-card">
            <div className="w-12 h-12 bg-[#FDF1F1] text-[#B93838] border border-[#F2C6C6] rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-[#222222]">
                Quiz Generation Error
              </h2>
              <p className="text-sm text-[#706B66] max-w-md mx-auto leading-relaxed">
                {error}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => loadQuizQuestions()}
                className="px-5 py-2.5 rounded-xl bg-[#C65D32] hover:bg-[#B64E24] text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-xs"
              >
                <RotateCcw size={14} />
                <span>Retry Question Generation</span>
              </button>

              <button
                type="button"
                onClick={handleBackToHub}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#252525] border border-[#E7E0D8] text-xs font-semibold transition-colors flex items-center gap-2"
              >
                <ArrowLeft size={14} />
                <span>Back to Practice Quiz Hub</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/create')}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#C65D32] border border-[#ECD0C0] text-xs font-semibold transition-colors flex items-center gap-2"
              >
                <PlusCircle size={14} />
                <span>Create Study Notes</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. Quiz Flow: Questions Interface */}
        {!loading && !error && !isSubmitted && (
          <div className="space-y-6">
            {/* Header */}
            <QuizHeader
              topic={displayTopic}
              domain={displaySubject}
              currentIndex={currentIndex}
              totalQuestions={totalQuestions}
              onExitClick={() => setShowExitModal(true)}
              elapsedSeconds={elapsedSeconds}
            />

            {/* Progress Bar & Jump Navigator */}
            <QuizProgress
              currentIndex={currentIndex}
              totalQuestions={totalQuestions}
              questions={questions}
              userAnswers={userAnswers}
              onJumpToQuestion={handleJumpToQuestion}
            />

            {/* Active Question Card */}
            {currentQuestion ? (
              <QuestionCard
                question={currentQuestion}
                currentIndex={currentIndex}
                totalQuestions={totalQuestions}
                selectedAnswer={userAnswers[currentQuestion?.id]}
                onSelectOption={handleSelectOption}
                onPrev={handlePrev}
                onNext={handleNext}
                onSubmit={handleRequestSubmit}
              />
            ) : (
              <div className="bg-white border border-[#E7E0D8] rounded-2xl p-8 text-center text-[#706B66] space-y-3">
                <p>No questions could be extracted from the selected notes.</p>
                <button
                  onClick={handleBackToHub}
                  className="px-4 py-2 bg-[#C65D32] text-white text-xs font-bold rounded-xl"
                >
                  Return to Quiz Hub
                </button>
              </div>
            )}
          </div>
        )}

        {/* 4. Results Page (Evaluation Report) */}
        {!loading && !error && isSubmitted && submissionResult && (
          <QuizResults
            result={submissionResult}
            topicTitle={displayTopic}
            domain={displaySubject}
            onTryAgain={handleTryAgain}
            onBackToHub={handleBackToHub}
            onBackToNotes={handleBackToNotes}
            onBackToLibrary={handleBackToLibrary}
          />
        )}

        {/* Exit Confirmation Dialog Modal */}
        {showExitModal && (
          <div className="quiz-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="exit-modal-title">
            <div className="quiz-modal-card space-y-4">
              <div className="flex items-center gap-3 text-[#222222]">
                <div className="w-10 h-10 rounded-full bg-[#FDF1F1] text-[#B93838] border border-[#F2C6C6] flex items-center justify-center shrink-0">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h3 id="exit-modal-title" className="text-base font-bold text-[#222222]">
                    Exit Quiz Session?
                  </h3>
                  <p className="text-xs text-[#706B66]">
                    Material: {displayTopic}
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#706B66] leading-relaxed">
                If you exit now, your current session progress and selected answers will be discarded. Are you sure you want to return to the Practice Quiz Hub?
              </p>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExitModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#252525] bg-white hover:bg-[#FAF8F5] border border-[#E7E0D8] transition-colors"
                >
                  Resume Quiz
                </button>
                <button
                  type="button"
                  onClick={handleConfirmExit}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#B93838] hover:bg-[#A32A2A] transition-colors shadow-xs"
                >
                  Exit Quiz
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Unanswered Questions Warning Modal */}
        {showUnansweredModal && (
          <div className="quiz-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="unanswered-modal-title">
            <div className="quiz-modal-card space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FAF5EF] text-[#7A3216] border border-[#E8B786] flex items-center justify-center shrink-0">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 id="unanswered-modal-title" className="text-base font-bold text-[#222222]">
                    Unanswered Questions Remaining
                  </h3>
                  <p className="text-xs text-[#706B66]">
                    {unansweredIndices.length} of {totalQuestions} questions not answered
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#706B66] leading-relaxed">
                You have not selected an answer for the following questions:
              </p>

              {/* Badges for missing questions */}
              <div className="flex flex-wrap gap-1.5 p-3 bg-[#FAF8F5] border border-[#E7E0D8] rounded-xl max-h-32 overflow-y-auto">
                {unansweredIndices.map((idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setShowUnansweredModal(false);
                      setCurrentIndex(idx);
                    }}
                    className="px-2.5 py-1 text-xs font-semibold bg-white hover:bg-[#FBF4EE] border border-[#E7E0D8] hover:border-[#ECD0C0] text-[#C65D32] rounded-lg transition-colors"
                    title={`Jump to Question ${idx + 1}`}
                  >
                    Question {idx + 1} →
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowUnansweredModal(false);
                    if (unansweredIndices.length > 0) {
                      setCurrentIndex(unansweredIndices[0]);
                    }
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#C65D32] hover:bg-[#B64E24] transition-colors shadow-xs"
                >
                  Review Unanswered
                </button>

                <button
                  type="button"
                  onClick={executeSubmit}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-[#706B66] hover:text-[#222222] transition-colors"
                >
                  Submit Anyway
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
