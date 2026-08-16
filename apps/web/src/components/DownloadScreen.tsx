"use client";

import React, { useState } from "react";
import { Download, Monitor, CheckCircle2, Shield, HardDrive, Terminal, Laptop, Info } from "lucide-react";
import { AxiomLogo } from "./AxiomLogo";

interface DownloadScreenProps {
  onBack: () => void;
  onStart: () => void;
}

export function DownloadScreen({ onBack, onStart }: DownloadScreenProps) {
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
    <div className="min-h-screen w-screen bg-black text-[#f5f5f7] flex flex-col justify-between p-6 sm:p-10 relative overflow-x-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#0071e3]/12 blur-[150px] rounded-full" />
      <div className="pointer-events-none absolute bottom-10 right-10 w-[500px] h-[300px] bg-[#30d158]/06 blur-[140px] rounded-full" />

      {/* Top Header */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between z-10 pb-6 border-b border-white/[0.08]">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-full bg-white/[0.06] border border-white/10 hover:bg-white/10 text-xs sm:text-sm font-semibold text-[#86868b] hover:text-white transition-all cursor-pointer"
        >
          Back to Home
        </button>

        <div className="flex items-center gap-2.5">
          <AxiomLogo className="h-7 w-7" />
          <span className="text-base font-extrabold tracking-tight text-white">AXIOM DESKTOP</span>
        </div>

        <button
          onClick={onStart}
          className="px-5 py-2 rounded-full btn-apple-primary text-xs sm:text-sm font-semibold shadow-lg cursor-pointer"
        >
          Web Setup
        </button>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-5xl mx-auto my-auto py-8 z-10 flex flex-col gap-8">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Download Axiom for Desktop
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-[#86868b] mt-3 leading-relaxed">
            Standalone, air-gapped executable container with embedded local AI inference, LanceDB vectors, and instant <code className="text-white bg-[#1c1c1e] px-1.5 py-0.5 rounded font-mono text-xs border border-white/10">.rssh</code> file associations.
          </p>
        </div>

        {/* Primary Download Card */}
        <div className="apple-card p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-3xl bg-[#1c1c1e] border border-white/10 flex items-center justify-center text-[#0071e3] shadow-inner shrink-0">
              <Monitor className="h-9 w-9 sm:h-11 sm:w-11" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Windows Installer (.exe)
                </h3>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#30d158]/20 text-[#30d158] border border-[#30d158]/30">
                  v1.0.0-beta
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#86868b] mt-1">
                For Windows 10 &amp; 11 (64-bit) • Standalone Electron Package
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-[#86868b] font-mono">
                <span>Size: ~142 MB</span>
                <span>•</span>
                <span>Type: x64 Setup</span>
                <span>•</span>
                <span>Checksum: SHA-256 Verified</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2 w-full md:w-auto shrink-0">
            <button
              onClick={handleStartDownload}
              disabled={downloading}
              className="w-full md:w-auto px-8 py-3.5 rounded-full btn-apple-primary text-sm sm:text-base font-bold shadow-xl hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {downloading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Preparing Installer...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Download .exe</span>
                </>
              )}
            </button>

            {downloadComplete && (
              <span className="text-[11px] text-[#30d158] font-medium flex items-center gap-1 mt-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Download started successfully!
              </span>
            )}
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto w-full text-left">
          <div className="p-4 rounded-2xl bg-[#161618] border border-white/[0.06] flex flex-col justify-between">
            <div className="flex items-center gap-2.5 mb-2">
              <Shield className="h-4 w-4 text-[#0071e3]" />
              <h4 className="text-xs font-bold text-white">100% Offline Runtime</h4>
            </div>
            <p className="text-[11px] text-[#86868b] leading-relaxed">
              No internet connection required. Runs models locally through embedded Ollama engine.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#161618] border border-white/[0.06] flex flex-col justify-between">
            <div className="flex items-center gap-2.5 mb-2">
              <HardDrive className="h-4 w-4 text-[#30d158]" />
              <h4 className="text-xs font-bold text-white">.rssh File Associate</h4>
            </div>
            <p className="text-[11px] text-[#86868b] leading-relaxed">
              Double-click any `.rssh` course package file to instantly mount and open syllabus workspaces.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#161618] border border-white/[0.06] flex flex-col justify-between">
            <div className="flex items-center gap-2.5 mb-2">
              <Terminal className="h-4 w-4 text-[#ff9f0a]" />
              <h4 className="text-xs font-bold text-white">Hardware Accelerated</h4>
            </div>
            <p className="text-[11px] text-[#86868b] leading-relaxed">
              Auto-detects NVIDIA CUDA, AMD ROCm, or Intel integrated graphics for fast inference.
            </p>
          </div>
        </div>

        {/* System Requirements & Verification */}
        <div className="p-5 rounded-2xl bg-[#121214] border border-white/[0.08] max-w-4xl mx-auto w-full text-xs">
          <div className="flex items-center gap-2 mb-3">
            <Info className="h-4 w-4 text-[#0071e3]" />
            <span className="font-bold text-white text-xs uppercase tracking-wider">
              System Specifications &amp; Requirements
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[#86868b]">
            <div className="p-2.5 rounded-xl bg-black/50 border border-white/[0.04]">
              <span className="block text-[10px] uppercase font-bold text-[#86868b]">OS</span>
              <span className="font-medium text-white text-xs">Windows 10 / 11 64-bit</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/50 border border-white/[0.04]">
              <span className="block text-[10px] uppercase font-bold text-[#86868b]">RAM</span>
              <span className="font-medium text-white text-xs">8 GB min (16 GB rec)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/50 border border-white/[0.04]">
              <span className="block text-[10px] uppercase font-bold text-[#86868b]">Storage</span>
              <span className="font-medium text-white text-xs">2.5 GB free space</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/50 border border-white/[0.04]">
              <span className="block text-[10px] uppercase font-bold text-[#86868b]">Processor</span>
              <span className="font-medium text-white text-xs">Intel i5 / Ryzen 5+</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto pt-6 border-t border-white/[0.08] flex items-center justify-between text-xs text-[#86868b] z-10">
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
