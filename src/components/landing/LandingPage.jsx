
import React from 'react';
import { Link } from 'react-router-dom';
import TiltCard from '../common/TiltCard';
import {
  ArrowRight,
  Brain,
  Zap,
  Flame,
  Clock,
  BookOpen,
  Layers,
  TrendingUp,
  Check
} from 'lucide-react';

export default function LandingPage() {

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
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/signup"
            className="btn-tactile w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#C65D32] hover:bg-[#B64E24] text-white font-bold text-sm shadow-card flex items-center justify-center gap-2 group"
          >
            <span>Get Started Free</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            to="/quiz"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#222222] hover:bg-[#333333] text-white font-bold text-sm shadow-card transition-all flex items-center justify-center gap-2"
          >
            <Brain size={16} />
            <span>Test Your Memory (Quiz)</span>
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

        {/* 2. SIMPLE VISUAL: Paste Content → Generate Notes → Take Quiz */}
        <div className="mt-14 relative max-w-4xl mx-auto">
          <TiltCard
            maxTilt={2.5}
            scale={1.005}
            glare={true}
            className="rounded-2xl border border-[#E7E0D8] bg-white p-6 sm:p-8 shadow-card text-left card-interactive"
          >
            {/* Top Bar / Label */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#E7E0D8]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C65D32]"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#222222]">
                  How RecallMe Works
                </span>
              </div>
              <span className="text-xs font-mono text-[#706B66] bg-[#FAF8F5] border border-[#E7E0D8] px-2.5 py-1 rounded-md">
                3-Step Learning Loop
              </span>
            </div>

            {/* Visual Steps Flow */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">

              {/* Step 1: Paste Content */}
              <div className="flex-1 p-5 rounded-xl bg-[#FAF8F5] border border-[#E7E0D8] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-[#222222] text-[#F7F3ED] flex items-center justify-center font-bold text-xs">
                    01
                  </span>
                  <span className="text-[11px] font-mono font-bold text-[#706B66] uppercase">Input</span>
                </div>
                <h3 className="font-bold text-[#222222] text-base">
                  Paste Content
                </h3>
                <p className="text-xs text-[#706B66] leading-relaxed">
                  Raw lecture notes, paper excerpts, or chapter readings.
                </p>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center justify-center text-[#C65D32] shrink-0 px-1">
                <ArrowRight size={22} />
              </div>

              {/* Step 2: Generate Notes */}
              <div className="flex-1 p-5 rounded-xl bg-[#FBF4EE] border border-[#ECD0C0] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-[#C65D32] text-white flex items-center justify-center font-bold text-xs">
                    02
                  </span>
                  <span className="text-[11px] font-mono font-bold text-[#C65D32] uppercase">Synthesis</span>
                </div>
                <h3 className="font-bold text-[#222222] text-base">
                  Generate Notes
                </h3>
                <p className="text-xs text-[#706B66] leading-relaxed">
                  Structured summaries, key terms, and glossary definitions.
                </p>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center justify-center text-[#C65D32] shrink-0 px-1">
                <ArrowRight size={22} />
              </div>

              {/* Step 3: Take Quiz */}
              <div className="flex-1 p-5 rounded-xl bg-[#FAF5EF] border border-[#E8B786] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-[#222222] text-[#E8B786] flex items-center justify-center font-bold text-xs">
                    03
                  </span>
                  <span className="text-[11px] font-mono font-bold text-[#7A3216] uppercase">Retention</span>
                </div>
                <h3 className="font-bold text-[#222222] text-base">
                  Take Quiz
                </h3>
                <p className="text-xs text-[#706B66] leading-relaxed">
                  Active recall tests with explanations and spaced repetition.
                </p>
              </div>

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

          {/* ⬇️⬇️ KEEP YOUR EXISTING CODE FROM HERE DOWN ⬇️⬇️
              Starting with the third card ("Daily Recall Streaks") and everything after it.
              Do NOT delete it. Only the part ABOVE this line is replaced. */}