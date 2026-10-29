import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TiltCard from '../common/TiltCard';
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
  TrendingUp, 
  Check,
  ChevronRight
} from 'lucide-react';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'quiz' | 'glossary'
  const [interactiveQuizAnswer, setInteractiveQuizAnswer] = useState(null);

  return (
    <div className="bg-[#F7F3ED] overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        
        {/* Subtle warm decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-[#ECD0C0]/20 blur-3xl -z-10 pointer-events-none" />

        {/* Announcement Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E7E0D8] text-[#222222] text-xs font-bold shadow-xs mb-6">
          <span className="w-2 h-2 rounded-full bg-[#C65D32]"></span>
          <span>Active Recall & Spaced Repetition Engine</span>
          <span className="text-[#E7E0D8]">•</span>
          <span className="text-[#706B66] font-medium">Cognitive Science Backed</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#222222] tracking-tight leading-[1.12] max-w-5xl mx-auto">
          Turn dense lectures and papers into{' '}
          <span className="text-[#C65D32]">permanent recall.</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg lg:text-xl text-[#706B66] max-w-2xl mx-auto leading-relaxed font-normal">
          Stop passive re-reading. Paste raw syllabus excerpts, research papers, or lecture notes. RecallMe extracts structured summaries, key concept glossaries, and active recall quizzes in seconds.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            to="/signup"
            className="btn-tactile w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#C65D32] hover:bg-[#B64E24] text-white font-bold text-sm shadow-card flex items-center justify-center gap-2 group"
          >
            <span>Get Started Free</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            to="/dashboard"
            className="btn-tactile w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#222222] font-bold text-sm border border-[#E7E0D8] shadow-xs flex items-center justify-center gap-2"
          >
            <span>Explore Live Demo</span>
            <ChevronRight size={16} className="text-[#706B66]" />
          </Link>
        </div>

        {/* Metrics Strip */}
        <div className="mt-12 pt-8 border-t border-[#E7E0D8] flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-xs font-semibold text-[#706B66]">
          <div className="flex items-center gap-2">
            <span className="text-[#222222] font-bold text-base">120,000+</span>
            <span>Concepts Mastered</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#C65D32] font-bold text-base">92.4%</span>
            <span>Average Retention</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#222222] font-bold text-base">4.9 / 5</span>
            <span>Student Rating</span>
          </div>
        </div>

        {/* 2. INTERACTIVE PRODUCT PREVIEW WITH 3D DEPTH */}
        <div className="mt-14 relative max-w-5xl mx-auto">
          <TiltCard 
            maxTilt={3} 
            scale={1.008} 
            glare={true}
            className="rounded-2xl border border-[#E7E0D8] bg-white shadow-card text-left card-interactive"
          >
            
            {/* Window title bar */}
            <div className="px-4 py-3 bg-[#FAF8F5] border-b border-[#E7E0D8] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#D8CFC5]"></div>
                <div className="w-3 h-3 rounded-full bg-[#D8CFC5]"></div>
                <div className="w-3 h-3 rounded-full bg-[#D8CFC5]"></div>
                <span className="ml-2 text-xs font-mono text-[#706B66] font-medium">
                  recallme.app/study/transformer-architecture
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#38765C] bg-[#EDF5F1] px-2.5 py-0.5 rounded border border-[#C0DCD0]">
                  Active Session
                </span>
              </div>
            </div>

            {/* Interactive Preview Header & Tabs */}
            <div className="p-6 sm:p-7 border-b border-[#E7E0D8]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#706B66] mb-1.5">
                    <span className="px-2.5 py-0.5 rounded bg-[#FBF4EE] text-[#C65D32] border border-[#ECD0C0] font-bold text-[11px]">
                      Machine Learning
                    </span>
                    <span>•</span>
                    <span>CS 224N</span>
                    <span>•</span>
                    <span>7 min read</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#222222] tracking-tight">
                    Transformer Architecture & Scaled Dot-Product Attention
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 bg-[#F7F3ED] p-1 rounded-xl border border-[#E7E0D8] self-start sm:self-auto">
                  <button
                    onClick={() => setActiveTab('notes')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'notes' ? 'bg-white text-[#C65D32] shadow-xs' : 'text-[#706B66] hover:text-[#222222]'
                    }`}
                  >
                    Structured Notes
                  </button>
                  <button
                    onClick={() => setActiveTab('quiz')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'quiz' ? 'bg-white text-[#C65D32] shadow-xs' : 'text-[#706B66] hover:text-[#222222]'
                    }`}
                  >
                    Active Quiz
                  </button>
                  <button
                    onClick={() => setActiveTab('glossary')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'glossary' ? 'bg-white text-[#C65D32] shadow-xs' : 'text-[#706B66] hover:text-[#222222]'
                    }`}
                  >
                    Glossary
                  </button>
                </div>
              </div>
            </div>

            {/* Tabbed Preview Content */}
            <div className="p-6 sm:p-7 bg-white min-h-[280px]">
              {activeTab === 'notes' && (
                <div className="space-y-4">
                  <div className="p-4 bg-[#FBF4EE] border-l-4 border-l-[#C65D32] border border-[#ECD0C0] rounded-r-xl space-y-1.5">
                    <div className="text-xs font-bold text-[#983E1A] flex items-center gap-1.5 uppercase tracking-wider">
                      <Sparkles size={14} className="text-[#C65D32]" />
                      <span>Executive Synthesis</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#252525] leading-relaxed">
                      Scaled Dot-Product attention computes Attention(Q, K, V) = softmax(QK^T / √d_k)V. The scaling factor √d_k normalizes dot product variance to 1.0, preventing vanishing gradients in deep attention stacks.
                    </p>
                  </div>

                  <div className="space-y-2 pt-1">
                    <h4 className="text-sm font-bold text-[#222222]">
                      1. The Query-Key-Value Dynamic
                    </h4>
                    <p className="text-xs sm:text-sm text-[#706B66] leading-relaxed">
                      Instead of sequential recurrence with O(N) hidden state updates, the Transformer treats sequence transduction as soft retrieval across projected Query, Key, and Value vectors.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'quiz' && (
                <div className="space-y-4 max-w-xl mx-auto py-2">
                  <div className="flex items-center justify-between text-xs text-[#706B66] font-bold">
                    <span>Question 1 of 5</span>
                    <span className="text-[#C65D32] uppercase tracking-wider">Active Recall</span>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-[#222222]">
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

                      let btnStyle = "bg-white border-[#E7E0D8] text-[#252525] hover:bg-[#FAF8F5]";
                      if (isSubmitted) {
                        if (opt.correct) btnStyle = "bg-[#EDF5F1] border-[#C0DCD0] text-[#38765C] font-bold";
                        else if (isSelected) btnStyle = "bg-[#FDF1F1] border-[#F2C6C6] text-[#B93838] line-through";
                      }

                      return (
                        <button
                          key={opt.id}
                          onClick={() => setInteractiveQuizAnswer(opt.id)}
                          className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt.text}</span>
                          {isSubmitted && opt.correct && <Check size={16} className="text-[#38765C] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {interactiveQuizAnswer !== null && (
                    <div className="text-xs text-[#706B66] bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E7E0D8]">
                      <strong className="text-[#222222] font-bold">Active Retrieval Feedback:</strong> Components of high-dimensional vectors yield larger dot products, driving softmax into saturated flat gradients. Dividing by √d_k normalizes variance to 1.0.
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'glossary' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="p-4 bg-white border border-[#E7E0D8] rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#222222]">Scaled Dot-Product</span>
                      <span className="text-[10px] font-mono bg-[#FBF4EE] text-[#C65D32] px-2 py-0.5 rounded font-bold">Mechanism</span>
                    </div>
                    <p className="text-xs text-[#706B66] leading-relaxed">
                      Softmax-based similarity weighted extraction preventing vanishing gradients in deep attention heads.
                    </p>
                  </div>

                  <div className="p-4 bg-white border border-[#E7E0D8] rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#222222]">Permutation Equivariance</span>
                      <span className="text-[10px] font-mono bg-[#FBF4EE] text-[#C65D32] px-2 py-0.5 rounded font-bold">Property</span>
                    </div>
                    <p className="text-xs text-[#706B66] leading-relaxed">
                      Inherent invariance to sequence order that necessitates explicit sinusoidal positional encodings.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </TiltCard>
        </div>

      </section>

      {/* 3. HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-white border-y border-[#E7E0D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-2.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#C65D32]">
              Structured Workflow
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#222222] tracking-tight">
              Three steps from information overload to mastery
            </h3>
            <p className="text-sm sm:text-base text-[#706B66] leading-relaxed">
              Transform passive reading into an interactive study cycle designed around synaptic potentiation.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Step 1 */}
            <div className="card-interactive bg-[#FAF8F5] p-7 rounded-2xl border border-[#E7E0D8] space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#222222] text-[#F7F3ED] flex items-center justify-center font-bold text-lg shadow-xs">
                01
              </div>
              <h4 className="text-lg font-bold text-[#222222]">Paste Your Raw Material</h4>
              <p className="text-sm text-[#706B66] leading-relaxed">
                Paste lecture transcripts, textbook chapters, or complex research paper excerpts. RecallMe supports code, equations, and long-form text.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card-interactive bg-[#FAF8F5] p-7 rounded-2xl border border-[#E7E0D8] space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#C65D32] text-white flex items-center justify-center font-bold text-lg shadow-xs">
                02
              </div>
              <h4 className="text-lg font-bold text-[#222222]">Automated Semantic Synthesis</h4>
              <p className="text-sm text-[#706B66] leading-relaxed">
                Our engine extracts core takeaways, organizes hierarchical sections, isolates domain keywords, and defines critical terminology.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card-interactive bg-[#FAF8F5] p-7 rounded-2xl border border-[#E7E0D8] space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#222222] text-[#E8B786] flex items-center justify-center font-bold text-lg shadow-xs">
                03
              </div>
              <h4 className="text-lg font-bold text-[#222222]">Lock in Retention with Quizzes</h4>
              <p className="text-sm text-[#706B66] leading-relaxed">
                Test yourself through active recall quizzes. Instant explanations and spaced repetition intervals guarantee long-term retention.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. FEATURES SECTION */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#C65D32]">
            Core Capabilities
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-[#222222] tracking-tight">
            Designed for serious students and researchers
          </h3>
          <p className="text-sm sm:text-base text-[#706B66] leading-relaxed">
            Every feature is purpose-built to eliminate the illusion of competence and build genuine conceptual intuition.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="card-interactive p-6 rounded-2xl border border-[#E7E0D8] bg-white shadow-xs hover:border-[#C65D32] transition-colors space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FBF4EE] text-[#C65D32] flex items-center justify-center">
              <BookOpen size={20} />
            </div>
            <h4 className="text-base font-bold text-[#222222]">Executive Synthesis</h4>
            <p className="text-xs text-[#706B66] leading-relaxed">
              Clear headings, bullet takeaways, and structured reading notes with one-click Markdown export.
            </p>
          </div>

          <div className="card-interactive p-6 rounded-2xl border border-[#E7E0D8] bg-white shadow-xs hover:border-[#C65D32] transition-colors space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FBF4EE] text-[#C65D32] flex items-center justify-center">
              <Zap size={20} />
            </div>
            <h4 className="text-base font-bold text-[#222222]">Active Recall Testing</h4>
            <p className="text-xs text-[#706B66] leading-relaxed">
              Conceptual multiple-choice retrieval prompts that force your brain to reconstruct memories instead of recognizing them.
            </p>
          </div>

          <div className="card-interactive p-6 rounded-2xl border border-[#E7E0D8] bg-white shadow-xs hover:border-[#C65D32] transition-colors space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF5EF] text-[#7A3216] border border-[#E8B786] flex items-center justify-center">
              <Flame size={20} className="text-[#C65D32]" />
            </div>
            <h4 className="text-base font-bold text-[#222222]">Daily Recall Streaks</h4>
            <p className="text-xs text-[#706B66] leading-relaxed">
              Stay motivated with daily streaks, retention velocity metrics, and automated spaced review reminders.
            </p>
          </div>

          <div className="card-interactive p-6 rounded-2xl border border-[#E7E0D8] bg-white shadow-xs hover:border-[#C65D32] transition-colors space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FBF4EE] text-[#C65D32] flex items-center justify-center">
              <Layers size={20} />
            </div>
            <h4 className="text-base font-bold text-[#222222]">Domain Glossaries</h4>
            <p className="text-xs text-[#706B66] leading-relaxed">
              Interactive terminology with phonetic pronunciations, part-of-speech context, and illustrative examples.
            </p>
          </div>

        </div>

      </section>

      {/* 5. THE SCIENCE SECTION (Charcoal & Warm Ivory) */}
      <section id="science" className="py-20 bg-[#222222] text-[#F7F3ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#E8B786] text-xs font-bold">
                <Brain size={14} />
                <span>Cognitive Neuroscience Foundations</span>
              </div>

              <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Why passive re-reading fails, and active recall wins
              </h3>

              <p className="text-sm sm:text-base text-[#D8CFC5] leading-relaxed">
                Highlighting and re-reading textbooks triggers the <em>fluency heuristic</em>—you recognize the words, falsely convincing yourself you understand the concepts.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#C65D32] text-white flex items-center justify-center mt-0.5 shrink-0">
                    <Check size={12} />
                  </div>
                  <p className="text-xs sm:text-sm text-[#D8CFC5]">
                    <strong className="text-white">Long-Term Potentiation (LTP):</strong> Actively retrieving knowledge triggers calcium influx via NMDA receptors, signaling structural synaptic consolidation.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#C65D32] text-white flex items-center justify-center mt-0.5 shrink-0">
                    <Check size={12} />
                  </div>
                  <p className="text-xs sm:text-sm text-[#D8CFC5]">
                    <strong className="text-white">The Ebbinghaus Forgetting Curve:</strong> Without spaced retrieval, 70% of new information decays within 48 hours. Spaced recall resets the exponential decay rate.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#E8B786] hover:text-white transition-colors"
                >
                  <span>Build your active recall decks now</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Retention Comparison Graph */}
            <div className="bg-[#2D2A28] border border-[#3D3A37] rounded-2xl p-6 sm:p-8 space-y-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#E8B786]">
                1-Week Retention Rate Comparison
              </h4>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-white">RecallMe (Active Recall & Spaced Testing)</span>
                    <span className="text-[#E8B786]">88% Retained</span>
                  </div>
                  <div className="w-full bg-[#3D3A37] h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#C65D32] h-full rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#D8CFC5]">Passive Flashcard Review</span>
                    <span className="text-[#D8CFC5]">42% Retained</span>
                  </div>
                  <div className="w-full bg-[#3D3A37] h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#E8B786] h-full rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#D8CFC5]">Passive Re-reading / Highlighting</span>
                    <span className="text-[#B93838]">18% Retained</span>
                  </div>
                  <div className="w-full bg-[#3D3A37] h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#B93838] h-full rounded-full" style={{ width: '18%' }}></div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#222222] rounded-xl border border-[#3D3A37] text-xs text-[#D8CFC5] italic">
                *Empirical findings consolidated from Roediger & Karpicke (2006) on the testing effect in educational psychology.
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="p-10 sm:p-14 bg-[#222222] rounded-3xl text-white shadow-card space-y-6 border border-[#222222]">
          
          <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F7F3ED]">
            Ready to master your hardest subjects?
          </h3>

          <p className="text-base sm:text-lg text-[#D8CFC5] max-w-xl mx-auto leading-relaxed font-normal">
            Join thousands of university students, medical candidates, and engineers using RecallMe daily.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              to="/signup"
              className="btn-tactile w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#C65D32] hover:bg-[#B64E24] text-white font-bold text-sm shadow-card"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="btn-tactile w-full sm:w-auto px-7 py-3.5 rounded-xl bg-transparent hover:bg-white/10 text-white font-bold text-sm border border-white/20"
            >
              Log In to Account
            </Link>
          </div>

        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="border-t border-[#E7E0D8] bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#706B66]">
          
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-[#222222] text-[#F7F3ED] flex items-center justify-center font-bold text-xs">
              R
            </div>
            <span className="font-bold text-[#222222] text-sm">RecallMe</span>
            <span>— Active Recall & Conceptual Mastery</span>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <a href="#features" className="hover:text-[#222222] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#222222] transition-colors">How It Works</a>
            <a href="#science" className="hover:text-[#222222] transition-colors">The Science</a>
            <Link to="/login" className="hover:text-[#222222] transition-colors">Student Login</Link>
          </div>

          <div>
            © {new Date().getFullYear()} RecallMe EdTech. Built for serious learners.
          </div>

        </div>
      </footer>

    </div>
  );
}
