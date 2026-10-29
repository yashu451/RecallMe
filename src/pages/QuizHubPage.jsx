import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  BookOpen, 
  Sliders, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  FileText,
  BrainCircuit,
  GraduationCap,
  Search,
  CheckSquare,
  Square,
  PlusCircle,
  AlertCircle
} from 'lucide-react';
import { fetchTopics } from '../services/api';
import '../styles/quiz.css';

/**
 * QuizHubPage Component
 * Practice Quiz Setup grounded exclusively in the user's saved study materials.
 * 
 * Users:
 * 1. Select one or multiple saved notes from their study library.
 * 2. Select difficulty (Easy, Medium, Hard).
 * 3. Select question count (5, 10, 15).
 * 4. Review session preview (titles, duration, difficulty, count).
 * 5. Launch custom recall practice session generated strictly from their notes.
 */
export default function QuizHubPage({ savedNotes = [] }) {
  const navigate = useNavigate();

  // Internal notes state in case props are loading or empty
  const [localNotes, setLocalNotes] = useState(savedNotes);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Selected note IDs (Set-based multi-select)
  const [selectedNoteIds, setSelectedNoteIds] = useState(() => {
    if (savedNotes.length > 0) {
      return [savedNotes[0].id];
    }
    return [];
  });

  // Quiz Configuration
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');
  const [selectedCount, setSelectedCount] = useState(5);

  // Sync with prop updates and fetch from backend if empty
  useEffect(() => {
    if (savedNotes && savedNotes.length > 0) {
      setLocalNotes(savedNotes);
      setSelectedNoteIds(prev => (prev.length > 0 ? prev : [savedNotes[0].id]));
    } else {
      setLoadingNotes(true);
      fetchTopics()
        .then((fetched) => {
          if (fetched && fetched.length > 0) {
            setLocalNotes(fetched);
            setSelectedNoteIds([fetched[0].id]);
          }
        })
        .finally(() => setLoadingNotes(false));
    }
  }, [savedNotes]);

  // Filter notes by title or subject or tags
  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return localNotes;
    const q = searchQuery.toLowerCase();
    return localNotes.filter(n => 
      (n.title && n.title.toLowerCase().includes(q)) ||
      (n.subject && n.subject.toLowerCase().includes(q)) ||
      (n.summary && n.summary.toLowerCase().includes(q))
    );
  }, [localNotes, searchQuery]);

  // Toggle selection for a note
  const toggleNoteSelection = (noteId) => {
    setSelectedNoteIds(prev => {
      if (prev.includes(noteId)) {
        return prev.filter(id => id !== noteId);
      } else {
        return [...prev, noteId];
      }
    });
  };

  // Select all filtered notes
  const handleSelectAll = () => {
    const allFilteredIds = filteredNotes.map(n => n.id);
    setSelectedNoteIds(Array.from(new Set([...selectedNoteIds, ...allFilteredIds])));
  };

  // Deselect all notes
  const handleClearAll = () => {
    setSelectedNoteIds([]);
  };

  // Resolved selected note objects
  const selectedNotesList = useMemo(() => {
    return localNotes.filter(n => selectedNoteIds.includes(n.id));
  }, [localNotes, selectedNoteIds]);

  // Launch quiz session
  const handleStartQuiz = () => {
    if (selectedNoteIds.length === 0) return;

    navigate('/quiz/play', {
      state: {
        noteIds: selectedNoteIds,
        notes: selectedNotesList,
        difficulty: selectedDifficulty,
        count: selectedCount
      }
    });
  };

  // Difficulty badge styling
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

  const isConfigValid = selectedNoteIds.length > 0;

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
                Test your knowledge and strengthen long-term memory with practice questions generated directly from your saved study notes.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3 self-start sm:self-center">
              <div className="p-3.5 bg-[#FAF8F5] border border-[#E7E0D8] rounded-2xl text-center min-w-[110px] shadow-2xs">
                <div className="text-[10px] font-mono uppercase font-bold text-[#706B66]">Saved Notes</div>
                <div className="text-xl font-extrabold text-[#222222] mt-0.5">{localNotes.length}</div>
              </div>
              <div className="p-3.5 bg-[#FAF8F5] border border-[#E7E0D8] rounded-2xl text-center min-w-[110px] shadow-2xs">
                <div className="text-[10px] font-mono uppercase font-bold text-[#706B66]">Selected</div>
                <div className="text-xl font-extrabold text-[#C65D32] mt-0.5">{selectedNoteIds.length}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#706B66] font-medium pt-1">
            <BrainCircuit size={15} className="text-[#C65D32] shrink-0" />
            <span>Questions are strictly grounded in your selected notes' concepts, terms, definitions, and takeaways.</span>
          </div>
        </div>

        {/* Empty State: If user has no saved notes */}
        {!loadingNotes && localNotes.length === 0 && (
          <div className="bg-white border border-[#E7E0D8] rounded-2xl p-12 text-center space-y-4 shadow-card">
            <div className="w-14 h-14 rounded-full bg-[#FAF5EF] text-[#C65D32] border border-[#E8B786] flex items-center justify-center mx-auto">
              <FileText size={28} />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h2 className="text-xl font-extrabold text-[#222222]">
                No Saved Study Notes Found
              </h2>
              <p className="text-xs sm:text-sm text-[#706B66] leading-relaxed">
                RecallMe generates practice quizzes strictly from your saved study materials. Create your first study note to begin active recall practice.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigate('/create')}
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#C65D32] hover:bg-[#B64E24] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                <PlusCircle size={15} />
                <span>Create Study Material</span>
              </button>
            </div>
          </div>
        )}

        {/* Active Hub: Configuration & Note Selector */}
        {(localNotes.length > 0 || loadingNotes) && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Note Selection & Options */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Note Selection Card */}
              <div className="bg-white border border-[#E7E0D8] rounded-2xl p-6 sm:p-7 shadow-card space-y-5">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7E0D8] pb-4">
                  <div>
                    <h2 className="text-base font-extrabold text-[#222222] flex items-center gap-2">
                      <BookOpen size={17} className="text-[#C65D32]" />
                      <span>1. Select Study Notes to Test</span>
                    </h2>
                    <p className="text-xs text-[#706B66] mt-0.5">
                      Select one or multiple notes to test. Questions will be drawn from all selected notes.
                    </p>
                  </div>

                  {/* Multi-select shortcuts */}
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="text-xs font-bold text-[#C65D32] hover:text-[#983E1A] px-2.5 py-1 rounded-lg bg-[#FBF4EE] border border-[#ECD0C0] transition-colors"
                    >
                      Select All
                    </button>
                    {selectedNoteIds.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearAll}
                        className="text-xs font-semibold text-[#706B66] hover:text-[#222222] px-2.5 py-1 rounded-lg border border-[#E7E0D8] transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Filter input */}
                {localNotes.length > 3 && (
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#706B66]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter saved notes by title or subject..."
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-[#E7E0D8] bg-[#FAF8F5] text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#C65D32] focus:bg-white transition-colors"
                    />
                  </div>
                )}

                {/* Notes list / cards */}
                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {filteredNotes.length === 0 ? (
                    <div className="p-6 text-center text-xs text-[#706B66] bg-[#FAF8F5] rounded-xl border border-[#E7E0D8]">
                      No notes matching "{searchQuery}".
                    </div>
                  ) : (
                    filteredNotes.map((note) => {
                      const isSelected = selectedNoteIds.includes(note.id);
                      return (
                        <div
                          key={note.id}
                          onClick={() => toggleNoteSelection(note.id)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                            isSelected
                              ? 'bg-[#FBF4EE] border-[#C65D32] shadow-xs'
                              : 'bg-[#FAF8F5] hover:bg-white border-[#E7E0D8]'
                          }`}
                        >
                          {/* Checkbox Icon */}
                          <div className="pt-0.5 shrink-0">
                            {isSelected ? (
                              <CheckSquare size={18} className="text-[#C65D32]" />
                            ) : (
                              <Square size={18} className="text-[#706B66]" />
                            )}
                          </div>

                          {/* Note Information */}
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-[#C65D32] border border-[#ECD0C0]">
                                {note.subject || 'General'}
                              </span>
                              {note.readTime && (
                                <span className="text-[10px] font-mono text-[#706B66]">
                                  {note.readTime}
                                </span>
                              )}
                              {note.masteryScore !== undefined && (
                                <span className="text-[10px] font-mono text-[#706B66] ml-auto">
                                  Mastery: {note.masteryScore}%
                                </span>
                              )}
                            </div>

                            <h3 className="font-bold text-sm text-[#222222] truncate">
                              {note.title}
                            </h3>

                            <p className="text-xs text-[#706B66] line-clamp-2 leading-relaxed">
                              {note.summary || (note.sections?.[0]?.content ? note.sections[0].content.slice(0, 110) + '...' : 'Saved study material.')}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {selectedNoteIds.length === 0 && (
                  <div className="flex items-center gap-2 p-3 bg-[#FDF1F1] border border-[#F2C6C6] rounded-xl text-xs text-[#B93838]">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>Please select at least one study note above to continue.</span>
                  </div>
                )}

              </div>

              {/* Quiz Configuration Controls */}
              <div className="bg-white border border-[#E7E0D8] rounded-2xl p-6 sm:p-7 shadow-card space-y-6">
                
                <div className="border-b border-[#E7E0D8] pb-3">
                  <h2 className="text-base font-extrabold text-[#222222] flex items-center gap-2">
                    <Sliders size={16} className="text-[#C65D32]" />
                    <span>2. Configure Quiz Settings</span>
                  </h2>
                  <p className="text-xs text-[#706B66] mt-0.5">
                    Calibrate difficulty and question volume to suit your current study session.
                  </p>
                </div>

                {/* Difficulty Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#222222]">
                    Difficulty Level
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
                  <p className="text-[11px] text-[#706B66]">
                    {selectedDifficulty === 'Easy' && 'Direct recall of terms, definitions, and stated facts.'}
                    {selectedDifficulty === 'Medium' && 'Conceptual understanding and distinguishing key mechanisms.'}
                    {selectedDifficulty === 'Hard' && 'Invariants, nuance analysis, and complex synthesis across concepts.'}
                  </p>
                </div>

                {/* Question Count Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#222222]">
                    Number of Questions
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
                    disabled={!isConfigValid}
                    className="w-full py-3.5 rounded-xl bg-[#C65D32] hover:bg-[#B64E24] text-white font-bold text-sm tracking-wide transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span>Generate & Start Practice Quiz</span>
                    <ArrowRight size={16} />
                  </button>
                </div>

              </div>

            </div>

            {/* Right Column: Live Session Preview */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white border border-[#E7E0D8] rounded-2xl p-6 shadow-card space-y-5">
                
                <div className="border-b border-[#E7E0D8] pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#706B66]">
                    Session Preview
                  </h3>
                  <div className="text-lg font-extrabold text-[#222222] mt-1">
                    {selectedNotesList.length === 0 && 'No notes selected'}
                    {selectedNotesList.length === 1 && selectedNotesList[0].title}
                    {selectedNotesList.length > 1 && `${selectedNotesList.length} Notes Combined`}
                  </div>
                  <div className="text-xs text-[#C65D32] font-semibold mt-0.5">
                    {selectedNotesList.length > 1 ? 'Multi-Note Review Deck' : (selectedNotesList[0]?.subject || 'Study Deck')}
                  </div>
                </div>

                {/* Selected Notes Summary Box */}
                <div className="space-y-2">
                  <div className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#706B66]">
                    Source Material ({selectedNotesList.length})
                  </div>
                  {selectedNotesList.length === 0 ? (
                    <div className="p-3 bg-[#FAF8F5] border border-dashed border-[#E7E0D8] rounded-xl text-xs text-[#706B66] text-center">
                      Select notes from the list to see preview
                    </div>
                  ) : (
                    <div className="max-h-40 overflow-y-auto space-y-1.5 p-2 bg-[#FAF8F5] border border-[#E7E0D8] rounded-xl">
                      {selectedNotesList.map((n, i) => (
                        <div key={n.id} className="text-xs font-medium text-[#222222] flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-[#ECD0C0] text-[#C65D32] font-mono text-[10px] flex items-center justify-center font-bold shrink-0">
                            {i + 1}
                          </span>
                          <span className="truncate">{n.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 bg-[#FAF8F5] border border-[#E7E0D8] rounded-xl">
                    <span className="text-[#706B66] font-medium flex items-center gap-1.5">
                      <GraduationCap size={14} className="text-[#C65D32]" />
                      <span>Difficulty</span>
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
                      ~{Math.round(selectedCount * 1.2)} minutes
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-[#FBF4EE] border border-[#ECD0C0] rounded-xl text-xs text-[#983E1A] space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <BrainCircuit size={13} />
                    <span>Active Retrieval Invariant:</span>
                  </div>
                  <p className="text-[#7A3216] leading-relaxed">
                    Testing forces your brain to reconstruct memory traces directly from your notes, producing up to 3x higher retention than passive rereading.
                  </p>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
