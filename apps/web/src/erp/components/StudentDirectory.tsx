import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Plus,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";
import { ErpApi } from "../supabase";
import { Student, SchoolClass, Section } from "../types";

export function StudentDirectory() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClassFilter, setSelectedClassFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Add Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other">("male");
  const [dob, setDob] = useState("2008-01-01");
  const [address, setAddress] = useState("");
  const [targetClassId, setTargetClassId] = useState("");
  const [targetSectionId, setTargetSectionId] = useState("");
  const [rollNumber, setRollNumber] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [stu, cls, sec] = await Promise.all([
      ErpApi.getStudents(),
      ErpApi.getClasses(),
      ErpApi.getSections(),
    ]);
    setStudents(stu);
    setClasses(cls);
    setSections(sec);
    if (cls.length > 0) {
      setTargetClassId(cls[0].id);
      const classSecs = sec.filter((s) => s.class_id === cls[0].id);
      if (classSecs.length > 0) setTargetSectionId(classSecs[0].id);
    }
  }

  const availableSectionsForModal = sections.filter(
    (s) => s.class_id === targetClassId
  );

  async function handleAddStudent(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;

    const matchedClass = classes.find((c) => c.id === targetClassId);
    const matchedSection = sections.find((s) => s.id === targetSectionId);

    const created = await ErpApi.createStudent({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim() || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@student.axiom.edu`,
      phone: phone.trim() || "+91 91234 56789",
      gender,
      dob,
      address: address.trim() || "Mumbai, India",
      class_id: targetClassId,
      section_id: targetSectionId,
      roll_number: rollNumber.trim() || `ROLL-${Date.now().toString().slice(-4)}`,
      class_name: matchedClass?.name || "Grade 10",
      section_name: matchedSection?.name || "Section A",
    });

    setStudents((prev) => [created, ...prev]);
    setShowAddModal(false);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setRollNumber("");
  }

  const filteredStudents = students.filter((stu) => {
    const fullName = `${stu.first_name} ${stu.last_name}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      stu.roll_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stu.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass =
      selectedClassFilter === "all" || stu.class_id === selectedClassFilter;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-[#30d158]" />
            Student Enrollment Directory
          </h1>
          <p className="text-xs text-[#86868b] mt-1">
            Manage student registrations, academic rosters, and profile records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-apple-primary px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Admit New Student
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="apple-card p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 border border-white/[0.08]">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#86868b]" />
          <input
            type="text"
            placeholder="Search by student name, roll no, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-3.5 w-3.5 text-[#86868b]" />
          <span className="text-xs text-[#86868b]">Class:</span>
          <select
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3] cursor-pointer"
          >
            <option value="all">All Classes ({students.length})</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Data Grid */}
      <div className="apple-card rounded-2xl border border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1c1c1e] text-[#86868b] border-b border-white/[0.08] uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5 font-bold">Student Name</th>
                <th className="px-5 py-3.5 font-bold">Roll Number</th>
                <th className="px-5 py-3.5 font-bold">Class &amp; Section</th>
                <th className="px-5 py-3.5 font-bold">Gender</th>
                <th className="px-5 py-3.5 font-bold">Contact Email</th>
                <th className="px-5 py-3.5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-white">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-[#86868b]">
                    No students match the criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((stu) => (
                  <tr key={stu.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-[#0071e3]">
                          {stu.first_name[0]}
                          {stu.last_name[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-white">
                            {stu.first_name} {stu.last_name}
                          </div>
                          <div className="text-[10px] text-[#86868b]">{stu.phone || "No phone"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[11px] text-[#86868b]">
                      {stu.roll_number || "Unassigned"}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[11px] font-medium">
                        {stu.class_name || "Grade 10"} • {stu.section_name || "A"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full capitalize font-semibold ${
                          stu.gender === "female"
                            ? "bg-pink-500/15 text-pink-400"
                            : "bg-[#0071e3]/15 text-[#0071e3]"
                        }`}
                      >
                        {stu.gender}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[#86868b]">{stu.email}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedStudent(stu)}
                        className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-[11px] font-semibold text-[#0071e3] transition-colors cursor-pointer"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#86868b]">
          <span>Showing {filteredStudents.length} of {students.length} students</span>
          <span className="text-emerald-400 font-medium">Active Database</span>
        </div>
      </div>

      {/* Student Profile Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="apple-card p-6 rounded-3xl max-w-md w-full border border-white/20 shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#0071e3] to-[#38bdf8] flex items-center justify-center text-xl font-bold text-white shadow-lg">
                {selectedStudent.first_name[0]}
                {selectedStudent.last_name[0]}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {selectedStudent.first_name} {selectedStudent.last_name}
                </h3>
                <p className="text-xs text-[#86868b]">
                  Roll No: <span className="font-mono text-white">{selectedStudent.roll_number}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 text-xs text-[#86868b] my-4 p-4 rounded-2xl bg-[#1c1c1e] border border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#0071e3]" />
                <span className="text-white">{selectedStudent.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[#30d158]" />
                <span className="text-white">{selectedStudent.phone || "Not recorded"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-[#ff9f0a]" />
                <span>DOB: {selectedStudent.dob || "2008-01-01"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#ec4899]" />
                <span className="text-white line-clamp-1">{selectedStudent.address || "Mumbai, India"}</span>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-5 py-2 rounded-full btn-apple-primary text-xs cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Student */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="apple-card p-6 rounded-3xl max-w-lg w-full border border-white/20 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-white mb-1">Admit New Student</h3>
            <p className="text-xs text-[#86868b] mb-4">
              Fill in student biographical data and academic tier assignment.
            </p>
            <form onSubmit={handleAddStudent} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#86868b] mb-1 block">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#86868b] mb-1 block">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Patel"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#86868b] mb-1 block">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    placeholder="student@axiom.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#86868b] mb-1 block">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#86868b] mb-1 block">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3] cursor-pointer"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#86868b] mb-1 block">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#86868b] mb-1 block">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    placeholder="CS10-05"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#86868b] mb-1 block">
                    Class Placement
                  </label>
                  <select
                    value={targetClassId}
                    onChange={(e) => {
                      setTargetClassId(e.target.value);
                      const secList = sections.filter((s) => s.class_id === e.target.value);
                      if (secList.length > 0) setTargetSectionId(secList[0].id);
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
                    Section
                  </label>
                  <select
                    value={targetSectionId}
                    onChange={(e) => setTargetSectionId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3] cursor-pointer"
                  >
                    {availableSectionsForModal.map((sec) => (
                      <option key={sec.id} value={sec.id}>
                        {sec.name} ({sec.room_number || "Room"})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#86868b] mb-1 block">
                  Residential Address
                </label>
                <input
                  type="text"
                  placeholder="Street, City, State"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3]"
                />
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
                  Confirm Admission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
