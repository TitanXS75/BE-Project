import React, { useState, useRef } from "react";
import {
  XCircle,
  CheckCircle2,
  Upload,
  FileArchive,
  AlertCircle,
  Sparkles
} from "lucide-react";
import { importRSSHPackage } from "@/lib/api";

export interface SubjectItem {
  name: string;
  code: string;
  units: number;
  docs: number;
  chunks: number;
  rssh: string;
}

interface SubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectsList: SubjectItem[];
  activeSubject: string;
  onSelectSubject: (name: string) => void;
  onImportPackage?: (newSubject: SubjectItem) => void;
}

export function SubjectModal({
  isOpen,
  onClose,
  subjectsList,
  activeSubject,
  onSelectSubject,
  onImportPackage
}: SubjectModalProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleProcessFile = async (file: File) => {
    if (!file.name.endsWith(".rssh") && !file.name.endsWith(".zip")) {
      setImportError("Only .rssh or .zip packages are supported.");
      return;
    }
    setIsImporting(true);
    setImportError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await importRSSHPackage(formData);
      const subjectName =
        res.subject?.subject_name ||
        res.subject?.title ||
        file.name.replace(/\.(rssh|zip)$/i, "");

      const newSubject: SubjectItem = {
        name: subjectName,
        code: res.subject?.subject_code || `CS-${Math.floor(100 + Math.random() * 900)}`,
        units: res.subject?.units?.length || 4,
        docs: res.subject?.documents_count || 12,
        chunks: res.subject?.chunks_count || 140,
        rssh: file.name
      };

      if (onImportPackage) {
        onImportPackage(newSubject);
      }
      onSelectSubject(subjectName);
      setImportSuccess(`Package ${file.name} imported successfully.`);
      setTimeout(() => {
        setImportSuccess(null);
        onClose();
      }, 1000);
    } catch (err: any) {
      setImportError(err?.message || "Failed to unpack and verify .rssh package.");
    } finally {
      setIsImporting(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="apple-card w-full max-w-lg p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div>
            <h3 className="text-base font-semibold text-white">Mounted Subject Packages</h3>
            <p className="text-xs text-[#86868b] mt-0.5">Switch syllabus context or import course .rssh package</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#86868b] hover:text-white cursor-pointer"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        {/* ─── IMPORT .RSSH PACKAGE DROPZONE ─── */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`p-5 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-2 ${
            isDragOver
              ? "border-[#0071e3] bg-[#0071e3]/10"
              : "border-white/10 hover:border-white/20 bg-black/40 hover:bg-black/60"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".rssh,.zip"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleProcessFile(e.target.files[0]);
              }
            }}
            className="hidden"
          />

          <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#0071e3]">
            {isImporting ? (
              <Sparkles className="h-5 w-5 animate-spin" />
            ) : (
              <Upload className="h-5 w-5" />
            )}
          </div>

          <div>
            <span className="text-xs font-semibold text-white block">
              {isImporting ? "Unpacking & Verifying Package..." : "Import Course Package (.rssh)"}
            </span>
            <span className="text-[11px] text-[#86868b]">
              Drag and drop .rssh or .zip package here, or click to browse
            </span>
          </div>

          {importError && (
            <div className="flex items-center gap-1.5 text-xs text-[#ff453a] mt-1">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>{importError}</span>
            </div>
          )}

          {importSuccess && (
            <div className="flex items-center gap-1.5 text-xs text-[#30d158] mt-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{importSuccess}</span>
            </div>
          )}
        </div>

        {/* ─── SUBJECTS LIST ─── */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider px-1">
            Available Courses ({subjectsList.length})
          </span>
          {subjectsList.map((subj, i) => (
            <div
              key={i}
              onClick={() => {
                onSelectSubject(subj.name);
                onClose();
              }}
              className={`p-4 rounded-2xl border text-sm flex items-center justify-between cursor-pointer transition-all ${
                activeSubject === subj.name
                  ? "bg-[#1c1c1e] border-[#0071e3] text-white shadow-sm"
                  : "bg-black/60 border-white/10 text-[#86868b] hover:text-white hover:border-white/20"
              }`}
            >
              <div>
                <p className="font-semibold text-white">{subj.name}</p>
                <p className="text-xs text-[#86868b] mt-0.5">
                  {subj.code} • {subj.units} Units • {subj.chunks} Chunks
                </p>
              </div>
              {activeSubject === subj.name && (
                <CheckCircle2 className="h-5 w-5 text-[#0071e3]" />
              )}
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full btn-apple-secondary text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
