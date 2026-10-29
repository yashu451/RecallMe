import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  Brain, 
  CheckCircle2, 
  Zap, 
  Flame, 
  Clock, 
  BookOpen, 
  Layers, 
  ShieldCheck, 
  TrendingUp, 
  GraduationCap,
  Play,
  RotateCcw,
  Check,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'quiz' | 'glossary'
  const [interactiveQuizAnswer, setInteractiveQuizAnswer] = useState(null);

  return (
    <div className="bg-white overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-b from-indigo-100/50 via-blue-50/30 to-transparent blur-3xl -z-10 pointer-events-none" />

        {/* Announcement Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold shadow-xs mb-6 animate-fadeIn">
          <Sparkles size={14} className="text-indigo-600" />
          <span>Active Recall & Spaced Repetition Engine</span>
          <span className="w-1 h-1 rounded-full bg-indigo-400"></span>
          <span className="text-indigo-600 font-normal">Backed by Cognitive Science</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] max-w-5xl mx-auto">
          Turn dense lectures and papers into{' '}
          <span className="gradient-text">permanent recall.</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
          Stop passive re-reading. Paste raw syllabus excerpts, research papers, or lecture notes. RecallMe extracts structured summaries, key concept glossaries, and active recall quizzes in seconds.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/signup"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Get Started Free</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex items-center justify-center gap-2"
          >
            <span>Explore Live Demo</span>
            <ChevronRight size={16} className="text-slate-400" />
          </Link>
        </div>

        {/* Social Proof / Metrics */}
        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-slate-900 font-bold text-base">120,000+</span>
            <span>Concepts Mastered</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-900 font-bold text-base">92.4%</span>
            <span>Average Retention</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-900 font-bold text-base">4.9 / 5</span>
            <span>Student Rating</span>
          </div>
        </div>

        {/* 2. INTERACTIVE PRODUCT PREVIEW */}
        <div className="mt-14 relative max-w-5xl mx-auto">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden text-left">
            
            {/* Window bar */}
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <span className="ml-2 text-xs font-mono text-slate-500 font-medium">
                  recallme.app/study/transformer-architecture
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Active Session
                </span>
              </div>
            </div>

            {/* Interactive Preview Header & Tabs */}
            <div className="p-6 border-b border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold text-[11px]">
                      Machine Learning
                    </span>
                    <span>•</span>
                    <span>CS 224N</span>
                    <span>•</span>
                    <span>7 min read</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Transformer Architecture & Scaled Dot-Product Attention
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg self-start sm:self-auto">
                  <button
                    onClick={() => setActiveTab('notes')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                      activeTab === 'notes' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Structured Notes
                  </button>
                  <button
                    onClick={() => setActiveTab('quiz')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                      activeTab === 'quiz' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Active Quiz
                  </button>
                  <button
                    onClick={() => setActiveTab('glossary')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                      activeTab === 'glossary' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Glossary
                  </button>
                </div>
              </div>
            </div>

            {/* Tabbed Preview Content */}
            <div className="p-6 bg-slate-50/50 min-h-[280px]">
              {activeTab === 'notes' && (
                <div className="space-y-4">
                  <div className="p-4 bg-indigo-50/80 border border-indigo-100 rounded-xl space-y-2">
                    <div className="text-xs font-bold text-indigo-900 flex items-center gap-1.5 uppercase tracking-wider">
                      <Sparkles size={14} className="text-indigo-600" />
                      <span>Executive Synthesis</span>
                    </div>
                    <p className="text-xs sm:text-sm text-indigo-950 leading-relaxed">
                      Scaled Dot-Product attention computes Attention(Q, K, V) = softmax(QK^T / √d_k)V. The scaling factor √d_k prevents vanishing gradients in high dimensional softmax activations.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-slate-800">
                      1. The Query-Key-Value Dynamic
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Instead of sequential recurrence with O(N) hidden state updates, the Transformer treats sequence transduction as soft retrieval across projected Query, Key, and Value vectors.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'quiz' && (
                <div className="space-y-4 max-w-xl mx-auto py-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Question 1 of 5</span>
                    <span className="text-indigo-600 font-semibold">Active Recall</span>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-slate-900">
                    Why do Transformers scale query-key dot products by 1/√d_k?
                  </h4>

                  <div className="space-y-2 pt-1">
                    {[
                      { id: 0, text: "To reduce matrix computation complexity from O(N²) to linear O(N)", correct: false },
                      { id: 1, text: "To normalize dot product variance back to 1.0 and prevent vanishing softmax gradients", correct: true },
                      { id: 2, text: "To compress sequence length and remove redundant stopwords", correct: false }
                    ].map((opt) => {
                      const isSelected = interactiveQuizAnswer === opt.id;
                      const isSubmitted = interactiveQuizAnswer !== null;

                      let btnStyle = "bg-white border-slate-200 text-slate-700 hover:border-slate-300";
                      if (isSubmitted) {
                        if (opt.correct) btnStyle = "bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold";
                        else if (isSelected) btnStyle = "bg-rose-50 border-rose-300 text-rose-900 line-through";
                      }

                      return (
                        <button
                          key={opt.id}
                          onClick={() => setInteractiveQuizAnswer(opt.id)}
                          className={`w-full p-3 rounded-lg border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt.text}</span>
                          {isSubmitted && opt.correct && <Check size={16} className="text-emerald-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {interactiveQuizAnswer !== null && (
                    <div className="text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200 animate-fadeIn">
                      <strong className="text-slate-900 font-semibold">Active Retrieval Feedback:</strong> Components of high-dimensional vectors yield larger dot products, driving softmax into saturated flat gradients. Dividing by √d_k normalizes variance to 1.0.
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'glossary' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Scaled Dot-Product</span>
                      <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded">Mechanism</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Softmax-based similarity weighted extraction preventing vanishing gradients in deep attention heads.
                    </p>
                  </div>

                  <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Permutation Equivariance</span>
                      <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded">Property</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Inherent invariance to sequence order that necessitates explicit sinusoidal positional encodings.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

      </section>

      {/* 3. HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Structured Workflow
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Three steps from information overload to mastery
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Transform passive reading into an interactive study cycle designed around synaptic potentiation.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-card space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg">
                01
              </div>
              <h4 className="text-lg font-bold text-slate-900">Paste Your Raw Material</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Paste lecture transcripts, textbook chapters, or complex research paper excerpts. RecallMe supports code, equations, and long-form text.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-card space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                02
              </div>
              <h4 className="text-lg font-bold text-slate-900">Automated Semantic Synthesis</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our engine extracts core takeaways, organizes hierarchical sections, isolates domain keywords, and defines critical terminology.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-card space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg">
                03
              </div>
              <h4 className="text-lg font-bold text-slate-900">Lock in Retention with Quizzes</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Test yourself through active recall quizzes. Instant explanations and spaced repetition intervals guarantee long-term retention.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. FEATURES SECTION */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Core Capabilities
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Designed for serious students and researchers
          </h3>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Every feature is purpose-built to eliminate the illusion of competence and build genuine conceptual intuition.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-subtle hover:border-indigo-300 hover:shadow-card transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen size={20} />
            </div>
            <h4 className="text-base font-bold text-slate-900">Executive Synthesis</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Clear headings, bullet takeaways, and structured reading notes with one-click Markdown export.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-subtle hover:border-indigo-300 hover:shadow-card transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Zap size={20} />
            </div>
            <h4 className="text-base font-bold text-slate-900">Active Recall Testing</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Conceptual multiple-choice retrieval prompts that force your brain to reconstruct memories instead of recognizing them.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-subtle hover:border-indigo-300 hover:shadow-card transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Flame size={20} />
            </div>
            <h4 className="text-base font-bold text-slate-900">Duolingo-Style Streaks</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Stay motivated with daily streaks, retention velocity metrics, and automated spaced review reminders.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-subtle hover:border-indigo-300 hover:shadow-card transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Layers size={20} />
            </div>
            <h4 className="text-base font-bold text-slate-900">Domain Glossaries</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Interactive terminology with phonetic pronunciations, part-of-speech context, and illustrative examples.
            </p>
          </div>

        </div>

      </section>

      {/* 5. THE SCIENCE SECTION */}
      <section id="science" className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold">
                <Brain size={14} />
                <span>Cognitive Neuroscience Foundations</span>
              </div>

              <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Why passive re-reading fails, and active recall wins
              </h3>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Highlighting and re-reading textbooks triggers the <em>fluency heuristic</em>—you recognize the words, falsely convincing yourself you understand the concepts.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mt-0.5 shrink-0">
                    <Check size={12} />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300">
                    <strong className="text-white">Long-Term Potentiation (LTP):</strong> Actively retrieving knowledge triggers calcium influx via NMDA receptors, signaling structural synaptic consolidation.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mt-0.5 shrink-0">
                    <Check size={12} />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300">
                    <strong className="text-white">The Ebbinghaus Forgetting Curve:</strong> Without spaced retrieval, 70% of new information decays within 48 hours. Spaced recall resets the exponential decay rate.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  <span>Build your active recall decks now</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Visual Retention Comparison */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-6">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                1-Week Retention Rate Comparison
              </h4>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-300">RecallMe (Active Recall + Spaced Testing)</span>
                    <span className="text-emerald-400 font-bold">88% Retained</span>
                  </div>
                  <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-400">Passive Flashcard Flipping</span>
                    <span className="text-amber-400 font-bold">42% Retained</span>
                  </div>
                  <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-400">Re-reading Textbook / Highlighting</span>
                    <span className="text-rose-400 font-bold">18% Retained</span>
                  </div>
                  <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-rose-400 h-full rounded-full" style={{ width: '18%' }}></div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700 text-xs text-slate-400 italic">
                *Empirical findings consolidated from Roediger & Karpicke (2006) on the testing effect in educational psychology.
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="p-10 sm:p-14 bg-gradient-to-tr from-indigo-700 via-indigo-600 to-blue-600 rounded-3xl text-white shadow-2xl space-y-6 relative overflow-hidden">
          
          <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ready to master your hardest subjects?
          </h3>

          <p className="text-base sm:text-lg text-indigo-100 max-w-xl mx-auto leading-relaxed">
            Join thousands of university students, medical candidates, and engineers using RecallMe daily.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white text-indigo-700 font-bold text-sm shadow-lg hover:bg-indigo-50 transition-all"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-800/60 hover:bg-indigo-800 text-white font-semibold text-sm border border-indigo-400/30 transition-all"
            >
              Log In to Account
            </Link>
          </div>

        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              R
            </div>
            <span className="font-bold text-slate-800 text-sm">RecallMe</span>
            <span>— Active Recall & Conceptual Mastery</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-slate-800 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-slate-800 transition-colors">How It Works</a>
            <a href="#science" className="hover:text-slate-800 transition-colors">The Science</a>
            <Link to="/login" className="hover:text-slate-800 transition-colors">Student Login</Link>
          </div>

          <div>
            © {new Date().getFullYear()} RecallMe EdTech. Built for serious learners.
          </div>

        </div>
      </footer>

    </div>
  );
}
