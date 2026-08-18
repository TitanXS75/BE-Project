import React from "react";
import {
  ShieldCheck,
  Building2,
  GraduationCap,
  Users,
  CalendarCheck,
  Award,
  Clock,
  Megaphone,
} from "lucide-react";
import { AdminTab } from "../types";

interface AdminWelcomeHubProps {
  onEnterTab: (tab: AdminTab) => void;
  onOpenLogoutConfirm: () => void;
}

export function AdminWelcomeHub({ onEnterTab }: AdminWelcomeHubProps) {
  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full py-6 px-4 sm:px-8">
      {/* Hero Welcome Banner */}
      <div className="apple-card p-8 sm:p-10 rounded-3xl relative overflow-hidden border border-white/10 shadow-2xl">
        <div className="pointer-events-none absolute -right-20 -top-20 w-96 h-96 bg-emerald-500/10 blur-[140px] rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-xs font-semibold mb-3">
              <ShieldCheck className="h-4 w-4" />
              <span>Enterprise ERP System Connected</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Institutional Administration Center
            </h1>
            <p className="text-xs sm:text-sm text-[#86868b] mt-2 max-w-2xl leading-relaxed">
              Complete centralized school &amp; university ERP engine. Manage academic tiers, student admissions, faculty allocations, attendance matrices, examination scorecards, and live circulars.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => onEnterTab("dashboard")}
              className="btn-apple-primary px-6 py-3 rounded-full text-xs font-bold w-full sm:w-auto cursor-pointer shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Open Live Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Quick Launchpad Bento Grid */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight uppercase tracking-wider">
              Administration Modules
            </h2>
            <p className="text-xs text-[#86868b]">Select a tool to launch institutional workspace</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Dashboard */}
          <div
            onClick={() => onEnterTab("dashboard")}
            className="apple-card-interactive p-5 rounded-2xl flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="h-10 w-10 rounded-xl bg-[#0071e3]/15 text-[#0071e3] flex items-center justify-center mb-3">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Executive KPIs</h3>
              <p className="text-[11px] text-[#86868b] leading-relaxed">
                Summary metrics, student gender ratios, active circulars, and calendar highlights.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-white/[0.06] text-[11px] text-[#0071e3] font-semibold">
              Launch Dashboard
            </div>
          </div>

          {/* Academic Structure */}
          <div
            onClick={() => onEnterTab("academic")}
            className="apple-card-interactive p-5 rounded-2xl flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="h-10 w-10 rounded-xl bg-[#ff9f0a]/15 text-[#ff9f0a] flex items-center justify-center mb-3">
                <Building2 className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Academic &amp; Classes</h3>
              <p className="text-[11px] text-[#86868b] leading-relaxed">
                Create sessions, classes, sections with room assignments, and curriculum subjects.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-white/[0.06] text-[11px] text-[#ff9f0a] font-semibold">
              Configure Classes
            </div>
          </div>

          {/* Student Directory */}
          <div
            onClick={() => onEnterTab("students")}
            className="apple-card-interactive p-5 rounded-2xl flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="h-10 w-10 rounded-xl bg-[#30d158]/15 text-[#30d158] flex items-center justify-center mb-3">
                <GraduationCap className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Student Directory</h3>
              <p className="text-[11px] text-[#86868b] leading-relaxed">
                Admissions registry, roll numbers, personal contact details, and student dossiers.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-white/[0.06] text-[11px] text-[#30d158] font-semibold">
              Manage Roster
            </div>
          </div>

          {/* Faculty Roster */}
          <div
            onClick={() => onEnterTab("teachers")}
            className="apple-card-interactive p-5 rounded-2xl flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="h-10 w-10 rounded-xl bg-[#38bdf8]/15 text-[#38bdf8] flex items-center justify-center mb-3">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Faculty Registry</h3>
              <p className="text-[11px] text-[#86868b] leading-relaxed">
                Departmental appointments, instructor allocations, and course assignments.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-white/[0.06] text-[11px] text-[#38bdf8] font-semibold">
              View Faculty
            </div>
          </div>

          {/* Attendance Tracker */}
          <div
            onClick={() => onEnterTab("attendance")}
            className="apple-card-interactive p-5 rounded-2xl flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="h-10 w-10 rounded-xl bg-[#a855f7]/15 text-[#a855f7] flex items-center justify-center mb-3">
                <CalendarCheck className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Attendance Tracker</h3>
              <p className="text-[11px] text-[#86868b] leading-relaxed">
                Daily section attendance roll call with instant matrix recording and stats.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-white/[0.06] text-[11px] text-[#a855f7] font-semibold">
              Take Attendance
            </div>
          </div>

          {/* Exams & Grades */}
          <div
            onClick={() => onEnterTab("exams")}
            className="apple-card-interactive p-5 rounded-2xl flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="h-10 w-10 rounded-xl bg-[#ff9f0a]/15 text-[#ff9f0a] flex items-center justify-center mb-3">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Exams &amp; Grading</h3>
              <p className="text-[11px] text-[#86868b] leading-relaxed">
                Evaluation scheduling, marks sheet entries, pass thresholds, and GPA calculation.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-white/[0.06] text-[11px] text-[#ff9f0a] font-semibold">
              Manage Exams
            </div>
          </div>

          {/* Timetable Planner */}
          <div
            onClick={() => onEnterTab("timetable")}
            className="apple-card-interactive p-5 rounded-2xl flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="h-10 w-10 rounded-xl bg-[#0071e3]/15 text-[#0071e3] flex items-center justify-center mb-3">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Timetable Planner</h3>
              <p className="text-[11px] text-[#86868b] leading-relaxed">
                Weekly routine grid, period time slots, lab bookings, and class schedules.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-white/[0.06] text-[11px] text-[#0071e3] font-semibold">
              Schedule Routines
            </div>
          </div>

          {/* Notice Board */}
          <div
            onClick={() => onEnterTab("notices")}
            className="apple-card-interactive p-5 rounded-2xl flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="h-10 w-10 rounded-xl bg-[#ec4899]/15 text-[#ec4899] flex items-center justify-center mb-3">
                <Megaphone className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Notice Board</h3>
              <p className="text-[11px] text-[#86868b] leading-relaxed">
                Broadcast official circulars, exam dates, and campus communications.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-white/[0.06] text-[11px] text-[#ec4899] font-semibold">
              Post Circular
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
