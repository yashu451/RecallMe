import React, { useState } from 'react';
import { 
  History, 
  RotateCcw, 
  BookOpen, 
  Clock, 
  Award, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Search
} from 'lucide-react';

export default function QuizHistoryView({ 
  quizHistory, 
  onRetakeTopic, 
  onReviewTopic 
}) {
  const [search, setSearch] = useState('');

  const filteredHistory = quizHistory.filter(h => 
    h.topicTitle.toLowerCase().includes(search.toLowerCase()) ||
    h.subject.toLowerCase().includes(search.toLowerCase())
  );

  // Compute aggregate stats
  const totalSessions = quizHistory.length;
  const avgRetention = totalSessions > 0
    ? Math.round(quizHistory.reduce((acc, h) => acc + h.percentage, 0) / totalSessions)
    : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      
      {/* Header */}
      <header className="border-b border-[#E8E6DE] pb-6 space-y-1">
        <div className="text-xs font-mono uppercase tracking-wider text-charcoal-400">
          Retention Records
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-900 font-normal tracking-tight">
          Quiz History
        </h1>
        <p className="text-sm text-charcoal-600">
          A temporal record of your active retrieval sessions and conceptual retention scores.
        </p>
      </header>

      {/* Aggregate Overview Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 bg-white border border-[#E2E0D8] rounded-md shadow-subtle">
          <div className="text-[11px] font-medium uppercase tracking-wider text-charcoal-400">
            Total Sessions
          </div>
          <div className="mt-1 font-serif text-2xl text-charcoal-900">
            {totalSessions} Completed
          </div>
          <div className="text-xs text-charcoal-500 mt-0.5">Across all enrolled domains</div>
        </div>

        <div className="p-4 bg-white border border-[#E2E0D8] rounded-md shadow-subtle">
          <div className="text-[11px] font-medium uppercase tracking-wider text-charcoal-400">
            Average Retention
          </div>
          <div className="mt-1 font-serif text-2xl text-charcoal-900">
            {avgRetention}%
          </div>
          <div className="text-xs text-emerald-700 font-medium mt-0.5">Target &gt; 80% achieved</div>
        </div>

        <div className="p-4 bg-white border border-[#E2E0D8] rounded-md shadow-subtle">
          <div className="text-[11px] font-medium uppercase tracking-wider text-charcoal-400">
            Active Recall Protocol
          </div>
          <div className="mt-1 font-serif text-2xl text-charcoal-900">
            Spaced 48h
          </div>
          <div className="text-xs text-charcoal-500 mt-0.5">Next review scheduled tomorrow</div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter history by topic or subject..."
          className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-[#E2E0D8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#312E81] focus:border-transparent"
        />
      </div>

      {/* History List */}
      <div className="space-y-3">
        {filteredHistory.length === 0 ? (
          <div className="p-8 text-center bg-white border border-[#E2E0D8] rounded-md text-charcoal-500 text-xs">
            No quiz records found matching your filter.
          </div>
        ) : (
          <div className="border border-[#E2E0D8] rounded-md bg-white divide-y divide-[#EFECE6] overflow-hidden">
            {filteredHistory.map((item) => (
              <div 
                key={item.id}
                className="p-5 hover:bg-[#FAF9F5] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#F0EDE4] text-charcoal-800 border border-[#E5E2D8]">
                      {item.subject}
                    </span>
                    <span className="text-xs text-charcoal-400 font-mono">
                      {item.date}
                    </span>
                    <span className="text-charcoal-300">•</span>
                    <span className="text-xs text-charcoal-500 flex items-center gap-1">
                      <Clock size={12} />
                      {item.timeTaken}
                    </span>
                  </div>

                  <h3 className="font-serif text-base sm:text-lg font-medium text-charcoal-900">
                    {item.topicTitle}
                  </h3>

                  {item.feedback && (
                    <p className="text-xs text-charcoal-600 line-clamp-1 italic font-serif">
                      "{item.feedback}"
                    </p>
                  )}
                </div>

                {/* Score and actions */}
                <div className="flex items-center justify-between sm:justify-end gap-5">
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] uppercase tracking-wider text-charcoal-400 font-semibold">
                      Score
                    </div>
                    <div className="font-mono text-base font-semibold text-charcoal-900 mt-0.5">
                      {item.score} / {item.totalQuestions}{' '}
                      <span className="text-xs font-normal text-[#312E81]">({item.percentage}%)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onReviewTopic(item.topicId)}
                      className="px-2.5 py-1.5 rounded text-xs font-medium text-charcoal-700 hover:text-charcoal-900 bg-[#F4F2EC] hover:bg-[#EAE7DC] border border-[#E2DFD6] transition-colors"
                    >
                      Notes
                    </button>
                    <button
                      onClick={() => onRetakeTopic(item.topicId)}
                      className="px-2.5 py-1.5 rounded text-xs font-semibold text-[#312E81] hover:text-white bg-[#EEF2FF] hover:bg-[#312E81] border border-[#D5DCFB] transition-colors flex items-center gap-1"
                    >
                      <RotateCcw size={12} />
                      <span>Retake</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

