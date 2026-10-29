import React, { useState } from 'react';
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
  X
} from 'lucide-react';

export default function StudyMaterialView({ 
  topic, 
  onBack, 
  onStartQuiz, 
  onToggleStar 
}) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'keywords' | 'definitions' | 'quizPreview'
  const [copied, setCopied] = useState(false);
  const [activeKeywordModal, setActiveKeywordModal] = useState(null);

  if (!topic) return null;

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
      
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <button
          onClick={onBack || (() => navigate('/library'))}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Library</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Star Bookmark */}
          <button
            onClick={() => onToggleStar(topic.id)}
            className={`p-2 rounded-lg border transition-all ${
              topic.isStarred
                ? 'bg-amber-50 text-amber-600 border-amber-200'
                : 'text-slate-400 hover:text-slate-700 bg-white border-slate-200'
            }`}
            title={topic.isStarred ? 'Saved to favorites' : 'Star this topic'}
          >
            <Star size={15} className={topic.isStarred ? 'fill-amber-500' : ''} />
          </button>

          {/* Copy Markdown */}
          <button
            onClick={handleCopyMarkdown}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Export Notes'}</span>
          </button>

          {/* Start Recall Quiz */}
          <button
            onClick={() => {
              onStartQuiz(topic);
              navigate(`/quiz/${topic.id}`);
            }}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all flex items-center gap-1.5 shadow-xs hover:shadow-indigo-500/20"
          >
            <span>Take Recall Quiz</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Article Header & Metadata */}
      <header className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
            {topic.subject}
          </span>
          {topic.subjectCode && (
            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {topic.subjectCode}
            </span>
          )}
          <span className="text-slate-300">•</span>
          <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
            <Clock size={13} />
            {topic.readTime}
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-xs text-slate-500">
            Last studied {topic.lastStudied}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {topic.title}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
          {topic.summary}
        </p>

        {/* Tags */}
        {topic.tags && topic.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            {topic.tags.map((tag, idx) => (
              <span 
                key={idx}
                className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200/60"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Modern Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-6 text-sm">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 font-semibold transition-all relative text-xs sm:text-sm ${
                isActive
                  ? 'text-indigo-600'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Structured Notes */}
      {activeTab === 'notes' && (
        <div className="space-y-8 leading-relaxed text-slate-900">
          
          {/* Key Takeaways Callout */}
          {topic.takeaways && topic.takeaways.length > 0 && (
            <div className="p-5 bg-indigo-50/70 border-l-4 border-l-indigo-600 border border-indigo-100 rounded-r-xl space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                <Sparkles size={15} className="text-indigo-600" />
                <span>Executive Synthesis & Invariant Principles</span>
              </div>
              <ul className="space-y-2 pt-1">
                {topic.takeaways.map((takeaway, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-indigo-950 flex items-start gap-2.5">
                    <span className="font-mono text-indigo-600 font-bold text-xs mt-0.5">
                      0{idx + 1}.
                    </span>
                    <span className="leading-relaxed">{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quick Clickable Term Inspector */}
          {topic.keywords && topic.keywords.length > 0 && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between">
                <span>Core Highlighted Terms in this topic (click for definition):</span>
                <span className="text-[11px] text-slate-400 font-normal">Interactive Glossary</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {topic.keywords.map((kw, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveKeywordModal(kw)}
                    className="text-xs px-3 py-1 rounded-lg bg-white hover:bg-indigo-50 text-slate-800 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 transition-all font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                    <span>{kw.term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sectional content breakdown */}
          <div className="space-y-8 pt-2">
            {topic.sections?.map((section, idx) => (
              <section key={idx} className="space-y-3 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                  {section.heading}
                </h2>
                <div className="text-sm sm:text-base text-slate-700 leading-relaxed font-sans space-y-3 whitespace-pre-line">
                  {section.content}
                </div>
              </section>
            ))}
          </div>

          {/* Interactive Term Highlight Legend */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Info size={16} className="text-indigo-600 shrink-0" />
              <span>
                Want to drill down into formal definitions? Explore the <strong>Glossary</strong> tab or inspect key terms.
              </span>
            </div>
            <button
              onClick={() => setActiveTab('definitions')}
              className="text-indigo-600 hover:text-indigo-800 font-bold self-start sm:self-auto"
            >
              View all definitions →
            </button>
          </div>

        </div>
      )}

      {/* TAB 2: Key Concepts */}
      {activeTab === 'keywords' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-500 font-medium">
            Core theoretical foundations, structural invariants, and mechanisms extracted from this material:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {topic.keywords?.map((kw, idx) => (
              <div 
                key={idx}
                className="p-5 bg-white border border-slate-200 rounded-2xl shadow-subtle space-y-2 hover:border-indigo-300 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                    {kw.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">#0{idx + 1}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {kw.term}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {kw.fullDef}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Glossary & Definitions */}
      {activeTab === 'definitions' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-500 font-medium">
            Exact terminology, phonetics, and contextual usage for rigorous academic recall:
          </div>

          <div className="border border-slate-200 rounded-2xl bg-white divide-y divide-slate-100 overflow-hidden shadow-card">
            {topic.definitions?.map((def, idx) => (
              <div key={idx} className="p-5 space-y-2">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <h3 className="text-base font-bold text-slate-900">
                    {def.term}
                  </h3>
                  {def.phonetic && (
                    <span className="font-mono text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                      {def.phonetic}
                    </span>
                  )}
                  {def.partOfSpeech && (
                    <span className="text-xs text-slate-500 italic">
                      {def.partOfSpeech}
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-700 leading-relaxed">
                  {def.definition}
                </p>

                {def.example && (
                  <div className="text-xs text-slate-600 bg-slate-50 border-l-2 border-indigo-400 p-2.5 rounded-r italic">
                    Example: "{def.example}"
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Quiz Questions Preview */}
      {activeTab === 'quizPreview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Active recall deck consisting of {topic.quiz?.length || 0} multiple-choice conceptual questions.
            </span>
            <button
              onClick={() => {
                onStartQuiz(topic);
                navigate(`/quiz/${topic.id}`);
              }}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all flex items-center gap-1.5 shadow-xs"
            >
              <span>Launch Quiz Session</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="space-y-3">
            {topic.quiz?.map((q, idx) => (
              <div 
                key={q.id || idx}
                className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-subtle"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>Question 0{idx + 1}</span>
                  <span>{q.options?.length} Options</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  {q.question}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {q.options?.map((opt, optIdx) => (
                    <div 
                      key={optIdx} 
                      className="text-xs text-slate-600 bg-slate-50 border border-slate-200/80 p-2.5 rounded-lg flex items-start gap-2"
                    >
                      <span className="font-mono text-slate-400 font-bold">
                        {String.fromCharCode(65 + optIdx)}.
                      </span>
                      <span className="line-clamp-2">{opt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Call to Action for Active Recall */}
      <div className="pt-6 border-t border-slate-200">
        <div className="p-6 bg-gradient-to-tr from-indigo-50 via-white to-blue-50 border border-indigo-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-card">
          <div className="space-y-1">
            <div className="text-base font-bold text-slate-900">
              Ready to verify your retention of this material?
            </div>
            <div className="text-xs text-slate-600">
              Take the {topic.quiz?.length || 4}-question recall quiz now to measure conceptual durability.
            </div>
          </div>
          <button
            onClick={() => {
              onStartQuiz(topic);
              navigate(`/quiz/${topic.id}`);
            }}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold tracking-wide transition-all flex items-center justify-center gap-2 self-start sm:self-auto shadow-md shadow-indigo-600/20"
          >
            <span>Start Recall Quiz</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Interactive Keyword Inspector Popover / Modal */}
      {activeKeywordModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                {activeKeywordModal.category || "Core Concept"}
              </span>
              <button
                onClick={() => setActiveKeywordModal(null)}
                className="text-slate-400 hover:text-slate-800 p-1 rounded-md"
              >
                <X size={18} />
              </button>
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              {activeKeywordModal.term}
            </h3>

            <p className="text-sm text-slate-700 leading-relaxed">
              {activeKeywordModal.fullDef || activeKeywordModal.shortDef}
            </p>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveKeywordModal(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
