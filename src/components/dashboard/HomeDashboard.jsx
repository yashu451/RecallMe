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
  Bookmark, 
  ChevronRight, 
  Calendar, 
  Flame, 
  Zap, 
  Layers,
  Award
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

  const samplePrompts = [
    { label: "Transformer Attention", text: "Attention mechanisms compute softmax(QK^T / sqrt(d_k))V to weight contextual sequence representations." },
    { label: "Synaptic Plasticity", text: "Long-Term Potentiation (LTP) requires NMDA magnesium unblocking followed by calcium influx and AMPA receptor trafficking." },
    { label: "Distributed Consensus", text: "Raft decomposes consensus into randomized leader elections, log replication, and commitment safety invariants." }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* 1. Header & Greeting */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            <Calendar size={14} />
            <span>Academic Term 2026</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-normal">Active Recall Rhythm</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {getGreeting()}, {currentUser?.name?.split(' ')[0] || 'Alex'} 👋
          </h1>
          <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
            Ready to turn today’s lectures and reading into permanent retention? Let's verify your conceptual recall.
          </p>
        </div>

        {/* Duolingo-style Streak Badge */}
        <div className="p-3.5 bg-gradient-to-tr from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/80 rounded-2xl flex items-center gap-3.5 shadow-xs shrink-0">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
            <Flame size={22} className="fill-white" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-900 flex items-center gap-1">
              <span>{currentUser?.streak || 7} Day Streak!</span>
            </div>
            <div className="text-[11px] text-amber-700/90 font-medium">
              1 review due today to keep streak
            </div>
          </div>
        </div>
      </header>

      {/* 2. "What did you learn today?" Rapid Input */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></span>
              What did you learn today?
            </h2>
            <p className="text-xs text-slate-500">
              Paste raw notes, lecture excerpts, or a textbook snippet to synthesize.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/60 hidden sm:inline">
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
              className="w-full text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/70 border border-slate-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all leading-relaxed resize-y font-sans"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
            {/* Quick preset chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-slate-500 font-semibold mr-1">Quick fill:</span>
              {samplePrompts.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setQuickInput(p.text)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors font-medium border border-slate-200/60"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={!quickInput.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold tracking-wide shadow-md shadow-indigo-600/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Create study notes</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </form>
      </section>

      {/* 3. Learning Activity & Retention Progress (Linear & Duolingo style) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <TrendingUp size={15} className="text-indigo-600" />
            <span>Retention Velocity & Progress</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Weekly Target: <strong className="text-indigo-600 font-bold">4 / 5 Topics</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {/* Stat 1 */}
          <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-subtle space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Mean Retention Score
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">88.3%</span>
              <span className="text-xs text-emerald-600 font-bold">↑ 3.2% vs last week</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full" style={{ width: '88%' }}></div>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-subtle space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Active Concepts Mastered
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">24</span>
              <span className="text-xs text-slate-500 font-medium">across 4 academic domains</span>
            </div>
            <p className="text-[11px] text-slate-500 truncate">
              Recent: Scaled Dot-Product Attention
            </p>
          </div>

          {/* Stat 3: 7-Day Recall Rhythm */}
          <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-subtle space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
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
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold ${
                      item.today
                        ? 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-600/30'
                        : item.active
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    ✓
                  </div>
                  <span className={`text-[10px] font-semibold ${item.today ? 'text-indigo-600' : 'text-slate-400'}`}>
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
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
          <div className="flex items-center gap-2">
            <BookOpen size={15} className="text-indigo-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Recently Studied Topics
            </h2>
            <span className="text-xs font-mono text-slate-400">({topics.length})</span>
          </div>
          <button 
            onClick={() => navigate('/library')}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 group"
          >
            <span>View all in Library</span>
            <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Modern Topics List */}
        <div className="border border-slate-200/80 rounded-2xl bg-white divide-y divide-slate-100 overflow-hidden shadow-card">
          {topics.slice(0, 4).map((topic) => (
            <div 
              key={topic.id}
              className="p-5 hover:bg-slate-50/70 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              {/* Left Column: Title & Subject */}
              <div className="space-y-1 sm:max-w-md">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100/60">
                    {topic.subject}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {topic.readTime}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500">
                    Studied {topic.lastStudied}
                  </span>
                </div>

                <h3 
                  onClick={() => {
                    onSelectTopic(topic);
                    navigate(`/study/${topic.id}`);
                  }}
                  className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  {topic.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-1 leading-relaxed">
                  {topic.summary}
                </p>
              </div>

              {/* Right Column: Mastery & Quick Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-5 pt-1 sm:pt-0">
                {/* Mastery Bar */}
                <div className="text-left sm:text-right min-w-[95px]">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Mastery
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-full rounded-full" 
                        style={{ width: `${topic.masteryScore}%` }}
                      ></div>
                    </div>
                    <span className="font-mono text-xs text-slate-800 font-bold">
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
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Notes
                  </button>
                  <button
                    onClick={() => {
                      onStartQuiz(topic);
                      navigate(`/quiz/${topic.id}`);
                    }}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all flex items-center gap-1 shadow-xs hover:shadow-indigo-500/20"
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
