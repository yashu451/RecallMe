import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  BookOpen, 
  Layers, 
  Sliders, 
  HelpCircle, 
  ArrowRight, 
  Flame, 
  CheckCircle2, 
  Clock, 
  FileText,
  ChevronRight,
  BrainCircuit,
  GraduationCap
} from 'lucide-react';
import { DOMAINS } from '../data/mockQuizData';
import '../styles/quiz.css';

/**
 * QuizHubPage Component
 * Practice Quiz Hub landing page where users select:
 * - Domain (DSA, Web Dev, DBMS, OS, Networks, AI/ML, etc.)
 * - Topic (dynamically populated based on chosen Domain)
 * - Difficulty (Easy, Medium, Hard)
 * - Question Count (5, 10, 15)
 * - Or select "Quiz My Notes" to test their saved study decks!
 */
export default function QuizHubPage({ savedNotes = [] }) {
  const navigate = useNavigate();

  // Active Hub Mode: 'domain' (by subject) or 'notes' (from user saved decks)
  const [hubTab, setHubTab] = useState('domain');

  // Configuration state
  const [selectedDomainName, setSelectedDomainName] = useState(DOMAINS[0].name);
  const [selectedTopic, setSelectedTopic] = useState(DOMAINS[0].topics[0]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');
  const [selectedCount, setSelectedCount] = useState(5);

  // Available topics for currently selected domain
  const currentDomainObj = DOMAINS.find(d => d.name === selectedDomainName) || DOMAINS[0];
  const availableTopics = currentDomainObj ? currentDomainObj.topics : [];

  // Update topic whenever domain changes
  const handleDomainChange = (newDomainName) => {
    setSelectedDomainName(newDomainName);
    const domainObj = DOMAINS.find(d => d.name === newDomainName);
    if (domainObj && domainObj.topics.length > 0) {
      setSelectedTopic(domainObj.topics[0]);
    } else {
      setSelectedTopic('');
    }
  };

  // Launch quiz session
  const handleStartQuiz = () => {
    if (!selectedDomainName || !selectedTopic) return;

    navigate('/quiz/play', {
      state: {
        domain: selectedDomainName,
        topic: selectedTopic,
        difficulty: selectedDifficulty,
        count: selectedCount
      }
    });
  };

  // Launch quiz for a specific saved note
  const handleStartNoteQuiz = (noteId) => {
    navigate(`/quiz/${noteId}`);
  };

  const isFormValid = Boolean(selectedDomainName && selectedTopic);

  // Difficulty colors
  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case 'Easy':
        return 'bg-[#EDF5F1] text-[#38765C] border-[#C0DCD0]';
      case 'Hard':
        return 'bg-[#FDF1F1] text-[#B93838] border-[#F2C6C6]';
      default:
        return 'bg-[#FAF5EF] text-[#7A3216] border-[#E8B786]';
    }
  };

  return (
    <div className="quiz-container">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-200">
        
        {/* Hub Header Banner */}
        <div className="bg-white border border-[#E7E0D8] rounded-2xl p-6 sm:p-8 shadow-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E0D8] pb-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#C65D32] bg-[#FBF4EE] border border-[#ECD0C0]">
                <Sparkles size={13} />
                <span>Active Recall Arena</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#222222] tracking-tight">
                Practice Quiz
              </h1>
              <p className="text-sm sm:text-base text-[#706B66] max-w-xl leading-relaxed">
                Choose a topic, test your knowledge, and improve your memory through scientifically backed retrieval practice.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3 self-start sm:self-center">
              <div className="p-3.5 bg-[#FAF8F5] border border-[#E7E0D8] rounded-2xl text-center min-w-[100px] shadow-2xs">
                <div className="text-[10px] font-mono uppercase font-bold text-[#706B66]">Domains</div>
                <div className="text-xl font-extrabold text-[#222222] mt-0.5">{DOMAINS.length}</div>
              </div>
              <div className="p-3.5 bg-[#FAF8F5] border border-[#E7E0D8] rounded-2xl text-center min-w-[100px] shadow-2xs">
                <div className="text-[10px] font-mono uppercase font-bold text-[#706B66]">Topics</div>
                <div className="text-xl font-extrabold text-[#C65D32] mt-0.5">35+</div>
              </div>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setHubTab('domain')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                hubTab === 'domain'
                  ? 'bg-[#C65D32] text-white shadow-xs'
                  : 'bg-[#FAF8F5] hover:bg-[#FBF4EE] text-[#706B66] hover:text-[#222222] border border-[#E7E0D8]'
              }`}
            >
              <Layers size={14} />
              <span>Explore by Domain & Topic</span>
            </button>

            {savedNotes.length > 0 && (
              <button
                type="button"
                onClick={() => setHubTab('notes')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  hubTab === 'notes'
                    ? 'bg-[#C65D32] text-white shadow-xs'
                    : 'bg-[#FAF8F5] hover:bg-[#FBF4EE] text-[#706B66] hover:text-[#222222] border border-[#E7E0D8]'
                }`}
              >
                <BookOpen size={14} />
                <span>Quiz My Saved Notes ({savedNotes.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: Explore by Domain & Topic */}
        {hubTab === 'domain' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Form Controls Card */}
            <div className="lg:col-span-7 bg-white border border-[#E7E0D8] rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
              
              <div className="border-b border-[#E7E0D8] pb-3">
                <h2 className="text-base font-extrabold text-[#222222] flex items-center gap-2">
                  <Sliders size={16} className="text-[#C65D32]" />
                  <span>Configure Your Practice Session</span>
                </h2>
                <p className="text-xs text-[#706B66] mt-0.5">
                  Customize the question pool to target your learning goals.
                </p>
              </div>

              {/* 1. Domain Selector */}
              <div className="space-y-2">
                <label 
                  htmlFor="domain-select" 
                  className="block text-xs font-bold uppercase tracking-wider text-[#222222]"
                >
                  1. Domain
                </label>
                <select
                  id="domain-select"
                  value={selectedDomainName}
                  onChange={(e) => handleDomainChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E7E0D8] bg-[#FAF8F5] text-sm font-semibold text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#C65D32] focus:bg-white transition-colors"
                >
                  {DOMAINS.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Topic Selector (Dynamically updates when domain changes) */}
              <div className="space-y-2">
                <label 
                  htmlFor="topic-select" 
                  className="block text-xs font-bold uppercase tracking-wider text-[#222222]"
                >
                  2. Topic
                </label>
                <select
                  id="topic-select"
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  disabled={availableTopics.length === 0}
                  className="w-full px-4 py-3 rounded-xl border border-[#E7E0D8] bg-[#FAF8F5] text-sm font-semibold text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#C65D32] focus:bg-white transition-colors disabled:opacity-50"
                >
                  {availableTopics.map((top) => (
                    <option key={top} value={top}>
                      {top}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-[#706B66]">
                  Available topics for {selectedDomainName}.
                </p>
              </div>

              {/* 3. Difficulty Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#222222]">
                  3. Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {['Easy', 'Medium', 'Hard'].map((diff) => {
                    const isSelected = selectedDifficulty === diff;
                    return (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => setSelectedDifficulty(diff)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                          isSelected
                            ? 'bg-[#C65D32] text-white border-[#C65D32] shadow-xs'
                            : 'bg-white hover:bg-[#FAF8F5] text-[#706B66] border-[#E7E0D8]'
                        }`}
                      >
                        {diff}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Question Count Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#222222]">
                  4. Number of Questions
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[5, 10, 15].map((count) => {
                    const isSelected = selectedCount === count;
                    return (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setSelectedCount(count)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                          isSelected
                            ? 'bg-[#C65D32] text-white border-[#C65D32] shadow-xs'
                            : 'bg-white hover:bg-[#FAF8F5] text-[#706B66] border-[#E7E0D8]'
                        }`}
                      >
                        {count} Questions
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleStartQuiz}
                  disabled={!isFormValid}
                  className="w-full py-3.5 rounded-xl bg-[#C65D32] hover:bg-[#B64E24] text-white font-bold text-sm tracking-wide transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span>Start Quiz Session</span>
                  <ArrowRight size={16} />
                </button>
              </div>

            </div>

            {/* Right Column: Preview & Session Details Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white border border-[#E7E0D8] rounded-2xl p-6 shadow-card space-y-5">
                <div className="border-b border-[#E7E0D8] pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#706B66]">
                    Session Preview
                  </h3>
                  <div className="text-lg font-extrabold text-[#222222] mt-1">
                    {selectedTopic || 'Selected Topic'}
                  </div>
                  <div className="text-xs text-[#C65D32] font-semibold mt-0.5">
                    {selectedDomainName}
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 bg-[#FAF8F5] border border-[#E7E0D8] rounded-xl">
                    <span className="text-[#706B66] font-medium flex items-center gap-1.5">
                      <GraduationCap size={14} className="text-[#C65D32]" />
                      <span>Target Difficulty</span>
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold border ${getDifficultyBadge(selectedDifficulty)}`}>
                      {selectedDifficulty}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[#FAF8F5] border border-[#E7E0D8] rounded-xl">
                    <span className="text-[#706B66] font-medium flex items-center gap-1.5">
                      <HelpCircle size={14} className="text-[#C65D32]" />
                      <span>Questions</span>
                    </span>
                    <span className="font-bold text-[#222222]">
                      {selectedCount} multiple-choice
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[#FAF8F5] border border-[#E7E0D8] rounded-xl">
                    <span className="text-[#706B66] font-medium flex items-center gap-1.5">
                      <Clock size={14} className="text-[#C65D32]" />
                      <span>Estimated Duration</span>
                    </span>
                    <span className="font-bold text-[#222222]">
                      ~{selectedCount * 1} minutes
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-[#FBF4EE] border border-[#ECD0C0] rounded-xl text-xs text-[#983E1A] space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <BrainCircuit size={13} />
                    <span>Active Retrieval Invariant:</span>
                  </div>
                  <p className="text-[#7A3216] leading-relaxed">
                    Testing forces your brain to reconstruct memory traces, producing 2-3x higher retention than passive rereading.
                  </p>
                </div>
              </div>

              {/* Quick Topic Ideas */}
              <div className="bg-[#FAF8F5] border border-[#E7E0D8] rounded-2xl p-5 space-y-3">
                <div className="text-xs font-bold text-[#222222]">
                  Popular Topic Shortcuts
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { domain: 'Data Structures & Algorithms', topic: 'Stacks' },
                    { domain: 'Database Management Systems', topic: 'SQL' },
                    { domain: 'Web Development', topic: 'React' },
                    { domain: 'Operating Systems', topic: 'Scheduling' },
                    { domain: 'Computer Networks', topic: 'TCP/IP' },
                    { domain: 'Artificial Intelligence & Machine Learning', topic: 'Neural Networks' },
                  ].map((item) => (
                    <button
                      key={item.topic}
                      type="button"
                      onClick={() => {
                        setSelectedDomainName(item.domain);
                        setSelectedTopic(item.topic);
                      }}
                      className="px-2.5 py-1 text-xs bg-white hover:bg-[#FBF4EE] hover:text-[#C65D32] hover:border-[#ECD0C0] border border-[#E7E0D8] text-[#706B66] rounded-lg transition-colors"
                    >
                      {item.topic}
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: Quiz My Saved Notes */}
        {hubTab === 'notes' && (
          <div className="bg-white border border-[#E7E0D8] rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
            <div className="border-b border-[#E7E0D8] pb-4">
              <h2 className="text-lg font-extrabold text-[#222222]">
                Generate Quiz from Saved Notes
              </h2>
              <p className="text-xs text-[#706B66] mt-0.5">
                Select any study deck from your library to practice questions directly synthesized from your content.
              </p>
            </div>

            {savedNotes.length === 0 ? (
              <div className="text-center py-12 text-[#706B66] space-y-3">
                <FileText size={32} className="mx-auto text-[#C65D32]" />
                <p className="text-sm">No saved notes found yet in your library.</p>
                <button
                  onClick={() => navigate('/create')}
                  className="px-4 py-2 bg-[#C65D32] hover:bg-[#B64E24] text-white text-xs font-bold rounded-xl"
                >
                  Create Notes Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-5 rounded-2xl border border-[#E7E0D8] bg-[#FAF8F5] hover:bg-white transition-all space-y-3 flex flex-col justify-between shadow-2xs hover:shadow-card"
                  >
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FBF4EE] text-[#C65D32] border border-[#ECD0C0]">
                        {note.subject || 'Study Deck'}
                      </span>
                      <h3 className="font-bold text-sm text-[#222222] line-clamp-2">
                        {note.title}
                      </h3>
                      <p className="text-xs text-[#706B66] line-clamp-2">
                        {note.summary || 'Custom study material deck.'}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#E7E0D8] flex items-center justify-between text-xs">
                      <span className="font-mono text-[#706B66]">
                        {note.quiz?.length || 4} Questions
                      </span>
                      <button
                        type="button"
                        onClick={() => handleStartNoteQuiz(note.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#C65D32] hover:bg-[#B64E24] text-white font-bold text-xs flex items-center gap-1 shadow-2xs transition-colors"
                      >
                        <span>Start Quiz</span>
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

