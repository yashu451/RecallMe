import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LearningActivityCalendar from './LearningActivityCalendar';
import { 
  ArrowRight, 
  BookOpen, 
  Clock, 
  TrendingUp, 
  ChevronRight, 
  Flame, 
  Zap, 
  Loader2 
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

  // 1. Dynamic Mean Retention Score
  const studiedTopics = (topics || []).filter(t => (t.masteryScore || 0) > 0);
  const meanScore = studiedTopics.length > 0
    ? Math.round(studiedTopics.reduce((acc, t) => acc + (t.masteryScore || 0), 0) / studiedTopics.length)
    : 0;

  // 2. Dynamic Active Concepts Mastered
  const totalConcepts = (topics || []).reduce((acc, t) => acc + (t.keywords?.length || 0), 0);
  const uniqueDomains = new Set((topics || []).map(t => t.subject).filter(Boolean)).size;
  const recentConcept = topics?.[0]?.keywords?.[0]?.term || (topics?.[0]?.title ? topics[0].title : 'None yet');

  // 3. Dynamic 7-day recall rhythm (past 7 days ending today)
  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const todayDay = new Date().getDay();
  const rhythmDays = Array.from({ length: 7 }, (_, i) => {
    const dIdx = (todayDay - 6 + i + 7) % 7;
    const isToday = i === 6;
    const isActive = isToday ? (topics && topics.length > 0) : false;
    return {
      day: dayLabels[dIdx],
      active: isActive,
      today: isToday
    };
  });

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
      
      {/* 1. Existing Dashboard Heading and Streak Card */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E0D8] pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222222] tracking-tight">
            Your Learning Space
          </h1>
          <p className="text-sm text-[#706B66] max-w-xl leading-relaxed">
            Turn what you learn into knowledge you remember.
          </p>
        </div>

        {/* Sand & Burnt Orange Streak Badge */}
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

      {/* 2. "What did you learn today?" Content Input */}
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

      {/* 3. Learning Activity Calendar (directly below "What did you learn today?") */}
      <LearningActivityCalendar 
        topics={topics}
        quizHistory={quizHistory}
        streak={currentUser?.streak ?? 0}
      />

      {/* 4. Learning Activity & Retention Progress */}
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#E7E0D8] pb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#706B66] flex items-center gap-1.5">
            <TrendingUp size={15} className="text-[#C65D32]" />
            <span>Retention Velocity & Progress</span>
          </h2>
          <span className="text-xs font-mono font-medium text-[#706B66]">Updated Just Now</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Mean Retention Score */}
          <div className="p-5 bg-white border border-[#E7E0D8] rounded-2xl shadow-card space-y-2 card-tactile">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#706B66]">
              Mean Retention Score
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#222222] tracking-tight">
                {meanScore}%
              </span>
              <span className="text-xs font-mono text-[#38765C] font-bold">
                {studiedTopics.length > 0 ? `${studiedTopics.length} studied` : 'Start studying'}
              </span>
            </div>
            <div className="w-full bg-[#FAF8F5] border border-[#E7E0D8] h-2 rounded-full overflow-hidden">
              <div 
                className="progress-bar-smooth bg-[#C65D32] h-full rounded-full" 
                style={{ width: `${meanScore}%` }}
              ></div>
            </div>
            <div className="text-[11px] text-[#706B66] pt-0.5">
              Target &gt; 80% for long-term memory consolidation
            </div>
          </div>

          {/* Card 2: Active Concepts Mastered */}
          <div className="p-5 bg-white border border-[#E7E0D8] rounded-2xl shadow-card space-y-2 card-tactile">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#706B66]">
              Concepts Mastered
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#222222] tracking-tight">
                {totalConcepts}
              </span>
              <span className="text-xs text-[#706B66]">in {uniqueDomains} domains</span>
            </div>
            <div className="text-xs text-[#706B66] truncate pt-1">
              Latest: <span className="text-[#222222] font-semibold">{recentConcept}</span>
            </div>
            <div className="text-[11px] text-[#C65D32] font-semibold flex items-center gap-1">
              <Zap size={12} />
              <span>Active retrieval active</span>
            </div>
          </div>

          {/* Card 3: 7-Day Recall Rhythm */}
          <div className="p-5 bg-white border border-[#E7E0D8] rounded-2xl shadow-card space-y-2 card-tactile">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#706B66]">
                7-Day Recall Rhythm
              </div>
              <span className="text-xs font-mono text-[#C65D32] font-bold">
                {currentUser?.streak ?? 0}d streak
              </span>
            </div>

            <div className="flex items-center justify-between gap-1.5 pt-2">
              {rhythmDays.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <div 
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold transition-all ${
                      d.today 
                        ? 'bg-[#C65D32] text-white ring-2 ring-[#C65D32] ring-offset-2' 
                        : d.active 
                          ? 'bg-[#222222] text-[#F7F3ED]' 
                          : 'bg-[#FAF8F5] text-[#706B66] border border-[#E7E0D8]'
                    }`}
                  >
                    {d.day}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-[11px] text-[#706B66] pt-1 text-center font-mono">
              Consecutive Daily Recall
            </div>
          </div>
        </div>
      </section>

      {/* 5. Recently Studied Topics */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#E7E0D8] pb-2">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-[#222222] tracking-tight">
              Recently Studied Topics
            </h2>
            <p className="text-xs text-[#706B66]">
              Pick up where you left off or retake a practice quiz to reinforce memory traces.
            </p>
          </div>
          <button 
            onClick={() => navigate('/library')}
            className="text-xs text-[#C65D32] hover:text-[#983E1A] font-bold flex items-center gap-1 group"
          >
            <span>View all in Library</span>
            <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Topics List Card or Empty State */}
        {topics.length === 0 ? (
          <div className="p-10 text-center space-y-3 bg-white border border-[#E7E0D8] rounded-2xl shadow-card card-tactile">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FAF5EF] text-[#C65D32] flex items-center justify-center">
              <BookOpen size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[#222222]">No study topics yet</h3>
              <p className="text-xs text-[#706B66] max-w-sm mx-auto">
                Paste what you learned today in the box above to generate your first AI study set!
              </p>
            </div>
          </div>
        ) : (
          <div className="border border-[#E7E0D8] rounded-2xl bg-white divide-y divide-[#E7E0D8] overflow-hidden shadow-card card-tactile">
            {topics.slice(0, 4).map((topic) => (
              <div 
                key={topic.id}
                className="p-5 hover:bg-[#FAF8F5] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                {/* Left Column: Title & Subject */}
                <div className="space-y-1 sm:max-w-md">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#FBF4EE] text-[#C65D32] border border-[#ECD0C0]">
                      {topic.subject}
                    </span>
                    <span className="text-xs text-[#706B66] font-mono">
                      {topic.readTime}
                    </span>
                    <span className="text-[#E7E0D8]">•</span>
                    <span className="text-xs text-[#706B66]">
                      Studied {topic.lastStudied}
                    </span>
                  </div>

                  <h3 
                    onClick={() => {
                      onSelectTopic(topic);
                      navigate(`/study/${topic.id}`);
                    }}
                    className="text-base font-bold text-[#222222] group-hover:text-[#C65D32] transition-colors cursor-pointer"
                  >
                    {topic.title}
                  </h3>

                  <p className="text-xs text-[#706B66] line-clamp-1 leading-relaxed">
                    {topic.summary}
                  </p>
                </div>

                {/* Right Column: Mastery & Quick Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-5 pt-1 sm:pt-0">
                  {/* Mastery Bar */}
                  <div className="text-left sm:text-right min-w-[95px]">
                    <div className="text-[10px] uppercase tracking-wider text-[#706B66] font-bold">
                      Mastery
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="w-16 bg-[#FAF8F5] border border-[#E7E0D8] h-2 rounded-full overflow-hidden">
                        <div 
                          className="progress-bar-smooth bg-[#C65D32] h-full rounded-full" 
                          style={{ width: `${topic.masteryScore}%` }}
                        ></div>
                      </div>
                      <span className="font-mono text-xs text-[#222222] font-bold">
                        {topic.masteryScore}%
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onSelectTopic(topic);
                        navigate(`/study/${topic.id}`);
                      }}
                      className="btn-tactile px-3 py-1.5 rounded-lg text-xs font-bold text-[#252525] hover:text-[#222222] bg-[#F7F3ED] hover:bg-[#EFE9DF] border border-[#E7E0D8]"
                    >
                      Notes
                    </button>
                    <button
                      onClick={() => {
                        onStartQuiz(topic);
                        navigate(`/quiz/${topic.id}`);
                      }}
                      className="btn-tactile px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#C65D32] hover:bg-[#B64E24] flex items-center gap-1 shadow-xs"
                    >
                      <span>Quiz</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
