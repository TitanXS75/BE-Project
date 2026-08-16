import React from "react";
import { XCircle } from "lucide-react";
import { SystemDiagnostics } from "@/lib/api";

interface SpecsModalProps {
  isOpen: boolean;
  onClose: () => void;
  diagnostics: SystemDiagnostics | null;
  selectedModel: string;
}

export function SpecsModal({
  isOpen,
  onClose,
  diagnostics,
  selectedModel
}: SpecsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="apple-card w-full max-w-lg p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <h3 className="text-base font-semibold text-white">System Hardware Profile</h3>
          <button
            onClick={onClose}
            className="text-[#86868b] hover:text-white cursor-pointer"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-3 text-sm">
          <div className="p-4 rounded-2xl bg-black border border-white/10 flex justify-between">
            <span className="text-[#86868b]">Operating System:</span>
            <span className="text-white font-mono">{diagnostics?.hardware.os || "Windows 11 AMD64"}</span>
          </div>
          <div className="p-4 rounded-2xl bg-black border border-white/10 flex justify-between">
            <span className="text-[#86868b]">Processor Cores:</span>
            <span className="text-white font-mono">{diagnostics?.hardware.cpu_cores || 12} Logical Cores</span>
          </div>
          <div className="p-4 rounded-2xl bg-black border border-white/10 flex justify-between">
            <span className="text-[#86868b]">System Memory (RAM):</span>
            <span className="text-white font-mono">{diagnostics?.hardware.ram_total_gb || 15.7} GB</span>
          </div>
          <div className="p-4 rounded-2xl bg-black border border-white/10 flex justify-between">
            <span className="text-[#86868b]">Configured Local Model:</span>
            <span className="text-[#0071e3] font-mono">{selectedModel}</span>
          </div>
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
