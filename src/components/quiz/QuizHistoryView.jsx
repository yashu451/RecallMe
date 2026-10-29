import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  History, 
  RotateCcw, 
  BookOpen, 
  Clock, 
  Award, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Search,
  Flame
} from 'lucide-react';

export default function QuizHistoryView({ 
  quizHistory, 
  onRetakeTopic, 
  onReviewTopic 
}) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filteredHistory = quizHistory.filter(h => 
    h.topicTitle.toLowerCase().includes(search.toLowerCase()) ||
    h.subject.toLowerCase().includes(search.toLowerCase())
  );

  const totalSessions = quizHistory.length;
  const avgRetention = totalSessions > 0
    ? Math.round(quizHistory.reduce((acc, h) => acc + h.percentage, 0) / totalSessions)
    : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <header className="border-b border-slate-200/80 pb-6 space-y-1">
        <div className="text-xs font-mono uppercase tracking-wider text-indigo-600 font-bold">
          Retention Records
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Quiz & Recall History
        </h1>
        <p className="text-sm text-slate-600">
          A temporal record of your active retrieval sessions and conceptual retention scores.
        </p>
      </header>

      {/* Aggregate Overview Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-subtle space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Sessions
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {totalSessions} Completed
          </div>
          <div className="text-xs text-slate-500">Across all enrolled domains</div>
        </div>

        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-subtle space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Average Retention
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {avgRetention}%
          </div>
          <div className="text-xs text-emerald-600 font-semibold">Target &gt; 80% achieved</div>
        </div>

        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-subtle space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Active Recall Protocol
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Spaced 48h
          </div>
          <div className="text-xs text-slate-500">Next review scheduled tomorrow</div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter history by topic or subject..."
          className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent shadow-xs"
        />
      </div>

      {/* History List */}
      <div className="space-y-3">
        {filteredHistory.length === 0 ? (
          <div className="p-10 text-center bg-white border border-slate-200 rounded-2xl text-slate-500 text-xs shadow-subtle">
            No quiz records found matching your filter.
          </div>
        ) : (
          <div className="border border-slate-200/80 rounded-2xl bg-white divide-y divide-slate-100 overflow-hidden shadow-card">
            {filteredHistory.map((item) => (
              <div 
                key={item.id}
                className="p-5 hover:bg-slate-50/70 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {item.subject}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {item.date}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                      <Clock size={12} />
                      {item.timeTaken}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    {item.topicTitle}
                  </h3>

                  {item.feedback && (
                    <p className="text-xs text-slate-500 line-clamp-1 italic">
                      "{item.feedback}"
                    </p>
                  )}
                </div>

                {/* Score and actions */}
                <div className="flex items-center justify-between sm:justify-end gap-5">
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                      Score
                    </div>
                    <div className="font-mono text-base font-extrabold text-slate-900 mt-0.5">
                      {item.score} / {item.totalQuestions}{' '}
                      <span className="text-xs font-semibold text-indigo-600">({item.percentage}%)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (onReviewTopic) onReviewTopic(item.topicId);
                        navigate(`/study/${item.topicId}`);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      Notes
                    </button>
                    <button
                      onClick={() => {
                        if (onRetakeTopic) onRetakeTopic(item.topicId);
                        navigate(`/quiz/${item.topicId}`);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all flex items-center gap-1 shadow-xs hover:shadow-indigo-500/20"
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
