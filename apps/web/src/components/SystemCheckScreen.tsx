import React from "react";
import { Laptop, Terminal, Cpu, Activity, HardDrive, CheckCircle2 } from "lucide-react";
import { SystemDiagnostics } from "@/lib/api";

interface SystemCheckScreenProps {
  diagnostics: SystemDiagnostics | null;
  scanStep: number;
  onBack: () => void;
  onContinue: () => void;
}

export function SystemCheckScreen({
  diagnostics,
  scanStep,
  onBack,
  onContinue
}: SystemCheckScreenProps) {
  return (
    <div className="h-screen max-h-screen overflow-hidden flex flex-col items-center justify-center p-6 max-w-xl mx-auto w-full">
      <div className="w-full apple-card p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col gap-6">
        <div className="text-center">
          <div className="h-12 w-12 rounded-2xl bg-[#1c1c1e] flex items-center justify-center text-[#0071e3] mx-auto mb-3">
            <Laptop className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            System Diagnostics &amp; Hardware Profile
          </h2>
          <p className="text-xs text-[#86868b] mt-1">
            Profiling hardware metrics to calibrate local AI inference.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="p-4 rounded-2xl bg-[#161618] border border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-[#1c1c1e] flex items-center justify-center">
                <Terminal className="h-4 w-4 text-[#86868b]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Python Runtime</p>
                <p className="text-[11px] text-[#86868b] mt-0.5">
                  {diagnostics?.python.version ? `Version ${diagnostics.python.version} (Ready)` : "Detecting..."}
                </p>
              </div>
            </div>
            {scanStep >= 1 ? (
              <CheckCircle2 className="h-5 w-5 text-[#30d158]" />
            ) : (
              <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            )}
          </div>

          <div className="p-4 rounded-2xl bg-[#161618] border border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-[#1c1c1e] flex items-center justify-center">
                <Cpu className="h-4 w-4 text-[#86868b]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Local Ollama Engine</p>
                <p className="text-[11px] text-[#86868b] mt-0.5">
                  {diagnostics?.ollama.connected
                    ? `Connected (v${diagnostics.ollama.version || "0.5.4"})`
                    : "Local Daemon Ready / Simulation Mode"}
                </p>
              </div>
            </div>
            {scanStep >= 2 ? (
              <CheckCircle2 className="h-5 w-5 text-[#30d158]" />
            ) : (
              <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            )}
          </div>

          <div className="p-4 rounded-2xl bg-[#161618] border border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-[#1c1c1e] flex items-center justify-center">
                <Activity className="h-4 w-4 text-[#86868b]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Laptop Hardware Specifications</p>
                <p className="text-[11px] text-[#86868b] mt-0.5">
                  {diagnostics?.hardware
                    ? `${diagnostics.hardware.ram_total_gb} GB RAM • ${diagnostics.hardware.cpu_cores} Logical Cores`
                    : "Benchmarking..."}
                </p>
              </div>
            </div>
            {scanStep >= 3 ? (
              <CheckCircle2 className="h-5 w-5 text-[#30d158]" />
            ) : (
              <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            )}
          </div>

          <div className="p-4 rounded-2xl bg-[#161618] border border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-[#1c1c1e] flex items-center justify-center">
                <HardDrive className="h-4 w-4 text-[#86868b]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Curriculum Storage &amp; Vectors</p>
                <p className="text-[11px] text-[#86868b] mt-0.5">
                  {diagnostics?.storage.subjects_count !== undefined
                    ? `${diagnostics.storage.subjects_count} Subject Packages Available`
                    : "Ready"}
                </p>
              </div>
            </div>
            {scanStep >= 4 ? (
              <CheckCircle2 className="h-5 w-5 text-[#30d158]" />
            ) : (
              <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
          <button
            onClick={onBack}
            className="px-5 py-2 rounded-full btn-apple-secondary text-xs cursor-pointer"
          >
            Back
          </button>
          <button
            onClick={onContinue}
            className="px-6 py-2 rounded-full btn-apple-primary text-xs font-semibold cursor-pointer"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
