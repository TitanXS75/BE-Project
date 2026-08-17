"use client";

import React from "react";
import { ShieldCheck, BookOpen, Package, Users2, Layers } from "lucide-react";
import { AxiomLogo } from "./AxiomLogo";
import LogoLoop from "./LogoLoop";
import FlowingMenu, { FlowingMenuItem } from "./FlowingMenu";
import Strands from "./Strands";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiPython,
  SiFastapi,
  SiOllama,
  SiPytorch,
  SiGooglegemini,
  SiFramer
} from "react-icons/si";

interface WelcomeScreenProps {
  onStart: () => void;
  onHowItWorks?: () => void;
  onDownloadExe?: () => void;
}

const techStackLogos = [
  {
    node: (
      <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/[0.06] border border-white/[0.12] hover:border-white/30 hover:bg-white/[0.12] transition-all shadow-md">
        <SiNextdotjs className="h-5 w-5 text-white" />
        <span className="text-sm sm:text-base font-bold text-[#f5f5f7]">Next.js 16</span>
      </div>
    ),
    title: "Next.js",
    href: "https://nextjs.org"
  },
  {
    node: (
      <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/[0.06] border border-white/[0.12] hover:border-white/30 hover:bg-white/[0.12] transition-all shadow-md">
        <SiReact className="h-5 w-5 text-[#61DAFB]" />
        <span className="text-sm sm:text-base font-bold text-[#f5f5f7]">React 19</span>
      </div>
    ),
    title: "React",
    href: "https://react.dev"
  },
  {
    node: (
      <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/[0.06] border border-white/[0.12] hover:border-white/30 hover:bg-white/[0.12] transition-all shadow-md">
        <SiTypescript className="h-5 w-5 text-[#3178C6]" />
        <span className="text-sm sm:text-base font-bold text-[#f5f5f7]">TypeScript</span>
      </div>
    ),
    title: "TypeScript",
    href: "https://www.typescriptlang.org"
  },
  {
    node: (
      <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/[0.06] border border-white/[0.12] hover:border-white/30 hover:bg-white/[0.12] transition-all shadow-md">
        <SiTailwindcss className="h-5 w-5 text-[#38BDF8]" />
        <span className="text-sm sm:text-base font-bold text-[#f5f5f7]">Tailwind CSS v4</span>
      </div>
    ),
    title: "Tailwind CSS",
    href: "https://tailwindcss.com"
  },
  {
    node: (
      <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/[0.06] border border-white/[0.12] hover:border-white/30 hover:bg-white/[0.12] transition-all shadow-md">
        <SiPython className="h-5 w-5 text-[#3776AB]" />
        <span className="text-sm sm:text-base font-bold text-[#f5f5f7]">Python 3.13</span>
      </div>
    ),
    title: "Python",
    href: "https://python.org"
  },
  {
    node: (
      <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/[0.06] border border-white/[0.12] hover:border-white/30 hover:bg-white/[0.12] transition-all shadow-md">
        <SiFastapi className="h-5 w-5 text-[#059669]" />
        <span className="text-sm sm:text-base font-bold text-[#f5f5f7]">FastAPI</span>
      </div>
    ),
    title: "FastAPI",
    href: "https://fastapi.tiangolo.com"
  },
  {
    node: (
      <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/[0.06] border border-white/[0.12] hover:border-white/30 hover:bg-white/[0.12] transition-all shadow-md">
        <SiOllama className="h-5 w-5 text-white" />
        <span className="text-sm sm:text-base font-bold text-[#f5f5f7]">Ollama Engine</span>
      </div>
    ),
    title: "Ollama",
    href: "https://ollama.com"
  },
  {
    node: (
      <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/[0.06] border border-white/[0.12] hover:border-white/30 hover:bg-white/[0.12] transition-all shadow-md">
        <SiPytorch className="h-5 w-5 text-[#EE4C2C]" />
        <span className="text-sm sm:text-base font-bold text-[#f5f5f7]">PyTorch</span>
      </div>
    ),
    title: "PyTorch",
    href: "https://pytorch.org"
  },
  {
    node: (
      <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/[0.06] border border-white/[0.12] hover:border-white/30 hover:bg-white/[0.12] transition-all shadow-md">
        <SiGooglegemini className="h-5 w-5 text-[#4E75F6]" />
        <span className="text-sm sm:text-base font-bold text-[#f5f5f7]">Google Gemini</span>
      </div>
    ),
    title: "Google Gemini",
    href: "https://ai.google.dev"
  },
  {
    node: (
      <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/[0.06] border border-white/[0.12] hover:border-white/30 hover:bg-white/[0.12] transition-all shadow-md">
        <SiFramer className="h-5 w-5 text-[#0055FF]" />
        <span className="text-sm sm:text-base font-bold text-[#f5f5f7]">Motion React</span>
      </div>
    ),
    title: "Motion",
    href: "https://motion.dev"
  }
];

