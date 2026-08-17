"use client";

import React, { useState } from "react";
import {
  Cpu,
  Database,
  FileCode2,
  HardDrive,
  Layers,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Terminal,
  Zap,
  CheckCircle2,
  Package,
  BookOpen,
  GraduationCap
} from "lucide-react";
import { AxiomLogo } from "./AxiomLogo";

interface ArchitectureScreenProps {
  onBack: () => void;
  onStart: () => void;
  onDownloadExe?: () => void;
}

export function ArchitectureScreen({ onBack, onStart }: ArchitectureScreenProps) {
  const [activeTab, setActiveTab] = useState<"realtime" | "pipeline" | "agents" | "storage">("realtime");

  // Real-time Pipeline Simulator State
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const runSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimulationStep(1);

    setTimeout(() => {
      setSimulationStep(2);
      setTimeout(() => {
        setSimulationStep(3);
        setTimeout(() => {
          setSimulationStep(4);
          setTimeout(() => {
            setSimulationStep(5);
            setIsSimulating(false);
          }, 800);
        }, 800);
      }, 800);
    }, 700);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setSimulationStep(0);
  };

  return (
    <div className="min-h-screen w-full bg-black text-[#f5f5f7] flex flex-col justify-between py-6 px-4 sm:px-10 lg:px-16 relative overflow-x-hidden antialiased selection:bg-[#0071e3] selection:text-white">
      {/* Ambient Lighting */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-[#0071e3]/15 blur-[160px] rounded-full" />
      <div className="pointer-events-none absolute bottom-10 right-10 w-[600px] h-[350px] bg-[#30d158]/08 blur-[150px] rounded-full" />
      <div className="pointer-events-none absolute top-1/2 left-10 w-[500px] h-[350px] bg-[#8b5cf6]/08 blur-[150px] rounded-full" />

      {/* Top Header - Expanded Full Width */}
      <header className="w-full max-w-[1440px] mx-auto flex items-center justify-between z-10 pb-6 border-b border-white/[0.08]">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-full bg-white/[0.06] border border-white/10 hover:bg-white/12 text-xs sm:text-sm font-semibold text-[#86868b] hover:text-white transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
        >
          Back to Home
        </button>

        <div className="flex items-center gap-2.5">
          <AxiomLogo className="h-7 w-7" />
          <span className="text-base font-extrabold tracking-tight text-white">AXIOM ARCHITECTURE</span>
        </div>

        <button
          onClick={onStart}
          className="px-5 py-2 sm:px-6 sm:py-2.5 rounded-full bg-white text-black text-xs sm:text-sm font-bold shadow-lg hover:bg-neutral-200 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          Launch Setup
        </button>
      </header>

      {/* Main Architecture Content - Expanded Full Width */}
      <main className="w-full max-w-[1440px] mx-auto py-8 z-10 flex flex-col gap-8 flex-1">
        {/* Title */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            How Axiom Works in Real-Time
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-[#86868b] mt-3 leading-relaxed max-w-3xl mx-auto">
            Physical data isolation, offline RAG retrieval, portable <code className="text-white bg-[#1c1c1e] px-2 py-0.5 rounded font-mono text-xs border border-white/10">.rssh</code> packages, and local Ollama inference with zero cloud dependency.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1">
          <div className="p-1 rounded-2xl flex gap-1 bg-[#161618] border border-white/10">
            <button
              onClick={() => setActiveTab("realtime")}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "realtime"
                  ? "bg-[#0071e3] text-white shadow-md"
                  : "text-[#86868b] hover:text-white"
              }`}
            >
              <Zap className="h-4 w-4" />
              <span>Real-Time Query Simulation</span>
            </button>

            <button
              onClick={() => setActiveTab("pipeline")}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "pipeline"
                  ? "bg-[#0071e3] text-white shadow-md"
                  : "text-[#86868b] hover:text-white"
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>.rssh Ingestion Pipeline</span>
            </button>

            <button
              onClick={() => setActiveTab("agents")}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "agents"
                  ? "bg-[#0071e3] text-white shadow-md"
                  : "text-[#86868b] hover:text-white"
              }`}
            >
              <Cpu className="h-4 w-4" />
              <span>Multi-Agent Controller</span>
            </button>

            <button
              onClick={() => setActiveTab("storage")}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "storage"
                  ? "bg-[#0071e3] text-white shadow-md"
                  : "text-[#86868b] hover:text-white"
              }`}
            >
              <Database className="h-4 w-4" />
              <span>Storage &amp; Vector Schemas</span>
            </button>
          </div>
        </div>

        {/* TAB 1: REAL-TIME SIMULATION */}
        {activeTab === "realtime" && (
          <div className="flex flex-col gap-6 w-full">
            {/* Simulator Control Bar */}
            <div className="p-5 sm:p-6 rounded-3xl apple-card border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div>
                <span className="text-xs font-semibold text-[#0071e3] uppercase tracking-wider block">
                  Interactive Execution Trace
                </span>
                <p className="text-sm sm:text-base font-bold text-white mt-0.5">
                  Query: <span className="text-[#38bdf8] font-mono">&ldquo;Derive Bias-Variance Tradeoff in Unit 3&rdquo;</span>
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={runSimulation}
                  disabled={isSimulating}
                  className="px-6 py-2.5 rounded-xl bg-white text-black disabled:opacity-50 text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg hover:bg-neutral-200"
                >
                  {isSimulating ? (
                    <>
                      <div className="h-3.5 w-3.5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      <span>Processing Step {simulationStep}/5...</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>Simulate Query Flow</span>
                    </>
                  )}
                </button>

                <button
                  onClick={resetSimulation}
                  disabled={isSimulating || simulationStep === 0}
                  className="p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-[#86868b] hover:text-white disabled:opacity-30 cursor-pointer"
                  title="Reset Simulation"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* 5-Step Pipeline Flowchart Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative w-full">
              {/* Step 1 */}
              <div
                className={`p-5 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
                  simulationStep >= 1
                    ? "bg-[#1c1c1e] border-[#0071e3] shadow-lg shadow-blue-500/10 ring-1 ring-[#0071e3]"
                    : "bg-[#121214] border-white/[0.08] opacity-60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white">01</span>
                    <Terminal className="h-4 w-4 text-[#0071e3]" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white mb-1">Student Input</h4>
                  <p className="text-[11px] sm:text-xs text-[#86868b] leading-relaxed">
                    Student submits natural language query tagged with active subject &amp; unit.
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-white/[0.06] text-[10px] sm:text-xs text-[#30d158] font-mono">
                  {simulationStep >= 1 ? "✓ Query Captured" : "Idle"}
                </div>
              </div>

              {/* Step 2 */}
              <div
                className={`p-5 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
                  simulationStep >= 2
                    ? "bg-[#1c1c1e] border-[#0071e3] shadow-lg shadow-blue-500/10 ring-1 ring-[#0071e3]"
                    : "bg-[#121214] border-white/[0.08] opacity-60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white">02</span>
                    <Database className="h-4 w-4 text-[#30d158]" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white mb-1">LanceDB Vector Match</h4>
                  <p className="text-[11px] sm:text-xs text-[#86868b] leading-relaxed">
                    Embeds query via sentence-transformers and matches top cosine distance chunks.
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-white/[0.06] text-[10px] sm:text-xs text-[#30d158] font-mono">
                  {simulationStep >= 2 ? "✓ 3 Chunks (Sim: 0.94)" : "Waiting..."}
                </div>
              </div>

              {/* Step 3 */}
              <div
                className={`p-5 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
                  simulationStep >= 3
                    ? "bg-[#1c1c1e] border-[#0071e3] shadow-lg shadow-blue-500/10 ring-1 ring-[#0071e3]"
                    : "bg-[#121214] border-white/[0.08] opacity-60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white">03</span>
                    <ShieldCheck className="h-4 w-4 text-[#ff9f0a]" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white mb-1">Syllabus Bounding</h4>
                  <p className="text-[11px] sm:text-xs text-[#86868b] leading-relaxed">
                    Filters context strictly by prescribed book chapters (Bishop PRML Ch. 3).
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-white/[0.06] text-[10px] sm:text-xs text-[#30d158] font-mono">
                  {simulationStep >= 3 ? "✓ Zero Hallucination Bound" : "Waiting..."}
                </div>
              </div>

              {/* Step 4 */}
              <div
                className={`p-5 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
                  simulationStep >= 4
                    ? "bg-[#1c1c1e] border-[#0071e3] shadow-lg shadow-blue-500/10 ring-1 ring-[#0071e3]"
                    : "bg-[#121214] border-white/[0.08] opacity-60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white">04</span>
                    <Cpu className="h-4 w-4 text-[#0055FF]" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white mb-1">Local Ollama LLM</h4>
                  <p className="text-[11px] sm:text-xs text-[#86868b] leading-relaxed">
                    Locally hosts Qwen 2.5 Coder 7B or Llama 3.2 3B in RAM for word-by-word streaming.
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-white/[0.06] text-[10px] sm:text-xs text-[#30d158] font-mono">
                  {simulationStep >= 4 ? "✓ Streaming ~32 tok/s" : "Waiting..."}
                </div>
              </div>

              {/* Step 5 */}
              <div
                className={`p-5 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
                  simulationStep >= 5
                    ? "bg-[#1c1c1e] border-[#30d158] shadow-lg shadow-green-500/10 ring-1 ring-[#30d158]"
                    : "bg-[#121214] border-white/[0.08] opacity-60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white">05</span>
                    <Sparkles className="h-4 w-4 text-[#30d158]" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white mb-1">Grounded Response</h4>
                  <p className="text-[11px] sm:text-xs text-[#86868b] leading-relaxed">
                    Delivers accurate mathematical proof with citation sources and 99% syllabus confidence.
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-white/[0.06] text-[10px] sm:text-xs text-[#30d158] font-mono">
                  {simulationStep >= 5 ? "✓ Complete & Verified" : "Waiting..."}
                </div>
              </div>
            </div>

            {/* Live Output Simulation Window */}
            {simulationStep >= 5 && (
              <div className="p-6 rounded-3xl bg-[#161618] border border-white/10 text-xs sm:text-sm flex flex-col gap-3 shadow-2xl animate-fadeIn w-full">
                <div className="flex items-center justify-between">
                  <span className="text-[#30d158] font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> Live Ollama SSE Stream Completed
                  </span>
                  <span className="text-[#86868b] font-mono text-[11px]">Inference: Qwen 2.5 Coder 7B • Latency: 42ms</span>
                </div>
                <div className="p-4 rounded-2xl bg-black border border-white/[0.08] text-[#f5f5f7] leading-relaxed font-sans">
                  <p className="font-semibold text-white mb-1">Response Summary:</p>
                  <p className="text-xs sm:text-sm text-[#86868b]">
                    The Bias-Variance Decomposition defines total expected loss as <code className="text-[#f5f5f7] bg-[#1c1c1e] px-1.5 py-0.5 rounded font-mono text-xs">E[(y - f(x))²] = Bias[f(x)]² + Var[f(x)] + σ²</code>. Bias represents hypothesis error from rigid assumptions, while Variance measures sensitivity to dataset fluctuations.
                  </p>
                  <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center gap-2 text-xs text-[#0071e3]">
                    <span>Sources:</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-white font-mono text-[11px]">Bishop_PRML_Ch3.pdf</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-white font-mono text-[11px]">Unit_3_Syllabus.pdf</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INGESTION PIPELINE */}
        {activeTab === "pipeline" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div className="apple-card p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col gap-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-[#1c1c1e] flex items-center justify-center text-[#0071e3] border border-white/10">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">Teacher Ingestion &amp; Packaging</h3>
                  <p className="text-xs text-[#86868b]">Compiling raw academic documents into .rssh files</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 text-xs sm:text-sm mt-2">
                <div className="p-3.5 rounded-2xl bg-black/60 border border-white/[0.08] flex items-center gap-3.5">
                  <span className="h-7 w-7 rounded-full bg-[#0071e3]/20 text-[#0071e3] font-bold flex items-center justify-center text-xs shrink-0">1</span>
                  <div>
                    <span className="font-semibold text-white block">Document Parsing</span>
                    <span className="text-[11px] sm:text-xs text-[#86868b]">Local OCR &amp; text extraction from PDFs, DOCX, &amp; PPTX</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/60 border border-white/[0.08] flex items-center gap-3.5">
                  <span className="h-7 w-7 rounded-full bg-[#0071e3]/20 text-[#0071e3] font-bold flex items-center justify-center text-xs shrink-0">2</span>
                  <div>
                    <span className="font-semibold text-white block">Semantic Chunking</span>
                    <span className="text-[11px] sm:text-xs text-[#86868b]">Unit &amp; topic-aware chunking with sentence overlap</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/60 border border-white/[0.08] flex items-center gap-3.5">
                  <span className="h-7 w-7 rounded-full bg-[#0071e3]/20 text-[#0071e3] font-bold flex items-center justify-center text-xs shrink-0">3</span>
                  <div>
                    <span className="font-semibold text-white block">Vector &amp; Relational Indexing</span>
                    <span className="text-[11px] sm:text-xs text-[#86868b]">LanceDB embeddings lookup + SQLite course relational tree</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/60 border border-white/[0.08] flex items-center gap-3.5">
                  <span className="h-7 w-7 rounded-full bg-[#30d158]/20 text-[#30d158] font-bold flex items-center justify-center text-xs shrink-0">4</span>
                  <div>
                    <span className="font-semibold text-white block">.rssh Package Archive</span>
                    <span className="text-[11px] sm:text-xs text-[#86868b]">Compiles self-contained portable package with checksum verification</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="apple-card p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col gap-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-[#1c1c1e] flex items-center justify-center text-[#30d158] border border-white/10">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">Student Offline Import &amp; Study</h3>
                  <p className="text-xs text-[#86868b]">Air-gapped loading and local inference</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 text-xs sm:text-sm mt-2">
                <div className="p-3.5 rounded-2xl bg-black/60 border border-white/[0.08] flex items-center gap-3.5">
                  <span className="h-7 w-7 rounded-full bg-[#30d158]/20 text-[#30d158] font-bold flex items-center justify-center text-xs shrink-0">A</span>
                  <div>
                    <span className="font-semibold text-white block">Import .rssh Archive</span>
                    <span className="text-[11px] sm:text-xs text-[#86868b]">1-click import mounts vector indices instantly without internet</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/60 border border-white/[0.08] flex items-center gap-3.5">
                  <span className="h-7 w-7 rounded-full bg-[#30d158]/20 text-[#30d158] font-bold flex items-center justify-center text-xs shrink-0">B</span>
                  <div>
                    <span className="font-semibold text-white block">Local Model Execution</span>
                    <span className="text-[11px] sm:text-xs text-[#86868b]">Runs Qwen/Llama locally through Ollama or BYOK Gemini</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/60 border border-white/[0.08] flex items-center gap-3.5">
                  <span className="h-7 w-7 rounded-full bg-[#30d158]/20 text-[#30d158] font-bold flex items-center justify-center text-xs shrink-0">C</span>
                  <div>
                    <span className="font-semibold text-white block">Dynamic Study Modes</span>
                    <span className="text-[11px] sm:text-xs text-[#86868b]">Socratic dialogues, auto-generated flashcards, and teach-back testing</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/60 border border-white/[0.08] flex items-center gap-3.5">
                  <span className="h-7 w-7 rounded-full bg-[#30d158]/20 text-[#30d158] font-bold flex items-center justify-center text-xs shrink-0">D</span>
                  <div>
                    <span className="font-semibold text-white block">Air-Gapped Privacy</span>
                    <span className="text-[11px] sm:text-xs text-[#86868b]">Zero questions or progress data leaves the student&apos;s physical machine</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MULTI-AGENT CONTROLLER */}
        {activeTab === "agents" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
            <div className="apple-card p-6 sm:p-7 rounded-3xl border border-white/10 flex flex-col justify-between shadow-xl">
              <div>
                <div className="h-10 w-10 rounded-2xl bg-[#0071e3]/10 border border-[#0071e3]/20 flex items-center justify-center mb-4 text-[#0071e3]">
                  <Cpu className="h-5 w-5" />
                </div>
                <h4 className="text-base font-bold text-white mb-2">Student Query Router</h4>
                <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                  Directs incoming requests to either vector search RAG, Socratic scaffolding, or direct calculation.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.06] text-xs font-mono text-[#0071e3]">
                Latency: ~8ms
              </div>
            </div>

            <div className="apple-card p-6 sm:p-7 rounded-3xl border border-white/10 flex flex-col justify-between shadow-xl">
              <div>
                <div className="h-10 w-10 rounded-2xl bg-[#30d158]/10 border border-[#30d158]/20 flex items-center justify-center mb-4 text-[#30d158]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h4 className="text-base font-bold text-white mb-2">Pedagogical Selector</h4>
                <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                  Determines whether student requires direct formula derivations, conceptual analogies, or Socratic hints.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.06] text-xs font-mono text-[#30d158]">
                Mode: Socratic / Direct
              </div>
            </div>

            <div className="apple-card p-6 sm:p-7 rounded-3xl border border-white/10 flex flex-col justify-between shadow-xl">
              <div>
                <div className="h-10 w-10 rounded-2xl bg-[#ff9f0a]/10 border border-[#ff9f0a]/20 flex items-center justify-center mb-4 text-[#ff9f0a]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h4 className="text-base font-bold text-white mb-2">Syllabus Guard</h4>
                <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                  Cross-checks retrieved chunks against textbook index boundaries. Prevents hallucinations and scope creep.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.06] text-xs font-mono text-[#ff9f0a]">
                Confidence: &gt;98%
              </div>
            </div>

            <div className="apple-card p-6 sm:p-7 rounded-3xl border border-white/10 flex flex-col justify-between shadow-xl">
              <div>
                <div className="h-10 w-10 rounded-2xl bg-[#a855f7]/10 border border-[#a855f7]/20 flex items-center justify-center mb-4 text-[#a855f7]">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <h4 className="text-base font-bold text-white mb-2">Teach-Back Grader</h4>
                <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                  Feynman-method evaluator that scores student conceptual explanations and flags blind spots.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.06] text-xs font-mono text-[#a855f7]">
                Rubric Assessment
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: STORAGE & VECTOR SCHEMAS */}
        {activeTab === "storage" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div className="apple-card p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col gap-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-[#30d158]/10 border border-[#30d158]/20 flex items-center justify-center text-[#30d158]">
                  <HardDrive className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">LanceDB Vector Table</h3>
                  <p className="text-xs text-[#86868b]">Fast cosine distance embeddings lookup</p>
                </div>
              </div>
              <div className="p-4 sm:p-5 rounded-2xl bg-black font-mono text-xs sm:text-sm text-[#86868b] border border-white/[0.08] overflow-x-auto leading-relaxed">
                <p className="text-white font-bold mb-2">// lancedb vector table</p>
                <p className="text-[#30d158]">vector: float32[384] (all-MiniLM-L6-v2);</p>
                <p className="text-[#30d158]">text_chunk: string (curriculum excerpt);</p>
                <p className="text-[#30d158]">metadata: JSON &#123; unit, page, source_doc &#125;;</p>
                <p className="text-[#30d158]">index: IVF_PQ (cosine similarity);</p>
              </div>
            </div>

            <div className="apple-card p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col gap-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-[#0071e3]/10 border border-[#0071e3]/20 flex items-center justify-center text-[#0071e3]">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">SQLite Curriculum Schema</h3>
                  <p className="text-xs text-[#86868b]">Relational unit hierarchy and progress tracking</p>
                </div>
              </div>
              <div className="p-4 sm:p-5 rounded-2xl bg-black font-mono text-xs sm:text-sm text-[#86868b] border border-white/[0.08] overflow-x-auto leading-relaxed">
                <p className="text-white font-bold mb-2">-- SQLite curriculum relational tables</p>
                <p className="text-[#38bdf8]">CREATE TABLE subjects (id TEXT PRIMARY KEY, name TEXT);</p>
                <p className="text-[#38bdf8]">CREATE TABLE units (id TEXT, subject_id TEXT, title TEXT);</p>
                <p className="text-[#38bdf8]">CREATE TABLE flashcards (id TEXT, unit_id TEXT, q TEXT, a TEXT);</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer - Expanded Full Width */}
      <footer className="w-full max-w-[1440px] mx-auto pt-6 border-t border-white/[0.08] flex items-center justify-between text-xs text-[#86868b] z-10">
        <span>Axiom Local-First Architecture • BE Project</span>
        <button
          onClick={onStart}
          className="text-white hover:text-[#0071e3] transition-colors font-semibold cursor-pointer"
        >
          Proceed to Onboarding
        </button>
      </footer>
    </div>
  );
}
