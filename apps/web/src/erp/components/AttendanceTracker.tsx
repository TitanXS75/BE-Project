import React, { useState, useEffect } from "react";
import {
  CalendarCheck,
  Calendar,
  Save,
  CheckCircle2,
} from "lucide-react";
import { ErpApi } from "../supabase";
import { Student, SchoolClass, Section, AttendanceRecord } from "../types";

export function AttendanceTracker() {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<
    Record<string, "present" | "absent" | "late" | "excused">
  >({});
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadMeta() {
      const [cls, sec] = await Promise.all([
        ErpApi.getClasses(),
        ErpApi.getSections(),
      ]);
      setClasses(cls);
      setSections(sec);
      if (cls.length > 0) {
        setSelectedClassId(cls[0].id);
        const classSecs = sec.filter((s) => s.class_id === cls[0].id);
        if (classSecs.length > 0) {
          setSelectedSectionId(classSecs[0].id);
        }
      }
    }
    loadMeta();
  }, []);

  useEffect(() => {
    if (!selectedSectionId) return;

    async function loadAttendanceSheet() {
      const [allStudents, recorded] = await Promise.all([
        ErpApi.getStudents(selectedClassId, selectedSectionId),
        ErpApi.getAttendance(attendanceDate, selectedSectionId),
      ]);
      setStudents(allStudents);

      const map: Record<string, "present" | "absent" | "late" | "excused"> = {};
      allStudents.forEach((stu) => {
        const found = recorded.find((r) => r.student_id === stu.id);
        map[stu.id] = found ? found.status : "present";
      });
      setAttendanceMap(map);
      setSavedSuccess(false);
    }
    loadAttendanceSheet();
  }, [selectedClassId, selectedSectionId, attendanceDate]);

  const availableSections = sections.filter((s) => s.class_id === selectedClassId);

  const handleStatusToggle = (
    studentId: string,
    status: "present" | "absent" | "late" | "excused"
  ) => {
    setAttendanceMap((prev) => ({ ...prev, [studentId]: status }));
    setSavedSuccess(false);
  };

  const handleMarkAll = (status: "present" | "absent") => {
    const updated: Record<string, "present" | "absent" | "late" | "excused"> = {};
    students.forEach((stu) => {
      updated[stu.id] = status;
    });
    setAttendanceMap(updated);
    setSavedSuccess(false);
  };

  const handleSaveAttendance = async () => {
    const records: Omit<AttendanceRecord, "id">[] = students.map((stu) => ({
      student_id: stu.id,
      section_id: selectedSectionId,
      date: attendanceDate,
      status: attendanceMap[stu.id] || "present",
    }));

    await ErpApi.recordAttendance(records);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const presentCount = Object.values(attendanceMap).filter((s) => s === "present").length;
  const absentCount = Object.values(attendanceMap).filter((s) => s === "absent").length;
  const lateCount = Object.values(attendanceMap).filter((s) => s === "late").length;
  const total = students.length;
  const attendanceRate = total > 0 ? Math.round((presentCount / total) * 100) : 100;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <CalendarCheck className="h-6 w-6 text-[#a855f7]" />
            Attendance Tracking Matrix
          </h1>
          <p className="text-xs text-[#86868b] mt-1">
            Record, update, and monitor daily attendance across sections.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleMarkAll("present")}
            className="btn-apple-secondary px-4 py-2 rounded-full text-xs font-semibold cursor-pointer"
          >
            Mark All Present
          </button>
          <button
            onClick={handleSaveAttendance}
            className="btn-apple-primary px-5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-lg"
          >
            <Save className="h-3.5 w-3.5" />
            Save Attendance
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>Attendance successfully saved and synced to Supabase.</span>
          </div>
        </div>
      )}

      {/* Selectors Bar */}
      <div className="apple-card p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 border border-white/[0.08]">
        <div>
          <label className="text-xs font-semibold text-[#86868b] mb-1 block">
            Academic Class
          </label>
          <select
            value={selectedClassId}
            onChange={(e) => {
              setSelectedClassId(e.target.value);
              const classSecs = sections.filter((s) => s.class_id === e.target.value);
              if (classSecs.length > 0) setSelectedSectionId(classSecs[0].id);
            }}
            className="w-full px-3 py-2 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3] cursor-pointer"
          >
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-[#86868b] mb-1 block">
            Target Section
          </label>
          <select
            value={selectedSectionId}
            onChange={(e) => setSelectedSectionId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3] cursor-pointer"
          >
            {availableSections.map((sec) => (
              <option key={sec.id} value={sec.id}>
                {sec.name} ({sec.room_number || "Room"})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-[#86868b] mb-1 block">
            Attendance Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#86868b]" />
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3]"
            />
          </div>
        </div>
      </div>

      {/* Summary Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="apple-card p-4 rounded-2xl border border-white/[0.06]">
          <span className="text-[11px] font-semibold text-[#86868b] uppercase">Present</span>
          <div className="text-2xl font-bold text-[#30d158] mt-1">{presentCount}</div>
        </div>
        <div className="apple-card p-4 rounded-2xl border border-white/[0.06]">
          <span className="text-[11px] font-semibold text-[#86868b] uppercase">Absent</span>
          <div className="text-2xl font-bold text-red-400 mt-1">{absentCount}</div>
        </div>
        <div className="apple-card p-4 rounded-2xl border border-white/[0.06]">
          <span className="text-[11px] font-semibold text-[#86868b] uppercase">Late / Excused</span>
          <div className="text-2xl font-bold text-[#ff9f0a] mt-1">{lateCount}</div>
        </div>
        <div className="apple-card p-4 rounded-2xl border border-white/[0.06]">
          <span className="text-[11px] font-semibold text-[#86868b] uppercase">Attendance Rate</span>
          <div className="text-2xl font-bold text-white mt-1">{attendanceRate}%</div>
        </div>
      </div>

      {/* Student Attendance List */}
      <div className="apple-card rounded-2xl border border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1c1c1e] text-[#86868b] border-b border-white/[0.08] uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5 font-bold">Roll No</th>
                <th className="px-5 py-3.5 font-bold">Student Name</th>
                <th className="px-5 py-3.5 font-bold">Current Status</th>
                <th className="px-5 py-3.5 font-bold text-right">Mark Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-white">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-[#86868b]">
                    No students found in this section.
                  </td>
                </tr>
              ) : (
                students.map((stu) => {
                  const status = attendanceMap[stu.id] || "present";
                  return (
                    <tr key={stu.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5 font-mono text-[11px] text-[#86868b]">
                        {stu.roll_number || "CS-01"}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-white">
                        {stu.first_name} {stu.last_name}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                            status === "present"
                              ? "bg-[#30d158]/15 text-[#30d158]"
                              : status === "absent"
                              ? "bg-red-500/15 text-red-400"
                              : "bg-[#ff9f0a]/15 text-[#ff9f0a]"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-[#1c1c1e] border border-white/10">
                          <button
                            onClick={() => handleStatusToggle(stu.id, "present")}
                            className={`px-3 py-1 rounded-lg font-semibold text-[10px] transition-all cursor-pointer ${
                              status === "present"
                                ? "bg-[#30d158] text-black font-bold"
                                : "text-[#86868b] hover:text-white"
                            }`}
                          >
                            Present
                          </button>
                          <button
                            onClick={() => handleStatusToggle(stu.id, "absent")}
                            className={`px-3 py-1 rounded-lg font-semibold text-[10px] transition-all cursor-pointer ${
                              status === "absent"
                                ? "bg-red-500 text-white font-bold"
                                : "text-[#86868b] hover:text-white"
                            }`}
                          >
                            Absent
                          </button>
                          <button
                            onClick={() => handleStatusToggle(stu.id, "late")}
                            className={`px-3 py-1 rounded-lg font-semibold text-[10px] transition-all cursor-pointer ${
                              status === "late"
                                ? "bg-[#ff9f0a] text-black font-bold"
                                : "text-[#86868b] hover:text-white"
                            }`}
                          >
                            Late
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
