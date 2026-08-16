import React, { useState } from "react";
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
  LogOut,
  ChevronLeft,
  ChevronRight
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`relative flex-shrink-0 border-r border-white/[0.08] bg-[#121214] flex flex-col justify-between z-20 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-[72px]" : "w-72 sm:w-80"
      }`}
    >
      {/* ─── FLOATING EDGE TOGGLE (< and > AT EDGE IN CENTER) ─── */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        className="absolute top-1/2 -translate-y-1/2 -right-3.5 z-30 h-7 w-7 rounded-full bg-[#1c1c1e] hover:bg-[#2c2c2e] text-[#86868b] hover:text-white border border-white/20 flex items-center justify-center cursor-pointer shadow-xl transition-all hover:scale-105"
      >
        {isCollapsed ? (
          <ChevronRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )}
      </button>

      <div className={`flex flex-col gap-4 overflow-y-auto ${isCollapsed ? "p-3 items-center" : "p-5"}`}>
        {/* Brand Header */}
        <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-2"}`}>
          <AxiomLogo className="h-9 w-9 flex-shrink-0" />
          {!isCollapsed && (
            <div>
              <h1 className="font-bold text-sm text-white tracking-tight">AXIOM</h1>
              <p className="text-xs text-[#86868b]">Curriculum Intelligence</p>
            </div>
          )}
        </div>

        {/* ─── ROLE-SPECIFIC IDENTITY CARD ─── */}
        {isCollapsed ? (
          <div
            title={mode === "student" ? "Student Workspace" : "Teacher Studio"}
            className={`h-11 w-11 rounded-2xl flex items-center justify-center shadow-sm cursor-default ${
              mode === "student"
                ? "bg-[#0071e3]/15 text-[#0071e3] border border-[#0071e3]/20"
                : "bg-[#ff9f0a]/15 text-[#ff9f0a] border border-[#ff9f0a]/20"
            }`}
          >
            {mode === "student" ? <GraduationCap className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-[#1c1c1e] border border-white/[0.08] flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div
                className={`h-9 w-9 rounded-xl flex items-center justify-center ${
                  mode === "student"
                    ? "bg-[#0071e3]/15 text-[#0071e3] border border-[#0071e3]/20"
                    : "bg-[#ff9f0a]/15 text-[#ff9f0a] border border-[#ff9f0a]/20"
                }`}
              >
                {mode === "student" ? <GraduationCap className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
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
                mode === "student" ? "bg-[#0071e3]/20 text-[#0071e3]" : "bg-[#ff9f0a]/20 text-[#ff9f0a]"
              }`}
            >
              {mode}
            </span>
          </div>
        )}

        {/* Navigation Menu Links */}
        <div className={`flex flex-col gap-1.5 ${isCollapsed ? "items-center w-full mt-2" : "mt-1"}`}>
          {!isCollapsed && (
            <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider px-2 mb-1">
              {mode === "student" ? "Student Learning Tools" : "Instructor Authoring Studio"}
            </span>
          )}

          {mode === "student" ? (
            <>
              <button
                onClick={() => setStudentTab("chat")}
                title="Grounded AI Tutor"
                className={`flex items-center rounded-2xl transition-all cursor-pointer ${
                  isCollapsed
                    ? `h-11 w-11 justify-center ${
                        studentTab === "chat"
                          ? "bg-[#1c1c1e] text-white shadow-sm border border-white/10"
                          : "text-[#86868b] hover:bg-white/[0.04] hover:text-white"
                      }`
                    : `w-full gap-3 px-3.5 py-2.5 text-xs font-medium ${
                        studentTab === "chat"
                          ? "bg-[#1c1c1e] text-white font-semibold shadow-sm border border-white/10"
                          : "text-[#86868b] hover:bg-white/[0.04] hover:text-white"
                      }`
                }`}
              >
                <Sparkles className="h-4 w-4 text-[#0071e3] flex-shrink-0" />
                {!isCollapsed && <span>Grounded AI Tutor</span>}
              </button>

              <button
                onClick={() => setStudentTab("flashcards")}
                title="Syllabus Flashcards"
                className={`flex items-center rounded-2xl transition-all cursor-pointer ${
                  isCollapsed
                    ? `h-11 w-11 justify-center ${
                        studentTab === "flashcards"
                          ? "bg-[#1c1c1e] text-white shadow-sm border border-white/10"
                          : "text-[#86868b] hover:bg-white/[0.04] hover:text-white"
                      }`
                    : `w-full gap-3 px-3.5 py-2.5 text-xs font-medium ${
                        studentTab === "flashcards"
                          ? "bg-[#1c1c1e] text-white font-semibold shadow-sm border border-white/10"
                          : "text-[#86868b] hover:bg-white/[0.04] hover:text-white"
                      }`
                }`}
              >
                <Layers className="h-4 w-4 text-[#ff9f0a] flex-shrink-0" />
                {!isCollapsed && <span>Syllabus Flashcards</span>}
              </button>

              <button
                onClick={() => setStudentTab("teachback")}
                title="Feynman Teach-Back"
                className={`flex items-center rounded-2xl transition-all cursor-pointer ${
                  isCollapsed
                    ? `h-11 w-11 justify-center ${
                        studentTab === "teachback"
                          ? "bg-[#1c1c1e] text-white shadow-sm border border-white/10"
                          : "text-[#86868b] hover:bg-white/[0.04] hover:text-white"
                      }`
                    : `w-full gap-3 px-3.5 py-2.5 text-xs font-medium ${
                        studentTab === "teachback"
                          ? "bg-[#1c1c1e] text-white font-semibold shadow-sm border border-white/10"
                          : "text-[#86868b] hover:bg-white/[0.04] hover:text-white"
                      }`
                }`}
              >
                <UserCheck className="h-4 w-4 text-[#0071e3] flex-shrink-0" />
                {!isCollapsed && <span>Feynman Teach-Back</span>}
              </button>

              <button
                onClick={() => setStudentTab("pyq")}
                title="PYQ Trend Analyzer"
                className={`flex items-center rounded-2xl transition-all cursor-pointer ${
                  isCollapsed
                    ? `h-11 w-11 justify-center ${
                        studentTab === "pyq"
                          ? "bg-[#1c1c1e] text-white shadow-sm border border-white/10"
                          : "text-[#86868b] hover:bg-white/[0.04] hover:text-white"
                      }`
                    : `w-full gap-3 px-3.5 py-2.5 text-xs font-medium ${
                        studentTab === "pyq"
                          ? "bg-[#1c1c1e] text-white font-semibold shadow-sm border border-white/10"
                          : "text-[#86868b] hover:bg-white/[0.04] hover:text-white"
                      }`
                }`}
              >
                <TrendingUp className="h-4 w-4 text-[#ff9f0a] flex-shrink-0" />
                {!isCollapsed && <span>PYQ Trend Analyzer</span>}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setTeacherTab("curriculum")}
                title="Document & .rssh Ingestion"
                className={`flex items-center rounded-2xl transition-all cursor-pointer ${
                  isCollapsed
                    ? `h-11 w-11 justify-center ${
                        teacherTab === "curriculum"
                          ? "bg-[#1c1c1e] text-white shadow-sm border border-white/10"
                          : "text-[#86868b] hover:bg-white/[0.04] hover:text-white"
                      }`
                    : `w-full gap-3 px-3.5 py-2.5 text-xs font-medium ${
                        teacherTab === "curriculum"
                          ? "bg-[#1c1c1e] text-white font-semibold shadow-sm border border-white/10"
                          : "text-[#86868b] hover:bg-white/[0.04] hover:text-white"
                      }`
                }`}
              >
                <Upload className="h-4 w-4 text-[#0071e3] flex-shrink-0" />
                {!isCollapsed && <span>Document &amp; .rssh Ingestion</span>}
              </button>

              <button
                onClick={() => setTeacherTab("exam_builder")}
                title="Exam Blueprint Builder"
                className={`flex items-center rounded-2xl transition-all cursor-pointer ${
                  isCollapsed
                    ? `h-11 w-11 justify-center ${
                        teacherTab === "exam_builder"
                          ? "bg-[#1c1c1e] text-white shadow-sm border border-white/10"
                          : "text-[#86868b] hover:bg-white/[0.04] hover:text-white"
                      }`
                    : `w-full gap-3 px-3.5 py-2.5 text-xs font-medium ${
                        teacherTab === "exam_builder"
                          ? "bg-[#1c1c1e] text-white font-semibold shadow-sm border border-white/10"
                          : "text-[#86868b] hover:bg-white/[0.04] hover:text-white"
                      }`
                }`}
              >
                <FileText className="h-4 w-4 text-[#ff9f0a] flex-shrink-0" />
                {!isCollapsed && <span>Exam Blueprint Builder</span>}
              </button>

              <button
                onClick={() => setTeacherTab("slides")}
                title="Lecture Slides (.pptx)"
                className={`flex items-center rounded-2xl transition-all cursor-pointer ${
                  isCollapsed
                    ? `h-11 w-11 justify-center ${
                        teacherTab === "slides"
                          ? "bg-[#1c1c1e] text-white shadow-sm border border-white/10"
                          : "text-[#86868b] hover:bg-white/[0.04] hover:text-white"
                      }`
                    : `w-full gap-3 px-3.5 py-2.5 text-xs font-medium ${
                        teacherTab === "slides"
                          ? "bg-[#1c1c1e] text-white font-semibold shadow-sm border border-white/10"
                          : "text-[#86868b] hover:bg-white/[0.04] hover:text-white"
                      }`
                }`}
              >
                <Presentation className="h-4 w-4 text-[#30d158] flex-shrink-0" />
                {!isCollapsed && <span>Lecture Slides (.pptx)</span>}
              </button>

              <button
                onClick={() => setTeacherTab("export")}
                title="Export .rssh Package"
                className={`flex items-center rounded-2xl transition-all cursor-pointer ${
                  isCollapsed
                    ? `h-11 w-11 justify-center ${
                        teacherTab === "export"
                          ? "bg-[#1c1c1e] text-white shadow-sm border border-white/10"
                          : "text-[#86868b] hover:bg-white/[0.04] hover:text-white"
                      }`
                    : `w-full gap-3 px-3.5 py-2.5 text-xs font-medium ${
                        teacherTab === "export"
                          ? "bg-[#1c1c1e] text-white font-semibold shadow-sm border border-white/10"
                          : "text-[#86868b] hover:bg-white/[0.04] hover:text-white"
                      }`
                }`}
              >
                <Package className="h-4 w-4 text-[#0071e3] flex-shrink-0" />
                {!isCollapsed && <span>Export .rssh Package</span>}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Bottom Status & Logout Bar */}
      <div className={`border-t border-white/[0.08] bg-black flex flex-col gap-2 ${isCollapsed ? "p-2.5 items-center" : "p-4"}`}>
        <button
          onClick={onOpenSpecsModal}
          title={isCollapsed ? `Specs (${diagnostics?.hardware.ram_total_gb || 16} GB RAM)` : undefined}
          className={`text-left flex items-center text-xs text-[#86868b] hover:text-white transition-colors cursor-pointer rounded-xl hover:bg-white/[0.04] ${
            isCollapsed ? "h-10 w-10 justify-center" : "w-full justify-between p-2"
          }`}
        >
          <span className="flex items-center gap-2">
            <Laptop className="h-4 w-4 text-[#0071e3] flex-shrink-0" />
            {!isCollapsed && (
              <span>
                {diagnostics?.hardware.ram_total_gb || 16} GB RAM • {diagnostics?.hardware.cpu_cores || 12} Cores
              </span>
            )}
          </span>
          {!isCollapsed && <span className="text-[#0071e3] font-medium">Specs</span>}
        </button>

        <button
          onClick={onOpenLogoutConfirm}
          title={isCollapsed ? "Log Out / Exit Session" : undefined}
          className={`rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#86868b] hover:text-white transition-all flex items-center justify-center cursor-pointer ${
            isCollapsed ? "h-10 w-10" : "w-full py-2 px-3 gap-2"
          }`}
        >
          <LogOut className="h-3.5 w-3.5 flex-shrink-0" />
          {!isCollapsed && <span>Log Out / Exit Session</span>}
        </button>
      </div>
    </aside>
  );
}

