"use client";

import React, { useState } from "react";
import Stepper, { Step } from "@/components/Stepper";
import { Laptop, Terminal, Cpu, Activity, HardDrive, CheckCircle2, Key, ExternalLink, GraduationCap, BookOpen, User, Rocket } from "lucide-react";
import { SystemDiagnostics, ModelRecommendation } from "@/lib/api";

interface OnboardingStepperProps {
  diagnostics: SystemDiagnostics | null;
  scanStep: number;
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
  savedGeminiKey: string | null;
  recommendation: ModelRecommendation | null;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  isRecommending: boolean;
  onAnalyzeGemini: () => void;
  mode: "student" | "teacher";
  setMode: (mode: "student" | "teacher") => void;
  onComplete: () => void;
  onBackToHome: () => void;
}

export function OnboardingStepper({
  diagnostics,
  scanStep,
  geminiApiKey,
  setGeminiApiKey,
  savedGeminiKey,
  recommendation,
  selectedModel,
  setSelectedModel,
  isRecommending,
  onAnalyzeGemini,
  mode,
  setMode,
  onComplete,
  onBackToHome
}: OnboardingStepperProps) {
  const [userName, setUserName] = useState("Alex Rivers");

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col items-center justify-between p-4 sm:p-6 bg-black relative select-none antialiased">
      {/* ─── TOP HEADER (CENTERED CLEAN TITLE) ─── */}
      <header className="w-full max-w-5xl mx-auto text-center pt-2 pb-2">
        <span className="text-xs font-bold text-[#0071e3] uppercase tracking-wider">
          Guided System Setup
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Configure Your Axiom Environment
        </h1>
        <p className="text-xs sm:text-sm text-[#86868b] mt-1">
          Follow the steps below to calibrate local hardware, models, and your learning workspace.
        </p>
      </header>

      {/* ─── ENLARGED STEPPER BOX ─── */}
      <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col justify-center">
        <Stepper
          initialStep={1}
          onStepChange={(step) => {
            console.log("Current Setup Step:", step);
          }}
          onFinalStepCompleted={onComplete}
          onFirstStepBack={onBackToHome}
          firstStepBackButtonText="Exit to Home"
          backButtonText="Previous"
          nextButtonText="Continue"
          stepCircleContainerClassName="!max-w-5xl !bg-[#161618]/95 !backdrop-blur-2xl !border-white/10 !rounded-3xl shadow-2xl"
          stepContainerClassName="!p-5 sm:!p-7"
          footerClassName="!pt-4 !pb-6 !px-8 sm:!px-12"
          contentClassName="!px-8 sm:!px-12 !pb-3 min-h-[340px] sm:min-h-[360px]"
        >
          {/* STEP 1: SYSTEM & HARDWARE DIAGNOSTICS */}
          <Step>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-2xl bg-[#1c1c1e] flex items-center justify-center text-[#0071e3] border border-white/5 shadow-inner">
                  <Laptop className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Step 1: System Diagnostics</h2>
                  <p className="text-xs sm:text-sm text-[#86868b]">Profiling hardware specifications and offline engine compatibility</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-1">
                <div className="p-4 rounded-2xl bg-black/60 border border-white/[0.08] flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3.5">
                    <div className="h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center text-[#86868b]">
                      <Terminal className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm sm:text-base font-bold text-white">Python Runtime</p>
                      <p className="text-xs sm:text-sm text-[#86868b]">
                        {diagnostics?.python.version ? `v${diagnostics.python.version} (Ready)` : "Detecting runtime..."}
                      </p>
                    </div>
                  </div>
                  {scanStep >= 1 ? <CheckCircle2 className="h-5 w-5 text-[#30d158]" /> : <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
                </div>

                <div className="p-4 rounded-2xl bg-black/60 border border-white/[0.08] flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3.5">
                    <div className="h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center text-[#86868b]">
                      <Cpu className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm sm:text-base font-bold text-white">Ollama Engine</p>
                      <p className="text-xs sm:text-sm text-[#86868b]">
                        {diagnostics?.ollama.connected ? "Connected" : "Local Daemon Active"}
                      </p>
                    </div>
                  </div>
                  {scanStep >= 2 ? <CheckCircle2 className="h-5 w-5 text-[#30d158]" /> : <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
                </div>

                <div className="p-4 rounded-2xl bg-black/60 border border-white/[0.08] flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3.5">
                    <div className="h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center text-[#86868b]">
                      <Activity className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm sm:text-base font-bold text-white">Hardware Memory</p>
                      <p className="text-xs sm:text-sm text-[#86868b]">
                        {diagnostics?.hardware ? `${diagnostics.hardware.ram_total_gb} GB RAM • ${diagnostics.hardware.cpu_cores} Cores` : "Benchmarking..."}
                      </p>
                    </div>
                  </div>
                  {scanStep >= 3 ? <CheckCircle2 className="h-5 w-5 text-[#30d158]" /> : <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
                </div>

                <div className="p-4 rounded-2xl bg-black/60 border border-white/[0.08] flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3.5">
                    <div className="h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center text-[#86868b]">
                      <HardDrive className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm sm:text-base font-bold text-white">LanceDB Storage</p>
                      <p className="text-xs sm:text-sm text-[#86868b]">
                        {diagnostics?.storage.subjects_count ? `${diagnostics.storage.subjects_count} Subjects Indexed` : "Storage Ready"}
                      </p>
                    </div>
                  </div>
                  {scanStep >= 4 ? <CheckCircle2 className="h-5 w-5 text-[#30d158]" /> : <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#1c1c1e]/70 border border-white/[0.08] text-xs sm:text-sm text-[#86868b] flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#30d158] flex-shrink-0" />
                <span><strong className="text-white">Hardware Validated:</strong> Your local device satisfies all offline vector retrieval and LLM neural execution criteria.</span>
              </div>
            </div>
          </Step>

          {/* STEP 2: MODEL RECOMMENDATION & OPTIONAL GEMINI KEY */}
          <Step>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Step 2: AI Model Selection</h2>
                  <p className="text-xs sm:text-sm text-[#86868b]">Calibrated for your machine profile</p>
                </div>
                <span className="text-xs sm:text-sm px-3.5 py-1 rounded-full bg-[#0071e3]/15 text-[#0071e3] border border-[#0071e3]/30 font-semibold">
                  {diagnostics?.hardware.ram_total_gb || 16} GB RAM Detected
                </span>
              </div>

              {/* Gemini API Key */}
              <div className="p-4 rounded-2xl bg-black/60 border border-white/[0.08] flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-semibold text-white flex items-center gap-1.5">
                    <Key className="h-4 w-4 text-[#ff9f0a]" />
                    Google Gemini API Key (Optional Cloud Consultation)
                  </label>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs sm:text-sm text-[#0071e3] hover:underline flex items-center gap-1 font-medium"
                  >
                    Get Key <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
                <div className="flex gap-2.5">
                  <input
                    type="password"
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#161618] border border-white/10 text-xs sm:text-sm text-white placeholder-[#86868b] outline-none focus:border-[#0071e3] font-mono"
                  />
                  <button
                    type="button"
                    onClick={onAnalyzeGemini}
                    disabled={isRecommending || !geminiApiKey.trim()}
                    className="px-5 py-2.5 rounded-xl btn-apple-primary disabled:opacity-40 text-xs sm:text-sm font-bold cursor-pointer"
                  >
                    {isRecommending ? "Testing..." : "Apply Key"}
                  </button>
                </div>
                {savedGeminiKey && (
                  <p className="text-xs sm:text-sm text-[#30d158] flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="h-4 w-4" /> Gemini Key connected for high-throughput cloud inference.
                  </p>
                )}
              </div>

              {/* Models List */}
              <div className="flex flex-col gap-2">
                <span className="text-xs sm:text-sm font-bold text-[#86868b] uppercase tracking-wider">Select Primary Inference Model:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: "qwen2.5-coder:7b", name: "Qwen 2.5 Coder (7B)", desc: "Recommended • SOTA STEM, Math & Code", ram: "4.7 GB" },
                    { id: "llama3.2:3b", name: "Llama 3.2 (3B)", desc: "Ultra-Fast • Low Memory Footprint", ram: "2.2 GB" },
                    { id: "deepseek-r1:8b", name: "DeepSeek R1 (8B)", desc: "Reasoning & Chain-of-Thought Proofs", ram: "5.5 GB" },
                    { id: "phi3:mini", name: "Microsoft Phi-3 Mini", desc: "Textbook QA & Structured Synthesis", ram: "2.8 GB" }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedModel(m.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedModel === m.id
                          ? "bg-[#1c1c1e] border-[#0071e3] text-white ring-1 ring-[#0071e3]"
                          : "bg-black/40 border-white/10 text-[#86868b] hover:text-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm sm:text-base text-white">{m.name}</span>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-[#86868b]">{m.ram}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#86868b] truncate">{m.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Step>

          {/* STEP 3: USER PROFILE & WORKSPACE ROLE */}
          <Step>
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Step 3: Profile &amp; Role</h2>
                <p className="text-xs sm:text-sm text-[#86868b]">Customize your identity and primary workspace role</p>
              </div>

              {/* Name Input */}
              <div className="p-4 rounded-2xl bg-black/60 border border-white/[0.08] flex flex-col gap-2">
                <label className="text-xs sm:text-sm font-semibold text-white flex items-center gap-1.5">
                  <User className="h-4 w-4 text-[#0071e3]" />
                  Your Display Name
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Your Name (e.g., Alex Rivers)"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#161618] border border-white/10 text-sm sm:text-base text-white placeholder-[#86868b] outline-none focus:border-[#0071e3]"
                />
              </div>

              {/* Role Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => setMode("student")}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    mode === "student"
                      ? "bg-[#1c1c1e] border-[#0071e3] ring-1 ring-[#0071e3]"
                      : "bg-black/40 border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2.5">
                    <div className="h-10 w-10 rounded-xl bg-[#161618] flex items-center justify-center text-[#0071e3] border border-white/5">
                      <GraduationCap className="h-6 w-6" />
                    </div>
                    <span className="text-base sm:text-lg font-bold text-white">Student Workspace</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                    AI tutor grounded in course textbooks, interactive flashcards, adaptive practice quizzes &amp; Feynman teach-back drills.
                  </p>
                </div>

                <div
                  onClick={() => setMode("teacher")}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    mode === "teacher"
                      ? "bg-[#1c1c1e] border-[#ff9f0a] ring-1 ring-[#ff9f0a]"
                      : "bg-black/40 border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2.5">
                    <div className="h-10 w-10 rounded-xl bg-[#161618] flex items-center justify-center text-[#ff9f0a] border border-white/5">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <span className="text-base sm:text-lg font-bold text-white">Teacher Studio</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                    Curriculum ingestion, Bloom&apos;s Taxonomy exam blueprint generator, and syllabus presentation slide creator.
                  </p>
                </div>
              </div>
            </div>
          </Step>

          {/* STEP 4: FINAL LAUNCH CONFIRMATION */}
          <Step>
            <div className="flex flex-col items-center text-center justify-center py-3">
              <div className="h-14 w-14 rounded-2xl bg-[#30d158]/10 text-[#30d158] flex items-center justify-center mb-3 border border-[#30d158]/20">
                <Rocket className="h-7 w-7" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">You&apos;re All Set!</h2>
              <p className="text-xs sm:text-sm text-[#86868b] max-w-md mt-1 mb-4">
                Your offline AI workspace has been configured and is ready to load.
              </p>

              <div className="w-full max-w-lg p-5 rounded-2xl bg-black/60 border border-white/[0.08] text-left text-xs sm:text-sm flex flex-col gap-2.5 mb-4 shadow-sm">
                <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
                  <span className="text-[#86868b]">User Profile</span>
                  <span className="font-bold text-white">{userName}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
                  <span className="text-[#86868b]">Active Model</span>
                  <span className="font-bold text-[#0071e3] font-mono">{selectedModel}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
                  <span className="text-[#86868b]">Selected Workspace</span>
                  <span className="font-bold text-[#30d158] capitalize">{mode} Mode</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#86868b]">Default Subject</span>
                  <span className="font-bold text-white">Machine Learning (CS-401)</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#86868b]">
                Click <strong className="text-white">Complete</strong> below to open the workspace.
              </p>
            </div>
          </Step>
        </Stepper>
      </div>

      {/* Subtle bottom spacer for optical balance */}
      <div className="h-2" />
    </div>
  );
}
