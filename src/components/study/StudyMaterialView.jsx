import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  HelpCircle, 
  Copy, 
  Star, 
  ArrowRight, 
  Sparkles, 
  Check, 
  Clock, 
  Layers, 
  Info, 
  X,
  BookmarkPlus,
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function StudyMaterialView({ 
  topic, 
  isLoading = false,
  isSaved = true,
  onSaveToLibrary,
  onBack, 
  onStartQuiz, 
  onToggleStar 
}) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'keywords' | 'definitions' | 'quizPreview'
  const [copied, setCopied] = useState(false);
  const [activeKeywordModal, setActiveKeywordModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedLocal, setSavedLocal] = useState(isSaved);
  const [saveToast, setSaveToast] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    setSavedLocal(isSaved);
  }, [isSaved]);

  // If loading skeleton
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-pulse">
        <div className="h-4 bg-[#E7E0D8] rounded w-24" />
        <div className="h-9 bg-[#E7E0D8] rounded w-2/3" />
        <div className="h-4 bg-[#E7E0D8] rounded w-full" />
        <div className="h-32 bg-white border border-[#E7E0D8] rounded-2xl p-6" />
        <div className="h-48 bg-white border border-[#E7E0D8] rounded-2xl p-6" />
      </div>
    );
  }

  // If no topic found
  if (!topic) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4 animate-fadeIn">
        <div className="w-14 h-14 rounded-full bg-[#FAF5EF] text-[#C65D32] border border-[#E8B786] flex items-center justify-center mx-auto">
          <BookOpen size={24} />
        </div>
        <h2 className="text-xl font-bold text-[#222222]">Study Material Not Found</h2>
        <p className="text-sm text-[#706B66] max-w-sm mx-auto">
          The requested study notes could not be found or have not been saved yet.
        </p>
        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            onClick={onBack || (() => navigate('/library'))}
            className="btn-tactile px-4 py-2 rounded-xl text-xs font-bold text-[#252525] bg-white hover:bg-[#FAF8F5] border border-[#E7E0D8]"
          >
            Go to Library
          </button>
          <button
            onClick={() => navigate('/create')}
            className="btn-tactile px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#C65D32] hover:bg-[#B64E24]"
          >
            Create New Notes
          </button>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    if (saving || savedLocal) return;
    setSaving(true);
    setSaveError(null);
    try {
      if (typeof onSaveToLibrary === 'function') {
        await onSaveToLibrary(topic);
      }
      setSavedLocal(true);
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 3500);
    } catch (err) {
      console.error('Failed to save topic to library:', err);
      setSaveError(err.message || 'Failed to save notes to database. Please retry.');
    } finally {
      setSaving(false);
    }
  };

  const handleCopyMarkdown = () => {
    let md = `# ${topic.title}\n\n`;
    md += `*Subject:* ${topic.subject} | *Read time:* ${topic.readTime}\n\n`;
    md += `## Key Takeaways\n`;
    topic.takeaways?.forEach(t => {
      md += `- ${t}\n`;
    });
    md += `\n## Notes\n`;
    topic.sections?.forEach(s => {
      md += `### ${s.heading}\n\n${s.content}\n\n`;
    });
    md += `## Glossary & Key Terms\n`;
    topic.definitions?.forEach(d => {
      md += `- **${d.term}**: ${d.definition}\n`;
    });

    navigator.clipboard.writeText(md).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const tabs = [
    { id: 'notes', label: 'Structured Notes' },
    { id: 'keywords', label: `Key Concepts (${topic.keywords?.length || 0})` },
    { id: 'definitions', label: `Glossary (${topic.definitions?.length || 0})` },
    { id: 'quizPreview', label: `Quiz Questions (${topic.quiz?.length || 0})` },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Toast Notification when Saved */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-[#222222] text-[#F7F3ED] rounded-2xl shadow-xl flex items-center gap-3 border border-[#E8B786] animate-in fade-in slide-in-from-bottom duration-200">
          <div className="w-8 h-8 rounded-full bg-[#38765C] text-white flex items-center justify-center shrink-0">
            <Check size={16} />
          </div>
          <div className="space-y-0.5">
            <div className="text-xs font-bold">Saved to My Library!</div>
            <div className="text-[11px] text-[#E8B786]">You can access this note anytime in your library.</div>
          </div>
        </div>
      )}

      {/* Save Error Alert with Retry */}
      {saveError && (
        <div className="p-4 bg-[#FDF1F1] border border-[#F2C6C6] rounded-2xl flex items-center justify-between gap-3 text-xs text-[#B93838] animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{saveError}</span>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-3 py-1 rounded-lg bg-[#B93838] hover:bg-[#9B2A2A] text-white font-bold transition-colors"
          >
            Retry Save
          </button>
        </div>
      )}

      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between border-b border-[#E7E0D8] pb-4 flex-wrap gap-3">
        <button
          onClick={onBack || (() => navigate('/library'))}
          className="text-xs font-bold text-[#706B66] hover:text-[#222222] flex items-center gap-1.5 transition-colors btn-tactile"
        >
          <ArrowLeft size={14} />
          <span>Back to Library</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Save to My Library Button */}
          {!savedLocal ? (
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#C65D32] hover:bg-[#B64E24] transition-colors flex items-center gap-1.5 shadow-xs btn-tactile disabled:opacity-50"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <BookmarkPlus size={14} />}
              <span>{saving ? 'Saving...' : 'Save to My Library'}</span>
            </button>
          ) : (
            <div className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#38765C] bg-[#EDF5F1] border border-[#C0DCD0] flex items-center gap-1.5">
              <CheckCircle2 size={14} />
              <span>Saved in Library</span>
            </div>
          )}

          {/* Star Bookmark */}
          {onToggleStar && (
            <button
              onClick={() => onToggleStar(topic.id)}
              className={`p-2 rounded-xl border transition-all btn-tactile ${
                topic.isStarred
                  ? 'bg-[#FAF5EF] text-[#C65D32] border-[#E8B786]'
                  : 'text-[#706B66] hover:text-[#222222] bg-white border-[#E7E0D8]'
              }`}
              title={topic.isStarred ? 'Saved to favorites' : 'Star this topic'}
            >
              <Star size={15} className={topic.isStarred ? 'fill-[#C65D32] text-[#C65D32]' : ''} />
            </button>
          )}

          {/* Copy Markdown */}
          <button
            onClick={handleCopyMarkdown}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#252525] bg-white hover:bg-[#FAF8F5] border border-[#E7E0D8] transition-colors flex items-center gap-1.5 shadow-xs btn-tactile"
          >
            {copied ? <Check size={14} className="text-[#38765C]" /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Export Notes'}</span>
          </button>

          {/* Start Recall Quiz */}
          <button
            onClick={() => {
              if (onStartQuiz) onStartQuiz(topic);
              navigate(`/quiz/${topic.id}`);
            }}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#222222] bg-[#FAF5EF] hover:bg-[#FBF4EE] border border-[#E8B786] transition-colors flex items-center gap-1.5 shadow-xs btn-tactile"
          >
            <span>Practice Quiz</span>
            <ArrowRight size={13} className="text-[#C65D32]" />
          </button>
        </div>
      </div>

      {/* Prominent Save Banner if freshly generated and unsaved */}
      {!savedLocal && (
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#FAF5EF] via-[#FFFDFB] to-[#FBF4EE] border border-[#E8B786] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#222222] text-[#E8B786] flex items-center justify-center shrink-0">
              <Sparkles size={20} className="text-[#C65D32]" />
            </div>
            <div className="space-y-0.5">
              <div className="text-sm font-bold text-[#222222]">Generated Study Notes Ready</div>
              <p className="text-xs text-[#706B66]">
                Review your synthesized study material below. Click save to store it in My Library.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="btn-tactile shrink-0 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#C65D32] hover:bg-[#B64E24] transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <BookmarkPlus size={15} />}
            <span>{saving ? 'Saving...' : 'Save to My Library'}</span>
          </button>
        </div>
      )}

      {/* Article Header & Metadata */}
      <header className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#FBF4EE] text-[#C65D32] border border-[#ECD0C0]">
            {topic.subject || 'General'}
          </span>
          {topic.subjectCode && (
            <span className="text-xs font-mono text-[#706B66] bg-white border border-[#E7E0D8] px-2 py-0.5 rounded">
              {topic.subjectCode}
            </span>
          )}
          <span className="text-[#E7E0D8]">•</span>
          <span className="text-xs text-[#706B66] flex items-center gap-1 font-medium">
            <Clock size={13} />
            {topic.readTime || '4 min read'}
          </span>
          {topic.lastStudied && (
            <>
              <span className="text-[#E7E0D8]">•</span>
              <span className="text-xs text-[#706B66]">
                {topic.lastStudied}
              </span>
            </>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#222222] tracking-tight leading-tight">
          {topic.title}
        </h1>

        <p className="text-sm sm:text-base text-[#706B66] leading-relaxed max-w-3xl">
          {topic.summary}
        </p>

        {/* Tags */}
        {topic.tags && topic.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            {topic.tags.map((tag, idx) => (
              <span 
                key={idx}
                className="text-[11px] font-semibold text-[#706B66] bg-white px-2.5 py-0.5 rounded-md border border-[#E7E0D8]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Key Takeaways Callout Box */}
      {topic.takeaways && topic.takeaways.length > 0 && (
        <section className="bg-white border border-[#E7E0D8] rounded-2xl p-6 shadow-card space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C65D32]">
            <Sparkles size={14} />
            <span>Key Invariants & Takeaways</span>
          </div>
          <ul className="space-y-2.5">
            {topic.takeaways.map((takeaway, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#252525] leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C65D32] mt-2 shrink-0"></span>
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Section Navigation Tabs */}
      <div className="border-b border-[#E7E0D8] flex items-center gap-2 overflow-x-auto pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-[#C65D32] text-[#C65D32]'
                : 'border-transparent text-[#706B66] hover:text-[#222222]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Structured Notes */}
      {activeTab === 'notes' && (
        <div className="space-y-8 animate-fadeIn">
          {topic.sections?.map((section, idx) => (
            <article 
              key={idx}
              className="bg-white border border-[#E7E0D8] rounded-2xl p-6 sm:p-8 shadow-card space-y-4"
            >
              <h2 className="text-lg sm:text-xl font-bold text-[#222222] tracking-tight pb-2 border-b border-[#E7E0D8]">
                {section.heading}
              </h2>
              <div className="prose prose-sm max-w-none text-xs sm:text-sm text-[#252525] leading-relaxed space-y-3 whitespace-pre-line font-sans">
                {section.content}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* TAB 2: Key Concepts */}
      {activeTab === 'keywords' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
          {topic.keywords?.map((kw, idx) => (
            <div
              key={idx}
              onClick={() => setActiveKeywordModal(kw)}
              className="p-5 rounded-2xl bg-white border border-[#E7E0D8] hover:border-[#C65D32] transition-all space-y-2 cursor-pointer shadow-card group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FAF8F5] text-[#706B66] border border-[#E7E0D8]">
                  {kw.category || 'Core Concept'}
                </span>
                <span className="text-xs text-[#C65D32] group-hover:translate-x-0.5 transition-transform">→</span>
              </div>
              <h3 className="font-bold text-base text-[#222222] group-hover:text-[#C65D32] transition-colors">
                {kw.term}
              </h3>
              <p className="text-xs text-[#706B66] line-clamp-2 leading-relaxed">
                {kw.shortDef || kw.fullDef}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Glossary & Definitions */}
      {activeTab === 'definitions' && (
        <div className="space-y-4 animate-fadeIn">
          {topic.definitions?.map((def, idx) => (
            <div 
              key={idx}
              className="p-6 bg-white border border-[#E7E0D8] rounded-2xl shadow-card space-y-3"
            >
              <div className="flex items-baseline justify-between gap-4">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h3 className="text-lg font-bold text-[#222222]">{def.term}</h3>
                  {def.phonetic && (
                    <span className="text-xs font-mono text-[#706B66]">{def.phonetic}</span>
                  )}
                </div>
                {def.partOfSpeech && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C65D32] px-2 py-0.5 rounded bg-[#FBF4EE] border border-[#ECD0C0]">
                    {def.partOfSpeech}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[#252525] leading-relaxed">
                {def.definition}
              </p>
              {def.example && (
                <div className="p-3 bg-[#FAF8F5] border border-[#E7E0D8] rounded-xl text-xs text-[#706B66] italic">
                  "{def.example}"
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: Quiz Questions Preview */}
      {activeTab === 'quizPreview' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-4 bg-[#FAF5EF] border border-[#E8B786] rounded-2xl flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-[#7A3216]">Active Retrieval Questions</div>
              <div className="text-xs text-[#706B66]">Generated directly from the content above.</div>
            </div>
            <button
              onClick={() => {
                if (onStartQuiz) onStartQuiz(topic);
                navigate(`/quiz/${topic.id}`);
              }}
              className="btn-tactile px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#C65D32] hover:bg-[#B64E24] transition-colors shadow-xs"
            >
              Start Full Quiz
            </button>
          </div>

          <div className="space-y-3">
            {topic.quiz?.map((q, qIdx) => (
              <div key={qIdx} className="p-5 bg-white border border-[#E7E0D8] rounded-2xl shadow-xs space-y-2">
                <div className="text-[10px] font-mono text-[#706B66] font-bold uppercase">
                  Question {qIdx + 1}
                </div>
                <div className="text-sm font-bold text-[#222222]">
                  {q.question}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {q.options?.map((opt, oIdx) => (
                    <div 
                      key={oIdx}
                      className="text-xs p-2 rounded-lg bg-[#FAF8F5] border border-[#E7E0D8] text-[#706B66]"
                    >
                      {String.fromCharCode(65 + oIdx)}. {opt}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Keyword Deep Dive Modal */}
      {activeKeywordModal && (
        <div className="fixed inset-0 z-50 bg-[#222222]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7E0D8] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C65D32]">
                  {activeKeywordModal.category || 'Core Concept'}
                </span>
                <h3 className="text-xl font-extrabold text-[#222222] mt-0.5">
                  {activeKeywordModal.term}
                </h3>
              </div>
              <button
                onClick={() => setActiveKeywordModal(null)}
                className="p-1 rounded-lg text-[#706B66] hover:text-[#222222] hover:bg-[#FAF8F5]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-[#252525] leading-relaxed">
              <p className="font-semibold text-[#222222]">
                {activeKeywordModal.shortDef}
              </p>
              <p className="text-[#706B66]">
                {activeKeywordModal.fullDef}
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveKeywordModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#FAF8F5] hover:bg-[#FBF4EE] text-[#222222] border border-[#E7E0D8]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
