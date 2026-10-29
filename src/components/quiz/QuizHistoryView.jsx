import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  History, 
  RotateCcw, 
  BookOpen, 
  Clock, 
  Search 
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
      <header className="border-b border-[#E7E0D8] pb-6 space-y-1">
        <div className="text-xs font-mono uppercase tracking-wider text-[#C65D32] font-bold">
          Retention Records
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222222] tracking-tight">
          Quiz & Recall History
        </h1>
        <p className="text-sm text-[#706B66]">
          A temporal record of your active retrieval sessions and conceptual retention scores.
        </p>
      </header>

      {/* Aggregate Overview Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white border border-[#E7E0D8] rounded-2xl shadow-subtle space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#706B66]">
            Total Sessions
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#222222]">
            {totalSessions} Completed
          </div>
          <div className="text-xs text-[#706B66]">Across all enrolled domains</div>
        </div>

        <div className="p-5 bg-white border border-[#E7E0D8] rounded-2xl shadow-subtle space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#706B66]">
            Average Retention
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#222222]">
            {avgRetention}%
          </div>
          <div className="text-xs text-[#38765C] font-bold">
            {totalSessions > 0 ? (avgRetention >= 80 ? 'Target > 80% achieved' : 'Keep practicing!') : 'Complete a quiz to track'}
          </div>
        </div>

        <div className="p-5 bg-white border border-[#E7E0D8] rounded-2xl shadow-subtle space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#706B66]">
            Active Recall Protocol
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#222222]">
            Spaced 48h
          </div>
          <div className="text-xs text-[#706B66]">Next review scheduled tomorrow</div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#706B66]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter history by topic or subject..."
          className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-[#E7E0D8] rounded-xl text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#C65D32] focus:border-transparent shadow-xs"
        />
      </div>

      {/* History List */}
      <div className="space-y-3">
        {filteredHistory.length === 0 ? (
          <div className="p-10 text-center bg-white border border-[#E7E0D8] rounded-2xl text-[#706B66] text-xs shadow-subtle">
            No quiz records found matching your filter.
          </div>
        ) : (
          <div className="border border-[#E7E0D8] rounded-2xl bg-white divide-y divide-[#E7E0D8] overflow-hidden shadow-card">
            {filteredHistory.map((item) => (
              <div 
                key={item.id}
                className="p-5 hover:bg-[#FAF8F5] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#FBF4EE] text-[#C65D32] border border-[#ECD0C0]">
                      {item.subject}
                    </span>
                    <span className="text-xs text-[#706B66] font-mono">
                      {item.date}
                    </span>
                    <span className="text-[#E7E0D8]">•</span>
                    <span className="text-xs text-[#706B66] flex items-center gap-1 font-medium">
                      <Clock size={12} />
                      {item.timeTaken}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#222222]">
                    {item.topicTitle}
                  </h3>

                  {item.feedback && (
                    <p className="text-xs text-[#706B66] line-clamp-1 italic">
                      "{item.feedback}"
                    </p>
                  )}
                </div>

                {/* Score and actions */}
                <div className="flex items-center justify-between sm:justify-end gap-5">
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] uppercase tracking-wider text-[#706B66] font-bold">
                      Score
                    </div>
                    <div className="font-mono text-base font-extrabold text-[#222222] mt-0.5">
                      {item.score} / {item.totalQuestions}{' '}
                      <span className="text-xs font-bold text-[#C65D32]">({item.percentage}%)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (onReviewTopic) onReviewTopic(item.topicId);
                        navigate(`/study/${item.topicId}`);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#252525] hover:text-[#222222] bg-[#F7F3ED] hover:bg-[#EFE9DF] border border-[#E7E0D8] transition-colors"
                    >
                      Notes
                    </button>
                    <button
                      onClick={() => {
                        if (onRetakeTopic) onRetakeTopic(item.topicId);
                        navigate(`/quiz/${item.topicId}`);
                      }}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#C65D32] hover:bg-[#B64E24] transition-colors flex items-center gap-1 shadow-xs"
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
