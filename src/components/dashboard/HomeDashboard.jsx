import React, { useState } from 'react';
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
  Layers
} from 'lucide-react';

export default function HomeDashboard({ 
  topics, 
  onSelectTopic, 
  onStartQuiz, 
  onCreateFromQuickInput, 
  setCurrentView 
}) {
  const [quickInput, setQuickInput] = useState('');

  // Determine time-appropriate greeting
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
  };

  const samplePrompts = [
    { label: "Transformer Attention", text: "Attention mechanisms compute softmax(QK^T / sqrt(d_k))V to weight contextual sequence representations." },
    { label: "Synaptic Plasticity", text: "Long-Term Potentiation (LTP) requires NMDA magnesium unblocking followed by calcium influx and AMPA receptor trafficking." },
    { label: "Distributed Consensus", text: "Raft decomposes consensus into randomized leader elections, log replication, and commitment safety invariants." }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-10">
      
      {/* 1. Header & Greeting */}
      <header className="space-y-1.5 border-b border-[#E8E6DE] pb-6">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono uppercase tracking-wider text-charcoal-500 flex items-center gap-2">
            <Calendar size={13} className="text-charcoal-400" />
            <span>Thursday, October 29</span>
            <span className="text-charcoal-300">•</span>
            <span className="text-[#312E81] font-semibold">Active Term 2026</span>
          </div>
          <span className="text-xs text-charcoal-500 font-serif italic hidden sm:inline">
            "Repetition is the mother of learning."
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-900 tracking-tight font-normal">
          {getGreeting()}, Alex.
        </h1>
        <p className="text-sm text-charcoal-600 max-w-xl leading-relaxed">
          Transform today’s reading and lecture concepts into permanent memory through active retrieval and structured synthesis.
        </p>
      </header>

      {/* 2. Prominent "What did you learn today?" Input */}
      <section className="bg-[#FFFFFF] border border-[#E2E0D8] rounded-lg p-5 sm:p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-sm font-semibold text-charcoal-900 tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#312E81]"></span>
              What did you learn today?
            </h2>
            <p className="text-xs text-charcoal-500">
              Paste raw notes, research excerpts, or a syllabus concept to synthesize.
            </p>
          </div>
          <span className="text-[11px] font-mono text-charcoal-400 hidden sm:inline">
            Markdown & Text Supported
          </span>
        </div>

        <form onSubmit={handleQuickSubmit} className="space-y-3">
          <div className="relative">
            <textarea
              rows={4}
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              placeholder="Paste a lecture excerpt, paper abstract, or conceptual notes here..."
              className="w-full text-sm text-charcoal-900 placeholder:text-charcoal-400 bg-[#FAF9F5] border border-[#E5E3DB] rounded-md p-3.5 focus:outline-none focus:ring-2 focus:ring-[#312E81] focus:border-transparent transition-all font-sans leading-relaxed resize-y"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
            {/* Quick preset chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-charcoal-500 font-medium mr-1">Quick fill:</span>
              {samplePrompts.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setQuickInput(p.text)}
                  className="text-xs px-2.5 py-1 rounded bg-[#F4F2EC] hover:bg-[#EAE7DC] text-charcoal-700 border border-[#E2E0D8] transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={!quickInput.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-[#312E81] hover:bg-[#282566] text-white text-xs font-semibold tracking-wide shadow-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Create study notes</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </form>
      </section>

      {/* 3. Compact Learning Activity Section (Editorial, Linear-inspired) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#E8E6DE] pb-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-charcoal-500 flex items-center gap-2">
            <TrendingUp size={14} className="text-charcoal-400" />
            Learning Activity & Retention
          </h2>
          <span className="text-xs text-charcoal-500">
            Current streak: <strong className="text-charcoal-800 font-semibold">7 consecutive days</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Stat 1 */}
          <div className="p-3.5 bg-[#FAF9F5] border border-[#E8E6DE] rounded-md">
            <div className="text-[11px] font-medium text-charcoal-500 uppercase tracking-wider">
              Retention Average
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-serif text-2xl font-normal text-charcoal-900">88.3%</span>
              <span className="text-xs text-emerald-700 font-medium">↑ 3.2% this week</span>
            </div>
            <div className="mt-2 w-full bg-[#E5E3DB] h-1 rounded-full overflow-hidden">
              <div className="bg-[#312E81] h-full" style={{ width: '88%' }}></div>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="p-3.5 bg-[#FAF9F5] border border-[#E8E6DE] rounded-md">
            <div className="text-[11px] font-medium text-charcoal-500 uppercase tracking-wider">
              Concepts Reviewed
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-serif text-2xl font-normal text-charcoal-900">24</span>
              <span className="text-xs text-charcoal-500 font-normal">across 4 domains</span>
            </div>
            <p className="mt-2 text-[11px] text-charcoal-500 truncate">
              Last: Transformer Self-Attention
            </p>
          </div>

          {/* Stat 3: 7-Day Recall Rhythm */}
          <div className="p-3.5 bg-[#FAF9F5] border border-[#E8E6DE] rounded-md">
            <div className="text-[11px] font-medium text-charcoal-500 uppercase tracking-wider">
              7-Day Recall Rhythm
            </div>
            <div className="mt-2 flex items-center justify-between gap-1">
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
                    className={`w-5 h-5 rounded-sm flex items-center justify-center text-[10px] font-mono ${
                      item.today
                        ? 'bg-[#312E81] text-white ring-2 ring-[#312E81]/30 font-bold'
                        : item.active
                        ? 'bg-[#DCD8CB] text-charcoal-800 font-medium'
                        : 'bg-[#EBE9E1] text-charcoal-400'
                    }`}
                  >
                    ✓
                  </div>
                  <span className={`text-[10px] ${item.today ? 'text-[#312E81] font-semibold' : 'text-charcoal-400'}`}>
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
        <div className="flex items-center justify-between border-b border-[#E8E6DE] pb-2">
          <div className="flex items-center gap-2">
            <BookOpen size={14} className="text-charcoal-400" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
              Recently Studied Topics
            </h2>
            <span className="text-xs font-mono text-charcoal-400">({topics.length})</span>
          </div>
          <button 
            onClick={() => setCurrentView('library')}
            className="text-xs text-[#312E81] hover:text-[#1E1B4B] font-medium flex items-center gap-1 group"
          >
            <span>View full library</span>
            <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Editorial Table / List */}
        <div className="border border-[#E2E0D8] rounded-md bg-[#FFFFFF] divide-y divide-[#EFECE6] overflow-hidden">
          {topics.slice(0, 4).map((topic) => (
            <div 
              key={topic.id}
              className="p-4 hover:bg-[#FAF9F5] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              {/* Left Column: Title & Subject */}
              <div className="space-y-1 sm:max-w-md">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#F0EDE4] text-charcoal-700 border border-[#E5E2D8]">
                    {topic.subject}
                  </span>
                  <span className="text-[11px] text-charcoal-400 font-mono">
                    {topic.readTime}
                  </span>
                  <span className="text-charcoal-300">•</span>
                  <span className="text-[11px] text-charcoal-500">
                    Last studied {topic.lastStudied}
                  </span>
                </div>

                <h3 
                  onClick={() => onSelectTopic(topic)}
                  className="font-serif text-base font-medium text-charcoal-900 group-hover:text-[#312E81] transition-colors cursor-pointer"
                >
                  {topic.title}
                </h3>

                <p className="text-xs text-charcoal-500 line-clamp-1">
                  {topic.summary}
                </p>
              </div>

              {/* Right Column: Mastery & Quick Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-4 pt-1 sm:pt-0">
                {/* Mastery Bar */}
                <div className="text-left sm:text-right min-w-[90px]">
                  <div className="text-[10px] uppercase tracking-wider text-charcoal-400 font-semibold">
                    Mastery
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="w-16 bg-[#E5E3DB] h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#312E81] h-full rounded-full" 
                        style={{ width: `${topic.masteryScore}%` }}
                      ></div>
                    </div>
                    <span className="font-mono text-xs text-charcoal-700 font-medium">
                      {topic.masteryScore}%
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onSelectTopic(topic)}
                    className="px-2.5 py-1.5 rounded text-xs font-medium text-charcoal-700 hover:text-charcoal-900 bg-[#F4F2EC] hover:bg-[#EAE7DC] border border-[#E2DFD6] transition-colors"
                  >
                    Study Notes
                  </button>
                  <button
                    onClick={() => onStartQuiz(topic)}
                    className="px-2.5 py-1.5 rounded text-xs font-medium text-[#312E81] hover:text-white bg-[#EEF2FF] hover:bg-[#312E81] border border-[#D5DCFB] transition-colors flex items-center gap-1"
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

      {/* 5. Minimalist Footer Info */}
      <footer className="pt-4 border-t border-[#E8E6DE] text-xs text-charcoal-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          RecallMe Platform • Editorial EdTech Architecture
        </div>
        <div className="flex items-center gap-4 text-charcoal-500">
          <span>Active Session: 28 mins</span>
          <span>•</span>
          <span>Spaced Interval: 48h</span>
        </div>
      </footer>

    </div>
  );
}

