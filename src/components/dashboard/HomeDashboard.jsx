import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  RotateCcw, 
  Search, 
  TrendingUp, 
  ChevronRight, 
  Calendar, 
  Flame, 
  Zap, 
  Layers,
  HelpCircle,
  Check,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DAILY_FLASHCARDS = [
  {
    id: 'fc-1',
    subject: 'Database Systems',
    code: 'CS 145',
    question: 'What is the main purpose of normalization in DBMS?',
    answer: 'Normalization decomposes relations to minimize data redundancy and prevent insertion, update, and deletion anomalies while enforcing data integrity (e.g., 1NF, 2NF, 3NF, BCNF).',
    insight: 'Eliminates duplicate attributes and guarantees structural functional dependencies.'
  },
  {
    id: 'fc-2',
    subject: 'Distributed Systems',
    code: 'CS 244B',
    question: 'Why does the Raft consensus algorithm use randomized election timeouts?',
    answer: 'Randomized election timeouts (typically 150–300ms) prevent split-vote scenarios where multiple candidate nodes start elections simultaneously and split votes evenly, ensuring a single leader emerges quickly.',
    insight: 'Elects an unambiguous leader within a few heartbeat intervals.'
  },
  {
    id: 'fc-3',
    subject: 'Operating Systems',
    code: 'CS 140',
    question: 'What is the fundamental difference between a process context switch and a thread context switch?',
    answer: 'A process switch swaps virtual memory address spaces (updating page table pointers in the CR3 register and invalidating TLB caches), whereas a thread switch only swaps CPU registers, program counter, and stack within the same address space.',
    insight: 'Thread switches incur significantly lower overhead due to shared memory mapping.'
  },
  {
    id: 'fc-4',
    subject: 'Computer Networks',
    code: 'CS 144',
    question: 'Why does TCP require a three-way handshake instead of a two-way handshake?',
    answer: 'A three-way handshake (SYN, SYN-ACK, ACK) ensures that both client and server independently verify packet delivery in both directions and synchronize initial sequence numbers (ISNs), preventing delayed duplicate packets from causing phantom sessions.',
    insight: 'Guarantees reliable bidirectional sequence initialization.'
  }
];

