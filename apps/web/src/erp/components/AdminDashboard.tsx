import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Users,
  Building2,
  BookOpen,
  Calendar,
  Megaphone,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { ErpApi } from "../supabase";
import { Student, Teacher, SchoolClass, Course, Notice, CalendarEvent, AdminTab } from "../types";

export function AdminDashboard({
  onNavigateTab,
}: {
  onNavigateTab?: (tab: AdminTab) => void;
}) {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [expandedNoticeId, setExpandedNoticeId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const [stu, tch, cls, crs, not, ev] = await Promise.all([
        ErpApi.getStudents(),
        ErpApi.getTeachers(),
        ErpApi.getClasses(),
        ErpApi.getCourses(),
        ErpApi.getNotices(),
        ErpApi.getEvents(),
      ]);
      setStudents(stu);
      setTeachers(tch);
      setClasses(cls);
      setCourses(crs);
      setNotices(not);
      setEvents(ev);
      if (not.length > 0) {
        setExpandedNoticeId(not[0].id);
      }
    }
    loadData();
  }, []);

  const totalStudents = students.length;
  const maleStudents = students.filter((s) => s.gender === "male").length;
  const femaleStudents = students.filter((s) => s.gender === "female").length;
  const otherStudents = totalStudents - maleStudents - femaleStudents;

  const malePercent = totalStudents > 0 ? Math.round((maleStudents / totalStudents) * 100) : 0;
  const femalePercent = totalStudents > 0 ? Math.round((femaleStudents / totalStudents) * 100) : 0;
  const otherPercent = totalStudents > 0 ? 100 - malePercent - femalePercent : 0;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-12">
      {/* Welcome Banner */}
      <div className="apple-card p-6 sm:p-8 rounded-3xl relative overflow-hidden border border-white/10 shadow-2xl">
        <div className="pointer-events-none absolute -right-20 -top-20 w-96 h-96 bg-[#0071e3]/10 blur-[120px] rounded-full" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Institutional Administration Live</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Axiom Enterprise ERP Hub
            </h1>
            <p className="text-xs sm:text-sm text-[#86868b] mt-1 max-w-2xl leading-relaxed">
              Real-time institutional management synchronized via Cloud Supabase with air-gapped local AI inference nodes.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateTab && onNavigateTab("students")}
              className="btn-apple-primary px-5 py-2.5 rounded-full text-xs font-semibold cursor-pointer"
            >
              Manage Students
            </button>
            <button
              onClick={() => onNavigateTab && onNavigateTab("academic")}
              className="btn-apple-secondary px-5 py-2.5 rounded-full text-xs font-semibold cursor-pointer"
            >
              Academic Setup
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="apple-card-interactive p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#86868b] uppercase tracking-wider">
              Enrolled Students
            </span>
            <div className="h-9 w-9 rounded-xl bg-[#0071e3]/15 text-[#0071e3] flex items-center justify-center">
              <GraduationCap className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-white tracking-tight">{totalStudents}</div>
            <div className="text-[11px] text-[#86868b] mt-1 flex items-center gap-1.5">
              <span className="text-[#30d158] font-medium">100% Active</span> in current session
            </div>
          </div>
        </div>

        {/* Total Teachers */}
        <div className="apple-card-interactive p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#86868b] uppercase tracking-wider">
              Faculty Members
            </span>
            <div className="h-9 w-9 rounded-xl bg-[#ff9f0a]/15 text-[#ff9f0a] flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-white tracking-tight">{teachers.length}</div>
            <div className="text-[11px] text-[#86868b] mt-1 flex items-center gap-1.5">
              <span className="text-[#30d158] font-medium">Allocated</span> to course sections
            </div>
          </div>
        </div>

        {/* Total Classes */}
        <div className="apple-card-interactive p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#86868b] uppercase tracking-wider">
              School Classes
            </span>
            <div className="h-9 w-9 rounded-xl bg-[#30d158]/15 text-[#30d158] flex items-center justify-center">
              <Building2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-white tracking-tight">{classes.length}</div>
            <div className="text-[11px] text-[#86868b] mt-1 flex items-center gap-1.5">
              Across all academic tiers
            </div>
          </div>
        </div>

        {/* Active Courses */}
        <div className="apple-card-interactive p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#86868b] uppercase tracking-wider">
              Active Courses
            </span>
            <div className="h-9 w-9 rounded-xl bg-[#38bdf8]/15 text-[#38bdf8] flex items-center justify-center">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-white tracking-tight">{courses.length}</div>
            <div className="text-[11px] text-[#86868b] mt-1 flex items-center gap-1.5">
              Curriculum aligned
            </div>
          </div>
        </div>
      </div>

      {/* Student Demographics Bar (Sikhi inspired) */}
      <div className="apple-card p-5 sm:p-6 rounded-2xl border border-white/[0.08]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Student Enrollment Ratio
            </span>
            <span className="text-xs text-[#86868b]">({totalStudents} total)</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-[#0071e3]" />
              <span className="text-[#86868b]">Male: {maleStudents} ({malePercent}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-[#ec4899]" />
              <span className="text-[#86868b]">Female: {femaleStudents} ({femalePercent}%)</span>
            </div>
            {otherStudents > 0 && (
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-[#ff9f0a]" />
                <span className="text-[#86868b]">Other: {otherStudents} ({otherPercent}%)</span>
              </div>
            )}
          </div>
        </div>

        {/* Stacked Progress Bar */}
        <div className="h-3 w-full rounded-full bg-white/[0.05] overflow-hidden flex">
          {malePercent > 0 && (
            <div
              style={{ width: `${malePercent}%` }}
              className="bg-[#0071e3] h-full transition-all duration-500"
              title={`Male: ${malePercent}%`}
            />
          )}
          {femalePercent > 0 && (
            <div
              style={{ width: `${femalePercent}%` }}
              className="bg-[#ec4899] h-full transition-all duration-500"
              title={`Female: ${femalePercent}%`}
            />
          )}
          {otherPercent > 0 && (
            <div
              style={{ width: `${otherPercent}%` }}
              className="bg-[#ff9f0a] h-full transition-all duration-500"
              title={`Other: ${otherPercent}%`}
            />
          )}
        </div>
      </div>

      {/* Split Section: Notices & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notices Board Accordion */}
        <div className="apple-card p-5 sm:p-6 rounded-2xl border border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-[#ec4899]/15 text-[#ec4899] flex items-center justify-center">
                  <Megaphone className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Institutional Notices</h3>
                  <p className="text-[11px] text-[#86868b]">Official announcements</p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab && onNavigateTab("notices")}
                className="text-xs text-[#0071e3] hover:underline font-semibold cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {notices.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#86868b]">
                  No active notices published yet.
                </div>
              ) : (
                notices.slice(0, 4).map((notice) => {
                  const isExpanded = expandedNoticeId === notice.id;
                  return (
                    <div
                      key={notice.id}
                      className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => setExpandedNoticeId(isExpanded ? null : notice.id)}
                        className="w-full p-3.5 text-left flex items-center justify-between gap-3 hover:bg-white/[0.03] transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                              notice.priority === "urgent"
                                ? "bg-red-500/20 text-red-400"
                                : notice.priority === "high"
                                ? "bg-[#ff9f0a]/20 text-[#ff9f0a]"
                                : "bg-white/10 text-[#86868b]"
                            }`}
                          >
                            {notice.priority}
                          </span>
                          <span className="text-xs font-semibold text-white line-clamp-1">
                            {notice.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#86868b] flex-shrink-0">
                          {notice.created_at}
                        </span>
                      </button>
                      {isExpanded && (
                        <div className="p-3.5 pt-0 text-xs text-[#86868b] leading-relaxed border-t border-white/[0.04] bg-white/[0.01]">
                          <p>{notice.content}</p>
                          <div className="mt-2 text-[10px] text-[#86868b]/70 flex items-center gap-1">
                            <span>Published by:</span>
                            <span className="text-[#f5f5f7] font-medium">{notice.published_by}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-[#86868b]">
            <span>Total {notices.length} active announcements</span>
            <span className="text-emerald-400 flex items-center gap-1 font-medium">
              <CheckCircle2 className="h-3 w-3" /> Live Feed
            </span>
          </div>
        </div>

        {/* Upcoming Calendar Events */}
        <div className="apple-card p-5 sm:p-6 rounded-2xl border border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-[#38bdf8]/15 text-[#38bdf8] flex items-center justify-center">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Upcoming Academic Events</h3>
                  <p className="text-[11px] text-[#86868b]">Schedule and key dates</p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab && onNavigateTab("events")}
                className="text-xs text-[#0071e3] hover:underline font-semibold cursor-pointer"
              >
                Calendar
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {events.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#86868b]">
                  No upcoming events scheduled.
                </div>
              ) : (
                events.slice(0, 4).map((event) => {
                  const eventDate = new Date(event.start_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                  return (
                    <div
                      key={event.id}
                      className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-start justify-between gap-3 hover:bg-white/[0.03] transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-9 w-9 rounded-xl bg-white/[0.06] border border-white/10 flex flex-col items-center justify-center flex-shrink-0 text-white">
                          <span className="text-[9px] uppercase font-bold text-[#0071e3]">
                            {eventDate.split(" ")[0]}
                          </span>
                          <span className="text-xs font-extrabold leading-none">
                            {eventDate.split(" ")[1]}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-white">{event.title}</h4>
                          {event.description && (
                            <p className="text-[11px] text-[#86868b] line-clamp-1 mt-0.5">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize flex-shrink-0 ${
                          event.event_type === "academic"
                            ? "bg-[#0071e3]/20 text-[#0071e3]"
                            : event.event_type === "holiday"
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-purple-500/20 text-purple-400"
                        }`}
                      >
                        {event.event_type}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-[#86868b]">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3 w-3" /> Automatic Session Sync
            </span>
            <span className="text-white font-medium">Next event in 2 days</span>
          </div>
        </div>
      </div>
    </div>
  );
}
