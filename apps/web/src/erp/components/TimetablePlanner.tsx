import React, { useState, useEffect } from "react";
import { Clock, Plus, ChevronDown } from "lucide-react";
import { ErpApi } from "../supabase";
import { RoutineSlot, SchoolClass, Section, Course, Teacher } from "../types";
import { AppleSelect } from "@/components/ui/AppleSelect";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

export function TimetablePlanner() {
  const [routines, setRoutines] = useState<RoutineSlot[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [slotDay, setSlotDay] = useState<typeof DAYS[number]>("Monday");
  const [slotCourseId, setSlotCourseId] = useState("");
  const [slotTeacherId, setSlotTeacherId] = useState("");
  const [slotStartTime, setSlotStartTime] = useState("09:00");
  const [slotEndTime, setSlotEndTime] = useState("10:30");
  const [slotRoom, setSlotRoom] = useState("Lab 301");

  useEffect(() => {
    async function loadData() {
      const [rts, cls, sec, crs, tch] = await Promise.all([
        ErpApi.getRoutines(),
        ErpApi.getClasses(),
        ErpApi.getSections(),
        ErpApi.getCourses(),
        ErpApi.getTeachers(),
      ]);
      setRoutines(rts);
      setClasses(cls);
      setSections(sec);
      setCourses(crs);
      setTeachers(tch);

      if (cls.length > 0) {
        setSelectedClassId(cls[0].id);
        const classSecs = sec.filter((s) => s.class_id === cls[0].id);
        if (classSecs.length > 0) setSelectedSectionId(classSecs[0].id);
        const classCourses = crs.filter((c) => c.class_id === cls[0].id);
        if (classCourses.length > 0) setSlotCourseId(classCourses[0].id);
      }
      if (tch.length > 0) setSlotTeacherId(tch[0].id);
    }
    loadData();
  }, []);

  const availableSections = sections.filter((s) => s.class_id === selectedClassId);
  const activeClassCourses = courses.filter((c) => c.class_id === selectedClassId);

  const filteredRoutines = routines.filter(
    (r) =>
      (!selectedClassId || r.class_id === selectedClassId) &&
      (!selectedSectionId || r.section_id === selectedSectionId)
  );

  async function handleAddSlot(e: React.FormEvent) {
    e.preventDefault();
    if (!slotCourseId) return;

    const created = await ErpApi.createRoutine({
      class_id: selectedClassId,
      section_id: selectedSectionId,
      course_id: slotCourseId,
      teacher_id: slotTeacherId,
      day_of_week: slotDay,
      start_time: slotStartTime,
      end_time: slotEndTime,
      room_number: slotRoom,
    });

    setRoutines((prev) => [...prev, created]);
    setShowAddModal(false);
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Clock className="h-6 w-6 text-[#0071e3]" />
            Timetable &amp; Routine Planner
          </h1>
          <p className="text-xs text-[#86868b] mt-1">
            Build weekly class schedules, assign classrooms, and synchronize lecture periods.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-apple-primary px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Timetable Slot
          </button>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="apple-card p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/[0.08] relative z-30">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div>
            <label className="text-[11px] font-semibold text-[#86868b] mb-1.5 block">
              Class
            </label>
            <AppleSelect
              value={selectedClassId}
              onChange={(val) => {
                setSelectedClassId(val);
                const classSecs = sections.filter((s) => s.class_id === val);
                if (classSecs.length > 0) setSelectedSectionId(classSecs[0].id);
              }}
              options={classes.map((cls) => ({ value: cls.id, label: cls.name }))}
              className="min-w-[160px]"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#86868b] mb-1.5 block">
              Section
            </label>
            <AppleSelect
              value={selectedSectionId}
              onChange={(val) => setSelectedSectionId(val)}
              options={availableSections.map((sec) => ({
                value: sec.id,
                label: `${sec.name} (${sec.room_number || "Room"})`,
              }))}
              className="min-w-[160px]"
            />
          </div>
        </div>

        <span className="text-xs text-[#86868b]">
          Total {filteredRoutines.length} scheduled periods
        </span>
      </div>

      {/* Weekly Routine Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {DAYS.map((day) => {
          const daySlots = filteredRoutines.filter((r) => r.day_of_week === day);
          return (
            <div
              key={day}
              className="apple-card p-5 rounded-2xl border border-white/[0.08] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06]">
                  <h3 className="text-sm font-bold text-white">{day}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-[#86868b] font-medium">
                    {daySlots.length} Periods
                  </span>
                </div>

                <div className="flex flex-col gap-2.5">
                  {daySlots.length === 0 ? (
                    <div className="p-6 text-center text-xs text-[#86868b]/60 border border-dashed border-white/[0.06] rounded-xl">
                      No classes scheduled
                    </div>
                  ) : (
                    daySlots.map((slot) => {
                      const matchedCourse = courses.find((c) => c.id === slot.course_id);
                      const matchedTeacher = teachers.find((t) => t.id === slot.teacher_id);
                      return (
                        <div
                          key={slot.id}
                          className="p-3 rounded-xl border border-white/[0.06] bg-[#1c1c1e] flex flex-col gap-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">
                              {matchedCourse?.name || "Lecture"}
                            </span>
                            <span className="text-[10px] font-mono text-[#0071e3] bg-[#0071e3]/10 px-2 py-0.5 rounded-full">
                              {slot.start_time} - {slot.end_time}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-[#86868b]">
                            <span>
                              {matchedTeacher
                                ? `${matchedTeacher.first_name} ${matchedTeacher.last_name}`
                                : "Instructor"}
                            </span>
                            <span className="text-white/60 font-mono text-[10px]">
                              {slot.room_number || "Room 101"}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add Slot */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="apple-card p-6 rounded-3xl max-w-md w-full border border-white/20 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Add Routine Slot</h3>
            <p className="text-xs text-[#86868b] mb-4">
              Schedule a lecture period for the selected class.
            </p>
            <form onSubmit={handleAddSlot} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-semibold text-[#86868b] mb-1.5 block">
                  Day of Week
                </label>
                <AppleSelect
                  value={slotDay}
                  onChange={(val) => setSlotDay(val as any)}
                  options={DAYS.map((d) => ({ value: d, label: d }))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#86868b] mb-1.5 block">
                  Course
                </label>
                <AppleSelect
                  value={slotCourseId}
                  onChange={(val) => setSlotCourseId(val)}
                  options={activeClassCourses.map((c) => ({
                    value: c.id,
                    label: `${c.name} (${c.code})`,
                  }))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#86868b] mb-1.5 block">
                  Instructor
                </label>
                <AppleSelect
                  value={slotTeacherId}
                  onChange={(val) => setSlotTeacherId(val)}
                  options={teachers.map((t) => ({
                    value: t.id,
                    label: `${t.first_name} ${t.last_name} (${t.department || "Faculty"})`,
                  }))}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#86868b] mb-1 block">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={slotStartTime}
                    onChange={(e) => setSlotStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#86868b] mb-1 block">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={slotEndTime}
                    onChange={(e) => setSlotEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#86868b] mb-1 block">
                    Room No
                  </label>
                  <input
                    type="text"
                    value={slotRoom}
                    onChange={(e) => setSlotRoom(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full btn-apple-secondary text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full btn-apple-primary text-xs cursor-pointer"
                >
                  Add Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
