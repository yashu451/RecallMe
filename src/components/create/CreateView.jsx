import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckSquare, 
  Square, 
  ArrowRight, 
  Loader2, 
  Sparkles,
  AlertCircle 
} from 'lucide-react';

export default function CreateView({ onGenerate, onCancel, initialText = '' }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [text, setText] = useState(initialText);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [generationProgress, setGenerationProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || isGenerating) return;

    setIsGenerating(true);
    setErrorMessage(null);
    setGenerationProgress(25);
    setGenerationStep('Contacting RecallMe AI Engine & parsing content...');

    const timer1 = setTimeout(() => {
      setGenerationProgress(65);
      setGenerationStep('Extracting key concepts, invariants & terminology...');
    }, 600);

    const timer2 = setTimeout(() => {
      setGenerationProgress(90);
      setGenerationStep('Synthesizing structured notes & active recall questions...');
    }, 1200);

    try {
      await onGenerate(text.trim(), title.trim(), options);
    } catch (err) {
      console.error('Generation error:', err);
      setErrorMessage(err.message || 'Failed to generate study notes. Please try again.');
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsGenerating(false);
    }
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
          Paste your lecture transcript, textbook chapter, or research paper excerpt. RecallMe automatically analyzes the domain and extracts structured summaries, key terminology, and an active recall quiz.
        </p>
      </div>

      {/* Error Message if Generation Fails */}
      {errorMessage && (
        <div className="p-4 bg-[#FDF1F1] border border-[#F2C6C6] rounded-2xl flex items-center gap-3 text-xs text-[#B93838]">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Topic Title (Optional) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#252525] uppercase tracking-wider block">
            Topic Title <span className="font-normal text-[#706B66]">(Optional — auto-inferred from content if left blank)</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Cellular Respiration & Chemiosmosis, The Taylor Rule, or Transformer Self-Attention"
            className="input-glow w-full text-sm bg-white border border-[#E7E0D8] rounded-xl px-4 py-3 text-[#252525] focus:outline-none focus:bg-white font-sans shadow-xs transition-colors"
          />
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

          <textarea
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste raw lecture text, textbook excerpts, or Markdown notes here..."
            className="input-glow w-full text-sm bg-white border border-[#E7E0D8] rounded-2xl p-4 sm:p-5 text-[#252525] focus:outline-none focus:bg-white font-sans shadow-xs leading-relaxed resize-y"
          />
        </div>

        {/* Generation Preferences */}
        <div className="bg-white border border-[#E7E0D8] rounded-2xl p-5 sm:p-6 shadow-card space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-[#706B66]">
            Configure What RecallMe Synthesizes
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Notes */}
            <div 
              onClick={() => toggleOption('notes')}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                options.notes 
                  ? 'bg-[#FBF4EE] border-[#C65D32]' 
                  : 'bg-[#FAF8F5] border-[#E7E0D8]'
              }`}
            >
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-[#222222]">Structured Notes</div>
                <div className="text-[11px] text-[#706B66]">Hierarchical sections with core takeaways.</div>
              </div>
              {options.notes ? <CheckSquare size={16} className="text-[#C65D32]" /> : <Square size={16} className="text-[#706B66]" />}
            </div>

            {/* Keywords */}
            <div 
              onClick={() => toggleOption('keywords')}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                options.keywords 
                  ? 'bg-[#FBF4EE] border-[#C65D32]' 
                  : 'bg-[#FAF8F5] border-[#E7E0D8]'
              }`}
            >
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-[#222222]">Key Concepts</div>
                <div className="text-[11px] text-[#706B66]">Essential terms with short & long definitions.</div>
              </div>
              {options.keywords ? <CheckSquare size={16} className="text-[#C65D32]" /> : <Square size={16} className="text-[#706B66]" />}
            </div>

            {/* Definitions */}
            <div 
              onClick={() => toggleOption('definitions')}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                options.definitions 
                  ? 'bg-[#FBF4EE] border-[#C65D32]' 
                  : 'bg-[#FAF8F5] border-[#E7E0D8]'
              }`}
            >
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-[#222222]">Glossary & Pronunciation</div>
                <div className="text-[11px] text-[#706B66]">Formal definitions with contextual examples.</div>
              </div>
              {options.definitions ? <CheckSquare size={16} className="text-[#C65D32]" /> : <Square size={16} className="text-[#706B66]" />}
            </div>

            {/* Quiz */}
            <div 
              onClick={() => toggleOption('quiz')}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                options.quiz 
                  ? 'bg-[#FBF4EE] border-[#C65D32]' 
                  : 'bg-[#FAF8F5] border-[#E7E0D8]'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#222222]">Practice Recall Quiz</span>
                  {options.quiz && (
                    <select
                      value={options.quizCount}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => setOptions(prev => ({ ...prev, quizCount: parseInt(e.target.value) }))}
                      className="text-[10px] font-bold py-0.5 px-1.5 rounded bg-white border border-[#E7E0D8] text-[#C65D32]"
                    >
                      <option value={3}>3 Questions</option>
                      <option value={5}>5 Questions</option>
                      <option value={10}>10 Questions</option>
                    </select>
                  )}
                </div>
                <div className="text-[11px] text-[#706B66]">Active retrieval testing with explanations.</div>
              </div>
              {options.quiz ? <CheckSquare size={16} className="text-[#C65D32]" /> : <Square size={16} className="text-[#706B66]" />}
            </div>
          </div>
        </div>

        {/* Action Button & Enhanced Progress */}
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
                <Sparkles size={14} />
                <span>Create Notes</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>

      </form>
    </div>
  );
}
