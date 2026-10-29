import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Trash2, 
  Layers
} from 'lucide-react';
import { SAMPLE_TEXTS_FOR_CREATOR } from '../../data/mockData';

export default function CreateView({ onGenerate, onCancel, initialText = '' }) {
  const navigate = useNavigate();
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
    setGenerationStep('Extracting core principles & hierarchical sections...');

    setTimeout(() => {
      setGenerationStep('Isolating domain invariants & terminology...');
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <button
          onClick={onCancel || (() => navigate('/dashboard'))}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Dashboard</span>
        </button>

        <div className="text-xs font-mono text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
          Distraction-Free Editor
        </div>
      </div>

      <div className="space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Create Study Material
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Paste your lecture transcript, textbook chapter, or research paper excerpt. RecallMe extracts structured summaries, key terminology, and an active recall quiz.
        </p>
      </div>

      {/* Preset Sample Excerpts */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
        <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
          <Sparkles size={14} className="text-indigo-600" />
          <span>Or load a pre-configured realistic academic excerpt:</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {SAMPLE_TEXTS_FOR_CREATOR.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleLoadSample(sample)}
              className="text-xs px-3 py-1.5 rounded-lg bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 transition-all font-semibold shadow-xs"
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
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Topic Title <span className="font-normal text-slate-400">(Auto-inferred if blank)</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Cellular Respiration & Chemiosmosis"
              className="w-full text-sm bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent font-sans shadow-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Academic Domain
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-sans shadow-xs"
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
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Source Material / Reading Notes
            </label>
            <div className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {wordCount} words • ~{estimatedReadTime} min read
            </div>
          </div>

          <div className="relative">
            <textarea
              rows={12}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste raw lecture excerpts, article text, or syllabus concepts here...&#10;&#10;Supports raw text, bullet points, and mathematical or scientific terminology."
              className="w-full text-sm font-sans text-slate-900 placeholder:text-slate-400 bg-white border border-slate-200 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent leading-relaxed resize-y shadow-xs"
              required
            />
          </div>

          {text.trim() && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setText('')}
                className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors pt-0.5 font-medium"
              >
                <Trash2 size={12} />
                <span>Clear text</span>
              </button>
            </div>
          )}
        </div>

        {/* What to generate options */}
        <div className="border border-slate-200 rounded-2xl bg-slate-50/60 p-5 sm:p-6 space-y-3">
          <div className="space-y-0.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              What should RecallMe generate?
            </h3>
            <p className="text-xs text-slate-500">
              Customize the active recall deck based on your study session requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Notes */}
            <div 
              onClick={() => toggleOption('notes')}
              className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
                options.notes 
                  ? 'bg-white border-indigo-600 ring-1 ring-indigo-600 shadow-sm' 
                  : 'bg-slate-100 border-slate-200 opacity-60'
              }`}
            >
              <div className="mt-0.5 text-indigo-600">
                {options.notes ? <CheckSquare size={17} /> : <Square size={17} />}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Structured Study Notes</div>
                <div className="text-[11px] text-slate-500">Organized headings, takeaways, and conceptual synthesis.</div>
              </div>
            </div>

            {/* Keywords */}
            <div 
              onClick={() => toggleOption('keywords')}
              className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
                options.keywords 
                  ? 'bg-white border-indigo-600 ring-1 ring-indigo-600 shadow-sm' 
                  : 'bg-slate-100 border-slate-200 opacity-60'
              }`}
            >
              <div className="mt-0.5 text-indigo-600">
                {options.keywords ? <CheckSquare size={17} /> : <Square size={17} />}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Key Concepts & Terms</div>
                <div className="text-[11px] text-slate-500">Interactive inline highlights with detailed explanations.</div>
              </div>
            </div>

            {/* Definitions */}
            <div 
              onClick={() => toggleOption('definitions')}
              className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
                options.definitions 
                  ? 'bg-white border-indigo-600 ring-1 ring-indigo-600 shadow-sm' 
                  : 'bg-slate-100 border-slate-200 opacity-60'
              }`}
            >
              <div className="mt-0.5 text-indigo-600">
                {options.definitions ? <CheckSquare size={17} /> : <Square size={17} />}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Glossary & Definitions</div>
                <div className="text-[11px] text-slate-500">Etymologies, precise meanings, and practical examples.</div>
              </div>
            </div>

            {/* Quiz */}
            <div 
              onClick={() => toggleOption('quiz')}
              className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
                options.quiz 
                  ? 'bg-white border-indigo-600 ring-1 ring-indigo-600 shadow-sm' 
                  : 'bg-slate-100 border-slate-200 opacity-60'
              }`}
            >
              <div className="mt-0.5 text-indigo-600">
                {options.quiz ? <CheckSquare size={17} /> : <Square size={17} />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Active Recall Quiz</span>
                  {options.quiz && (
                    <select
                      value={options.quizCount}
                      onChange={(e) => {
                        e.stopPropagation();
                        setOptions(prev => ({ ...prev, quizCount: Number(e.target.value) }));
                      }}
                      className="text-[11px] font-mono border border-slate-300 rounded px-2 py-0.5 bg-white text-slate-800"
                    >
                      <option value={3}>3 Questions</option>
                      <option value={5}>5 Questions</option>
                      <option value={8}>8 Questions</option>
                    </select>
                  )}
                </div>
                <div className="text-[11px] text-slate-500">Retrieval testing with explanations.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button & Progress */}
        <div className="pt-2">
          {isGenerating ? (
            <div className="p-5 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center gap-3.5 animate-fadeIn">
              <Loader2 size={20} className="animate-spin text-indigo-600 shrink-0" />
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-indigo-900">Synthesizing Learning Material...</div>
                <div className="text-xs text-indigo-700 font-mono">{generationStep}</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-slate-500 hidden sm:inline font-medium">
                "Active retrieval strengthens memory 3x more than passive re-reading."
              </span>
              <button
                type="submit"
                disabled={!text.trim()}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold tracking-wide shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
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
