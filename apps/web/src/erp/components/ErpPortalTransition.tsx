"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Database, Layers, Check, Sparkles, BookOpen } from "lucide-react";

interface ErpPortalTransitionProps {
  destination: "erp" | "workspace";
  onComplete: () => void;
}

export function ErpPortalTransition({
  destination,
  onComplete,
}: ErpPortalTransitionProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(15);

  const isEnteringErp = destination === "erp";

  const steps = isEnteringErp
    ? [
        { label: "Verifying Institutional Permissions", icon: ShieldCheck },
        { label: "Connecting to Cloud Database & Tables", icon: Database },
        { label: "Hydrating Admissions & Academic Assets", icon: Layers },
        { label: "Mounting ERP Administration Console", icon: Sparkles },
      ]
    : [
        { label: "Saving Active ERP State", icon: Database },
        { label: "Calibrating Local AI Inference Node", icon: ShieldCheck },
        { label: "Restoring Syllabus Knowledge Base", icon: BookOpen },
        { label: "Mounting Learning Workspace", icon: Sparkles },
      ];

  useEffect(() => {
    // Total smooth and fast duration: ~1.4s
    const t1 = setTimeout(() => {
      setStepIndex(1);
      setProgress(45);
    }, 350);

    const t2 = setTimeout(() => {
      setStepIndex(2);
      setProgress(75);
    }, 750);

    const t3 = setTimeout(() => {
      setStepIndex(3);
      setProgress(100);
    }, 1150);

    const t4 = setTimeout(() => {
      onComplete();
    }, 1450);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-xl px-4 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-[#161618] border border-white/10 p-7 sm:p-8 shadow-2xl flex flex-col items-center text-center">
        {/* Solid Icon Container matching Stepper aesthetic */}
        <div className="h-14 w-14 rounded-2xl bg-[#1c1c1e] border border-white/10 flex items-center justify-center text-[#0071e3] shadow-inner mb-4">
          <ShieldCheck className="h-7 w-7" />
        </div>

        {/* Section Header */}
        <span className="text-[10px] font-bold text-[#0071e3] uppercase tracking-wider">
          {isEnteringErp ? "Institutional System Bridge" : "Local Learning Engine"}
        </span>
        <h2 className="text-xl font-bold text-white tracking-tight mt-1">
          {isEnteringErp ? "Launching Institutional ERP" : "Returning to Workspace"}
        </h2>
        <p className="text-xs text-[#86868b] mt-1 max-w-xs">
          {isEnteringErp
            ? "Establishing secure bridge to cloud database and administrative registry."
            : "Switching to your local air-gapped curriculum workspace."}
        </p>

        {/* Solid Single-Color Progress Bar matching Stepper connector */}
        <div className="w-full mt-5 mb-5">
          <div className="h-1.5 w-full bg-[#27272a] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0071e3] rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Progression List (Strict solid Apple dark theme) */}
        <div className="w-full flex flex-col gap-2 text-left">
          {steps.map((step, idx) => {
            const isFinished = stepIndex > idx;
            const isCurrent = stepIndex === idx;
            const StepIcon = step.icon;

            return (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border transition-all flex items-center justify-between text-xs ${
                  isCurrent
                    ? "bg-[#1c1c1e] border-[#0071e3]/60 text-white shadow-sm"
                    : isFinished
                    ? "bg-[#1c1c1e]/60 border-white/[0.06] text-white/90"
                    : "bg-transparent border-transparent text-[#86868b]/50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`h-6 w-6 rounded-lg flex items-center justify-center border ${
                      isFinished
                        ? "bg-[#1c1c1e] border-[#30d158]/30 text-[#30d158]"
                        : isCurrent
                        ? "bg-[#1c1c1e] border-[#0071e3]/40 text-[#0071e3]"
                        : "bg-white/5 border-transparent text-[#86868b]/40"
                    }`}
                  >
                    <StepIcon className="h-3.5 w-3.5" />
                  </div>
                  <span className={`text-[11px] ${isCurrent ? "font-semibold text-white" : ""}`}>
                    {step.label}
                  </span>
                </div>

                {isFinished && <Check className="h-3.5 w-3.5 text-[#30d158] flex-shrink-0" />}
                {isCurrent && (
                  <span className="h-2 w-2 rounded-full bg-[#0071e3] flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Meta */}
        <div className="mt-5 pt-3.5 border-t border-white/[0.06] w-full flex items-center justify-between text-[10px] text-[#86868b] font-mono">
          <span>Axiom Core</span>
          <span className="text-[#0071e3] font-semibold">{progress}% Synchronized</span>
        </div>
      </div>
    </div>
  );
}
