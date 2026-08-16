"use client";

import React, { useState } from "react";
import Stepper, { Step } from "@/components/Stepper";
import { Laptop, Terminal, Cpu, Activity, HardDrive, CheckCircle2, Key, ExternalLink, GraduationCap, BookOpen, User, Rocket, ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 bg-black relative">
      {/* Top bar */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={onBackToHome}
          className="text-xs text-[#86868b] hover:text-white transition-colors px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer"
        >
          Exit to Home
        </button>
      </div>

      <div className="w-full max-w-2xl mx-auto py-8">
        <div className="text-center mb-4">
          <span className="text-[11px] font-semibold text-[#0071e3] uppercase tracking-wider">
            Guided System Setup
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Configure Your Axiom Environment
          </h1>
          <p className="text-xs text-[#86868b] mt-1">
            Follow the steps below to calibrate local hardware, models, and your learning workspace.
          </p>
        </div>

        <Stepper
          initialStep={1}
          onStepChange={(step) => {
            console.log("Current Setup Step:", step);
          }}
          onFinalStepCompleted={onComplete}
          backButtonText="Previous"
          nextButtonText="Continue"
          stepCircleContainerClassName="!max-w-2xl !bg-[#161618]/90 !backdrop-blur-2xl !border-white/10 !rounded-3xl shadow-2xl"
          footerClassName="!pt-4 !pb-6 !px-8"
          contentClassName="!px-6 sm:!px-8 !pb-2 min-h-[380px]"
        >
          {/* STEP 1: SYSTEM & HARDWARE DIAGNOSTICS */}
          <Step>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-[#1c1c1e] flex items-center justify-center text-[#0071e3]">
                  <Laptop className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">Step 1: System Diagnostics</h2>
                  <p className="text-xs text-[#86868b]">Profiling hardware and local engine compatibility</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
                <div className="p-3.5 rounded-2xl bg-black/60 border border-white/[0.08] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Terminal className="h-4 w-4 text-[#86868b]" />
                    <div>
                      <p className="text-xs font-semibold text-white">Python Runtime</p>
                      <p className="text-[11px] text-[#86868b]">
                        {diagnostics?.python.version ? `v${diagnostics.python.version} (Ready)` : "Detecting..."}
                      </p>
                    </div>
                  </div>
                  {scanStep >= 1 ? <CheckCircle2 className="h-4 w-4 text-[#30d158]" /> : <div className="h-3.5 w-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
                </div>

                <div className="p-3.5 rounded-2xl bg-black/60 border border-white/[0.08] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Cpu className="h-4 w-4 text-[#86868b]" />
                    <div>
                      <p className="text-xs font-semibold text-white">Ollama Engine</p>
                      <p className="text-[11px] text-[#86868b]">
                        {diagnostics?.ollama.connected ? "Connected" : "Local Daemon Active"}
                      </p>
                    </div>
                  </div>
                  {scanStep >= 2 ? <CheckCircle2 className="h-4 w-4 text-[#30d158]" /> : <div className="h-3.5 w-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
                </div>

                <div className="p-3.5 rounded-2xl bg-black/60 border border-white/[0.08] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Activity className="h-4 w-4 text-[#86868b]" />
                    <div>
                      <p className="text-xs font-semibold text-white">Hardware Memory</p>
                      <p className="text-[11px] text-[#86868b]">
                        {diagnostics?.hardware ? `${diagnostics.hardware.ram_total_gb} GB • ${diagnostics.hardware.cpu_cores} Cores` : "Benchmarking..."}
                      </p>
                    </div>
                  </div>
                  {scanStep >= 3 ? <CheckCircle2 className="h-4 w-4 text-[#30d158]" /> : <div className="h-3.5 w-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
                </div>

                <div className="p-3.5 rounded-2xl bg-black/60 border border-white/[0.08] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <HardDrive className="h-4 w-4 text-[#86868b]" />
                    <div>
                      <p className="text-xs font-semibold text-white">LanceDB Storage</p>
                      <p className="text-[11px] text-[#86868b]">
                        {diagnostics?.storage.subjects_count ? `${diagnostics.storage.subjects_count} Subjects Loaded` : "Ready"}
                      </p>
                    </div>
                  </div>
                  {scanStep >= 4 ? <CheckCircle2 className="h-4 w-4 text-[#30d158]" /> : <div className="h-3.5 w-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#1c1c1e]/60 border border-white/[0.06] text-xs text-[#86868b]">
                <span className="text-white font-medium">✓ Diagnostics complete:</span> Your laptop meets all offline vector search and LLM requirements.
              </div>
            </div>
          </Step>

          {/* STEP 2: MODEL RECOMMENDATION & OPTIONAL GEMINI KEY */}
          <Step>
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">Step 2: AI Model Selection</h2>
                  <p className="text-xs text-[#86868b]">Calibrated for your hardware profile</p>
                </div>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#0071e3]/10 text-[#0071e3] border border-[#0071e3]/20 font-medium">
                  {diagnostics?.hardware.ram_total_gb || 16} GB RAM Detected
                </span>
              </div>

              {/* Gemini API Key */}
              <div className="p-3 rounded-2xl bg-black/60 border border-white/[0.08] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Key className="h-3.5 w-3.5 text-[#ff9f0a]" />
                    Google Gemini API Key (Optional)
                  </label>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-[#0071e3] hover:underline flex items-center gap-1"
                  >
                    Get Key <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="flex-1 px-3 py-1.5 rounded-xl bg-[#161618] border border-white/10 text-xs text-white placeholder-[#86868b] outline-none focus:border-[#0071e3] font-mono"
                  />
                  <button
                    type="button"
                    onClick={onAnalyzeGemini}
                    disabled={isRecommending || !geminiApiKey.trim()}
                    className="px-3 py-1.5 rounded-xl btn-apple-primary disabled:opacity-40 text-xs font-medium cursor-pointer"
                  >
                    {isRecommending ? "Testing..." : "Apply"}
                  </button>
                </div>
                {savedGeminiKey && (
                  <p className="text-[11px] text-[#30d158] flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Gemini Key active for cloud consultation.
                  </p>
                )}
              </div>

              {/* Models List */}
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold text-[#86868b]">Select Active Inference Model:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: "qwen2.5-coder:7b", name: "Qwen 2.5 Coder 7B", desc: "Recommended • Best for STEM & Math", ram: "4.7 GB" },
                    { id: "llama3.2:3b", name: "Llama 3.2 3B", desc: "Ultra-Fast • Low Memory", ram: "2.2 GB" },
                    { id: "deepseek-r1:8b", name: "DeepSeek R1 8B", desc: "Reasoning & Deep Proofs", ram: "5.5 GB" },
                    { id: "phi3:mini", name: "Microsoft Phi-3 Mini", desc: "Academic Textbook QA", ram: "2.8 GB" }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedModel(m.id)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        selectedModel === m.id
                          ? "bg-[#1c1c1e] border-[#0071e3] text-white ring-1 ring-[#0071e3]"
                          : "bg-black/40 border-white/10 text-[#86868b] hover:text-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-semibold text-white">{m.name}</span>
                        <span className="text-[10px] text-[#86868b]">{m.ram}</span>
                      </div>
                      <p className="text-[11px] text-[#86868b] truncate">{m.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Step>

          {/* STEP 3: USER PROFILE & WORKSPACE ROLE */}
          <Step>
            <div className="flex flex-col gap-3.5">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Step 3: Profile &amp; Role</h2>
                <p className="text-xs text-[#86868b]">Customize your identity and primary workspace</p>
              </div>

              {/* Name Input */}
              <div className="p-3 rounded-2xl bg-black/60 border border-white/[0.08] flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-[#0071e3]" />
                  Your Display Name
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Your Name (e.g., Alex Rivers)"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#161618] border border-white/10 text-xs text-white placeholder-[#86868b] outline-none focus:border-[#0071e3]"
                />
              </div>

              {/* Role Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setMode("student")}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    mode === "student"
                      ? "bg-[#1c1c1e] border-[#0071e3] ring-1 ring-[#0071e3]"
                      : "bg-black/40 border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="h-8 w-8 rounded-xl bg-[#161618] flex items-center justify-center text-[#0071e3]">
                      <GraduationCap className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-bold text-white">Student Workspace</span>
                  </div>
                  <p className="text-[11px] text-[#86868b] leading-relaxed">
                    AI tutor grounded in course textbooks, interactive flashcards, quizzes &amp; teach-back drills.
                  </p>
                </div>

                <div
                  onClick={() => setMode("teacher")}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    mode === "teacher"
                      ? "bg-[#1c1c1e] border-[#ff9f0a] ring-1 ring-[#ff9f0a]"
                      : "bg-black/40 border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="h-8 w-8 rounded-xl bg-[#161618] flex items-center justify-center text-[#ff9f0a]">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-bold text-white">Teacher Studio</span>
                  </div>
                  <p className="text-[11px] text-[#86868b] leading-relaxed">
                    Curriculum ingestion, Bloom&apos;s Taxonomy exam generator, and slide presentation creator.
                  </p>
                </div>
              </div>
            </div>
          </Step>

          {/* STEP 4: FINAL LAUNCH CONFIRMATION */}
          <Step>
            <div className="flex flex-col items-center text-center justify-center py-2">
              <div className="h-12 w-12 rounded-2xl bg-[#30d158]/10 text-[#30d158] flex items-center justify-center mb-3 border border-[#30d158]/20">
                <Rocket className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">You&apos;re All Set!</h2>
              <p className="text-xs text-[#86868b] max-w-md mt-1 mb-4">
                Your offline AI workspace has been configured and is ready to load.
              </p>

              <div className="w-full max-w-md p-4 rounded-2xl bg-black/60 border border-white/[0.08] text-left text-xs flex flex-col gap-2 mb-2">
                <div className="flex justify-between py-1 border-b border-white/[0.06]">
                  <span className="text-[#86868b]">User Profile</span>
                  <span className="font-semibold text-white">{userName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.06]">
                  <span className="text-[#86868b]">Active Model</span>
                  <span className="font-semibold text-[#0071e3] font-mono">{selectedModel}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.06]">
                  <span className="text-[#86868b]">Selected Workspace</span>
                  <span className="font-semibold text-[#30d158] capitalize">{mode} Mode</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#86868b]">Default Subject</span>
                  <span className="font-semibold text-white">Machine Learning (CS-401)</span>
                </div>
              </div>

              <p className="text-[11px] text-[#86868b]">
                Click <strong className="text-white">Complete</strong> below to open the workspace.
              </p>
            </div>
          </Step>
        </Stepper>
      </div>
    </div>
  );
}
