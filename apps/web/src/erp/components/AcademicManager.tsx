import React, { useState, useEffect } from "react";
import {
  Building2,
  Plus,
  Layers,
  BookOpen,
  Calendar,
} from "lucide-react";
import { ErpApi } from "../supabase";
import { AcademicSession, SchoolClass, Section, Course } from "../types";

export function AcademicManager() {
  const [sessions, setSessions] = useState<AcademicSession[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");

  // Form states
  const [showClassModal, setShowClassModal] = useState(false);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);

  const [newClassName, setNewClassName] = useState("");
  const [newClassTier, setNewClassTier] = useState("10");

  const [newSectionName, setNewSectionName] = useState("");
  const [newSectionRoom, setNewSectionRoom] = useState("");
  const [newSectionCapacity, setNewSectionCapacity] = useState("35");

  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseCode, setNewCourseCode] = useState("");
  const [newCourseCredits, setNewCourseCredits] = useState("3.0");

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    const [sess, cls, sec, crs] = await Promise.all([
      ErpApi.getSessions(),
      ErpApi.getClasses(),
      ErpApi.getSections(),
      ErpApi.getCourses(),
    ]);
    setSessions(sess);
    setClasses(cls);
    setSections(sec);
    setCourses(crs);
    if (cls.length > 0 && !selectedClassId) {
      setSelectedClassId(cls[0].id);
    }
  }

  const activeClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const activeSections = sections.filter((s) => s.class_id === activeClass?.id);
  const activeCourses = courses.filter((c) => c.class_id === activeClass?.id);

  async function handleAddClass(e: React.FormEvent) {
    e.preventDefault();
    if (!newClassName.trim()) return;
    const created = await ErpApi.createClass({
      session_id: sessions[0]?.id || "sess-1",
      name: newClassName.trim(),
      numeric_name: parseInt(newClassTier) || 10,
    });
    setClasses((prev) => [...prev, created]);
    setSelectedClassId(created.id);
    setNewClassName("");
    setShowClassModal(false);
  }

  async function handleAddSection(e: React.FormEvent) {
    e.preventDefault();
    if (!newSectionName.trim() || !activeClass) return;
    const created = await ErpApi.createSection({
      class_id: activeClass.id,
      name: newSectionName.trim(),
      room_number: newSectionRoom.trim() || "Room 101",
      capacity: parseInt(newSectionCapacity) || 35,
    });
    setSections((prev) => [...prev, created]);
    setNewSectionName("");
    setNewSectionRoom("");
    setShowSectionModal(false);
  }

  async function handleAddCourse(e: React.FormEvent) {
    e.preventDefault();
    if (!newCourseName.trim() || !activeClass) return;
    const created = await ErpApi.createCourse({
      class_id: activeClass.id,
      name: newCourseName.trim(),
      code: newCourseCode.trim() || "CRS-101",
      credit_hours: parseFloat(newCourseCredits) || 3.0,
    });
    setCourses((prev) => [...prev, created]);
    setNewCourseName("");
    setNewCourseCode("");
    setShowCourseModal(false);
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Building2 className="h-6 w-6 text-[#ff9f0a]" />
            Academic &amp; Class Architecture
          </h1>
          <p className="text-xs text-[#86868b] mt-1">
            Configure academic sessions, classes, sections, and curriculum courses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowClassModal(true)}
            className="btn-apple-primary px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Add New Class
          </button>
        </div>
      </div>

      {/* Active Session Info Banner */}
      <div className="apple-card p-4 rounded-2xl flex items-center justify-between border border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-[#0071e3]/15 text-[#0071e3] flex items-center justify-center">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white">
              {sessions.find((s) => s.is_current)?.name || "Academic Year 2026-2027"}
            </span>
            <p className="text-[11px] text-[#86868b]">Active Academic Session</p>
          </div>
        </div>
        <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          Status: Operational
        </span>
      </div>

      {/* Main Grid: Class Selector + Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Classes List (Sidebar Column) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <span className="text-xs font-semibold text-[#86868b] uppercase tracking-wider px-1">
            Institutional Classes ({classes.length})
          </span>
          <div className="flex flex-col gap-2">
            {classes.map((cls) => {
              const isSelected = cls.id === activeClass?.id;
              const classSectionCount = sections.filter((s) => s.class_id === cls.id).length;
              const classCourseCount = courses.filter((c) => c.class_id === cls.id).length;

              return (
                <button
                  key={cls.id}
                  onClick={() => setSelectedClassId(cls.id)}
                  className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-[#1c1c1e] border-white/20 shadow-lg text-white"
                      : "bg-[#161618] border-white/[0.06] text-[#86868b] hover:bg-white/[0.03] hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{cls.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 font-mono">
                      Tier {cls.numeric_name || 10}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-[11px] text-[#86868b]">
                    <span>{classSectionCount} Sections</span>
                    <span>•</span>
                    <span>{classCourseCount} Courses</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Class Deep View (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {activeClass ? (
            <>
              {/* Sections Card */}
              <div className="apple-card p-6 rounded-2xl border border-white/[0.08]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-[#30d158]" />
                    <h3 className="text-sm font-bold text-white">
                      Sections for {activeClass.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowSectionModal(true)}
                    className="btn-apple-secondary px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" /> Add Section
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeSections.length === 0 ? (
                    <div className="col-span-2 p-6 text-center text-xs text-[#86868b] border border-dashed border-white/10 rounded-xl">
                      No sections created for this class yet.
                    </div>
                  ) : (
                    activeSections.map((sec) => (
                      <div
                        key={sec.id}
                        className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-bold text-white">{sec.name}</div>
                          <div className="text-[11px] text-[#86868b] mt-0.5">
                            Room: {sec.room_number || "Unassigned"}
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-[#86868b] font-mono">
                          Cap: {sec.capacity || 35}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Courses Card */}
              <div className="apple-card p-6 rounded-2xl border border-white/[0.08]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-[#38bdf8]" />
                    <h3 className="text-sm font-bold text-white">
                      Curriculum Courses for {activeClass.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowCourseModal(true)}
                    className="btn-apple-secondary px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" /> Add Course
                  </button>
                </div>

                <div className="flex flex-col gap-2.5">
                  {activeCourses.length === 0 ? (
                    <div className="p-6 text-center text-xs text-[#86868b] border border-dashed border-white/10 rounded-xl">
                      No courses assigned to this class yet.
                    </div>
                  ) : (
                    activeCourses.map((crs) => (
                      <div
                        key={crs.id}
                        className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-bold text-white">{crs.name}</div>
                          <div className="text-[11px] text-[#86868b] mt-0.5 font-mono">
                            Code: {crs.code}
                          </div>
                        </div>
                        <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#0071e3]/15 text-[#0071e3] font-semibold">
                          {crs.credit_hours || 3.0} Credits
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-xs text-[#86868b]">
              Select or create a class to view configuration.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Add Class */}
      {showClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="apple-card p-6 rounded-3xl max-w-md w-full border border-white/20 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Add Academic Class</h3>
            <p className="text-xs text-[#86868b] mb-4">
              Enter class identification and academic numeric tier.
            </p>
            <form onSubmit={handleAddClass} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-semibold text-[#86868b] mb-1 block">
                  Class Display Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grade 10 - Robotics"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#86868b] mb-1 block">
                  Numeric Tier
                </label>
                <input
                  type="number"
                  required
                  value={newClassTier}
                  onChange={(e) => setNewClassTier(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3]"
                />
              </div>
              <div className="flex items-center justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowClassModal(false)}
                  className="px-4 py-2 rounded-full btn-apple-secondary text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full btn-apple-primary text-xs cursor-pointer"
                >
                  Save Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Section */}
      {showSectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="apple-card p-6 rounded-3xl max-w-md w-full border border-white/20 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Add Section</h3>
            <p className="text-xs text-[#86868b] mb-4">
              Create a section for {activeClass?.name}.
            </p>
            <form onSubmit={handleAddSection} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-semibold text-[#86868b] mb-1 block">
                  Section Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Section A"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#86868b] mb-1 block">
                  Room / Lab Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. Room 204"
                  value={newSectionRoom}
                  onChange={(e) => setNewSectionRoom(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#86868b] mb-1 block">
                  Capacity Limit
                </label>
                <input
                  type="number"
                  value={newSectionCapacity}
                  onChange={(e) => setNewSectionCapacity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3]"
                />
              </div>
              <div className="flex items-center justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowSectionModal(false)}
                  className="px-4 py-2 rounded-full btn-apple-secondary text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full btn-apple-primary text-xs cursor-pointer"
                >
                  Save Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Course */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="apple-card p-6 rounded-3xl max-w-md w-full border border-white/20 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Add Course</h3>
            <p className="text-xs text-[#86868b] mb-4">
              Assign a new course to {activeClass?.name}.
            </p>
            <form onSubmit={handleAddCourse} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-semibold text-[#86868b] mb-1 block">
                  Course Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Algorithms and Data Structures"
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#86868b] mb-1 block">
                  Course Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS-201"
                  value={newCourseCode}
                  onChange={(e) => setNewCourseCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#86868b] mb-1 block">
                  Credit Hours
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={newCourseCredits}
                  onChange={(e) => setNewCourseCredits(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3]"
                />
              </div>
              <div className="flex items-center justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="px-4 py-2 rounded-full btn-apple-secondary text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full btn-apple-primary text-xs cursor-pointer"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
