import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowRight, 
  BookOpen, 
  Clock, 
  Star, 
  Trash2, 
  Plus, 
  SlidersHorizontal,
  Layers,
  ArrowUpDown
} from 'lucide-react';

export default function LibraryView({ 
  topics, 
  onSelectTopic, 
  onStartQuiz, 
  onToggleStar, 
  onDeleteTopic, 
  onCreateNew 
}) {
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
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E6DE] pb-6">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-charcoal-400">
            Study Repository
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-900 font-normal tracking-tight mt-1">
            My Library
          </h1>
          <p className="text-sm text-charcoal-600 mt-1">
            {topics.length} synthesized study topics with active recall decks.
          </p>
        </div>

        <button
          onClick={onCreateNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#312E81] hover:bg-[#282566] text-white text-xs font-semibold tracking-wide transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>New Study Notes</span>
        </button>
      </header>

      {/* Search and Filters Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic title, concept, or keyword tag..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-[#E2E0D8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#312E81] focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-charcoal-400 hover:text-charcoal-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <div className="relative flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs bg-white border border-[#E2E0D8] rounded-md px-3 py-2 text-charcoal-700 focus:outline-none focus:ring-2 focus:ring-[#312E81]"
              >
                <option value="recent">Sort: Most Recent</option>
                <option value="mastery">Sort: Retention Score</option>
                <option value="alpha">Sort: Alphabetical (A-Z)</option>
              </select>
            </div>

            {/* Starred filter button */}
            <button
              onClick={() => setOnlyStarred(!onlyStarred)}
              className={`px-3 py-2 rounded-md text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                onlyStarred
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-white text-charcoal-600 border-[#E2E0D8] hover:bg-[#FAF9F5]'
              }`}
            >
              <Star size={13} className={onlyStarred ? 'fill-amber-500 text-amber-500' : ''} />
              <span>Starred</span>
            </button>
          </div>
        </div>

        {/* Subject Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {subjects.map((subj) => {
            const isSelected = selectedSubject === subj;
            return (
              <button
                key={subj}
                onClick={() => setSelectedSubject(subj)}
                className={`text-xs px-3 py-1 rounded-full whitespace-nowrap transition-colors font-medium ${
                  isSelected
                    ? 'bg-[#312E81] text-white shadow-xs'
                    : 'bg-[#F2EFE8] text-charcoal-700 hover:bg-[#EAE7DC] border border-[#E0DDCF]'
                }`}
              >
                {subj}
              </button>
            );
          })}
        </div>
      </div>

      {/* Topics List (Editorial style with thin borders and clean typography) */}
      <div className="space-y-3">
        {filteredTopics.length === 0 ? (
          <div className="p-12 text-center border border-[#E2E0D8] rounded-md bg-white space-y-3">
            <BookOpen size={28} className="mx-auto text-charcoal-300" />
            <h3 className="font-serif text-lg text-charcoal-800">No matching study materials found</h3>
            <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
              Try adjusting your search query or reset domain filters to view your notes.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedSubject('All'); setOnlyStarred(false); }}
              className="text-xs text-[#312E81] hover:underline font-semibold"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="border border-[#E2E0D8] rounded-md bg-white divide-y divide-[#EFECE6] overflow-hidden">
            {filteredTopics.map((topic) => (
              <div 
                key={topic.id}
                className="p-5 hover:bg-[#FAF9F5] transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4 group"
              >
                {/* Topic Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#F0EDE4] text-charcoal-800 border border-[#E5E2D8]">
                      {topic.subject}
                    </span>
                    <span className="text-xs text-charcoal-400 font-mono">
                      {topic.readTime}
                    </span>
                    <span className="text-charcoal-300">•</span>
                    <span className="text-xs text-charcoal-500">
                      {topic.quiz?.length || 4} recall questions
                    </span>
                    <span className="text-charcoal-300">•</span>
                    <span className="text-xs text-charcoal-400">
                      Added {topic.createdAt}
                    </span>
                  </div>

                  <h3 
                    onClick={() => onSelectTopic(topic)}
                    className="font-serif text-lg sm:text-xl font-medium text-charcoal-900 group-hover:text-[#312E81] transition-colors cursor-pointer"
                  >
                    {topic.title}
                  </h3>

                  <p className="text-xs text-charcoal-600 leading-relaxed line-clamp-2 max-w-2xl">
                    {topic.summary}
                  </p>

                  {/* Tags */}
                  {topic.tags && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {topic.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-[10px] text-charcoal-500 bg-[#FAF9F5] px-1.5 py-0.5 rounded border border-[#EBE8DC]">
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
                      className={`p-1.5 rounded transition-colors ${
                        topic.isStarred 
                          ? 'text-amber-500 hover:text-amber-600' 
                          : 'text-charcoal-300 hover:text-charcoal-600'
                      }`}
                      title="Star topic"
                    >
                      <Star size={15} className={topic.isStarred ? 'fill-amber-500' : ''} />
                    </button>

                    <button
                      onClick={() => onDeleteTopic(topic.id)}
                      className="p-1.5 rounded text-charcoal-300 hover:text-rose-600 transition-colors"
                      title="Remove from library"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {/* Mastery Score Progress */}
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] uppercase tracking-wider text-charcoal-400 font-semibold">
                      Mastery Score
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="w-16 bg-[#E5E3DB] h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-[#312E81] h-full rounded-full" 
                          style={{ width: `${topic.masteryScore}%` }}
                        ></div>
                      </div>
                      <span className="font-mono text-xs text-charcoal-800 font-semibold">
                        {topic.masteryScore}%
                      </span>
                    </div>
                  </div>

                  {/* Primary Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => onSelectTopic(topic)}
                      className="px-3 py-1.5 rounded text-xs font-medium text-charcoal-700 hover:text-charcoal-900 bg-[#F4F2EC] hover:bg-[#EAE7DC] border border-[#E2DFD6] transition-colors"
                    >
                      Read Notes
                    </button>
                    <button
                      onClick={() => onStartQuiz(topic)}
                      className="px-3 py-1.5 rounded text-xs font-medium text-[#312E81] hover:text-white bg-[#EEF2FF] hover:bg-[#312E81] border border-[#D5DCFB] transition-colors flex items-center gap-1"
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
