import React, { useState } from 'react';
import { 
  ArrowLeft, 
  BookOpen, 
  FileText, 
  BookMarked, 
  CheckCircle2, 
  HelpCircle, 
  Share2, 
  Copy, 
  Star, 
  ArrowRight,
  Sparkles,
  Bookmark,
  Check,
  Tag,
  Clock,
  Layers,
  Info,
  X
} from 'lucide-react';

export default function StudyMaterialView({ 
  topic, 
  onBack, 
  onStartQuiz, 
  onToggleStar, 
  onUpdateTopic 
}) {
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
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between border-b border-[#E8E6DE] pb-4">
        <button
          onClick={onBack}
          className="text-xs font-medium text-charcoal-500 hover:text-charcoal-900 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Library</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Star Bookmark */}
          <button
            onClick={() => onToggleStar(topic.id)}
            className={`p-1.5 rounded border transition-colors ${
              topic.isStarred
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'text-charcoal-400 hover:text-charcoal-700 bg-white border-[#E2E0D8]'
            }`}
            title={topic.isStarred ? 'Saved to favorites' : 'Star this topic'}
          >
            <Star size={14} className={topic.isStarred ? 'fill-amber-500' : ''} />
          </button>

          {/* Copy Markdown */}
          <button
            onClick={handleCopyMarkdown}
            className="px-2.5 py-1 rounded text-xs font-medium text-charcoal-700 bg-white hover:bg-[#FAF9F5] border border-[#E2E0D8] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
            <span>{copied ? 'Copied' : 'Export Notes'}</span>
          </button>

          {/* Start Recall Quiz */}
          <button
            onClick={() => onStartQuiz(topic)}
            className="px-3 py-1 rounded text-xs font-semibold text-white bg-[#312E81] hover:bg-[#282566] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <span>Take Recall Quiz</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Article Title & Metadata (Editorial Style) */}
      <header className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#F0EDE4] text-charcoal-800 border border-[#E5E2D8]">
            {topic.subject}
          </span>
          {topic.subjectCode && (
            <span className="text-xs font-mono text-charcoal-500">
              {topic.subjectCode}
            </span>
          )}
          <span className="text-charcoal-300">•</span>
          <span className="text-xs text-charcoal-500 flex items-center gap-1">
            <Clock size={12} />
            {topic.readTime}
          </span>
          <span className="text-charcoal-300">•</span>
          <span className="text-xs text-charcoal-500">
            Last studied {topic.lastStudied}
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-900 font-normal tracking-tight leading-tight">
          {topic.title}
        </h1>

        <p className="text-base text-charcoal-600 font-serif italic leading-relaxed max-w-3xl">
          "{topic.summary}"
        </p>

        {/* Tags */}
        {topic.tags && topic.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            {topic.tags.map((tag, idx) => (
              <span 
                key={idx}
                className="text-[11px] text-charcoal-600 bg-[#F4F2EC] px-2 py-0.5 rounded border border-[#E5E2D8]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Editorial Navigation Tabs */}
      <div className="border-b border-[#E2E0D8] flex items-center gap-6 text-sm">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 font-medium transition-colors relative text-xs sm:text-sm ${
                isActive
                  ? 'text-[#312E81] font-semibold'
                  : 'text-charcoal-500 hover:text-charcoal-900'
              }`}
            >
              <span>{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#312E81]"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Structured Notes */}
      {activeTab === 'notes' && (
        <div className="space-y-8 leading-relaxed text-charcoal-900">
          
          {/* Key Takeaways Callout (Quiet, editorial box) */}
          {topic.takeaways && topic.takeaways.length > 0 && (
            <div className="p-5 bg-[#FAF9F5] border-l-3 border-l-[#312E81] border border-[#E8E6DE] rounded-r-md space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#312E81] flex items-center gap-1.5">
                <Sparkles size={14} />
                <span>Executive Synthesis & Core Principles</span>
              </div>
              <ul className="space-y-2 pt-1">
                {topic.takeaways.map((takeaway, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-charcoal-800 flex items-start gap-2.5">
                    <span className="font-mono text-[#312E81] font-semibold text-xs mt-0.5">
                      0{idx + 1}.
                    </span>
                    <span className="leading-normal">{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quick Clickable Term Inspector */}
          {topic.keywords && topic.keywords.length > 0 && (
            <div className="p-3.5 bg-[#FAF9F5] border border-[#E8E6DE] rounded-md space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-charcoal-500 flex items-center justify-between">
                <span>Core Highlighted Terms in this topic (click for definition):</span>
                <span className="text-[11px] text-charcoal-400">Interactive Glossary</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {topic.keywords.map((kw, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveKeywordModal(kw)}
                    className="text-xs px-2.5 py-1 rounded bg-white hover:bg-[#EEF2FF] text-charcoal-800 hover:text-[#312E81] border border-[#E0DDCF] hover:border-[#C7D2FE] transition-colors font-medium flex items-center gap-1.5 shadow-xs"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#312E81]"></span>
                    <span>{kw.term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sectional content breakdown */}
          <div className="space-y-8 pt-2">
            {topic.sections?.map((section, idx) => (
              <section key={idx} className="space-y-3">
                <h2 className="font-serif text-xl sm:text-2xl text-charcoal-900 font-normal tracking-tight border-b border-[#EBE9E1] pb-2">
                  {section.heading}
                </h2>
                <div className="text-sm sm:text-base text-charcoal-700 leading-relaxed font-sans space-y-3 whitespace-pre-line">
                  {section.content}
                </div>
              </section>
            ))}
          </div>

          {/* Interactive Term Highlight Legend */}
          <div className="p-4 bg-[#F5F3EC] border border-[#E6E3D8] rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-charcoal-700">
              <Info size={15} className="text-[#312E81]" />
              <span>
                Want to drill down into formal definitions? Explore the <strong>Glossary</strong> tab or inspect key terms.
              </span>
            </div>
            <button
              onClick={() => setActiveTab('definitions')}
              className="text-[#312E81] hover:underline font-semibold self-start sm:self-auto"
            >
              View all definitions →
            </button>
          </div>

        </div>
      )}

      {/* TAB 2: Key Concepts */}
      {activeTab === 'keywords' && (
        <div className="space-y-4">
          <div className="text-xs text-charcoal-500">
            Core theoretical foundations, structural invariants, and mechanisms extracted from this material:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {topic.keywords?.map((kw, idx) => (
              <div 
                key={idx}
                className="p-4 bg-white border border-[#E2E0D8] rounded-md shadow-subtle space-y-2 hover:border-[#312E81] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold uppercase px-2 py-0.5 rounded bg-[#EEF2FF] text-[#312E81]">
                    {kw.category}
                  </span>
                  <span className="text-xs font-mono text-charcoal-400">#0{idx + 1}</span>
                </div>
                <h3 className="font-serif text-lg font-medium text-charcoal-900">
                  {kw.term}
                </h3>
                <p className="text-xs text-charcoal-600 leading-relaxed">
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
          <div className="text-xs text-charcoal-500">
            Exact terminology, phonetics, and contextual usage for rigorous academic recall:
          </div>

          <div className="border border-[#E2E0D8] rounded-md bg-white divide-y divide-[#EFECE6] overflow-hidden">
            {topic.definitions?.map((def, idx) => (
              <div key={idx} className="p-4 space-y-2">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <h3 className="font-serif text-lg font-semibold text-charcoal-900">
                    {def.term}
                  </h3>
                  {def.phonetic && (
                    <span className="font-mono text-xs text-charcoal-500">
                      {def.phonetic}
                    </span>
                  )}
                  {def.partOfSpeech && (
                    <span className="text-xs text-charcoal-400 italic">
                      {def.partOfSpeech}
                    </span>
                  )}
                </div>

                <p className="text-sm text-charcoal-800 leading-relaxed">
                  {def.definition}
                </p>

                {def.example && (
                  <div className="text-xs text-charcoal-600 bg-[#FAF9F5] border-l-2 border-[#D8D5CA] p-2 italic">
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
            <span className="text-xs text-charcoal-500">
              Active recall deck consisting of {topic.quiz?.length || 0} multiple-choice conceptual questions.
            </span>
            <button
              onClick={() => onStartQuiz(topic)}
              className="px-3 py-1.5 rounded text-xs font-semibold text-white bg-[#312E81] hover:bg-[#282566] transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span>Launch Quiz Session</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="space-y-3">
            {topic.quiz?.map((q, idx) => (
              <div 
                key={q.id || idx}
                className="p-4 bg-white border border-[#E2E0D8] rounded-md space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs text-charcoal-500 font-mono">
                  <span>Question 0{idx + 1}</span>
                  <span>{q.options?.length} Options</span>
                </div>
                <h4 className="text-sm font-semibold text-charcoal-900 font-sans">
                  {q.question}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {q.options?.map((opt, optIdx) => (
                    <div 
                      key={optIdx} 
                      className="text-xs text-charcoal-600 bg-[#FAF9F5] border border-[#E8E6DE] p-2 rounded flex items-start gap-2"
                    >
                      <span className="font-mono text-charcoal-400 font-medium">
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
      <div className="pt-6 border-t border-[#E8E6DE]">
        <div className="p-5 bg-[#FAF9F5] border border-[#E2E0D8] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-sm font-serif font-medium text-charcoal-900">
              Ready to verify your retention of this material?
            </div>
            <div className="text-xs text-charcoal-500">
              Take the {topic.quiz?.length || 4}-question recall quiz now to measure conceptual durability.
            </div>
          </div>
          <button
            onClick={() => onStartQuiz(topic)}
            className="px-4 py-2 rounded-md bg-[#312E81] hover:bg-[#282566] text-white text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-2 self-start sm:self-auto shadow-xs"
          >
            <span>Start Recall Quiz</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Interactive Keyword Inspector Popover / Modal */}
      {activeKeywordModal && (
        <div className="fixed inset-0 bg-charcoal-900/30 backdrop-blur-[1px] flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-[#E2E0D8] rounded-lg max-w-md w-full p-5 shadow-elevated space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-[#EEF2FF] text-[#312E81]">
                {activeKeywordModal.category || "Core Concept"}
              </span>
              <button
                onClick={() => setActiveKeywordModal(null)}
                className="text-charcoal-400 hover:text-charcoal-800 p-1 rounded"
              >
                <X size={16} />
              </button>
            </div>

            <h3 className="font-serif text-xl font-medium text-charcoal-900">
              {activeKeywordModal.term}
            </h3>

            <p className="text-sm text-charcoal-700 leading-relaxed font-sans">
              {activeKeywordModal.fullDef || activeKeywordModal.shortDef}
            </p>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveKeywordModal(null)}
                className="px-3.5 py-1.5 rounded bg-[#F4F2EC] hover:bg-[#EAE7DC] text-charcoal-800 text-xs font-medium border border-[#E0DDCF] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
