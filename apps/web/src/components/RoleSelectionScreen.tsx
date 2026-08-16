import React from "react";
import { GraduationCap, BookOpen, CheckCircle2, LogOut } from "lucide-react";

interface RoleSelectionScreenProps {
  onSelectRole: (role: "student" | "teacher") => void;
  onBack: () => void;
  onExitHome: () => void;
}

export function RoleSelectionScreen({
  onSelectRole,
  onBack,
  onExitHome
}: RoleSelectionScreenProps) {
  return (
    <div className="h-screen max-h-screen overflow-hidden flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full">
      <div className="text-center mb-6">
        <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">
          Step 3 of 3
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
          Select Your Workspace
        </h2>
        <p className="text-xs sm:text-sm text-[#86868b] mt-1">
          Choose your profile. You can switch roles or log out at any time.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full mb-6">
        <div
          onClick={() => onSelectRole("student")}
          className="apple-card-interactive p-6 rounded-2xl flex flex-col justify-between cursor-pointer group shadow-xl"
        >
          <div>
            <div className="h-11 w-11 rounded-xl bg-[#1c1c1e] flex items-center justify-center text-[#0071e3] mb-4">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Student Workspace
            </h3>
            <p className="text-xs text-[#86868b] leading-relaxed mb-4">
              Curriculum-grounded learning, spaced repetition flashcards, adaptive practice quizzes, Feynman teach-back evaluations, and exam question trends.
            </p>

            <div className="flex flex-col gap-2 text-xs text-[#86868b]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#30d158]" />
                <span className="text-[#f5f5f7]">Curriculum AI Tutor</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#30d158]" />
                <span className="text-[#f5f5f7]">Feynman Intuition Evaluation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#30d158]" />
                <span className="text-[#f5f5f7]">Exam Frequency Trends</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-semibold text-[#0071e3]">
            <span>Enter as Student</span>
          </div>
        </div>

        <div
          onClick={() => onSelectRole("teacher")}
          className="apple-card-interactive p-6 rounded-2xl flex flex-col justify-between cursor-pointer group shadow-xl"
        >
          <div>
            <div className="h-11 w-11 rounded-xl bg-[#1c1c1e] flex items-center justify-center text-[#ff9f0a] mb-4">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Teacher Studio
            </h3>
            <p className="text-xs text-[#86868b] leading-relaxed mb-4">
              Curriculum document ingestion, Bloom&apos;s Taxonomy exam blueprint generator, structured lecture presentation creator, and portable <code className="font-mono text-[11px] text-[#f5f5f7]">.rssh</code> exporter.
            </p>

            <div className="flex flex-col gap-2 text-xs text-[#86868b]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#30d158]" />
                <span className="text-[#f5f5f7]">RAG Document Ingestion</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#30d158]" />
                <span className="text-[#f5f5f7]">Bloom&apos;s Taxonomy Exam Paper</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#30d158]" />
                <span className="text-[#f5f5f7]">Export Portable .rssh Packages</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-semibold text-[#ff9f0a]">
            <span>Enter as Teacher</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="px-5 py-2 rounded-full btn-apple-secondary text-xs cursor-pointer"
        >
          Back to Model Setup
        </button>
        <button
          onClick={onExitHome}
          className="px-5 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs text-[#86868b] hover:text-white transition-all cursor-pointer"
        >
          Exit to Home
        </button>
      </div>
    </div>
  );
}
