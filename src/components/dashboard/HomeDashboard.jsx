import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  ChevronRight, 
  Flame, 
  Loader2,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function HomeDashboard({ 
  topics = [], 
  quizHistory = [],
  onSelectTopic, 
  onStartQuiz, 
  onCreateFromQuickInput,
  onGenerateNotes 
}) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [quickInput, setQuickInput] = useState('');
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  const [generateError, setGenerateError] = useState(null);

  // Real statistics derived directly from the authenticated user's records
  const totalNotes = (topics || []).length;
  const recentNotes = (topics || []).slice(0, 3);
  const totalQuizzes = (quizHistory || []).length;

  const avgQuizScore = totalQuizzes > 0
    ? Math.round(quizHistory.reduce((acc, q) => acc + (q.percentage || 0), 0) / totalQuizzes)
    : 0;

  const uniqueSubjects = Array.from(new Set((topics || []).map(t => t.subject).filter(Boolean)));
  
  // Real recent activity from authenticated user
  const latestQuiz = quizHistory && quizHistory.length > 0 ? quizHistory[0] : null;
  const latestTopic = topics && topics.length > 0 ? topics[0] : null;

  const handleQuickSubmit = async (e) => {
    e.preventDefault();
    if (!quickInput.trim() || isGeneratingNotes) return;

    if (typeof onGenerateNotes === 'function') {
      setIsGeneratingNotes(true);
      setGenerateError(null);
      try {
        const created = await onGenerateNotes(quickInput.trim());
        navigate(`/study/${created.id}`, { state: { topic: created, isNew: true } });
      } catch (err) {
        console.error('Failed to generate study notes:', err);
        setGenerateError(err.message || 'Generation failed. Opening editor...');
        setTimeout(() => {
          if (onCreateFromQuickInput) onCreateFromQuickInput(quickInput);
          navigate('/create');
        }, 1200);
      } finally {
        setIsGeneratingNotes(false);
      }
    } else {
      if (onCreateFromQuickInput) onCreateFromQuickInput(quickInput);
      navigate('/create');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* 1. Header & Greeting */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E0D8] pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222222] tracking-tight">
            Your Learning Space
          </h1>
          <p className="text-sm text-[#706B66] max-w-xl leading-relaxed">
            Turn what you learn into knowledge you remember.
          </p>
        </div>

        {/* Streak Badge */}
        <div className="card-tactile p-3.5 bg-[#FAF5EF] border border-[#E8B786] rounded-2xl flex items-center gap-3.5 shadow-xs shrink-0">
          <div className="w-10 h-10 rounded-xl bg-[#222222] text-[#E8B786] flex items-center justify-center">
            <Flame size={22} className="text-[#C65D32] fill-[#C65D32]" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#7A3216] flex items-center gap-1">
              <span>{currentUser?.streak ?? 0} Day Streak</span>
            </div>
            <div className="text-[11px] text-[#706B66] font-medium">
              {(currentUser?.streak ?? 0) > 0 ? 'Keep the momentum going!' : 'Study your first topic today!'}
            </div>
          </div>
        </div>
      </header>

      {/* 2. "What did you learn today?" Rapid Input */}
      <section className="bg-white border border-[#E7E0D8] rounded-2xl p-5 sm:p-7 shadow-card space-y-4 card-tactile">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-[#222222] tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C65D32]"></span>
              What did you learn today?
            </h2>
            <p className="text-xs text-[#706B66]">
              Paste raw notes, lecture excerpts, or a textbook snippet to synthesize.
            </p>
          </div>
          <span className="text-[11px] font-mono text-[#706B66] bg-[#F7F3ED] px-2.5 py-1 rounded-md border border-[#E7E0D8] hidden sm:inline">
            Markdown & Paper Text Supported
          </span>
        </div>

        {generateError && (
          <div className="p-3 bg-[#FDF1F1] border border-[#F2C6C6] rounded-xl text-xs text-[#B93838]">
            {generateError}
          </div>
        )}

        <form onSubmit={handleQuickSubmit} className="space-y-3">
          <div className="relative">
            <textarea
              rows={3}
              value={quickInput}
              disabled={isGeneratingNotes}
              onChange={(e) => setQuickInput(e.target.value)}
              placeholder="e.g., 'Today we covered how the Taylor Rule specifies that central banks raise nominal rates more than 1:1 when inflation rises...' or paste paper excerpts"
              className="w-full text-sm text-[#252525] placeholder:text-[#706B66]/60 bg-[#FAF8F5] border border-[#E7E0D8] rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#C65D32] focus:bg-white transition-all leading-relaxed resize-y font-sans disabled:opacity-50"
            />
          </div>

          <div className="flex items-center justify-end pt-1">
            <button
              type="submit"
              disabled={!quickInput.trim() || isGeneratingNotes}
              className="btn-tactile w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#C65D32] hover:bg-[#B64E24] text-white text-xs font-bold tracking-wide shadow-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isGeneratingNotes ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Synthesizing study notes...</span>
                </>
              ) : (
                <>
                  <span>Create study notes</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* 3. Combined Learning Overview: Continue Learning + Learning Progress */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E7E0D8] pb-3">
          <div className="space-y-0.5">
            <h2 className="text-base sm:text-lg font-bold text-[#222222] tracking-tight flex items-center gap-2">
              <Sparkles size={18} className="text-[#C65D32]" />
              <span>Learning Overview</span>
            </h2>
            <p className="text-xs text-[#706B66]">
              Your recent study materials, active retention statistics, and latest recall activity.
            </p>
          </div>
          {totalNotes > 0 && (
            <button
              onClick={() => navigate('/library')}
              className="text-xs text-[#C65D32] hover:text-[#983E1A] font-bold flex items-center gap-1 group self-start sm:self-auto btn-tactile"
            >
              <span>View all in Library ({totalNotes})</span>
              <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          )}
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* COLUMN 1: Continue Learning (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#706B66] flex items-center gap-1.5">
                <BookOpen size={14} className="text-[#C65D32]" />
                <span>Continue Learning</span>
              </h3>
              <span className="text-[11px] font-mono text-[#706B66]">
                {recentNotes.length > 0 ? `Showing ${recentNotes.length} of ${totalNotes}` : '0 saved notes'}
              </span>
            </div>

            {/* If no saved notes: Friendly Empty State */}
            {recentNotes.length === 0 ? (
              <div className="p-8 text-center space-y-4 bg-white border border-[#E7E0D8] rounded-2xl shadow-card card-tactile">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FAF5EF] text-[#C65D32] border border-[#E8B786] flex items-center justify-center">
                  <BookOpen size={22} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[#222222]">No study materials saved yet</h4>
                  <p className="text-xs text-[#706B66] max-w-sm mx-auto leading-relaxed">
                    Paste your first lecture transcript or reading notes above, or click below to create structured study sets with active recall quizzes.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/create')}
                  className="btn-tactile inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#C65D32] hover:bg-[#B64E24] shadow-xs transition-colors"
                >
                  <Plus size={14} />
                  <span>Create Study Material</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentNotes.map((topic) => (
                  <div
                    key={topic.id}
                    className="p-4 sm:p-5 bg-white border border-[#E7E0D8] hover:border-[#C65D32] rounded-2xl shadow-card transition-all space-y-3 group card-tactile"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FBF4EE] text-[#C65D32] border border-[#ECD0C0]">
                            {topic.subject || 'General Study'}
                          </span>
                          <span className="text-xs text-[#706B66] font-mono">
                            {topic.readTime || '3 min read'}
                          </span>
                          <span className="text-[#E7E0D8]">•</span>
                          <span className="text-xs text-[#706B66] flex items-center gap-1 font-mono">
                            <Clock size={11} />
                            <span>{topic.lastStudied || topic.createdAt || 'Recent'}</span>
                          </span>
                        </div>

                        <h4
                          onClick={() => {
                            if (onSelectTopic) onSelectTopic(topic);
                            navigate(`/study/${topic.id}`);
                          }}
                          className="text-base font-bold text-[#222222] group-hover:text-[#C65D32] cursor-pointer transition-colors truncate"
                          title={topic.title}
                        >
                          {topic.title}
                        </h4>

                        <p className="text-xs text-[#706B66] line-clamp-1 leading-relaxed">
                          {topic.summary || 'Structured notes with key invariants and definitions.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#E7E0D8] gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-[#706B66]">
                          {topic.quiz?.length || 4} questions
                        </span>
                        {(topic.masteryScore || 0) > 0 && (
                          <span className="text-[11px] font-mono font-bold text-[#38765C]">
                            • {topic.masteryScore}% mastery
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (onSelectTopic) onSelectTopic(topic);
                            navigate(`/study/${topic.id}`);
                          }}
                          className="btn-tactile px-3 py-1.5 rounded-xl text-xs font-bold text-[#252525] hover:text-[#222222] bg-[#FAF8F5] hover:bg-[#F0EBE1] border border-[#E7E0D8] flex items-center gap-1.5 transition-colors"
                        >
                          <BookOpen size={12} className="text-[#706B66]" />
                          <span>Continue Studying</span>
                        </button>
                        <button
                          onClick={() => {
                            if (onStartQuiz) onStartQuiz(topic);
                            navigate(`/quiz/${topic.id}`);
                          }}
                          className="btn-tactile px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#C65D32] hover:bg-[#B64E24] flex items-center gap-1.5 shadow-xs transition-colors"
                        >
                          <span>Take Quiz</span>
                          <ArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* COLUMN 2: Learning Progress (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#706B66] flex items-center gap-1.5">
                <TrendingUp size={14} className="text-[#C65D32]" />
                <span>Learning Progress</span>
              </h3>
              <span className="text-[11px] font-mono text-[#706B66]">
                Real-time Statistics
              </span>
            </div>

            <div className="bg-white border border-[#E7E0D8] rounded-2xl p-5 sm:p-6 shadow-card space-y-5 card-tactile">
              
              {/* Stat 1 & 2: Materials Saved & Quizzes Completed */}
              <div className="grid grid-cols-2 gap-3 pb-4 border-b border-[#E7E0D8]">
                <div className="space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#706B66]">
                    Materials Saved
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#222222] tracking-tight">
                    {totalNotes}
                  </div>
                  <div className="text-[11px] text-[#706B66] truncate">
                    {uniqueSubjects.length > 0 
                      ? `${uniqueSubjects.length} subject domain${uniqueSubjects.length === 1 ? '' : 's'}` 
                      : 'Build your library'}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#706B66]">
                    Quizzes Completed
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#222222] tracking-tight">
                    {totalQuizzes}
                  </div>
                  <div className="text-[11px] text-[#706B66] truncate">
                    {totalQuizzes > 0 
                      ? `${totalQuizzes} recall session${totalQuizzes === 1 ? '' : 's'}` 
                      : 'No quiz sessions yet'}
                  </div>
                </div>
              </div>

              {/* Stat 3: Average Quiz Score */}
              <div className="space-y-2 pb-4 border-b border-[#E7E0D8]">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#706B66]">
                    Average Quiz Score
                  </div>
                  <span className="text-xs font-mono font-bold text-[#38765C]">
                    {totalQuizzes > 0 ? `${avgQuizScore}%` : 'N/A'}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-[#222222] tracking-tight">
                    {totalQuizzes > 0 ? `${avgQuizScore}%` : '0%'}
                  </span>
                  <span className="text-xs text-[#706B66]">
                    {totalQuizzes > 0 
                      ? `across ${totalQuizzes} attempt${totalQuizzes === 1 ? '' : 's'}` 
                      : 'Complete a quiz to set baseline'}
                  </span>
                </div>
                <div className="w-full bg-[#FAF8F5] border border-[#E7E0D8] h-2 rounded-full overflow-hidden">
                  <div
                    className="progress-bar-smooth bg-[#C65D32] h-full rounded-full transition-all duration-500"
                    style={{ width: `${avgQuizScore}%` }}
                  ></div>
                </div>
                <div className="text-[11px] text-[#706B66]">
                  {totalQuizzes > 0 
                    ? (avgQuizScore >= 80 ? 'Target achieved (>80%) for long-term retention' : 'Target > 80% for permanent consolidation')
                    : 'Active recall strengthens long-term memory retrieval pathways'}
                </div>
              </div>

              {/* Stat 4: Recent Learning Activity */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#706B66] flex items-center justify-between">
                  <span>Recent Learning Activity</span>
                  <Clock size={12} className="text-[#706B66]" />
                </div>

                {latestQuiz || latestTopic ? (
                  <div className="space-y-2">
                    {latestQuiz && (
                      <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E7E0D8] space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="font-bold text-[#C65D32] uppercase">Latest Quiz Attempt</span>
                          <span className="text-[#706B66]">{latestQuiz.date || 'Recently'}</span>
                        </div>
                        <div className="text-xs font-bold text-[#222222] truncate">
                          {latestQuiz.topicTitle}
                        </div>
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="font-bold text-[#38765C]">
                            Score: {latestQuiz.percentage}% ({latestQuiz.score}/{latestQuiz.totalQuestions})
                          </span>
                          <span className="text-[#E7E0D8]">•</span>
                          <span className="text-[#706B66]">{latestQuiz.timeTaken || 'Completed'}</span>
                        </div>
                      </div>
                    )}

                    {latestTopic && !latestQuiz && (
                      <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E7E0D8] space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="font-bold text-[#C65D32] uppercase">Latest Note Added</span>
                          <span className="text-[#706B66]">{latestTopic.lastStudied || latestTopic.createdAt || 'Recently'}</span>
                        </div>
                        <div className="text-xs font-bold text-[#222222] truncate">
                          {latestTopic.title}
                        </div>
                        <div className="text-[11px] text-[#706B66]">
                          {latestTopic.subject} • {latestTopic.readTime || '3 min read'}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E0D8] text-center text-xs text-[#706B66] leading-relaxed">
                    No learning activity recorded yet. Create study notes or complete a quiz to begin tracking your progress.
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
