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
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function HomeDashboard({ 
  topics, 
  onSelectTopic, 
  onStartQuiz, 
  onCreateFromQuickInput 
}) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [quickInput, setQuickInput] = useState('');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
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
            {getGreeting()}, {currentUser?.name?.split(' ')[0] || 'Alex'} 👋
          </h1>
          <p className="text-sm text-[#706B66] max-w-xl leading-relaxed">
            Ready to turn today’s lectures and reading into permanent retention? Let's verify your conceptual recall.
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

      {/* 3. Learning Activity & Retention Progress */}
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
