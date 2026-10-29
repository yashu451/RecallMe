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
  Flame, 
  Zap, 
  Layers,
  RotateCw,
  HelpCircle,
  Check
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
  topics, 
  onSelectTopic, 
  onStartQuiz, 
  onCreateFromQuickInput 
}) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [quickInput, setQuickInput] = useState('');

  // Flashcard of the Day State
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardFeedback, setCardFeedback] = useState(null); // 'got_it' | 'review_again' | null

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
      
      {/* 1. Clean Header Area */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E0D8] pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222222] tracking-tight">
            Your Learning Space
          </h1>
          <p className="text-sm text-[#706B66] max-w-xl leading-relaxed">
            Turn what you learn into knowledge you remember.
          </p>
        </div>

        {/* Sand & Burnt Orange Streak Badge with tactile hover */}
        <div className="card-interactive p-3.5 bg-[#FAF5EF] border border-[#E8B786] rounded-2xl flex items-center gap-3.5 shadow-xs shrink-0 cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-[#222222] text-[#E8B786] flex items-center justify-center shadow-xs">
            <Flame size={22} className="text-[#C65D32] fill-[#C65D32]" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#7A3216] flex items-center gap-1">
              <span>{currentUser?.streak || 7} Day Streak!</span>
            </div>
            <div className="text-[11px] text-[#706B66] font-medium">
              1 review due today to maintain
            </div>
          </div>
        </div>
      </header>

      {/* 2. "What did you learn today?" Rapid Input */}
      <section className="card-interactive bg-white border border-[#E7E0D8] rounded-2xl p-5 sm:p-7 shadow-card space-y-4">
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
              className="input-glow w-full text-sm text-[#252525] placeholder:text-[#706B66]/60 bg-[#FAF8F5] border border-[#E7E0D8] rounded-xl p-4 focus:outline-none focus:bg-white leading-relaxed resize-y font-sans shadow-xs"
            />
          </div>

          <div className="flex justify-end pt-1">
            {/* Primary Action Button with tactile feedback */}
            <button
              type="submit"
              disabled={!quickInput.trim()}
              className="btn-tactile w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#C65D32] hover:bg-[#B64E24] text-white text-xs font-bold tracking-wide shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Create study notes</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </form>
      </section>

      {/* 3. Interactive Flashcard of the Day */}
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#E7E0D8] pb-2">
          <div className="space-y-0.5">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C65D32]">
              DAILY RECALL
            </div>
            <h2 className="text-sm sm:text-base font-bold text-[#222222] tracking-tight flex items-center gap-2">
              <Sparkles size={15} className="text-[#C65D32]" />
              <span>Flashcard of the Day</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#706B66] hidden sm:inline">
              Card {currentCardIndex + 1} of {DAILY_FLASHCARDS.length}
            </span>
            <button
              type="button"
              onClick={handleNextCard}
              className="btn-tactile inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E7E0D8] bg-white hover:bg-[#FAF8F5] text-xs font-bold text-[#252525] shadow-xs"
              title="Cycle to next study flashcard"
            >
              <span>Next Card</span>
              <ChevronRight size={14} className="text-[#706B66]" />
            </button>
          </div>
        </div>

        {/* 3D Flip Card Container */}
        <div className="flashcard-perspective w-full">
          <div className={`flashcard-inner rounded-2xl ${isFlipped ? 'is-flipped' : ''}`}>
            
            {/* FRONT FACE */}
            <div className="flashcard-front bg-white border border-[#E7E0D8] rounded-2xl p-6 sm:p-7 shadow-card flex flex-col justify-between space-y-5 card-interactive">
              
              {/* Front Top Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#FBF4EE] border border-[#ECD0C0] text-[#C65D32] flex items-center justify-center shadow-xs">
                    <HelpCircle size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#222222]">
                      {currentCard.subject}
                    </span>
                    <span className="text-[11px] font-mono text-[#706B66] ml-2 bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#E7E0D8]">
                      {currentCard.code}
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-mono text-[#706B66] sm:hidden">
                  {currentCardIndex + 1}/{DAILY_FLASHCARDS.length}
                </span>
              </div>

              {/* Front Question */}
              <div className="space-y-1.5 py-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#706B66]">
                  Active Retrieval Prompt:
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#222222] leading-snug">
                  {currentCard.question}
                </h3>
              </div>

              {/* Front Action Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#E7E0D8]">
                <span className="text-xs text-[#706B66]">
                  Test your recall before flipping to inspect the verified answer.
                </span>

                <button
                  type="button"
                  onClick={() => setIsFlipped(true)}
                  className="btn-tactile inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#C65D32] hover:bg-[#B64E24] text-white text-xs font-bold shadow-xs self-start sm:self-auto"
                >
                  <RotateCw size={13} />
                  <span>Reveal Answer</span>
                </button>
              </div>

            </div>

            {/* BACK FACE */}
            <div className="flashcard-back bg-white border border-[#E7E0D8] rounded-2xl p-6 sm:p-7 shadow-card flex flex-col justify-between space-y-5">
              
              {/* Back Top Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#EDF5F1] border border-[#C0DCD0] text-[#38765C] flex items-center justify-center shadow-xs">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#38765C] uppercase tracking-wider">
                      Verified Concept Solution
                    </span>
                    <span className="text-[11px] text-[#706B66] ml-2">
                      ({currentCard.subject})
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFlipped(false)}
                  className="btn-tactile text-xs text-[#706B66] hover:text-[#222222] flex items-center gap-1 font-semibold"
                >
                  <RotateCw size={12} />
                  <span>Flip to question</span>
                </button>
              </div>

              {/* Back Answer */}
              <div className="space-y-2 py-1">
                <p className="text-xs sm:text-sm text-[#252525] leading-relaxed font-sans">
                  {currentCard.answer}
                </p>
                {currentCard.insight && (
                  <div className="text-xs text-[#706B66] bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E7E0D8] font-mono">
                    <strong className="text-[#222222] font-sans">Key Insight:</strong> {currentCard.insight}
                  </div>
                )}
              </div>

              {/* Back Action Row: Got It / Review Again */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#E7E0D8]">
                <div>
                  {cardFeedback === 'got_it' && (
                    <span className="text-xs font-bold text-[#38765C] flex items-center gap-1">
                      <Check size={14} />
                      <span>Retained! Marked as understood.</span>
                    </span>
                  )}
                  {cardFeedback === 'review_again' && (
                    <span className="text-xs font-bold text-[#C65D32] flex items-center gap-1">
                      <RotateCcw size={14} />
                      <span>Queued for upcoming spaced repetition review.</span>
                    </span>
                  )}
                  {!cardFeedback && (
                    <span className="text-xs text-[#706B66]">
                      How durable was your recall of this concept?
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={handleReviewAgain}
                    className={`btn-tactile px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                      cardFeedback === 'review_again'
                        ? 'bg-[#FBF4EE] border-[#C65D32] text-[#C65D32]'
                        : 'bg-white border-[#E7E0D8] text-[#706B66] hover:text-[#222222] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    Review Again
                  </button>

                  <button
                    type="button"
                    onClick={handleGotIt}
                    className={`btn-tactile px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-xs ${
                      cardFeedback === 'got_it'
                        ? 'bg-[#38765C] text-white'
                        : 'bg-[#222222] hover:bg-[#333333] text-white'
                    }`}
                  >
                    Got it
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 4. Learning Activity & Retention Progress */}
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#E7E0D8] pb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#706B66] flex items-center gap-1.5">
            <TrendingUp size={15} className="text-[#C65D32]" />
            <span>Retention Velocity & Progress</span>
          </h2>
          <span className="text-xs text-[#706B66] font-medium">
            Weekly Target: <strong className="text-[#C65D32] font-bold">4 / 5 Topics</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {/* Stat 1 */}
          <div className="card-interactive p-4 bg-white border border-[#E7E0D8] rounded-xl shadow-subtle space-y-2">
            <div className="text-[11px] font-bold text-[#706B66] uppercase tracking-wider">
              Mean Retention Score
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#222222]">88.3%</span>
              <span className="text-xs text-[#38765C] font-bold">↑ 3.2% vs last week</span>
            </div>
            <div className="w-full bg-[#FAF8F5] border border-[#E7E0D8] h-2 rounded-full overflow-hidden">
              <div className="progress-bar-smooth bg-[#C65D32] h-full rounded-full" style={{ width: '88%' }}></div>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="card-interactive p-4 bg-white border border-[#E7E0D8] rounded-xl shadow-subtle space-y-2">
            <div className="text-[11px] font-bold text-[#706B66] uppercase tracking-wider">
              Active Concepts Mastered
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#222222]">24</span>
              <span className="text-xs text-[#706B66] font-medium">across 4 academic domains</span>
            </div>
            <p className="text-[11px] text-[#706B66] truncate">
              Recent: Scaled Dot-Product Attention
            </p>
          </div>

          {/* Stat 3: 7-Day Recall Rhythm */}
          <div className="card-interactive p-4 bg-white border border-[#E7E0D8] rounded-xl shadow-subtle space-y-2">
            <div className="text-[11px] font-bold text-[#706B66] uppercase tracking-wider">
              7-Day Recall Rhythm
            </div>
            <div className="flex items-center justify-between gap-1 pt-1">
              {[
                { day: 'F', active: true },
                { day: 'S', active: true },
                { day: 'S', active: true },
                { day: 'M', active: true },
                { day: 'T', active: true },
                { day: 'W', active: true },
                { day: 'T', active: true, today: true },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold transition-transform hover:scale-110 ${
                      item.today
                        ? 'bg-[#C65D32] text-white shadow-xs'
                        : item.active
                        ? 'bg-[#222222] text-[#F7F3ED] font-semibold'
                        : 'bg-[#F7F3ED] text-[#706B66] border border-[#E7E0D8]'
                    }`}
                  >
                    ✓
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

      {/* 4. Recently Studied Topics */}
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
            <ChevronRight size={13} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Topics List Card */}
        <div className="border border-[#E7E0D8] rounded-2xl bg-white divide-y divide-[#E7E0D8] overflow-hidden shadow-card">
          {topics.slice(0, 4).map((topic) => (
            <div 
              key={topic.id}
              className="p-5 hover:bg-[#FAF8F5] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
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
      </section>

    </div>
  );
}
