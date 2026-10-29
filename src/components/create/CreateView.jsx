import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowLeft, 
  BookOpen, 
  CheckSquare, 
  Square, 
  ArrowRight, 
  Loader2, 
  Trash2 
} from 'lucide-react';
import { SAMPLE_TEXTS_FOR_CREATOR } from '../../data/mockData';

export default function CreateView({ onGenerate, onCancel, initialText = '' }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Machine Learning');
  const [text, setText] = useState(initialText);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [generationProgress, setGenerationProgress] = useState(0);

  // Generation options
  const [options, setOptions] = useState({
    notes: true,
    keywords: true,
    definitions: true,
    quiz: true,
    quizCount: 5
  });

  const toggleOption = (key) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 180));

  const handleLoadSample = (sample) => {
    setTitle(sample.title);
    setSubject(sample.category);
    setText(sample.text);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsGenerating(true);
    setGenerationProgress(25);
    setGenerationStep('Extracting core principles & hierarchical sections...');

    setTimeout(() => {
      setGenerationProgress(65);
      setGenerationStep('Isolating domain invariants & terminology...');
    }, 600);

    setTimeout(() => {
      setGenerationProgress(95);
      setGenerationStep('Formulating active recall questions & explanations...');
    }, 1200);

    setTimeout(() => {
      setIsGenerating(false);
      onGenerate(text, title, options);
    }, 1800);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#E7E0D8] pb-4">
        <button
          onClick={onCancel || (() => navigate('/dashboard'))}
          className="text-xs font-bold text-[#706B66] hover:text-[#222222] flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Dashboard</span>
        </button>

        <div className="text-xs font-mono text-[#706B66] bg-[#FAF8F5] px-2.5 py-1 rounded-md border border-[#E7E0D8]">
          Distraction-Free Editor
        </div>
      </div>

      <div className="space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222222] tracking-tight">
          Create Study Material
        </h1>
        <p className="text-sm text-[#706B66] leading-relaxed">
          Paste your lecture transcript, textbook chapter, or research paper excerpt. RecallMe extracts structured summaries, key terminology, and an active recall quiz.
        </p>
      </div>

      {/* Preset Sample Excerpts */}
      <div className="p-4 bg-white rounded-2xl border border-[#E7E0D8] space-y-2.5 shadow-subtle">
        <div className="text-xs font-bold text-[#222222] flex items-center gap-2">
          <Sparkles size={14} className="text-[#C65D32]" />
          <span>Or load a pre-configured realistic academic excerpt:</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {SAMPLE_TEXTS_FOR_CREATOR.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleLoadSample(sample)}
              className="btn-tactile text-xs px-3 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#FBF4EE] text-[#252525] hover:text-[#C65D32] border border-[#E7E0D8] hover:border-[#ECD0C0] font-semibold shadow-xs"
            >
              Load: {sample.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Title & Subject row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-[#252525] uppercase tracking-wider block">
              Topic Title <span className="font-normal text-[#706B66]">(Auto-inferred if blank)</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Cellular Respiration & Chemiosmosis"
              className="input-glow w-full text-sm bg-white border border-[#E7E0D8] rounded-xl px-4 py-2.5 text-[#252525] focus:outline-none focus:bg-white font-sans shadow-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#252525] uppercase tracking-wider block">
              Academic Domain
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="input-glow w-full text-sm bg-white border border-[#E7E0D8] rounded-xl px-3.5 py-2.5 text-[#252525] focus:outline-none focus:bg-white font-sans shadow-xs font-semibold"
            >
              <option value="Machine Learning">Machine Learning</option>
              <option value="Cognitive Science">Cognitive Science</option>
              <option value="Distributed Systems">Distributed Systems</option>
              <option value="Biochemistry">Biochemistry</option>
              <option value="Behavioral Economics">Behavioral Economics</option>
              <option value="Quantum Physics">Quantum Physics</option>
              <option value="General Science">General Science</option>
            </select>
          </div>
        </div>

        {/* Source Content Textarea */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#252525] uppercase tracking-wider block">
              Source Material / Reading Notes
            </label>
            <div className="text-xs font-mono text-[#706B66] bg-[#FAF8F5] px-2.5 py-0.5 rounded border border-[#E7E0D8]">
              {wordCount} words • ~{estimatedReadTime} min read
            </div>
          </div>

          <div className="relative">
            <textarea
              rows={12}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste raw lecture excerpts, article text, or syllabus concepts here...&#10;&#10;Supports raw text, bullet points, and mathematical or scientific terminology."
              className="input-glow w-full text-sm font-sans text-[#252525] placeholder:text-[#706B66]/60 bg-white border border-[#E7E0D8] rounded-2xl p-4 focus:outline-none focus:bg-white leading-relaxed resize-y shadow-xs"
              required
            />
          </div>

          {text.trim() && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setText('')}
                className="btn-tactile text-xs text-[#706B66] hover:text-[#B93838] flex items-center gap-1 pt-0.5 font-bold"
              >
                <Trash2 size={12} />
                <span>Clear text</span>
              </button>
            </div>
          )}
        </div>

        {/* What to generate options */}
        <div className="border border-[#E7E0D8] rounded-2xl bg-white p-5 sm:p-6 space-y-3 shadow-subtle">
          <div className="space-y-0.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#222222]">
              What should RecallMe generate?
            </h3>
            <p className="text-xs text-[#706B66]">
              Customize the active recall deck based on your study session requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Notes */}
            <div 
              onClick={() => toggleOption('notes')}
              className={`card-interactive p-3.5 rounded-xl border text-left cursor-pointer flex items-start gap-3 ${
                options.notes 
                  ? 'bg-[#FBF4EE] border-[#C65D32] ring-1 ring-[#C65D32]' 
                  : 'bg-[#FAF8F5] border-[#E7E0D8] opacity-60'
              }`}
            >
              <div className="mt-0.5 text-[#C65D32]">
                {options.notes ? <CheckSquare size={17} /> : <Square size={17} />}
              </div>
              <div>
                <div className="text-xs font-bold text-[#222222]">Structured Study Notes</div>
                <div className="text-[11px] text-[#706B66]">Organized headings, takeaways, and conceptual synthesis.</div>
              </div>
            </div>

            {/* Keywords */}
            <div 
              onClick={() => toggleOption('keywords')}
              className={`card-interactive p-3.5 rounded-xl border text-left cursor-pointer flex items-start gap-3 ${
                options.keywords 
                  ? 'bg-[#FBF4EE] border-[#C65D32] ring-1 ring-[#C65D32]' 
                  : 'bg-[#FAF8F5] border-[#E7E0D8] opacity-60'
              }`}
            >
              <div className="mt-0.5 text-[#C65D32]">
                {options.keywords ? <CheckSquare size={17} /> : <Square size={17} />}
              </div>
              <div>
                <div className="text-xs font-bold text-[#222222]">Key Concepts & Terms</div>
                <div className="text-[11px] text-[#706B66]">Interactive inline highlights with detailed explanations.</div>
              </div>
            </div>

            {/* Definitions */}
            <div 
              onClick={() => toggleOption('definitions')}
              className={`card-interactive p-3.5 rounded-xl border text-left cursor-pointer flex items-start gap-3 ${
                options.definitions 
                  ? 'bg-[#FBF4EE] border-[#C65D32] ring-1 ring-[#C65D32]' 
                  : 'bg-[#FAF8F5] border-[#E7E0D8] opacity-60'
              }`}
            >
              <div className="mt-0.5 text-[#C65D32]">
                {options.definitions ? <CheckSquare size={17} /> : <Square size={17} />}
              </div>
              <div>
                <div className="text-xs font-bold text-[#222222]">Glossary & Definitions</div>
                <div className="text-[11px] text-[#706B66]">Etymologies, precise meanings, and practical examples.</div>
              </div>
            </div>

            {/* Quiz */}
            <div 
              onClick={() => toggleOption('quiz')}
              className={`card-interactive p-3.5 rounded-xl border text-left cursor-pointer flex items-start gap-3 ${
                options.quiz 
                  ? 'bg-[#FBF4EE] border-[#C65D32] ring-1 ring-[#C65D32]' 
                  : 'bg-[#FAF8F5] border-[#E7E0D8] opacity-60'
              }`}
            >
              <div className="mt-0.5 text-[#C65D32]">
                {options.quiz ? <CheckSquare size={17} /> : <Square size={17} />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#222222]">Active Recall Quiz</span>
                  {options.quiz && (
                    <select
                      value={options.quizCount}
                      onChange={(e) => {
                        e.stopPropagation();
                        setOptions(prev => ({ ...prev, quizCount: Number(e.target.value) }));
                      }}
                      className="text-[11px] font-mono border border-[#E7E0D8] rounded px-2 py-0.5 bg-white text-[#252525]"
                    >
                      <option value={3}>3 Questions</option>
                      <option value={5}>5 Questions</option>
                      <option value={8}>8 Questions</option>
                    </select>
                  )}
                </div>
                <div className="text-[11px] text-[#706B66]">Retrieval testing with explanations.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button & Enhanced Elegant Progress */}
        <div className="pt-2">
          {isGenerating ? (
            <div className="p-5 bg-[#FBF4EE] border border-[#ECD0C0] rounded-2xl space-y-3 animate-fadeIn shadow-subtle">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Loader2 size={18} className="animate-spin text-[#C65D32] shrink-0" />
                  <div className="text-xs font-bold text-[#983E1A]">Synthesizing Learning Material...</div>
                </div>
                <span className="text-xs font-mono font-bold text-[#C65D32]">{generationProgress}%</span>
              </div>
              
              {/* Animated Progress Bar */}
              <div className="w-full bg-[#ECD0C0]/50 h-2 rounded-full overflow-hidden">
                <div 
                  className="progress-bar-smooth bg-[#C65D32] h-full rounded-full"
                  style={{ width: `${generationProgress}%` }}
                />
              </div>

              <div className="text-xs text-[#706B66] font-mono pt-0.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C65D32] animate-ping" />
                <span>{generationStep}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-[#706B66] hidden sm:inline font-medium">
                "Active retrieval strengthens memory 3x more than passive re-reading."
              </span>
              <button
                type="submit"
                disabled={!text.trim()}
                className="btn-tactile w-full sm:w-auto px-6 py-3 rounded-xl bg-[#C65D32] hover:bg-[#B64E24] text-white text-xs font-bold tracking-wide shadow-xs flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Generate Study Material</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>

      </form>
    </div>
  );
}
