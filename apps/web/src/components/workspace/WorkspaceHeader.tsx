import React, { useRef, useEffect, useState } from "react";
import {
  FolderOpen,
  ChevronDown,
  Check,
  Zap,
  Cpu,
  Database,
  SlidersHorizontal,
  ShieldCheck,
} from "lucide-react";
import { CloudAiConfig } from "@/lib/api";

interface UnitItem {
  title: string;
  topics: string;
  chunks: number;
}

interface WorkspaceHeaderProps {
  mode: "student" | "teacher" | "admin";
  activeSubject: string;
  activeUnit: string;
  setActiveUnit: (unit: string) => void;
  unitsList: UnitItem[];
  isUnitDropdownOpen: boolean;
  setIsUnitDropdownOpen: (open: boolean) => void;
  selectedModel: string;
  onOpenSubjectModal: () => void;
  cloudConfig: CloudAiConfig;
  onOpenAIModelModal: () => void;
  isInHub?: boolean;
  onOpenRSSHViewer?: () => void;
  onSwitchToErp?: () => void;
  onReturnFromErp?: () => void;
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
  onOpenSubjectModal,
  cloudConfig,
  onOpenAIModelModal,
  isInHub = false,
  onOpenRSSHViewer,
  onSwitchToErp,
  onReturnFromErp,
}: WorkspaceHeaderProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const actionsMenuRef = useRef<HTMLDivElement>(null);
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUnitDropdownOpen(false);
      }
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target as Node)) {
        setIsActionsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsUnitDropdownOpen]);

  const isCloudActive = cloudConfig.mode === "cloud" || (cloudConfig.mode === "hybrid" && cloudConfig.isValid);

  const getRoleTitle = () => {
    if (mode === "student") return "Student Workspace";
    if (mode === "teacher") return "Teacher Studio";
    return "Institution Admin ERP";
  };

  return (
    <header className="h-16 border-b border-white/[0.08] px-6 sm:px-8 flex items-center justify-between bg-black/80 backdrop-blur-xl z-30">
      <div className="flex items-center gap-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#30d158] animate-pulse" />
          <span className="text-white font-semibold">{getRoleTitle()}</span>
        </div>

        <span className="text-[#86868b]">/</span>

        {mode === "admin" ? (
          <span className="text-[#86868b] text-xs font-medium flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Cloud Supabase Sync Live</span>
          </span>
        ) : isInHub ? (
          <span className="text-[#86868b] text-xs font-medium">
            {mode === "student" ? "Choose Course Package" : "Course Authoring Hub"}
          </span>
        ) : (
          <>
            <button
              onClick={onOpenSubjectModal}
              className="text-[#0071e3] hover:underline font-medium cursor-pointer"
            >
              {activeSubject || "Select Subject"}
            </button>

            {activeUnit && unitsList.length > 0 && (
              <>
                <span className="text-[#86868b]">/</span>

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
              </>
            )}
          </>
        )}
      </div>

      {/* Top Right Workspace Menu */}
      <div className="relative" ref={actionsMenuRef}>
        <button
          onClick={() => setIsActionsMenuOpen(!isActionsMenuOpen)}
          className="px-3.5 py-1.5 rounded-xl bg-[#1c1c1e] hover:bg-[#2c2c2e] border border-white/10 text-xs text-white font-medium flex items-center gap-2 transition-all cursor-pointer shadow-sm"
        >
          <SlidersHorizontal className="h-3.5 w-3.5 text-[#0071e3]" />
          <span>Workspace Menu</span>
          <ChevronDown
            className={`h-3.5 w-3.5 text-[#86868b] transition-transform duration-200 ${
              isActionsMenuOpen ? "rotate-180 text-white" : ""
            }`}
          />
        </button>

        {isActionsMenuOpen && (
          <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#18181b] p-2 border border-white/20 shadow-2xl z-50 flex flex-col gap-1 animate-in fade-in duration-150">
            {/* PORTAL SECTION */}
            <div className="px-3 py-2 text-[11px] font-semibold text-[#86868b] uppercase tracking-wider border-b border-white/[0.08] flex items-center justify-between">
              <span>Portals</span>
              <span className="text-[10px] text-emerald-400 font-mono">
                {mode === "admin" ? "ERP Portal Active" : "Learning Workspace"}
              </span>
            </div>

            {/* Switch to ERP Option (When in Student / Teacher mode) */}
            {mode !== "admin" && onSwitchToErp && (
              <button
                onClick={() => {
                  setIsActionsMenuOpen(false);
                  onSwitchToErp();
                }}
                className="w-full text-left p-2.5 rounded-xl text-xs flex items-center gap-3 bg-[#1c1c1e] hover:bg-[#2c2c2e] border border-white/10 transition-all cursor-pointer group"
              >
                <div className="h-8 w-8 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center flex-shrink-0 text-[#0071e3]">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <span>Switch to ERP Portal</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-[#0071e3] font-semibold">Cloud</span>
                  </div>
                  <span className="text-[11px] text-[#86868b] leading-tight mt-0.5">
                    Admissions, attendance, routine &amp; grades
                  </span>
                </div>
              </button>
            )}

            {/* Return from ERP Option (When in Admin mode) */}
            {mode === "admin" && onReturnFromErp && (
              <button
                onClick={() => {
                  setIsActionsMenuOpen(false);
                  onReturnFromErp();
                }}
                className="w-full text-left p-2.5 rounded-xl text-xs flex items-center gap-3 bg-[#1c1c1e] hover:bg-[#2c2c2e] border border-white/10 transition-all cursor-pointer group"
              >
                <div className="h-8 w-8 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center flex-shrink-0 text-[#0071e3]">
                  <FolderOpen className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-white">Return to Learning Workspace</span>
                  <span className="text-[11px] text-[#86868b] leading-tight mt-0.5">
                    Back to active curriculum &amp; AI tools
                  </span>
                </div>
              </button>
            )}

            <div className="px-3 py-2 text-[11px] font-semibold text-[#86868b] uppercase tracking-wider border-b border-white/[0.08] mt-1 flex items-center justify-between">
              <span>Tools &amp; Configuration</span>
              <span className="text-[10px] text-[#30d158] font-mono">
                {isCloudActive ? "Cloud AI" : "Local Engine"}
              </span>
            </div>

            {/* 1. Course Library */}
            <button
              onClick={() => {
                setIsActionsMenuOpen(false);
                onOpenSubjectModal();
              }}
              className="w-full text-left p-2.5 rounded-xl text-xs flex items-center gap-3 text-[#a1a1a6] hover:bg-white/[0.06] hover:text-white transition-all cursor-pointer"
            >
              <div className="h-8 w-8 rounded-lg bg-[#0071e3]/10 border border-[#0071e3]/20 flex items-center justify-center flex-shrink-0 text-[#0071e3]">
                <FolderOpen className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-white">Course Library</span>
                <span className="text-[11px] text-[#86868b]">Switch subject &amp; view mounted packages</span>
              </div>
            </button>

            {/* 2. AI Inference Engine & Cloud Keys */}
            <button
              onClick={() => {
                setIsActionsMenuOpen(false);
                onOpenAIModelModal();
              }}
              className="w-full text-left p-2.5 rounded-xl text-xs flex items-center gap-3 text-[#a1a1a6] hover:bg-white/[0.06] hover:text-white transition-all cursor-pointer"
            >
              <div className="h-8 w-8 rounded-lg bg-[#30d158]/10 border border-[#30d158]/20 flex items-center justify-center flex-shrink-0 text-[#30d158]">
                {isCloudActive ? <Zap className="h-4 w-4" /> : <Cpu className="h-4 w-4" />}
              </div>
              <div className="flex flex-col flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white">AI Inference &amp; API Keys</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-[#0071e3] font-semibold">
                    {isCloudActive ? "Cloud" : "Local"}
                  </span>
                </div>
                <span className="text-[11px] text-[#86868b] truncate max-w-[180px]">
                  {isCloudActive ? cloudConfig.model || cloudConfig.providerName : selectedModel}
                </span>
              </div>
            </button>

            {/* 3. .rssh Package Viewer */}
            {onOpenRSSHViewer && (
              <button
                onClick={() => {
                  setIsActionsMenuOpen(false);
                  onOpenRSSHViewer();
                }}
                className="w-full text-left p-2.5 rounded-xl text-xs flex items-center gap-3 text-[#a1a1a6] hover:bg-white/[0.06] hover:text-white transition-all cursor-pointer"
              >
                <div className="h-8 w-8 rounded-lg bg-[#ff9f0a]/10 border border-[#ff9f0a]/20 flex items-center justify-center flex-shrink-0 text-[#ff9f0a]">
                  <Database className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-white">.rssh Package Inspector</span>
                  <span className="text-[11px] text-[#86868b]">Inspect SQLite DB, vector index &amp; archive</span>
                </div>
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