const developerItems: FlowingMenuItem[] = [
  {
    text: "Sarthak",
    fullName: "Sarthak Sontakke",
    role: "UI/UX & Overall Lead",
    link: "#"
  },
  {
    text: "Rohit",
    fullName: "Rohit Sable",
    role: "Backend & AI Architecture",
    link: "#"
  },
  {
    text: "Shubham",
    fullName: "Shubham Gupta",
    role: "Backend & RAG Pipeline",
    link: "#"
  },
  {
    text: "Himanshu",
    fullName: "Himanshu Kejdiwal",
    role: "System Integration & Architecture",
    link: "#"
  }
];

export function WelcomeScreen({ onStart, onHowItWorks, onDownloadExe }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen w-full flex flex-col justify-between py-6 px-4 sm:px-10 lg:px-16 bg-black text-[#f5f5f7] relative overflow-x-hidden">
      {/* Ambient background glows */}
      {/* Ambient background glows - Rich Indigo/Purple Glass Illumination */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#6366f1]/25 via-[#a855f7]/20 to-transparent blur-[140px] rounded-full" />
      <div className="pointer-events-none absolute top-1/4 left-10 w-[500px] h-[350px] bg-[#3b82f6]/15 blur-[150px] rounded-full" />
      <div className="pointer-events-none absolute top-1/3 right-10 w-[600px] h-[350px] bg-[#8b5cf6]/15 blur-[150px] rounded-full" />
      <div className="pointer-events-none absolute bottom-10 left-10 w-[500px] h-[300px] bg-[#06b6d4]/08 blur-[140px] rounded-full" />

      {/* Main Hero Content Area - Left-Aligned Split with Strands on Right */}
      <main className="w-full max-w-[1440px] mx-auto my-auto py-8 sm:py-12 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Axiom AI Brand Header with Enlarged Logo */}
            <div className="flex items-center gap-3.5 sm:gap-4.5 mb-6 sm:mb-7 group">
              <div className="relative flex items-center justify-center">
                <AxiomLogo className="h-12 w-12 sm:h-15 sm:w-15 transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-[#3b82f6]/30 blur-xl rounded-full -z-10 group-hover:bg-[#a855f7]/40 transition-colors" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-none">
                  Axiom AI
                </span>
                <span className="text-[11px] sm:text-xs text-[#86868b] tracking-wider uppercase font-mono mt-1.5 font-semibold">
                  Curriculum AI Core
                </span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-5xl lg:text-[50px] font-bold tracking-tight text-white leading-[1.12] max-w-2xl">
              Curriculum Grounded AI <br />
              <span className="text-[#86868b]">
                Engineered for Your Laptop.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#86868b] max-w-xl mt-4 mb-7 leading-relaxed font-normal">
              Master university courses with local models strictly bounded by your syllabus and textbooks.
              Zero cloud data leaks, instant LanceDB vector retrieval, and portable <code className="text-[#f5f5f7] bg-[#1c1c1e] px-2 py-0.5 rounded border border-white/10 font-mono text-xs sm:text-sm font-medium">.rssh</code> packages.
            </p>

            {/* Action Buttons: Exact styling from Reference Image */}
            <div className="flex flex-wrap items-center gap-3.5">
              <button
                onClick={onStart}
                className="px-7 py-3 rounded-2xl bg-white text-black font-semibold text-sm sm:text-base hover:bg-neutral-100 hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-lg"
              >
                Get started
              </button>

              <button
                onClick={onHowItWorks}
                className="px-6 py-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-white/90 hover:text-white border border-white/10 hover:border-white/20 text-sm sm:text-base font-medium backdrop-blur-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-md"
              >
                Learn more
              </button>

              <button
                onClick={onDownloadExe}
                className="px-6 py-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] text-[#a1a1aa] hover:text-white border border-white/[0.08] hover:border-white/15 text-sm sm:text-base font-medium backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                Download EXE
              </button>
            </div>
          </div>

          {/* Right Hero Column: Strands WebGL Graphic */}
          <div className="lg:col-span-5 w-full flex items-center justify-center my-auto">
            <div className="w-full max-w-[480px] h-[400px] sm:h-[460px] lg:h-[480px] relative flex items-center justify-center pointer-events-none">
              <Strands
                colors={["#3B82F6", "#7C3AED", "#06B6D4"]}
                count={3}
                speed={0.5}
                amplitude={1}
                waviness={1}
                thickness={0.7}
                glow={2.6}
                taper={3}
                spread={1}
                intensity={0.65}
                saturation={2}
                opacity={1}
                scale={1.5}
                glass
                refraction={1}
                dispersion={1}
                glassSize={1.0}
                hueShift={0}
              />
            </div>
          </div>
        </div>

        {/* 3 Feature Cards - Full-Width Responsive 3-Column Grid */}
        <div id="axiom-features" className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full text-left mb-6 scroll-mt-24">
          <div className="apple-card p-6 rounded-3xl border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all shadow-xl">
            <div>
              <div className="h-11 w-11 rounded-2xl bg-[#0071e3]/10 border border-[#0071e3]/20 flex items-center justify-center mb-4 text-[#0071e3]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2 tracking-tight">
                100% Air-Gapped Autonomy
              </h3>
              <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                Runs entirely on local hardware via Ollama. No external telemetry, zero subscription fees, and complete offline privacy.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06] text-xs font-mono text-[#0071e3]">
              Private • Local LLM Engine
            </div>
          </div>

          <div className="apple-card p-6 rounded-3xl border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all shadow-xl">
            <div>
              <div className="h-11 w-11 rounded-2xl bg-[#30d158]/10 border border-[#30d158]/20 flex items-center justify-center mb-4 text-[#30d158]">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2 tracking-tight">
                Zero Hallucinations
              </h3>
              <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                Every AI response is strictly grounded and cited to prescribed textbooks, university lecture slides, and syllabus modules.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06] text-xs font-mono text-[#30d158]">
              Grounded • LanceDB Vectors
            </div>
          </div>

          <div className="apple-card p-6 rounded-3xl border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all shadow-xl">
            <div>
              <div className="h-11 w-11 rounded-2xl bg-[#ff9f0a]/10 border border-[#ff9f0a]/20 flex items-center justify-center mb-4 text-[#ff9f0a]">
                <Package className="h-5 w-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2 tracking-tight">
                Portable .rssh Bundles
              </h3>
              <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                Instructors compile and distribute self-contained subject archives containing full relational graphs and vector indices.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06] text-xs font-mono text-[#ff9f0a]">
              Portable • SQLite + LanceDB
            </div>
          </div>
        </div>
      </main>

      {/* SECTION 2: BIG & PROMINENT TECH STACK SECTION (FULL-WIDTH) */}
      <section className="w-full max-w-[1440px] mx-auto pt-10 pb-10 border-t border-white/[0.1] z-10 shrink-0">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/10 mb-2">
            <Layers className="h-4 w-4 text-[#0071e3]" />
            <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-white">
              Core Tech Stack
            </span>
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white mt-1">
            Powered by Modern Open-Source &amp; Local AI Architecture
          </h2>
          <p className="text-xs sm:text-sm text-[#86868b] mt-1">
            Engineered with high-performance frameworks and air-gapped local AI runtimes
          </p>
        </div>

        <div className="relative w-full overflow-hidden rounded-3xl py-4 bg-white/[0.02] border border-white/[0.06] shadow-2xl">
          <LogoLoop
            logos={techStackLogos}
            speed={35}
            direction="left"
            logoHeight={48}
            gap={28}
            pauseOnHover={true}
            scaleOnHover={true}
            fadeOut={true}
            fadeOutColor="#000000"
            ariaLabel="Axiom Technology Stack"
          />
        </div>
      </section>

      {/* SECTION 3: FULL-WIDTH DEVELOPERS SECTION */}
      <section className="w-full max-w-[1440px] mx-auto pt-8 pb-10 border-t border-white/[0.08] z-10">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <Users2 className="h-4 w-4 text-[#0071e3]" />
            <h3 className="text-xs sm:text-sm font-bold tracking-wider text-white uppercase">
              Project Development Team
            </h3>
          </div>
          <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[#86868b]">
            BE Project
          </span>
        </div>

        <div className="h-[210px] sm:h-[240px] w-full rounded-3xl overflow-hidden border border-white/10 shadow-xl relative bg-[#0e0e10]">
          <FlowingMenu
            items={developerItems}
            speed={12}
            textColor="#f5f5f7"
            bgColor="#0e0e10"
            marqueeBgColor="#0071e3"
            marqueeTextColor="#ffffff"
            borderColor="rgba(255, 255, 255, 0.08)"
          />
        </div>
      </section>
    </div>
  );
}
