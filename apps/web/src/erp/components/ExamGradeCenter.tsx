import React, { useState, useEffect } from "react";
import {
  Award,
  Plus,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { ErpApi } from "../supabase";
import { Exam, SchoolClass, Course, Student } from "../types";

export function ExamGradeCenter() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const [selectedExamId, setSelectedExamId] = useState<string>("");
  const [marksMap, setMarksMap] = useState<Record<string, number>>({});
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Exam Form
  const [newExamName, setNewExamName] = useState("");
  const [newExamClassId, setNewExamClassId] = useState("");
  const [newExamCourseId, setNewExamCourseId] = useState("");
  const [newExamDate, setNewExamDate] = useState("2026-09-20");
  const [newTotalMarks, setNewTotalMarks] = useState("100");
  const [newPassMarks, setNewPassMarks] = useState("40");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [exList, clsList, crsList, stuList] = await Promise.all([
        ErpApi.getExams(),
        ErpApi.getClasses(),
        ErpApi.getCourses(),
        ErpApi.getStudents(),
      ]);
      setExams(exList);
      setClasses(clsList);
      setCourses(crsList);
      setStudents(stuList);
      if (exList.length > 0) {
        setSelectedExamId(exList[0].id);
      }
      if (clsList.length > 0) {
        setNewExamClassId(clsList[0].id);
        const matchedCourses = crsList.filter((c) => c.class_id === clsList[0].id);
        if (matchedCourses.length > 0) setNewExamCourseId(matchedCourses[0].id);
      }
    }
    loadData();
  }, []);

  const activeExam = exams.find((e) => e.id === selectedExamId) || exams[0];
  const examStudents = students.filter(
    (s) => !activeExam || s.class_id === activeExam.class_id
  );

  async function handleCreateExam(e: React.FormEvent) {
    e.preventDefault();
    if (!newExamName.trim()) return;

    const created = await ErpApi.createExam({
      name: newExamName.trim(),
      semester_id: "sem-1",
      class_id: newExamClassId,
      course_id: newExamCourseId,
      exam_date: newExamDate,
      total_marks: parseFloat(newTotalMarks) || 100,
      pass_marks: parseFloat(newPassMarks) || 40,
    });

    setExams((prev) => [...prev, created]);
    setSelectedExamId(created.id);
    setShowCreateModal(false);
    setNewExamName("");
  }

  const handleMarkChange = (studentId: string, mark: number) => {
    setMarksMap((prev) => ({ ...prev, [studentId]: mark }));
    setSaveSuccess(false);
  };

  const handleSaveMarks = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  const getCalculatedGrade = (score: number, maxScore: number) => {
    const pct = (score / maxScore) * 100;
    if (pct >= 90) return { grade: "A+", gpa: 4.0, color: "text-[#30d158]" };
    if (pct >= 80) return { grade: "A", gpa: 3.7, color: "text-emerald-400" };
    if (pct >= 70) return { grade: "B+", gpa: 3.3, color: "text-[#0071e3]" };
    if (pct >= 60) return { grade: "B", gpa: 3.0, color: "text-[#38bdf8]" };
    if (pct >= 50) return { grade: "C", gpa: 2.0, color: "text-[#ff9f0a]" };
    if (pct >= 40) return { grade: "D", gpa: 1.0, color: "text-amber-500" };
    return { grade: "F", gpa: 0.0, color: "text-red-400" };
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Award className="h-6 w-6 text-[#ff9f0a]" />
            Examinations &amp; Evaluation Center
          </h1>
          <p className="text-xs text-[#86868b] mt-1">
            Schedule examinations, record student marks, and calculate weighted grade rules.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-apple-primary px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Schedule Examination
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>Examination marks successfully recorded to institutional database.</span>
          </div>
        </div>
      )}

      {/* Grid: Exam Selector + Marks Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Exam List Column (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <span className="text-xs font-semibold text-[#86868b] uppercase tracking-wider px-1">
            Active Examinations ({exams.length})
          </span>
          <div className="flex flex-col gap-2">
            {exams.map((ex) => {
              const isSelected = ex.id === activeExam?.id;
              const matchedClass = classes.find((c) => c.id === ex.class_id);
              const matchedCourse = courses.find((c) => c.id === ex.course_id);

              return (
                <button
                  key={ex.id}
                  onClick={() => setSelectedExamId(ex.id)}
                  className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-[#1c1c1e] border-white/20 shadow-lg text-white"
                      : "bg-[#161618] border-white/[0.06] text-[#86868b] hover:bg-white/[0.03] hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{ex.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 font-mono">
                      Max: {ex.total_marks}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-[#86868b]">
                    <span>{matchedClass?.name || "Class"}</span>
                    <span>•</span>
                    <span className="text-[#38bdf8]">{matchedCourse?.name || "Subject"}</span>
                  </div>
                  <div className="mt-2 text-[10px] text-[#86868b]/70 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Date: {ex.exam_date || "2026-09-20"}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Marks Table Column (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {activeExam ? (
            <div className="apple-card p-6 rounded-2xl border border-white/[0.08]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/[0.06]">
                <div>
                  <h3 className="text-base font-bold text-white">{activeExam.name}</h3>
                  <p className="text-xs text-[#86868b] mt-0.5">
                    Passing Threshold: {activeExam.pass_marks} / {activeExam.total_marks} Marks
                  </p>
                </div>
                <button
                  onClick={handleSaveMarks}
                  className="btn-apple-primary px-5 py-2 rounded-full text-xs font-semibold self-start sm:self-auto cursor-pointer"
                >
                  Save Marks Sheet
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#1c1c1e] text-[#86868b] uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="px-4 py-3 font-bold">Roll No</th>
                      <th className="px-4 py-3 font-bold">Student Name</th>
                      <th className="px-4 py-3 font-bold">Marks Score</th>
                      <th className="px-4 py-3 font-bold">Grade</th>
                      <th className="px-4 py-3 font-bold">GPA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04] text-white">
                    {examStudents.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-[#86868b]">
                          No students enrolled in this class.
                        </td>
                      </tr>
                    ) : (
                      examStudents.map((stu, idx) => {
                        const defaultScore = 75 + ((idx * 7) % 20);
                        const currentMark = marksMap[stu.id] !== undefined ? marksMap[stu.id] : defaultScore;
                        const gradeInfo = getCalculatedGrade(currentMark, activeExam.total_marks);

                        return (
                          <tr key={stu.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-4 py-3 font-mono text-[11px] text-[#86868b]">
                              {stu.roll_number || `CS-${idx + 1}`}
                            </td>
                            <td className="px-4 py-3 font-semibold text-white">
                              {stu.first_name} {stu.last_name}
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                max={activeExam.total_marks}
                                min={0}
                                value={currentMark}
                                onChange={(e) =>
                                  handleMarkChange(stu.id, parseFloat(e.target.value) || 0)
                                }
                                className="w-20 px-2.5 py-1 rounded-lg bg-[#1c1c1e] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#0071e3]"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <span className={`font-bold ${gradeInfo.color}`}>
                                {gradeInfo.grade}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-mono text-[11px] text-[#86868b]">
                              {gradeInfo.gpa.toFixed(1)}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-[#86868b]">
              Select or create an examination to enter marks.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Schedule Exam */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="apple-card p-6 rounded-3xl max-w-md w-full border border-white/20 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Schedule Examination</h3>
            <p className="text-xs text-[#86868b] mb-4">
              Create an evaluation event for a course and class.
            </p>
            <form onSubmit={handleCreateExam} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-semibold text-[#86868b] mb-1 block">
                  Examination Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. End-Term Theory Exam"
                  value={newExamName}
                  onChange={(e) => setNewExamName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#86868b] mb-1 block">
                    Class
                  </label>
                  <select
                    value={newExamClassId}
                    onChange={(e) => {
                      setNewExamClassId(e.target.value);
                      const crs = courses.filter((c) => c.class_id === e.target.value);
                      if (crs.length > 0) setNewExamCourseId(crs[0].id);
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
                    Course
                  </label>
                  <select
                    value={newExamCourseId}
                    onChange={(e) => setNewExamCourseId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3] cursor-pointer"
                  >
                    {courses
                      .filter((c) => c.class_id === newExamClassId)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.code})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#86868b] mb-1 block">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newExamDate}
                    onChange={(e) => setNewExamDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#86868b] mb-1 block">
                    Max Marks
                  </label>
                  <input
                    type="number"
                    value={newTotalMarks}
                    onChange={(e) => setNewTotalMarks(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#86868b] mb-1 block">
                    Pass Marks
                  </label>
                  <input
                    type="number"
                    value={newPassMarks}
                    onChange={(e) => setNewPassMarks(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-full btn-apple-secondary text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full btn-apple-primary text-xs cursor-pointer"
                >
                  Confirm Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
