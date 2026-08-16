import React from "react";
import { XCircle, CheckCircle2 } from "lucide-react";

interface SubjectItem {
  name: string;
  code: string;
  units: number;
  chunks: number;
  rssh: string;
}

interface SubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectsList: SubjectItem[];
  activeSubject: string;
  onSelectSubject: (name: string) => void;
}

export function SubjectModal({
  isOpen,
  onClose,
  subjectsList,
  activeSubject,
  onSelectSubject
}: SubjectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="apple-card w-full max-w-lg p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <h3 className="text-base font-semibold text-white">Mounted Subject Packages</h3>
          <button
            onClick={onClose}
            className="text-[#86868b] hover:text-white cursor-pointer"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {subjectsList.map((subj, i) => (
            <div
              key={i}
              onClick={() => {
                onSelectSubject(subj.name);
                onClose();
              }}
              className={`p-4 rounded-2xl border text-sm flex items-center justify-between cursor-pointer transition-all ${
                activeSubject === subj.name
                  ? "bg-[#1c1c1e] border-[#0071e3] text-white"
                  : "bg-black border-white/10 text-[#86868b] hover:text-white"
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
