import React from 'react';
import { Sparkles, BookOpen, Lightbulb, Send, CheckCircle2, Layers, ArrowUpRight } from 'lucide-react';

export default function DashboardHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FAF8F5] via-[#FFFDFB] to-[#FAF4EE] border border-[#E7E0D8] p-6 sm:p-8 lg:p-10 shadow-card card-tactile">
      {/* Ambient background glows */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#E8B786]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#C65D32]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Content & Vision */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF5EF] border border-[#E8B786] text-[#7A3216] text-[11px] font-bold tracking-wider uppercase shadow-xs">
            <Sparkles size={12} className="text-[#C65D32]" />
            <span>Active Recall & Permanent Retention</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#222222] tracking-tight leading-tight">
            Turn Everyday Learning into Permanent Knowledge
          </h2>

          <p className="text-sm sm:text-base text-[#706B66] leading-relaxed max-w-xl">
            Synthesize lecture transcripts, textbook chapters, and research notes into structured memory anchors. RecallMe combines cognitive extraction with active retrieval practice to consolidate what you learn.
          </p>

          {/* Value Badges */}
          <div className="pt-2 flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E7E0D8] text-xs font-semibold text-[#252525] shadow-xs">
              <CheckCircle2 size={13} className="text-[#38765C]" />
              <span>Cognitive Extraction</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E7E0D8] text-xs font-semibold text-[#252525] shadow-xs">
              <CheckCircle2 size={13} className="text-[#C65D32]" />
              <span>Active Retrieval Quizzes</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E7E0D8] text-xs font-semibold text-[#252525] shadow-xs">
              <CheckCircle2 size={13} className="text-[#E8B786]" />
              <span>Long-Term Consolidation</span>
            </div>
          </div>
        </div>

        {/* Right Side: Creative 3D Learning Illustration (No Humans, No Fixed Subject Names) */}
        <div className="lg:col-span-5 relative flex items-center justify-center min-h-[260px] sm:min-h-[290px] select-none pointer-events-none">
          
          {/* Central Warm Radiant Halo */}
          <div className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-[#E8B786]/30 via-[#C65D32]/20 to-transparent blur-2xl animate-glow-pulse" />

          {/* Outer Rotating Knowledge Ring */}
          <div className="absolute w-60 h-60 rounded-full border border-dashed border-[#E8B786]/60 animate-spin" style={{ animationDuration: '45s' }} />

          {/* Element 1: Glowing Lightbulb of Insight (Top Center) */}
          <div className="absolute top-2 right-12 z-20 animate-float-fast">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFF8EE] to-[#FAF5EF] border border-[#E8B786] shadow-card flex items-center justify-center relative group">
              <div className="absolute inset-0 bg-[#C65D32]/10 rounded-2xl blur-sm" />
              <Lightbulb size={26} className="text-[#C65D32] fill-[#E8B786]/30 relative z-10" />
              {/* Radiating Light Rays */}
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#C65D32]" />
              <span className="absolute -bottom-1 -left-1 w-1.5 h-1.5 rounded-full bg-[#E8B786]" />
            </div>
          </div>

          {/* Element 2: Floating 3D Notebook (Center-Left) */}
          <div className="absolute left-6 top-8 z-10 animate-float-slow transform -rotate-6">
            <div className="w-36 h-44 rounded-2xl bg-[#222222] text-[#F7F3ED] p-3 shadow-xl border-l-4 border-[#C65D32] relative flex flex-col justify-between">
              {/* Notebook Header & Ribbon */}
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#C65D32]" />
                  <span className="w-2 h-2 rounded-full bg-[#E8B786]" />
                </div>
                <div className="w-2.5 h-6 bg-[#C65D32] rounded-b-sm absolute right-4 -top-1" />
              </div>

              {/* Notebook Abstract Content Lines */}
              <div className="space-y-2 py-2">
                <div className="h-2 bg-white/20 rounded w-4/5" />
                <div className="h-2 bg-white/15 rounded w-full" />
                <div className="h-2 bg-white/15 rounded w-3/4" />
                <div className="h-2 bg-[#E8B786]/40 rounded w-1/2" />
              </div>

              {/* Bottom Badge */}
              <div className="flex items-center justify-between text-[9px] font-mono text-[#E8B786] pt-1 border-t border-white/10">
                <span>RECALL DECK</span>
                <span>★ ACTIVE</span>
              </div>
            </div>
          </div>

          {/* Element 3: Ascending Paper Plane (Top-Right) */}
          <div className="absolute top-0 right-4 z-30 animate-float-medium transform rotate-12">
            <div className="w-12 h-12 rounded-xl bg-white border border-[#E7E0D8] shadow-md flex items-center justify-center">
              <Send size={20} className="text-[#C65D32] transform -rotate-45 translate-x-0.5" />
            </div>
            {/* Dotted Flight Trail */}
            <div className="absolute -bottom-6 -left-8 w-12 h-6 border-b-2 border-l-2 border-dotted border-[#C65D32]/40 rounded-bl-full pointer-events-none" />
          </div>

          {/* Element 4: Angled 3D Study Card (Bottom-Right) */}
          <div className="absolute right-8 bottom-3 z-20 animate-float-medium transform rotate-3">
            <div className="w-40 rounded-2xl bg-white border border-[#E7E0D8] p-3.5 shadow-card space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#C65D32] bg-[#FAF5EF] px-1.5 py-0.5 rounded border border-[#E8B786]">
                  Key Concept
                </span>
                <span className="w-2 h-2 rounded-full bg-[#38765C]" />
              </div>
              <div className="space-y-1.5">
                <div className="h-2.5 bg-[#222222] rounded w-3/4" />
                <div className="h-2 bg-[#FAF8F5] border border-[#E7E0D8] rounded w-full" />
                <div className="h-2 bg-[#FAF8F5] border border-[#E7E0D8] rounded w-5/6" />
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#38765C] font-bold pt-1 border-t border-[#E7E0D8]">
                <span>Retention: 95%</span>
                <CheckCircle2 size={12} />
              </div>
            </div>
          </div>

          {/* Element 5: Floating Open Book (Bottom-Left) */}
          <div className="absolute left-16 bottom-0 z-30 animate-float-fast transform -rotate-3">
            <div className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#FAF8F5] to-white border border-[#E7E0D8] shadow-subtle flex items-center gap-2">
              <BookOpen size={16} className="text-[#C65D32]" />
              <div className="space-y-1">
                <div className="w-12 h-1.5 bg-[#222222]/80 rounded" />
                <div className="w-8 h-1 bg-[#706B66]/60 rounded" />
              </div>
            </div>
          </div>

          {/* Decorative Sparkle Accents */}
          <div className="absolute top-1/2 left-2 text-[#E8B786] animate-pulse">
            <Sparkles size={16} />
          </div>
          <div className="absolute bottom-12 right-2 text-[#C65D32] animate-bounce-subtle">
            <Sparkles size={14} />
          </div>

        </div>

      </div>
    </section>
  );
}