export default function HomeDashboard({ 
  topics = [], 
  onSelectTopic, 
  onStartQuiz, 
  onCreateFromQuickInput 
}) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [quickInput, setQuickInput] = useState('');

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

  // Flashcard of the Day State
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardFeedback, setCardFeedback] = useState(null);

  const currentCard = DAILY_FLASHCARDS[currentCardIndex];

  const handleNextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev + 1) % DAILY_FLASHCARDS.length);
      setCardFeedback(null);
    }, 180);
  };

  const handleGotIt = () => {
    setCardFeedback('got_it');
  };

  const handleReviewAgain = () => {
    setCardFeedback('review_again');
  };

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    onCreateFromQuickInput(quickInput);
    navigate('/create');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* 1. Header & Greeting */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E0D8] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#C65D32] uppercase tracking-wider">
            <Calendar size={14} />
            <span>Academic Term 2026</span>
            <span className="text-[#E7E0D8]">•</span>
            <span className="text-[#706B66] font-medium">Active Recall Rhythm</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222222] tracking-tight">
            Your Learning Space, {currentUser?.name?.split(' ')[0] || 'Learner'} 👋
          </h1>
          <p className="text-sm text-[#706B66] max-w-xl leading-relaxed">
            Ready to turn today's lectures and reading into permanent retention? Let's verify your conceptual recall.
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

      {/* 2. Interactive Flashcard of the Day */}
      <section className="bg-gradient-to-br from-[#FAF8F5] via-[#FFFDFB] to-[#FBF4EE] border border-[#E7E0D8] rounded-2xl p-5 sm:p-6 shadow-card space-y-4 relative overflow-hidden card-tactile">
        <div className="flex items-center justify-between gap-2 border-b border-[#E7E0D8]/60 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#C65D32]/10 text-[#C65D32] flex items-center justify-center">
              <Zap size={14} className="fill-[#C65D32]" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#222222]">
              Flashcard of the Day
            </span>
            <span className="text-[11px] font-mono text-[#706B66] bg-white px-2 py-0.5 rounded-md border border-[#E7E0D8]">
              {currentCard.code} • {currentCard.subject}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-[#706B66] hidden sm:inline">
              Card {currentCardIndex + 1} of {DAILY_FLASHCARDS.length}
            </span>
            <button
              onClick={handleNextCard}
              className="text-xs font-bold text-[#706B66] hover:text-[#C65D32] flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white transition-colors"
              title="Next concept card"
            >
              <RefreshCw size={12} />
              <span>Next</span>
            </button>
          </div>
        </div>

        {/* 3D Flip Card Container */}
        <div 
          onClick={() => setIsFlipped(!isFlipped)}
          className="relative min-h-[160px] sm:min-h-[140px] cursor-pointer select-none group perspective-1000"
        >
          <div className="bg-white border border-[#E7E0D8] rounded-xl p-5 shadow-subtle transition-all duration-300 group-hover:border-[#ECD0C0] relative min-h-[150px] flex flex-col justify-between">
            {!isFlipped ? (
              <>
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#C65D32] flex items-center gap-1.5">
                    <HelpCircle size={13} />
                    <span>Active Recall Prompt — Click anywhere to reveal answer</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#222222] leading-snug">
                    {currentCard.question}
                  </h3>
                </div>
                <div className="text-[11px] text-[#706B66] font-medium flex items-center gap-1 pt-2">
                  <RotateCcw size={12} className="group-hover:rotate-45 transition-transform" />
                  <span>Click card to test your memory</span>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#38765C] flex items-center gap-1.5">
                    <CheckCircle2 size={13} />
                    <span>Core Synthesis & Retention Answer</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#252525] leading-relaxed">
                    {currentCard.answer}
                  </p>
                  <p className="text-[11px] text-[#706B66] italic bg-[#FAF8F5] p-2 rounded-lg border border-[#E7E0D8]">
                    <strong>Key takeaway:</strong> {currentCard.insight}
                  </p>
                </div>
                <div className="text-[11px] text-[#706B66] flex items-center gap-1 pt-2">
                  <RotateCcw size={12} />
                  <span>Click to flip back</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Interactive Self-Rating Buttons */}
        {isFlipped && (
          <div className="flex items-center justify-between gap-3 pt-1 animate-fadeIn">
            <span className="text-xs text-[#706B66]">How well did you recall this?</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReviewAgain}
                className={`btn-tactile text-xs px-3 py-1.5 rounded-lg border font-bold transition-all ${
                  cardFeedback === 'review_again'
                    ? 'bg-[#FBF4EE] text-[#C65D32] border-[#ECD0C0]'
                    : 'bg-white text-[#706B66] border-[#E7E0D8] hover:text-[#222222]'
                }`}
              >
                Needs Review
              </button>
              <button
                type="button"
                onClick={handleGotIt}
                className={`btn-tactile text-xs px-3 py-1.5 rounded-lg border font-bold transition-all ${
                  cardFeedback === 'got_it'
                    ? 'bg-[#EEF7F2] text-[#38765C] border-[#B8E2CC]'
                    : 'bg-white text-[#706B66] border-[#E7E0D8] hover:text-[#38765C]'
                }`}
              >
                Got It ✓
              </button>
              <button
                type="button"
                onClick={handleNextCard}
                className="btn-tactile text-xs px-3 py-1.5 rounded-lg bg-[#222222] text-white font-bold hover:bg-black transition-colors"
              >
                Next Card →
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 3. "What did you learn today?" Rapid Input */}
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

        <form onSubmit={handleQuickSubmit} className="space-y-3">
          <div className="relative">
            <textarea
              rows={3}
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              placeholder="e.g., 'Today we covered how the Taylor Rule specifies that central banks raise nominal rates more than 1:1 when inflation rises...' or paste paper excerpts"
              className="w-full text-sm text-[#252525] placeholder:text-[#706B66]/60 bg-[#FAF8F5] border border-[#E7E0D8] rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#C65D32] focus:bg-white transition-all leading-relaxed resize-y font-sans"
            />
          </div>

          <div className="flex items-center justify-end pt-1">
            <button
              type="submit"
              disabled={!quickInput.trim()}
              className="btn-tactile w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#C65D32] hover:bg-[#B64E24] text-white text-xs font-bold tracking-wide shadow-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Create study notes</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </form>
      </section>

      {/* 4. Learning Activity & Retention Progress */}
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#E7E0D8] pb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#706B66] flex items-center gap-1.5">
            <TrendingUp size={15} className="text-[#C65D32]" />
            <span>Retention Velocity & Progress</span>
          </h2>
          <span className="text-xs text-[#706B66] font-medium">
            Weekly Target: <strong className="text-[#C65D32] font-bold">{topics.length} / 5 Topics</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {/* Stat 1: Mean Retention Score */}
          <div className="card-tactile p-4 bg-white border border-[#E7E0D8] rounded-xl shadow-subtle space-y-2">
            <div className="text-[11px] font-bold text-[#706B66] uppercase tracking-wider">
              Mean Retention Score
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#222222]">{meanScore}%</span>
              <span className="text-xs text-[#38765C] font-bold">
                {studiedTopics.length > 0 ? `${studiedTopics.length} topics tested` : 'Take a quiz to score'}
              </span>
            </div>
            <div className="w-full bg-[#FAF8F5] border border-[#E7E0D8] h-2 rounded-full overflow-hidden">
              <div 
                className="progress-bar-smooth bg-[#C65D32] h-full rounded-full" 
                style={{ width: `${meanScore}%` }}
              ></div>
            </div>
          </div>

          {/* Stat 2: Active Concepts Mastered */}
          <div className="card-tactile p-4 bg-white border border-[#E7E0D8] rounded-xl shadow-subtle space-y-2">
            <div className="text-[11px] font-bold text-[#706B66] uppercase tracking-wider">
              Active Concepts Mastered
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#222222]">{totalConcepts}</span>
              <span className="text-xs text-[#706B66] font-medium">across {uniqueDomains} domain{uniqueDomains === 1 ? '' : 's'}</span>
            </div>
            <p className="text-[11px] text-[#706B66] truncate">
              Recent: {recentConcept}
            </p>
          </div>

          {/* Stat 3: 7-Day Recall Rhythm */}
          <div className="card-tactile p-4 bg-white border border-[#E7E0D8] rounded-xl shadow-subtle space-y-2">
            <div className="text-[11px] font-bold text-[#706B66] uppercase tracking-wider">
              7-Day Recall Rhythm
            </div>
            <div className="flex items-center justify-between gap-1 pt-1">
              {rhythmDays.map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold ${
                      item.today && item.active
                        ? 'bg-[#C65D32] text-white shadow-xs'
                        : item.active
                        ? 'bg-[#222222] text-[#F7F3ED] font-semibold'
                        : item.today
                        ? 'bg-[#FAF5EF] text-[#C65D32] border border-[#ECD0C0]'
                        : 'bg-[#F7F3ED] text-[#706B66]/40 border border-[#E7E0D8]'
                    }`}
                  >
                    {item.active ? '✓' : '•'}
                  </div>
                  <span className={`text-[10px] font-semibold ${item.today ? 'text-[#C65D32]' : 'text-[#706B66]'}`}>
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Recently Studied Topics */}
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#E7E0D8] pb-2">
          <div className="flex items-center gap-2">
            <BookOpen size={15} className="text-[#C65D32]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#706B66]">
              Recently Studied Topics
            </h2>
            <span className="text-xs font-mono text-[#706B66]">({topics.length})</span>
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
