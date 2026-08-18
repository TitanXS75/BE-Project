import React, { useState } from "react";
import {
  GraduationCap,
  BookOpen,
  ShieldCheck,
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
  ChevronRight,
  LayoutDashboard,
  Building2,
  Users,
  CalendarCheck,
  Award,
  Clock,
  Megaphone,
  Calendar,
} from "lucide-react";
import { AxiomLogo } from "../AxiomLogo";
import { StudentTab } from "../student/StudentWorkspace";
import { TeacherTab } from "../teacher/TeacherWorkspace";
import { AdminTab } from "@/erp";
import { SystemDiagnostics, CloudAiConfig } from "@/lib/api";

interface WorkspaceSidebarProps {
  mode: "student" | "teacher" | "admin";
  studentTab: StudentTab;
  setStudentTab: (tab: StudentTab) => void;
  teacherTab: TeacherTab;
  setTeacherTab: (tab: TeacherTab) => void;
  adminTab?: AdminTab;
  setAdminTab?: (tab: AdminTab) => void;
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
  adminTab = "dashboard",
  setAdminTab,
  diagnostics,
  onOpenSpecsModal,
  onOpenLogoutConfirm,
}: WorkspaceSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getRoleHeader = () => {
    if (mode === "student") {
      return {
        title: "Student Workspace",
        subtitle: "Learner Profile • Active",
        icon: <GraduationCap className="h-5 w-5" />,
        badgeBg: "bg-[#0071e3]/20 text-[#0071e3]",
        iconBg: "bg-[#0071e3]/15 text-[#0071e3] border-[#0071e3]/20",
      };
    }
    if (mode === "teacher") {
      return {
        title: "Teacher Studio",
        subtitle: "Faculty Profile • Active",
        icon: <BookOpen className="h-5 w-5" />,
        badgeBg: "bg-[#ff9f0a]/20 text-[#ff9f0a]",
        iconBg: "bg-[#ff9f0a]/15 text-[#ff9f0a] border-[#ff9f0a]/20",
      };
    }
    return {
      title: "Institution Admin",
      subtitle: "Enterprise ERP • Active",
      icon: <ShieldCheck className="h-5 w-5" />,
      badgeBg: "bg-emerald-500/20 text-emerald-400",
      iconBg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    };
  };

  const roleInfo = getRoleHeader();

  return (
    <aside
      className={`relative flex-shrink-0 border-r border-white/[0.08] bg-[#121214] flex flex-col justify-between z-20 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-[72px]" : "w-72 sm:w-80"
      }`}
    >
      {/* Edge Toggle */}
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

        {/* Role Card */}
        {isCollapsed ? (
          <div
            title={roleInfo.title}
            className={`h-11 w-11 rounded-2xl flex items-center justify-center shadow-sm cursor-default border ${roleInfo.iconBg}`}
          >
            {roleInfo.icon}
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-[#1c1c1e] border border-white/[0.08] flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`h-9 w-9 rounded-xl flex items-center justify-center border ${roleInfo.iconBg}`}>
                {roleInfo.icon}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">
                    {roleInfo.title}
                  </span>
                </div>
                <p className="text-[11px] text-[#86868b]">
                  {roleInfo.subtitle}
                </p>
              </div>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize ${roleInfo.badgeBg}`}>
              {mode}
            </span>
          </div>
        )}

        {/* Navigation Menu Links */}
        <div className={`flex flex-col gap-1.5 ${isCollapsed ? "items-center w-full mt-2" : "mt-1"}`}>
          {!isCollapsed && (
            <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider px-2 mb-1">
              {mode === "student"
                ? "Student Learning Tools"
                : mode === "teacher"
                ? "Instructor Authoring Studio"
                : "Enterprise Administration"}
            </span>
          )}

          {/* Student Tabs */}
          {mode === "student" && (
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
          )}

          {/* Teacher Tabs */}
          {mode === "teacher" && (
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

          {/* Admin Tabs */}
          {mode === "admin" && setAdminTab && (
            <>
              <button
                onClick={() => setAdminTab("dashboard")}
                title="ERP Overview"
                className={`flex items-center rounded-2xl transition-all cursor-pointer ${
                  isCollapsed
                    ? `h-11 w-11 justify-center ${
                        adminTab === "dashboard"
                          ? "bg-[#1c1c1e] text-white shadow-sm border border-white/10"
                          : "text-[#86868b] hover:bg-white/[0.04] hover:text-white"
                      }`
                    : `w-full gap-3 px-3.5 py-2.5 text-xs font-medium ${
                        adminTab === "dashboard"
                          ? "bg-[#1c1c1e] text-white font-semibold shadow-sm border border-white/10"
                          : "text-[#86868b] hover:bg-white/[0.04] hover:text-white"
                      }`
                }`}
              >
                <LayoutDashboard className="h-4 w-4 text-[#0071e3] flex-shrink-0" />
                {!isCollapsed && <span>ERP Dashboard</span>}
              </button>

              <button
                onClick={() => setAdminTab("academic")}
                title="Academic Structure"
                className={`flex items-center rounded-2xl transition-all cursor-pointer ${
                  isCollapsed
                    ? `h-11 w-11 justify-center ${
                        adminTab === "academic"
                          ? "bg-[#1c1c1e] text-white shadow-sm border border-white/10"
                          : "text-[#86868b] hover:bg-white/[0.04] hover:text-white"
                      }`
                    : `w-full gap-3 px-3.5 py-2.5 text-xs font-medium ${
                        adminTab === "academic"
                          ? "bg-[#1c1c1e] text-white font-semibold shadow-sm border border-white/10"
                          : "text-[#86868b] hover:bg-white/[0.04] hover:text-white"
                      }`
                }`}
              >
                <Building2 className="h-4 w-4 text-[#ff9f0a] flex-shrink-0" />
                {!isCollapsed && <span>Academic &amp; Classes</span>}
              </button>

              <button
                onClick={() => setAdminTab("students")}
                title="Student Roster"
                className={`flex items-center rounded-2xl transition-all cursor-pointer ${
                  isCollapsed
                    ? `h-11 w-11 justify-center ${
                        adminTab === "students"
                          ? "bg-[#1c1c1e] text-white shadow-sm border border-white/10"
                          : "text-[#86868b] hover:bg-white/[0.04] hover:text-white"
                      }`
                    : `w-full gap-3 px-3.5 py-2.5 text-xs font-medium ${
                        adminTab === "students"
                          ? "bg-[#1c1c1e] text-white font-semibold shadow-sm border border-white/10"
                          : "text-[#86868b] hover:bg-white/[0.04] hover:text-white"
                      }`
                }`}
              >
                <GraduationCap className="h-4 w-4 text-[#30d158] flex-shrink-0" />
                {!isCollapsed && <span>Student Directory</span>}
              </button>

              <button
                onClick={() => setAdminTab("teachers")}
                title="Faculty Directory"
                className={`flex items-center rounded-2xl transition-all cursor-pointer ${
                  isCollapsed
                    ? `h-11 w-11 justify-center ${
                        adminTab === "teachers"
                          ? "bg-[#1c1c1e] text-white shadow-sm border border-white/10"
                          : "text-[#86868b] hover:bg-white/[0.04] hover:text-white"
                      }`
                    : `w-full gap-3 px-3.5 py-2.5 text-xs font-medium ${
                        adminTab === "teachers"
                          ? "bg-[#1c1c1e] text-white font-semibold shadow-sm border border-white/10"
                          : "text-[#86868b] hover:bg-white/[0.04] hover:text-white"
                      }`
                }`}
              >
                <Users className="h-4 w-4 text-[#38bdf8] flex-shrink-0" />
                {!isCollapsed && <span>Faculty Directory</span>}
              </button>

              <button
                onClick={() => setAdminTab("attendance")}
                title="Attendance Tracker"
                className={`flex items-center rounded-2xl transition-all cursor-pointer ${
                  isCollapsed
                    ? `h-11 w-11 justify-center ${
                        adminTab === "attendance"
                          ? "bg-[#1c1c1e] text-white shadow-sm border border-white/10"
                          : "text-[#86868b] hover:bg-white/[0.04] hover:text-white"
                      }`
                    : `w-full gap-3 px-3.5 py-2.5 text-xs font-medium ${
                        adminTab === "attendance"
                          ? "bg-[#1c1c1e] text-white font-semibold shadow-sm border border-white/10"
                          : "text-[#86868b] hover:bg-white/[0.04] hover:text-white"
                      }`
                }`}
              >
                <CalendarCheck className="h-4 w-4 text-[#a855f7] flex-shrink-0" />
                {!isCollapsed && <span>Attendance Tracker</span>}
              </button>

              <button
                onClick={() => setAdminTab("exams")}
                title="Exam &amp; Grade Center"
                className={`flex items-center rounded-2xl transition-all cursor-pointer ${
                  isCollapsed
                    ? `h-11 w-11 justify-center ${
                        adminTab === "exams"
                          ? "bg-[#1c1c1e] text-white shadow-sm border border-white/10"
                          : "text-[#86868b] hover:bg-white/[0.04] hover:text-white"
                      }`
                    : `w-full gap-3 px-3.5 py-2.5 text-xs font-medium ${
                        adminTab === "exams"
                          ? "bg-[#1c1c1e] text-white font-semibold shadow-sm border border-white/10"
                          : "text-[#86868b] hover:bg-white/[0.04] hover:text-white"
                      }`
                }`}
              >
                <Award className="h-4 w-4 text-[#ff9f0a] flex-shrink-0" />
                {!isCollapsed && <span>Exams &amp; Grading</span>}
              </button>

              <button
                onClick={() => setAdminTab("timetable")}
                title="Timetable Scheduler"
                className={`flex items-center rounded-2xl transition-all cursor-pointer ${
                  isCollapsed
                    ? `h-11 w-11 justify-center ${
                        adminTab === "timetable"
                          ? "bg-[#1c1c1e] text-white shadow-sm border border-white/10"
                          : "text-[#86868b] hover:bg-white/[0.04] hover:text-white"
                      }`
                    : `w-full gap-3 px-3.5 py-2.5 text-xs font-medium ${
                        adminTab === "timetable"
                          ? "bg-[#1c1c1e] text-white font-semibold shadow-sm border border-white/10"
                          : "text-[#86868b] hover:bg-white/[0.04] hover:text-white"
                      }`
                }`}
              >
                <Clock className="h-4 w-4 text-[#0071e3] flex-shrink-0" />
                {!isCollapsed && <span>Timetable Routines</span>}
              </button>

              <button
                onClick={() => setAdminTab("notices")}
                title="Notice Board"
                className={`flex items-center rounded-2xl transition-all cursor-pointer ${
                  isCollapsed
                    ? `h-11 w-11 justify-center ${
                        adminTab === "notices"
                          ? "bg-[#1c1c1e] text-white shadow-sm border border-white/10"
                          : "text-[#86868b] hover:bg-white/[0.04] hover:text-white"
                      }`
                    : `w-full gap-3 px-3.5 py-2.5 text-xs font-medium ${
                        adminTab === "notices"
                          ? "bg-[#1c1c1e] text-white font-semibold shadow-sm border border-white/10"
                          : "text-[#86868b] hover:bg-white/[0.04] hover:text-white"
                      }`
                }`}
              >
                <Megaphone className="h-4 w-4 text-[#ec4899] flex-shrink-0" />
                {!isCollapsed && <span>Notice Board</span>}
              </button>

              <button
                onClick={() => setAdminTab("events")}
                title="Calendar Events"
                className={`flex items-center rounded-2xl transition-all cursor-pointer ${
                  isCollapsed
                    ? `h-11 w-11 justify-center ${
                        adminTab === "events"
                          ? "bg-[#1c1c1e] text-white shadow-sm border border-white/10"
                          : "text-[#86868b] hover:bg-white/[0.04] hover:text-white"
                      }`
                    : `w-full gap-3 px-3.5 py-2.5 text-xs font-medium ${
                        adminTab === "events"
                          ? "bg-[#1c1c1e] text-white font-semibold shadow-sm border border-white/10"
                          : "text-[#86868b] hover:bg-white/[0.04] hover:text-white"
                      }`
                }`}
              >
                <Calendar className="h-4 w-4 text-[#38bdf8] flex-shrink-0" />
                {!isCollapsed && <span>Calendar Events</span>}
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
