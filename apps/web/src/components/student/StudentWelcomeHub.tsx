"use client";

import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Layers,
  BookOpen,
  Sparkles,
  ArrowRight,
  Database,
  Cpu,
  CheckCircle2,
  FolderOpen
} from "lucide-react";

interface SubjectItem {
  name: string;
  code: string;
  units: number;
  docs: number;
  chunks: number;
  rssh: string;
}

interface StudentWelcomeHubProps {
  subjectsList: SubjectItem[];
  activeSubject: string;
  onSelectSubject: (subjectName: string) => void;
  onEnterWorkspace: () => void;
}

export function StudentWelcomeHub({
  subjectsList,
  activeSubject,
  onSelectSubject,
  onEnterWorkspace
}: StudentWelcomeHubProps) {
  const [selected, setSelected] = useState(activeSubject);
  const [isMounting, setIsMounting] = useState(false);
  const [mountStep, setMountStep] = useState(0);
  const [mountProgress, setMountProgress] = useState(0);

  const mountStages = [
    { label: `Reading package archive (${selected.replace(/\s+/g, "-")}-2026.rssh)...`, progress: 25 },
    { label: "Unpacking SQLite relational curriculum schema (subject.db)...", progress: 55 },
    { label: "Mounting LanceDB 1536-dim vector indices (dense chunks)...", progress: 85 },
    { label: "Course syllabus grounded & ready for AI Tutor.", progress: 100 }
  ];

  const handleStartMounting = (subjectName: string) => {
    setSelected(subjectName);
    onSelectSubject(subjectName);
    setIsMounting(true);
    setMountStep(0);
    setMountProgress(25);
  };

  useEffect(() => {
    if (!isMounting) return;

    const timer1 = setTimeout(() => {
      setMountStep(1);
      setMountProgress(55);
    }, 450);

    const timer2 = setTimeout(() => {
      setMountStep(2);
      setMountProgress(85);
    }, 900);

    const timer3 = setTimeout(() => {
      setMountStep(3);
      setMountProgress(100);
    }, 1350);

    const timer4 = setTimeout(() => {
      setIsMounting(false);
      onEnterWorkspace();
    }, 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [isMounting, onEnterWorkspace]);

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col justify-center py-6 px-4 animate-in fade-in duration-300">
      {/* ─── WELCOME HEADER ─── */}
      <div className="flex flex-col items-center text-center gap-3 mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Welcome, Student
        </h1>
        <p className="text-sm text-[#86868b] max-w-lg leading-relaxed">
          Select a prescribed course to load its portable <span className="text-white font-mono font-medium">.rssh</span> package, vector embeddings, and verified syllabus materials.
        </p>
      </div>

      {/* ─── SUBJECT CARDS GRID ─── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">
            Choose Course Subject (.rssh)
          </span>
          <span className="text-xs text-[#86868b]">
            {subjectsList.length} Mounted Courses Available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {subjectsList.map((subj) => {
            const isCurrent = selected === subj.name;
            return (
              <div
                key={subj.code}
                onClick={() => handleStartMounting(subj.name)}
                className={`p-6 rounded-3xl border transition-all cursor-pointer group flex flex-col justify-between gap-5 relative overflow-hidden ${
                  isCurrent
                    ? "bg-[#1c1c1e] border-[#0071e3] shadow-lg ring-1 ring-[#0071e3]/40"
                    : "bg-[#161618] border-white/10 hover:border-white/20 hover:bg-[#1a1a1c]"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-[#0071e3] group-hover:scale-105 transition-transform">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono text-[#0071e3] font-semibold block">
                        {subj.code}
                      </span>
                      <h3 className="text-base font-bold text-white group-hover:text-[#0071e3] transition-colors">
                        {subj.name}
                      </h3>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-1 rounded-md bg-black text-[#86868b] border border-white/5">
                    {subj.rssh}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-[#86868b] pt-3 border-t border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <span>{subj.units} Syllabus Units</span>
                    <span>•</span>
                    <span className="text-[#30d158] font-mono">{subj.chunks} Dense Chunks</span>
                  </div>
                  <div className="flex items-center gap-1 text-white font-medium group-hover:text-[#0071e3] group-hover:translate-x-0.5 transition-all">
                    <span>Load Subject</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── ANIMATED .RSSH MOUNTING MODAL ─── */}
      {isMounting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="w-full max-w-md p-8 rounded-3xl bg-[#18181b] border border-white/20 shadow-2xl flex flex-col items-center text-center gap-6 animate-in zoom-in-95 duration-200">
            <div className="relative">
              <div className="h-16 w-16 rounded-3xl bg-[#0071e3]/10 border border-[#0071e3]/30 flex items-center justify-center text-[#0071e3]">
                <Database className="h-8 w-8 animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#30d158] flex items-center justify-center text-black">
                <Sparkles className="h-3 w-3" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">
                Mounting .rssh Course Package
              </h3>
              <p className="text-xs text-[#0071e3] font-mono font-medium">
                {selected}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-black/60 rounded-full h-2 overflow-hidden border border-white/10 p-0.5">
              <div
                className="bg-gradient-to-r from-[#0071e3] to-[#30d158] h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${mountProgress}%` }}
              />
            </div>

            {/* Stage Logs */}
            <div className="w-full p-4 rounded-2xl bg-black/40 border border-white/[0.06] text-left text-xs font-mono flex flex-col gap-2">
              {mountStages.map((stage, idx) => {
                const isPassed = mountStep > idx;
                const isCurrent = mountStep === idx;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-2.5 transition-colors ${
                      isPassed
                        ? "text-[#30d158]"
                        : isCurrent
                        ? "text-white font-medium animate-pulse"
                        : "text-[#48484a]"
                    }`}
                  >
                    {isPassed ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#30d158] flex-shrink-0" />
                    ) : isCurrent ? (
                      <div className="h-3.5 w-3.5 border-2 border-[#0071e3] border-t-transparent rounded-full animate-spin flex-shrink-0" />
                    ) : (
                      <div className="h-3.5 w-3.5 rounded-full border border-white/10 flex-shrink-0" />
                    )}
                    <span className="truncate">{stage.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
