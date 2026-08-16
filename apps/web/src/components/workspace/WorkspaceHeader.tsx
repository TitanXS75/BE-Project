import React, { useRef, useEffect } from "react";
import { Terminal, FolderOpen, ChevronDown, Check } from "lucide-react";

interface UnitItem {
  title: string;
  topics: string;
  chunks: number;
}

interface WorkspaceHeaderProps {
  mode: "student" | "teacher";
  activeSubject: string;
  activeUnit: string;
  setActiveUnit: (unit: string) => void;
  unitsList: UnitItem[];
  isUnitDropdownOpen: boolean;
  setIsUnitDropdownOpen: (open: boolean) => void;
  selectedModel: string;
  onSwitchRole: () => void;
  onOpenSubjectModal: () => void;
}

export function WorkspaceHeader({
  mode,
  activeSubject,
  activeUnit,
  setActiveUnit,
  unitsList,
  isUnitDropdownOpen,
  setIsUnitDropdownOpen,
  selectedModel,
  onSwitchRole,
  onOpenSubjectModal
}: WorkspaceHeaderProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUnitDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsUnitDropdownOpen]);

  return (
    <header className="h-16 border-b border-white/[0.08] px-8 flex items-center justify-between bg-black/80 backdrop-blur-xl z-30">
      <div className="flex items-center gap-4 text-sm">
        <span className="text-white font-semibold">
          {mode === "student" ? "Student Workspace" : "Teacher Studio"}
        </span>
        <span className="text-[#86868b]">/</span>
        <button
          onClick={onOpenSubjectModal}
          className="text-[#0071e3] hover:underline font-medium cursor-pointer"
        >
          {activeSubject}
        </button>
        <span className="text-[#86868b]">/</span>

        {/* ─── PROFESSIONAL OPAQUE UNIT DROPDOWN POPOVER ─── */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsUnitDropdownOpen(!isUnitDropdownOpen)}
            className="px-3.5 py-1.5 rounded-xl bg-[#1c1c1e] hover:bg-[#2c2c2e] border border-white/10 text-xs text-white font-medium flex items-center gap-2.5 transition-all cursor-pointer shadow-sm"
          >
            <span>{activeUnit.split(":")[0]}</span>
            <span className="text-[#86868b] font-normal truncate max-w-[200px]">
              {activeUnit.split(":")[1] || activeUnit}
            </span>
            <ChevronDown
              className={`h-3.5 w-3.5 text-[#86868b] transition-transform duration-200 ${
                isUnitDropdownOpen ? "rotate-180 text-white" : ""
              }`}
            />
          </button>

          {isUnitDropdownOpen && (
            <div className="absolute left-0 mt-2 w-96 rounded-2xl bg-[#18181b] p-2 border border-white/20 shadow-2xl z-50 flex flex-col gap-1 animate-in fade-in duration-150">
              <div className="px-3 py-2 text-[11px] font-semibold text-[#86868b] uppercase tracking-wider border-b border-white/[0.08]">
                Syllabus Units ({unitsList.length})
              </div>
              {unitsList.map((unitObj, idx) => {
                const isSelected = activeUnit === unitObj.title;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveUnit(unitObj.title);
                      setIsUnitDropdownOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#27272a] text-white font-semibold"
                        : "text-[#a1a1a6] hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-white">{unitObj.title}</span>
                      <span className="text-[11px] text-[#86868b] truncate max-w-[280px]">
                        {unitObj.topics}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-black text-[#86868b]">
                        {unitObj.chunks} Chunks
                      </span>
                      {isSelected && <Check className="h-4 w-4 text-[#0071e3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="px-3.5 py-1.5 rounded-xl bg-[#1c1c1e] border border-white/10 text-xs flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-[#30d158]" />
          <span className="text-[#86868b]">Model:</span>
          <span className="text-white font-mono">{selectedModel}</span>
        </div>

        <button
          onClick={onSwitchRole}
          className="px-4 py-1.5 rounded-xl btn-apple-secondary text-xs cursor-pointer"
        >
          Switch Role
        </button>

        <button
          onClick={onOpenSubjectModal}
          className="px-4 py-1.5 rounded-xl btn-apple-primary text-xs font-medium cursor-pointer flex items-center gap-2"
        >
          <FolderOpen className="h-3.5 w-3.5" />
          Course Library
        </button>
      </div>
    </header>
  );
}
