"use client";

import React, { useState } from "react";
import {
  BookOpen,
  PlusCircle,
  FileEdit,
  FolderOpen,
  ArrowRight,
  Sparkles,
  Layers,
  FileText,
  Upload,
  CheckCircle2,
  X
} from "lucide-react";

interface SubjectItem {
  name: string;
  code: string;
  units: number;
  docs: number;
  chunks: number;
  rssh: string;
}

interface TeacherWelcomeHubProps {
  subjectsList: SubjectItem[];
  activeSubject: string;
  onSelectSubject: (subjectName: string) => void;
  onEnterWorkspace: (action?: "create" | "update") => void;
  onCreateNewSubject: (newSubject: { name: string; code: string; units: number }) => void;
}

export function TeacherWelcomeHub({
  subjectsList,
  activeSubject,
  onSelectSubject,
  onEnterWorkspace,
  onCreateNewSubject
}: TeacherWelcomeHubProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSubjName, setNewSubjName] = useState("");
  const [newSubjCode, setNewSubjCode] = useState("");
  const [newSubjUnits, setNewSubjUnits] = useState(4);
  const [selectedToUpdate, setSelectedToUpdate] = useState(activeSubject);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjName.trim()) return;

    const code = newSubjCode.trim() || `CS-${Math.floor(100 + Math.random() * 900)}`;
    onCreateNewSubject({
      name: newSubjName.trim(),
      code,
      units: Number(newSubjUnits) || 4
    });
    onSelectSubject(newSubjName.trim());
    setShowCreateModal(false);
    onEnterWorkspace("create");
  };

  const handleUpdateSelect = (subjectName: string) => {
    setSelectedToUpdate(subjectName);
    onSelectSubject(subjectName);
    onEnterWorkspace("update");
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col justify-center py-6 px-4 animate-in fade-in duration-300">
      {/* ─── WELCOME HEADER ─── */}
      <div className="flex flex-col items-center text-center gap-3 mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Welcome, Faculty &amp; Instructor
        </h1>
        <p className="text-sm text-[#86868b] max-w-lg leading-relaxed">
          Create new curriculum packages or update existing syllabus documents, Bloom&apos;s exam blueprints, and slide decks.
        </p>
      </div>

      {/* ─── TWO CORE ACTIONS (CREATE NEW VS UPDATE CURRENT) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* OPTION 1: CREATE NEW SUBJECT */}
        <div
          onClick={() => setShowCreateModal(true)}
          className="p-7 rounded-3xl bg-[#161618] border border-white/10 hover:border-[#0071e3]/50 hover:bg-[#1a1a1c] transition-all cursor-pointer group flex flex-col justify-between gap-6 shadow-xl relative overflow-hidden"
        >
          <div className="flex flex-col gap-4">
            <div className="h-12 w-12 rounded-2xl bg-[#0071e3]/10 border border-[#0071e3]/20 flex items-center justify-center text-[#0071e3] group-hover:scale-110 transition-transform">
              <PlusCircle className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0071e3] block mb-1">
                New Syllabus Packaging
              </span>
              <h2 className="text-xl font-bold text-white group-hover:text-[#0071e3] transition-colors">
                Create New Subject
              </h2>
              <p className="text-xs text-[#86868b] mt-2 leading-relaxed">
                Initialize a fresh course package, upload reference textbooks, configure vector indices, and define unit taxonomy.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/[0.06] text-xs">
            <span className="text-[#86868b]">Scaffold fresh .rssh package</span>
            <div className="flex items-center gap-1.5 text-white font-medium group-hover:text-[#0071e3] group-hover:translate-x-1 transition-all">
              <span>Start Creation</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* OPTION 2: UPDATE CURRENT SUBJECT */}
        <div className="p-7 rounded-3xl bg-[#161618] border border-white/10 flex flex-col justify-between gap-6 shadow-xl">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-2xl bg-[#ff9f0a]/10 border border-[#ff9f0a]/20 flex items-center justify-center text-[#ff9f0a]">
                <FileEdit className="h-6 w-6" />
              </div>
              <span className="text-xs text-[#86868b]">
                {subjectsList.length} Courses Mounted
              </span>
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#ff9f0a] block mb-1">
                Curriculum Re-Authoring
              </span>
              <h2 className="text-xl font-bold text-white">
                Update Current Subject
              </h2>
              <p className="text-xs text-[#86868b] mt-2 leading-relaxed">
                Modify curriculum units, ingest supplementary notes, synthesize Bloom&apos;s exam papers, or generate lecture decks.
              </p>
            </div>
          </div>

          {/* Quick Subject Picker */}
          <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.06]">
            <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">
              Select Subject to Edit:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {subjectsList.slice(0, 4).map((subj) => (
                <button
                  key={subj.code}
                  type="button"
                  onClick={() => handleUpdateSelect(subj.name)}
                  className="p-2.5 rounded-xl bg-black/50 border border-white/10 hover:border-[#ff9f0a]/50 text-left transition-all cursor-pointer group"
                >
                  <span className="text-[10px] text-[#ff9f0a] font-mono block">
                    {subj.code}
                  </span>
                  <span className="text-xs font-semibold text-white truncate block group-hover:text-[#ff9f0a]">
                    {subj.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── MODAL: CREATE NEW SUBJECT ─── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="w-full max-w-lg p-7 rounded-3xl bg-[#18181b] border border-white/20 shadow-2xl flex flex-col gap-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-[#0071e3]/10 border border-[#0071e3]/20 flex items-center justify-center text-[#0071e3]">
                  <PlusCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Create New Subject Package
                  </h3>
                  <p className="text-xs text-[#86868b]">
                    Set course title, curriculum code, and syllabus structure.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#86868b] hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="flex flex-col gap-4 text-xs">
              <div>
                <label className="text-white font-semibold mb-1.5 block">
                  Subject / Course Name:
                </label>
                <input
                  type="text"
                  required
                  value={newSubjName}
                  onChange={(e) => setNewSubjName(e.target.value)}
                  placeholder="e.g. Deep Learning & Neural Architectures"
                  className="w-full p-3 rounded-xl bg-black border border-white/10 text-white outline-none focus:border-[#0071e3]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white font-semibold mb-1.5 block">
                    Course Code:
                  </label>
                  <input
                    type="text"
                    value={newSubjCode}
                    onChange={(e) => setNewSubjCode(e.target.value)}
                    placeholder="e.g. CS-405"
                    className="w-full p-3 rounded-xl bg-black border border-white/10 text-white outline-none focus:border-[#0071e3] font-mono"
                  />
                </div>
                <div>
                  <label className="text-white font-semibold mb-1.5 block">
                    Initial Units Count:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newSubjUnits}
                    onChange={(e) => setNewSubjUnits(Number(e.target.value))}
                    className="w-full p-3 rounded-xl bg-black border border-white/10 text-white outline-none focus:border-[#0071e3]"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] text-[#86868b] leading-relaxed">
                Will generate <span className="text-white font-mono">{newSubjName ? `${newSubjName.replace(/\s+/g, "-")}-2026.rssh` : "Course-2026.rssh"}</span> with SQLite relational metadata and LanceDB vector schemas.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl btn-apple-secondary text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newSubjName.trim()}
                  className="px-6 py-2 rounded-xl btn-apple-primary text-xs font-medium cursor-pointer disabled:opacity-40"
                >
                  Initialize Subject Studio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
