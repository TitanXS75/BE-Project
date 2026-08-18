"use client";

import React, { useState } from "react";
import { Download, Monitor, CheckCircle2, Shield, HardDrive, Terminal, Info } from "lucide-react";
import { AxiomLogo } from "./AxiomLogo";

interface DownloadScreenProps {
  onBack: () => void;
  onStart: () => void;
  onHowItWorks?: () => void;
}

export function DownloadScreen({ onBack, onStart, onHowItWorks }: DownloadScreenProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const handleStartDownload = () => {
    setDownloading(true);
    setDownloadComplete(false);

    // Simulate direct installer package download trigger
    setTimeout(() => {
      setDownloading(false);
      setDownloadComplete(true);

      // Create dummy download package trigger
      const element = document.createElement("a");
      const file = new Blob(
        [
          "Axiom AI Local Learning Platform - Executable Installer Package\nVersion: 1.0.0-beta\nArchitecture: Windows x64 (Electron Container)\nStatus: Ready for deployment."
        ],
        { type: "text/plain" }
      );
      element.href = URL.createObjectURL(file);
      element.download = "Axiom-Setup-1.0.0.exe";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full bg-black text-[#f5f5f7] flex flex-col justify-between py-6 px-4 sm:px-10 lg:px-16 relative overflow-x-hidden antialiased selection:bg-[#0071e3] selection:text-white">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-[#0071e3]/15 blur-[160px] rounded-full" />
      <div className="pointer-events-none absolute bottom-10 right-10 w-[600px] h-[350px] bg-[#30d158]/08 blur-[150px] rounded-full" />
      <div className="pointer-events-none absolute top-1/2 left-10 w-[500px] h-[350px] bg-[#8b5cf6]/08 blur-[150px] rounded-full" />

      {/* Top Header - Expanded Full Width */}
      <header className="w-full max-w-[1440px] mx-auto flex items-center justify-between z-10 pb-6 border-b border-white/[0.08]">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-full bg-white/[0.06] border border-white/10 hover:bg-white/12 text-xs sm:text-sm font-semibold text-[#86868b] hover:text-white transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
        >
          Back to Home
        </button>

        <div className="flex items-center gap-2.5">
          <AxiomLogo className="h-7 w-7" />
          <span className="text-base font-extrabold tracking-tight text-white">AXIOM DESKTOP</span>
        </div>

        <button
          onClick={onStart}
          className="px-5 py-2 sm:px-6 sm:py-2.5 rounded-full bg-white text-black text-xs sm:text-sm font-bold shadow-lg hover:bg-neutral-200 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          Web Setup
        </button>
      </header>

      {/* Main Content Area - Expanded Full Width */}
      <main className="w-full max-w-[1440px] mx-auto py-8 z-10 flex flex-col gap-8 flex-1">
        {/* Title */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
            Download Axiom for Desktop
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-[#86868b] mt-3 leading-relaxed max-w-3xl mx-auto">
            Standalone, air-gapped executable container with embedded local AI inference, LanceDB vectors, and instant <code className="text-white bg-[#1c1c1e] px-2 py-0.5 rounded font-mono text-xs border border-white/10">.rssh</code> file associations.
          </p>
        </div>

        {/* Primary Download Card - Expanded Full Width */}
        <div className="apple-card p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8 w-full">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-3xl bg-[#1c1c1e] border border-white/10 flex items-center justify-center text-[#0071e3] shadow-inner shrink-0">
              <Monitor className="h-10 w-10 sm:h-12 sm:w-12" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Windows Installer (.exe)
                </h3>
                <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#30d158]/20 text-[#30d158] border border-[#30d158]/30">
                  v1.0.0-beta
                </span>
              </div>
              <p className="text-sm sm:text-base text-[#86868b] mt-1.5">
                For Windows 10 &amp; 11 (64-bit) • Standalone Electron Package
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs sm:text-sm text-[#86868b] font-mono">
                <span>Size: ~142 MB</span>
                <span>•</span>
                <span>Type: x64 Setup</span>
                <span>•</span>
                <span>Checksum: SHA-256 Verified</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center lg:items-end gap-2.5 w-full lg:w-auto shrink-0">
            <button
              onClick={handleStartDownload}
              disabled={downloading}
              className="w-full sm:w-auto px-10 py-4 rounded-full bg-white text-black text-base font-bold shadow-xl hover:bg-neutral-200 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-3"
            >
              {downloading ? (
                <>
                  <div className="h-5 w-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  <span>Preparing Installer...</span>
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  <span>Download .exe</span>
                </>
              )}
            </button>

            {downloadComplete && (
              <span className="text-xs text-[#30d158] font-medium flex items-center gap-1.5 mt-1">
                <CheckCircle2 className="h-4 w-4" /> Download started successfully!
              </span>
            )}
          </div>
        </div>

        {/* Feature Grid - Expanded Full Width */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full text-left">
          <div className="p-6 rounded-3xl bg-[#161618] border border-white/[0.08] flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-2xl bg-[#0071e3]/10 border border-[#0071e3]/20 flex items-center justify-center text-[#0071e3]">
                  <Shield className="h-5 w-5" />
                </div>
                <h4 className="text-base font-bold text-white">100% Offline Runtime</h4>
              </div>
              <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                No internet connection required. Runs models locally through embedded Ollama engine without data leaks.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06] text-xs font-mono text-[#0071e3]">
              Private • Air-Gapped
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#161618] border border-white/[0.08] flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-2xl bg-[#30d158]/10 border border-[#30d158]/20 flex items-center justify-center text-[#30d158]">
                  <HardDrive className="h-5 w-5" />
                </div>
                <h4 className="text-base font-bold text-white">.rssh File Association</h4>
              </div>
              <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                Double-click any `.rssh` course package file to instantly mount and open syllabus workspaces.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06] text-xs font-mono text-[#30d158]">
              Instant Syllabus Mount
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#161618] border border-white/[0.08] flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-2xl bg-[#ff9f0a]/10 border border-[#ff9f0a]/20 flex items-center justify-center text-[#ff9f0a]">
                  <Terminal className="h-5 w-5" />
                </div>
                <h4 className="text-base font-bold text-white">Hardware Accelerated</h4>
              </div>
              <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                Auto-detects NVIDIA CUDA, AMD ROCm, or Intel graphics for ultra-fast local inference.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06] text-xs font-mono text-[#ff9f0a]">
              Direct GPU Pipeline
            </div>
          </div>
        </div>

        {/* System Requirements & Verification - Expanded Full Width */}
        <div className="p-6 sm:p-7 rounded-3xl bg-[#121214] border border-white/[0.08] w-full text-xs sm:text-sm shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <Info className="h-4 w-4 text-[#0071e3]" />
            <span className="font-bold text-white text-xs sm:text-sm uppercase tracking-wider">
              System Specifications &amp; Requirements
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[#86868b]">
            <div className="p-4 rounded-2xl bg-black/50 border border-white/[0.04]">
              <span className="block text-[11px] uppercase font-bold text-[#86868b] mb-1">OS</span>
              <span className="font-medium text-white text-sm">Windows 10 / 11 64-bit</span>
            </div>
            <div className="p-4 rounded-2xl bg-black/50 border border-white/[0.04]">
              <span className="block text-[11px] uppercase font-bold text-[#86868b] mb-1">RAM</span>
              <span className="font-medium text-white text-sm">8 GB min (16 GB rec)</span>
            </div>
            <div className="p-4 rounded-2xl bg-black/50 border border-white/[0.04]">
              <span className="block text-[11px] uppercase font-bold text-[#86868b] mb-1">Storage</span>
              <span className="font-medium text-white text-sm">2.5 GB free space</span>
            </div>
            <div className="p-4 rounded-2xl bg-black/50 border border-white/[0.04]">
              <span className="block text-[11px] uppercase font-bold text-[#86868b] mb-1">Processor</span>
              <span className="font-medium text-white text-sm">Intel i5 / Ryzen 5+</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Expanded Full Width */}
      <footer className="w-full max-w-[1440px] mx-auto pt-6 border-t border-white/[0.08] flex items-center justify-between text-xs text-[#86868b] z-10">
        <span>Axiom Desktop Installer • Electron Container Architecture</span>
        <button
          onClick={onStart}
          className="text-white hover:text-[#0071e3] transition-colors font-semibold cursor-pointer"
        >
          Launch Web Version
        </button>
      </footer>
    </div>
  );
}
