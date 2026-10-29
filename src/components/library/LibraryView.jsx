import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  ArrowRight, 
  BookOpen, 
  Clock, 
  Star, 
  Trash2, 
  Plus, 
  Layers
} from 'lucide-react';

export default function LibraryView({ 
  topics, 
  onSelectTopic, 
  onStartQuiz, 
  onToggleStar, 
  onDeleteTopic 
}) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [onlyStarred, setOnlyStarred] = useState(false);
  const [sortBy, setSortBy] = useState('recent'); // 'recent' | 'mastery' | 'alpha'

  // Extract unique subjects
  const subjects = useMemo(() => {
    const list = new Set(topics.map(t => t.subject));
    return ['All', ...Array.from(list)];
  }, [topics]);

  // Filter & sort
  const filteredTopics = useMemo(() => {
    return topics
      .filter(topic => {
        const matchesSearch = 
          topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          topic.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (topic.tags && topic.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

        const matchesSubject = selectedSubject === 'All' || topic.subject === selectedSubject;
        const matchesStarred = !onlyStarred || topic.isStarred;

        return matchesSearch && matchesSubject && matchesStarred;
      })
      .sort((a, b) => {
        if (sortBy === 'recent') {
          return (b.createdAt || '').localeCompare(a.createdAt || '');
        } else if (sortBy === 'mastery') {
          return (b.masteryScore || 0) - (a.masteryScore || 0);
        } else if (sortBy === 'alpha') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [topics, searchQuery, selectedSubject, onlyStarred, sortBy]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-indigo-600 font-bold">
            Study Repository
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            My Study Library
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {topics.length} synthesized study topics with active recall decks.
          </p>
        </div>

        <button
          onClick={() => navigate('/create')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold tracking-wide transition-all shadow-md shadow-indigo-600/20 self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>New Study Notes</span>
        </button>
      </header>

      {/* Search and Filters Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic title, concept, or keyword tag..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-xs font-medium"
            >
              <option value="recent">Sort: Most Recent</option>
              <option value="mastery">Sort: Retention Score</option>
              <option value="alpha">Sort: Alphabetical (A-Z)</option>
            </select>

            {/* Starred filter button */}
            <button
              onClick={() => setOnlyStarred(!onlyStarred)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all shadow-xs ${
                onlyStarred
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Star size={14} className={onlyStarred ? 'fill-amber-500 text-amber-500' : ''} />
              <span>Starred</span>
            </button>
          </div>
        </div>

        {/* Subject Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {subjects.map((subj) => {
            const isSelected = selectedSubject === subj;
            return (
              <button
                key={subj}
                onClick={() => setSelectedSubject(subj)}
                className={`text-xs px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all font-semibold ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/60'
                }`}
              >
                {subj}
              </button>
            );
          })}
        </div>
      </div>

      {/* Topics List */}
      <div className="space-y-3">
        {filteredTopics.length === 0 ? (
          <div className="p-12 text-center border border-slate-200 rounded-2xl bg-white space-y-3 shadow-subtle">
            <BookOpen size={32} className="mx-auto text-slate-300" />
            <h3 className="text-base font-bold text-slate-800">No matching study materials found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search query or reset domain filters to view your notes.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedSubject('All'); setOnlyStarred(false); }}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-bold"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="border border-slate-200/80 rounded-2xl bg-white divide-y divide-slate-100 overflow-hidden shadow-card">
            {filteredTopics.map((topic) => (
              <div 
                key={topic.id}
                className="p-5 hover:bg-slate-50/70 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4 group"
              >
                {/* Topic Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {topic.subject}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {topic.readTime}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500 font-medium">
                      {topic.quiz?.length || 4} recall questions
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-400">
                      Added {topic.createdAt}
                    </span>
                  </div>

                  <h3 
                    onClick={() => {
                      onSelectTopic(topic);
                      navigate(`/study/${topic.id}`);
                    }}
                    className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    {topic.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 max-w-2xl">
                    {topic.summary}
                  </p>

                  {/* Tags */}
                  {topic.tags && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {topic.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Column: Mastery & Actions */}
                <div className="flex flex-col sm:items-end justify-between gap-3 shrink-0 pt-2 sm:pt-0">
                  {/* Top: Star and Delete */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleStar(topic.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        topic.isStarred 
                          ? 'text-amber-500 hover:text-amber-600' 
                          : 'text-slate-300 hover:text-slate-600'
                      }`}
                      title="Star topic"
                    >
                      <Star size={16} className={topic.isStarred ? 'fill-amber-500' : ''} />
                    </button>

                    <button
                      onClick={() => onDeleteTopic(topic.id)}
                      className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 transition-colors"
                      title="Remove from library"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Mastery Score Progress */}
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                      Mastery Score
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

                  {/* Primary Buttons */}
                  <div className="flex items-center gap-2 pt-1">
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
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all flex items-center gap-1 shadow-xs hover:shadow-indigo-500/20"
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
      </div>

    </div>
  );
}
