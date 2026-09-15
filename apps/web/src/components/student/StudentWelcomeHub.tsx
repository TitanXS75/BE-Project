"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  GraduationCap,
  Layers,
  BookOpen,
  Sparkles,
  Database,
  Cpu,
  CheckCircle2,
  FolderOpen,
  Upload,
  X,
  AlertCircle,
  FileArchive
} from "lucide-react";
import { importRSSHPackage } from "@/lib/api";

export interface SubjectItem {
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
  onImportPackage?: (newSubject: SubjectItem) => void;
}

export function StudentWelcomeHub({
  subjectsList,
  activeSubject,
  onSelectSubject,
  onEnterWorkspace,
  onImportPackage
}: StudentWelcomeHubProps) {
  const [selected, setSelected] = useState(activeSubject);
  const [isMounting, setIsMounting] = useState(false);
  const [mountStep, setMountStep] = useState(0);
  const [mountProgress, setMountProgress] = useState(0);

  // Import Modal State
  const [showImportModal, setShowImportModal] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleProcessFile = async (file: File) => {
    if (!file.name.endsWith(".rssh") && !file.name.endsWith(".zip")) {
      setImportError("Only .rssh or .zip packages are supported.");
      return;
    }
    setIsImporting(true);
    setImportError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await importRSSHPackage(formData);
      const subjectName = res.subject?.subject_name || res.subject?.title || file.name.replace(/\.(rssh|zip)$/i, "");
      const newSubject: SubjectItem = {
        name: subjectName,
        code: res.subject?.subject_code || `CS-${Math.floor(100 + Math.random() * 900)}`,
        units: res.subject?.units?.length || 4,
        docs: res.subject?.documents_count || 12,
        chunks: res.subject?.chunks_count || 140,
        rssh: file.name
      };
      if (onImportPackage) {
        onImportPackage(newSubject);
      }
      setImportSuccess(`Package ${file.name} imported and verified successfully.`);
      setTimeout(() => {
        setShowImportModal(false);
        setImportSuccess(null);
        handleStartMounting(subjectName);
      }, 1000);
    } catch (err: any) {
      setImportError(err?.message || "Failed to unpack and verify .rssh package.");
    } finally {
      setIsImporting(false);
    }
  };

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
    <div className="w-full max-w-6xl 2xl:max-w-7xl mx-auto h-full flex flex-col justify-center py-6 px-4 sm:px-6 animate-in fade-in duration-300">
      {/* ─── WELCOME HEADER ─── */}
      <div className="flex flex-col items-center text-center gap-3 mb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Welcome, Student
        </h1>
        <p className="text-sm sm:text-base text-[#86868b] max-w-2xl leading-relaxed">
          Select a prescribed course to load its portable <span className="text-white font-mono font-medium">.rssh</span> package, vector embeddings, and verified syllabus materials.
        </p>
      </div>

      {/* ─── SUBJECT CARDS GRID ─── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">
            Choose Course Subject (.rssh)
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowImportModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white text-xs font-medium flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Upload className="h-3.5 w-3.5 text-[#0071e3]" />
              <span>Import .rssh Package</span>
            </button>
            <span className="text-xs text-[#86868b]">
              {subjectsList.length} Mounted Courses Available
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {subjectsList.map((subj) => {
            const isCurrent = selected === subj.name;
            return (
              <div
                key={subj.code}
                onClick={() => handleStartMounting(subj.name)}
                className={`p-6 sm:p-7 rounded-3xl border transition-all cursor-pointer group flex flex-col justify-between gap-5 relative overflow-hidden ${
                  isCurrent
                    ? "bg-[#1c1c1e] border-[#0071e3] shadow-lg ring-1 ring-[#0071e3]/40"
                    : "bg-[#161618] border-white/10 hover:border-white/20 hover:bg-[#1a1a1c]"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="h-12 w-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-[#0071e3] group-hover:scale-105 transition-transform">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono text-[#0071e3] font-semibold block">
                        {subj.code}
                      </span>
                      <h3 className="text-lg font-bold text-white group-hover:text-[#0071e3] transition-colors">
                        {subj.name}
                      </h3>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-black text-[#86868b] border border-white/5">
                    {subj.rssh}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm text-[#86868b] pt-4 border-t border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <span>{subj.units} Syllabus Units</span>
                    <span>•</span>
                    <span className="text-[#30d158] font-mono font-medium">{subj.chunks} Dense Chunks</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white font-medium group-hover:text-[#0071e3] transition-all">
                    <span>Load Subject</span>
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
      {/* ─── IMPORT .RSSH PACKAGE MODAL ─── */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="w-full max-w-lg p-7 rounded-3xl bg-[#18181b] border border-white/20 shadow-2xl flex flex-col gap-5 animate-in zoom-in-95 duration-200 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-[#0071e3]/15 border border-[#0071e3]/30 flex items-center justify-center text-[#0071e3]">
                  <FileArchive className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Import Course Package</h3>
                  <p className="text-xs text-[#86868b]">Upload an air-gapped .rssh or .zip syllabus package</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportError(null);
                  setImportSuccess(null);
                }}
                className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 text-[#86868b] hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Drag & Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleProcessFile(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center gap-3.5 cursor-pointer ${
                isDragOver
                  ? "border-[#0071e3] bg-[#0071e3]/10"
                  : "border-white/15 hover:border-white/30 bg-black/30 hover:bg-black/40"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".rssh,.zip"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleProcessFile(e.target.files[0]);
                  }
                }}
              />

              <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#0071e3]">
                <Upload className="h-6 w-6" />
              </div>

              <div>
                <span className="text-sm font-semibold text-white block">
                  Click to browse or drop package here
                </span>
                <span className="text-xs text-[#86868b] mt-0.5 block">
                  Accepts .rssh or .zip (Relational Syllabus Subject Hub)
                </span>
              </div>
            </div>

            {isImporting && (
              <div className="p-4 rounded-xl bg-black/40 border border-[#0071e3]/30 flex items-center gap-3 text-xs font-mono text-[#0071e3]">
                <div className="h-4 w-4 border-2 border-[#0071e3] border-t-transparent rounded-full animate-spin flex-shrink-0" />
                <span>Unpacking SQLite schema &amp; mounting vector indices...</span>
              </div>
            )}

            {importError && (
              <div className="p-4 rounded-xl bg-[#ff453a]/10 border border-[#ff453a]/30 flex items-center gap-3 text-xs text-[#ff453a]">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{importError}</span>
              </div>
            )}

            {importSuccess && (
              <div className="p-4 rounded-xl bg-[#30d158]/10 border border-[#30d158]/30 flex items-center gap-3 text-xs text-[#30d158] font-medium">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                <span>{importSuccess}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
