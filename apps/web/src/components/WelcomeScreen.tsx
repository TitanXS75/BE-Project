"use client";

import React from "react";
import { ShieldCheck, BookOpen, Package, Users2, Layers } from "lucide-react";
import { AxiomLogo } from "./AxiomLogo";
import LogoLoop from "./LogoLoop";
import FlowingMenu, { FlowingMenuItem } from "./FlowingMenu";
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
    <div className="min-h-screen w-screen flex flex-col justify-between py-8 px-4 sm:px-8 bg-black text-[#f5f5f7] relative overflow-x-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#0071e3]/12 blur-[120px] rounded-full" />

      {/* Top Header Bar - Centered */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-center text-center z-10 shrink-0 mb-2">
        <div className="flex items-center gap-2.5">
          <AxiomLogo className="h-9 w-9 sm:h-10 sm:w-10" />
          <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            AXIOM
          </span>
        </div>
      </header>

      {/* Main Hero Content Area */}
      <main className="w-full max-w-5xl mx-auto flex flex-col items-center text-center my-auto py-8 z-10">
        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight max-w-4xl">
          Curriculum-Grounded AI. <br />
          <span className="text-[#86868b]">
            Engineered for Your Laptop.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-[#86868b] max-w-2xl mt-3.5 mb-7 leading-relaxed font-normal">
          Master university courses with local models strictly bounded by your syllabus and textbooks.
          Zero cloud data leaks, instant LanceDB vector retrieval, and portable <code className="text-[#f5f5f7] bg-[#1c1c1e] px-2 py-0.5 rounded border border-white/10 font-mono text-xs">.rssh</code> packages.
        </p>

        {/* 3 Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-left mb-8">
          <div className="apple-card p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-xl bg-[#1c1c1e] flex items-center justify-center mb-3 border border-white/[0.06]">
                <ShieldCheck className="h-5 w-5 text-[#0071e3]" />
              </div>
              <h3 className="text-base font-semibold text-white mb-1 tracking-tight">
                100% Air-Gapped
              </h3>
              <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                Runs entirely on local hardware via Ollama. No external telemetry, zero subscription fees, and complete offline autonomy.
              </p>
            </div>
          </div>

          <div className="apple-card p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-xl bg-[#1c1c1e] flex items-center justify-center mb-3 border border-white/[0.06]">
                <BookOpen className="h-5 w-5 text-[#30d158]" />
              </div>
              <h3 className="text-base font-semibold text-white mb-1 tracking-tight">
                Zero Hallucinations
              </h3>
              <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                Every AI response is strictly grounded and cited to prescribed textbooks, university slides, and syllabus modules.
              </p>
            </div>
          </div>

          <div className="apple-card p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-xl bg-[#1c1c1e] flex items-center justify-center mb-3 border border-white/[0.06]">
                <Package className="h-5 w-5 text-[#ff9f0a]" />
              </div>
              <h3 className="text-base font-semibold text-white mb-1 tracking-tight">
                Portable .rssh Bundles
              </h3>
              <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                Instructors compile and distribute self-contained subject archives containing full relational graphs and vector indices.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons: 3 clean buttons side by side */}
        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <button
            onClick={onStart}
            className="px-9 py-3.5 rounded-full btn-apple-primary text-sm sm:text-base font-semibold shadow-xl hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            Get Started
          </button>

          <button
            onClick={onHowItWorks}
            className="px-7 py-3.5 rounded-full btn-apple-secondary text-sm sm:text-base font-semibold shadow-lg hover:border-white/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            How It Works
          </button>

          <button
            onClick={onDownloadExe}
            className="px-7 py-3.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-white text-sm sm:text-base font-semibold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            Download EXE
          </button>
        </div>
      </main>

      {/* SECTION 2: BIG & PROMINENT TECH STACK SECTION */}
      <section className="w-full max-w-6xl mx-auto pt-10 pb-10 border-t border-white/[0.1] z-10 shrink-0">
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
            gap={24}
            pauseOnHover={true}
            scaleOnHover={true}
            fadeOut={true}
            fadeOutColor="#000000"
            ariaLabel="Axiom Technology Stack"
          />
        </div>
      </section>

      {/* SECTION 3: COMPACT & SLEEK DEVELOPERS SECTION */}
      <section className="w-full max-w-6xl mx-auto pt-8 pb-10 border-t border-white/[0.08] z-10">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <Users2 className="h-4 w-4 text-[#0071e3]" />
            <h3 className="text-xs sm:text-sm font-bold tracking-wider text-white uppercase">
              Developers
            </h3>
          </div>
          <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[#86868b]">
            Built for BE Project
          </span>
        </div>

        <div className="h-[210px] sm:h-[230px] w-full rounded-2xl overflow-hidden border border-white/10 shadow-xl relative bg-[#0e0e10]">
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
