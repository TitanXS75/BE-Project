import React from "react";
import {
  GraduationCap,
  BookOpen,
  Layers,
  Sparkles,
  UserCheck,
  TrendingUp,
  Upload,
  FileText,
  Presentation,
  Package,
  Laptop,
  LogOut
} from "lucide-react";
import { AxiomLogo } from "../AxiomLogo";
import { StudentTab } from "../student/StudentWorkspace";
import { TeacherTab } from "../teacher/TeacherWorkspace";
import { SystemDiagnostics, CloudAiConfig } from "@/lib/api";

interface WorkspaceSidebarProps {
  mode: "student" | "teacher";
  studentTab: StudentTab;
  setStudentTab: (tab: StudentTab) => void;
  teacherTab: TeacherTab;
  setTeacherTab: (tab: TeacherTab) => void;
  activeSubject?: string;
  onOpenSubjectModal?: () => void;
  diagnostics: SystemDiagnostics | null;
  onOpenSpecsModal: () => void;
  onOpenLogoutConfirm: () => void;
  cloudConfig?: CloudAiConfig;
  onOpenAIModelModal?: () => void;
  selectedModel?: string;
}

export function WorkspaceSidebar({
  mode,
  studentTab,
  setStudentTab,
  teacherTab,
  setTeacherTab,
  diagnostics,
  onOpenSpecsModal,
  onOpenLogoutConfirm
}: WorkspaceSidebarProps) {

  return (
    <aside className="w-80 flex-shrink-0 border-r border-white/[0.08] bg-[#121214] flex flex-col justify-between z-20">
      <div className="p-5 flex flex-col gap-5 overflow-y-auto">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2">
          <AxiomLogo className="h-9 w-9" />
          <div>
            <h1 className="font-bold text-sm text-white tracking-tight">
              AXIOM
            </h1>
            <p className="text-xs text-[#86868b]">Curriculum Intelligence</p>
          </div>
        </div>

        {/* ─── ROLE-SPECIFIC IDENTITY CARD (NO ARBITRARY SWITCHER) ─── */}
        <div className="p-3.5 rounded-2xl bg-[#1c1c1e] border border-white/[0.08] flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div
              className={`h-9 w-9 rounded-xl flex items-center justify-center ${
                mode === "student"
                  ? "bg-[#0071e3]/15 text-[#0071e3] border border-[#0071e3]/20"
                  : "bg-[#ff9f0a]/15 text-[#ff9f0a] border border-[#ff9f0a]/20"
              }`}
            >
              {mode === "student" ? (
                <GraduationCap className="h-5 w-5" />
              ) : (
                <BookOpen className="h-5 w-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">
                  {mode === "student" ? "Student Workspace" : "Teacher Studio"}
                </span>
              </div>
              <p className="text-[11px] text-[#86868b]">
                {mode === "student" ? "Learner Profile • Active" : "Faculty Profile • Active"}
              </p>
            </div>
          </div>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize ${
              mode === "student"
                ? "bg-[#0071e3]/20 text-[#0071e3]"
                : "bg-[#ff9f0a]/20 text-[#ff9f0a]"
            }`}
          >
            {mode}
          </span>
        </div>

        {/* Navigation Menu Links */}
        <div className="flex flex-col gap-1.5 mt-1">
          <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider px-2 mb-1">
            {mode === "student" ? "Student Learning Tools" : "Instructor Authoring Studio"}
          </span>

          {mode === "student" ? (
            <>
              <button
                onClick={() => setStudentTab("chat")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all cursor-pointer ${
                  studentTab === "chat"
                    ? "bg-[#1c1c1e] text-white font-semibold shadow-sm border border-white/10"
                    : "text-[#86868b] hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <Sparkles className="h-4 w-4 text-[#0071e3]" />
                Grounded AI Tutor
              </button>
              <button
                onClick={() => setStudentTab("flashcards")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all cursor-pointer ${
                  studentTab === "flashcards"
                    ? "bg-[#1c1c1e] text-white font-semibold shadow-sm border border-white/10"
                    : "text-[#86868b] hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <Layers className="h-4 w-4 text-[#ff9f0a]" />
                Syllabus Flashcards
              </button>
              <button
                onClick={() => setStudentTab("teachback")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all cursor-pointer ${
                  studentTab === "teachback"
                    ? "bg-[#1c1c1e] text-white font-semibold shadow-sm border border-white/10"
                    : "text-[#86868b] hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <UserCheck className="h-4 w-4 text-[#0071e3]" />
                Feynman Teach-Back
              </button>
              <button
                onClick={() => setStudentTab("pyq")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all cursor-pointer ${
                  studentTab === "pyq"
                    ? "bg-[#1c1c1e] text-white font-semibold shadow-sm border border-white/10"
                    : "text-[#86868b] hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <TrendingUp className="h-4 w-4 text-[#ff9f0a]" />
                PYQ Trend Analyzer
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setTeacherTab("curriculum")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all cursor-pointer ${
                  teacherTab === "curriculum"
                    ? "bg-[#1c1c1e] text-white font-semibold shadow-sm border border-white/10"
                    : "text-[#86868b] hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <Upload className="h-4 w-4 text-[#0071e3]" />
                Document &amp; .rssh Ingestion
              </button>
              <button
                onClick={() => setTeacherTab("exam_builder")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all cursor-pointer ${
                  teacherTab === "exam_builder"
                    ? "bg-[#1c1c1e] text-white font-semibold shadow-sm border border-white/10"
                    : "text-[#86868b] hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <FileText className="h-4 w-4 text-[#ff9f0a]" />
                Exam Blueprint Builder
              </button>
              <button
                onClick={() => setTeacherTab("slides")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all cursor-pointer ${
                  teacherTab === "slides"
                    ? "bg-[#1c1c1e] text-white font-semibold shadow-sm border border-white/10"
                    : "text-[#86868b] hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <Presentation className="h-4 w-4 text-[#30d158]" />
                Lecture Slides (.pptx)
              </button>
              <button
                onClick={() => setTeacherTab("export")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all cursor-pointer ${
                  teacherTab === "export"
                    ? "bg-[#1c1c1e] text-white font-semibold shadow-sm border border-white/10"
                    : "text-[#86868b] hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <Package className="h-4 w-4 text-[#0071e3]" />
                Export .rssh Package
              </button>
            </>
          )}
        </div>
      </div>

      {/* Bottom Status & Logout Bar */}
      <div className="p-4 border-t border-white/[0.08] bg-black flex flex-col gap-2">
        <button
          onClick={onOpenSpecsModal}
          className="w-full text-left flex items-center justify-between text-xs text-[#86868b] hover:text-white transition-colors cursor-pointer p-2 rounded-xl hover:bg-white/[0.04]"
        >
          <span className="flex items-center gap-2">
            <Laptop className="h-4 w-4 text-[#0071e3]" />
            {diagnostics?.hardware.ram_total_gb || 16} GB RAM • {diagnostics?.hardware.cpu_cores || 12} Cores
          </span>
          <span className="text-[#0071e3] font-medium">Specs</span>
        </button>

        <button
          onClick={onOpenLogoutConfirm}
          className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#86868b] hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
          Log Out / Exit Session
        </button>
      </div>
    </aside>
  );
}

