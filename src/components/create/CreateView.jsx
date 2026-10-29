import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowLeft, 
  BookOpen, 
  FileText, 
  HelpCircle, 
  CheckSquare, 
  Square, 
  ArrowRight, 
  Loader2,
  Bookmark,
  Trash2,
  FileCheck
} from 'lucide-react';
import { SAMPLE_TEXTS_FOR_CREATOR } from '../../data/mockData';

export default function CreateView({ onGenerate, onCancel, initialText = '' }) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Machine Learning');
  const [text, setText] = useState(initialText);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');

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
    setGenerationStep('Synthesizing core conceptual hierarchy...');

    setTimeout(() => {
      setGenerationStep('Extracting key definitions & invariant terms...');
    }, 600);

    setTimeout(() => {
      setGenerationStep('Formulating active recall questions & explanations...');
    }, 1200);

    setTimeout(() => {
      setIsGenerating(false);
      onGenerate(text, title, options);
    }, 1800);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E8E6DE] pb-4">
        <button
          onClick={onCancel}
          className="text-xs font-medium text-charcoal-500 hover:text-charcoal-900 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Dashboard</span>
        </button>

        <div className="text-xs font-mono text-charcoal-400">
          Distraction-Free Editor
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="font-serif text-3xl text-charcoal-900 font-normal tracking-tight">
          Create Study Material
        </h1>
        <p className="text-sm text-charcoal-600 leading-relaxed">
          Paste your lecture transcript, textbook chapter, or research paper excerpt. RecallMe extracts structured summaries, key terminology, and an active recall quiz.
        </p>
      </div>

      {/* Preset Sample Buttons */}
      <div className="p-3 bg-[#F5F3EC] rounded-md border border-[#E6E3D8] space-y-2">
        <div className="text-xs font-medium text-charcoal-700 flex items-center gap-2">
          <span>Or test with a pre-configured realistic academic excerpt:</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {SAMPLE_TEXTS_FOR_CREATOR.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleLoadSample(sample)}
              className="text-xs px-2.5 py-1 rounded bg-[#FFFFFF] hover:bg-[#FAF9F5] text-charcoal-800 border border-[#DCD9CE] transition-colors font-medium shadow-xs"
            >
              Load: {sample.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Title & Subject row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-charcoal-700 uppercase tracking-wider block">
              Topic Title <span className="font-normal text-charcoal-400">(Optional - auto-inferred if blank)</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Cellular Respiration & Chemiosmosis"
              className="w-full text-sm bg-white border border-[#E2E0D8] rounded-md px-3.5 py-2 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-[#312E81] focus:border-transparent font-sans"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal-700 uppercase tracking-wider block">
              Academic Domain
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full text-sm bg-white border border-[#E2E0D8] rounded-md px-3 py-2 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-[#312E81] focus:border-transparent"
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
            <label className="text-xs font-semibold text-charcoal-700 uppercase tracking-wider block">
              Source Material / Reading Notes
            </label>
            <div className="text-xs font-mono text-charcoal-500">
              {wordCount} words • ~{estimatedReadTime} min read
            </div>
          </div>

          <div className="relative">
            <textarea
              rows={12}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste raw lecture excerpts, article text, or syllabus concepts here...&#10;&#10;Supports raw text, bullet points, and mathematical or scientific terminology."
              className="w-full text-sm font-sans text-charcoal-900 placeholder:text-charcoal-400 bg-white border border-[#E2E0D8] rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-[#312E81] focus:border-transparent leading-relaxed resize-y font-mono text-xs sm:text-sm"
              required
            />
          </div>

          {text.trim() && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setText('')}
                className="text-xs text-charcoal-500 hover:text-rose-700 flex items-center gap-1 transition-colors pt-0.5"
              >
                <Trash2 size={12} />
                <span>Clear text</span>
              </button>
            </div>
          )}
        </div>

        {/* What to generate section */}
        <div className="border border-[#E2E0D8] rounded-md bg-[#FAF9F5] p-5 space-y-3">
          <div className="space-y-0.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-charcoal-700">
              What should RecallMe generate?
            </h3>
            <p className="text-xs text-charcoal-500">
              Select the study components tailored to your learning workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Notes */}
            <div 
              onClick={() => toggleOption('notes')}
              className={`p-3 rounded border text-left cursor-pointer transition-colors flex items-start gap-2.5 ${
                options.notes 
                  ? 'bg-white border-[#312E81] ring-1 ring-[#312E81]/30' 
                  : 'bg-[#F2EFE8] border-[#E2DFD6] opacity-60'
              }`}
            >
              <div className="mt-0.5 text-[#312E81]">
                {options.notes ? <CheckSquare size={16} /> : <Square size={16} />}
              </div>
              <div>
                <div className="text-xs font-semibold text-charcoal-900">Structured Study Notes</div>
                <div className="text-[11px] text-charcoal-500">Organized headings, takeaways, and conceptual synthesis.</div>
              </div>
            </div>

            {/* Keywords */}
            <div 
              onClick={() => toggleOption('keywords')}
              className={`p-3 rounded border text-left cursor-pointer transition-colors flex items-start gap-2.5 ${
                options.keywords 
                  ? 'bg-white border-[#312E81] ring-1 ring-[#312E81]/30' 
                  : 'bg-[#F2EFE8] border-[#E2DFD6] opacity-60'
              }`}
            >
              <div className="mt-0.5 text-[#312E81]">
                {options.keywords ? <CheckSquare size={16} /> : <Square size={16} />}
              </div>
              <div>
                <div className="text-xs font-semibold text-charcoal-900">Key Concepts & Terms</div>
                <div className="text-[11px] text-charcoal-500">Interactive inline highlights with detailed explanations.</div>
              </div>
            </div>

            {/* Definitions */}
            <div 
              onClick={() => toggleOption('definitions')}
              className={`p-3 rounded border text-left cursor-pointer transition-colors flex items-start gap-2.5 ${
                options.definitions 
                  ? 'bg-white border-[#312E81] ring-1 ring-[#312E81]/30' 
                  : 'bg-[#F2EFE8] border-[#E2DFD6] opacity-60'
              }`}
            >
              <div className="mt-0.5 text-[#312E81]">
                {options.definitions ? <CheckSquare size={16} /> : <Square size={16} />}
              </div>
              <div>
                <div className="text-xs font-semibold text-charcoal-900">Glossary & Definitions</div>
                <div className="text-[11px] text-charcoal-500">Etymologies, precise meanings, and practical examples.</div>
              </div>
            </div>

            {/* Quiz */}
            <div 
              onClick={() => toggleOption('quiz')}
              className={`p-3 rounded border text-left cursor-pointer transition-colors flex items-start gap-2.5 ${
                options.quiz 
                  ? 'bg-white border-[#312E81] ring-1 ring-[#312E81]/30' 
                  : 'bg-[#F2EFE8] border-[#E2DFD6] opacity-60'
              }`}
            >
              <div className="mt-0.5 text-[#312E81]">
                {options.quiz ? <CheckSquare size={16} /> : <Square size={16} />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-charcoal-900">Active Recall Quiz</span>
                  {options.quiz && (
                    <select
                      value={options.quizCount}
                      onChange={(e) => {
                        e.stopPropagation();
                        setOptions(prev => ({ ...prev, quizCount: Number(e.target.value) }));
                      }}
                      className="text-[11px] font-mono border border-[#D5D1C4] rounded px-1.5 py-0.5 bg-white text-charcoal-800"
                    >
                      <option value={3}>3 Questions</option>
                      <option value={5}>5 Questions</option>
                      <option value={8}>8 Questions</option>
                    </select>
                  )}
                </div>
                <div className="text-[11px] text-charcoal-500">Multiple-choice retrieval testing with explanations.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit / Progress State */}
        <div className="pt-2">
          {isGenerating ? (
            <div className="p-4 bg-[#EEF2FF] border border-[#C7D2FE] rounded-md flex items-center gap-3">
              <Loader2 size={18} className="animate-spin text-[#312E81]" />
              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-[#1E1B4B]">Generating Study Deck...</div>
                <div className="text-xs text-[#312E81] font-mono">{generationStep}</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-charcoal-500 font-serif italic hidden sm:inline">
                "Active retrieval strengthens synaptic pathways 300% more than re-reading."
              </span>
              <button
                type="submit"
                disabled={!text.trim()}
                className="w-full sm:w-auto px-6 py-2.5 rounded-md bg-[#312E81] hover:bg-[#282566] text-white text-xs font-semibold tracking-wide shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
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

