import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  BookOpen,
  Calendar,
  Building,
} from "lucide-react";
import { ErpApi } from "../supabase";
import { Teacher } from "../types";

export function TeacherDirectory() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [designation, setDesignation] = useState("Assistant Professor");
  const [department, setDepartment] = useState("Computer Science");
  const [gender, setGender] = useState<"male" | "female" | "other">("male");

  useEffect(() => {
    loadTeachers();
  }, []);

  async function loadTeachers() {
    const data = await ErpApi.getTeachers();
    setTeachers(data);
  }

  async function handleAddTeacher(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;

    const created = await ErpApi.createTeacher({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim() || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@axiom.edu`,
      phone: phone.trim() || "+91 98765 43210",
      designation,
      department,
      gender,
      join_date: new Date().toISOString().split("T")[0],
    });

    setTeachers((prev) => [...prev, created]);
    setShowAddModal(false);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
  }

  const departments = Array.from(
    new Set(teachers.map((t) => t.department || "General"))
  );

  const filteredTeachers = teachers.filter((t) => {
    const name = `${t.first_name} ${t.last_name}`.toLowerCase();
    const matchesSearch =
      name.includes(searchQuery.toLowerCase()) ||
      t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.department?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept =
      selectedDept === "all" || t.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-[#38bdf8]" />
            Faculty &amp; Teacher Directory
          </h1>
          <p className="text-xs text-[#86868b] mt-1">
            Manage academic instructors, departmental appointments, and contact records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-apple-primary px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Faculty Member
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="apple-card p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 border border-white/[0.08]">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#86868b]" />
          <input
            type="text"
            placeholder="Search by faculty name, email, department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Building className="h-3.5 w-3.5 text-[#86868b]" />
          <span className="text-xs text-[#86868b]">Department:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3] cursor-pointer"
          >
            <option value="all">All Departments ({teachers.length})</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Teacher Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTeachers.map((teacher) => (
          <div
            key={teacher.id}
            className="apple-card-interactive p-5 rounded-2xl flex flex-col justify-between border border-white/[0.08]"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#ff9f0a] to-[#ff453a] flex items-center justify-center font-bold text-white shadow-md">
                    {teacher.first_name[0]}
                    {teacher.last_name[0]}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {teacher.first_name} {teacher.last_name}
                    </h3>
                    <p className="text-[11px] text-[#ff9f0a] font-medium">
                      {teacher.designation || "Instructor"}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-[#86868b] font-medium">
                  {teacher.department || "CS"}
                </span>
              </div>

              <div className="flex flex-col gap-2 text-xs text-[#86868b] my-3 p-3 rounded-xl bg-[#1c1c1e] border border-white/[0.04]">
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-[#0071e3]" />
                  <span className="text-white line-clamp-1">{teacher.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-[#30d158]" />
                  <span>{teacher.phone || "No phone"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-[#a855f7]" />
                  <span>Joined: {teacher.join_date || "2023-01-01"}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                Active Faculty
              </span>
              <span className="text-[#0071e3] font-semibold flex items-center gap-1">
                <BookOpen className="h-3 w-3" /> Assigned Courses
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add Faculty */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="apple-card p-6 rounded-3xl max-w-lg w-full border border-white/20 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Add Faculty Member</h3>
            <p className="text-xs text-[#86868b] mb-4">
              Enter personal details and departmental assignment.
            </p>
            <form onSubmit={handleAddTeacher} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#86868b] mb-1 block">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Arvind"
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
                    placeholder="e.g. Raman"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#86868b] mb-1 block">
                    Institutional Email
                  </label>
                  <input
                    type="email"
                    placeholder="faculty@axiom.edu"
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#86868b] mb-1 block">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#86868b] mb-1 block">
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3]"
                  />
                </div>
              </div>

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
                  Add Faculty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
