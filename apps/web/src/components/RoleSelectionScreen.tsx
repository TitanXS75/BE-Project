"use client";

import React from "react";
import {
  Check,
  Home,
  ShieldCheck,
  BookOpen,
  GraduationCap,
  Sparkles
} from "lucide-react";

export type UserRole = "student" | "teacher" | "admin";

interface RoleSelectionScreenProps {
  onSelectRole: (role: UserRole) => void;
  onBack: () => void;
  onExitHome: () => void;
}

export function RoleSelectionScreen({
  onSelectRole,
  onExitHome,
}: RoleSelectionScreenProps) {
  const roles = [
    {
      id: "student" as UserRole,
      title: "Student Workspace",
      kicker: "Curriculum AI Tutor",
      badge: "Local-First Learning",
      badgeColor: "bg-[#0071e3]/15 text-[#0071e3] border-[#0071e3]/30",
      accentColor: "#0071e3",
      image: "/assets/3d/role_student_3d.jpg",
      description:
        "Syllabus-grounded learning with strict zero hallucinations, Feynman teach-back evaluations, spaced repetition flashcards, and exam trend analytics.",
      features: [
        "Curriculum AI Tutor with citation bounds",
        "Feynman teach-back intuition evaluation",
        "Spaced repetition flashcards & practice quizzes",
        "5-Year Past Exam (PYQ) trend analytics",
      ],
      buttonText: "Continue as Student",
      buttonClass: "bg-[#0071e3] hover:bg-[#0077ed] text-white",
    },
    {
      id: "teacher" as UserRole,
      title: "Teacher Studio",
      kicker: "Curriculum & Exam Studio",
      badge: "Pedagogy Tools",
      badgeColor: "bg-[#ff9f0a]/15 text-[#ff9f0a] border-[#ff9f0a]/30",
      accentColor: "#ff9f0a",
      image: "/assets/3d/role_teacher_3d.jpg",
      description:
        "Curriculum document ingestion, Bloom's Taxonomy exam blueprint authoring, lecture slide keyframe generation, and portable .rssh exporter.",
      features: [
        "RAG textbook & syllabus ingestion engine",
        "Bloom's Taxonomy exam blueprint generator",
        "Interactive lecture slide presentation creator",
        "Export standalone offline .rssh packages",
      ],
      buttonText: "Continue as Teacher",
      buttonClass: "bg-[#ff9f0a] hover:bg-[#ffb020] text-black font-semibold",
    },
    {
      id: "admin" as UserRole,
      title: "Institution Admin ERP",
      kicker: "Cloud Institutional ERP",
      badge: "Academic Operations",
      badgeColor: "bg-[#30d158]/15 text-[#30d158] border-[#30d158]/30",
      accentColor: "#30d158",
      image: "/assets/3d/role_admin_3d.jpg",
      description:
        "Comprehensive administrative ERP for managing student admissions, faculty appointments, roll-call attendance, grade sheets, and timetables.",
      features: [
        "Cloud database synchronization with Supabase",
        "Unified student directory & faculty registry",
        "Subject-wise attendance tracker & analytics",
        "Exam scheduler, routine planner & circulars",
      ],
      buttonText: "Continue as Administrator",
      buttonClass: "bg-[#30d158] hover:bg-[#34e060] text-black font-semibold",
    },
  ];

  return (
    <div className="h-screen w-screen bg-black text-[#f5f5f7] flex flex-col justify-between px-6 sm:px-10 lg:px-14 py-4 sm:py-6 select-none antialiased overflow-hidden">
      {/* ─── FULL-WIDTH HEADER ROW ─── */}
      <header className="w-full max-w-[1440px] mx-auto relative flex items-center justify-center pt-1 pb-2">
        {/* Top Left Home Button */}
        <button
          type="button"
          onClick={onExitHome}
          className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#161618] hover:bg-[#1c1c1e] text-xs sm:text-sm font-semibold text-[#86868b] hover:text-white border border-white/10 transition-all cursor-pointer shadow-md"
        >
          <Home className="h-4 w-4 text-[#0071e3]" />
          <span>Home</span>
        </button>

        {/* Center Header */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Choose Your Axiom Workspace
          </h1>
          <p className="text-xs sm:text-base text-[#86868b] mt-1 max-w-2xl mx-auto">
            Select your primary operational profile to calibrate hardware diagnostics and local models.
          </p>
        </div>
      </header>

      {/* ─── 3 EXPANDED VERTICAL SHOWCASE CARDS (EQUAL HEIGHT & FULL WIDTH) ─── */}
      <main className="w-full max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 flex-1 min-h-0 my-3 items-stretch">
        {roles.map((role) => (
          <div
            key={role.id}
            onClick={() => onSelectRole(role.id)}
            className="group relative rounded-3xl bg-[#161618] border border-white/10 hover:border-white/25 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)] cursor-pointer h-full"
          >
            {/* Top 3D Artwork Showcase Container (Enlarged) */}
            <div className="relative w-full h-44 sm:h-48 lg:h-56 2xl:h-64 bg-[#0c0c0e] border-b border-white/[0.08] flex items-center justify-center p-4 overflow-hidden flex-shrink-0">
              {/* Subtle Ambient Backlight Glow */}
              <div
                className="absolute inset-0 opacity-25 group-hover:opacity-50 transition-opacity duration-500 blur-2xl"
                style={{ backgroundColor: role.accentColor }}
              />

              {/* 3D Render Image (Enlarged) */}
              <div className="relative z-10 h-full w-full flex items-center justify-center">
                <img
                  src={role.image}
                  alt={role.title}
                  className="max-h-full max-w-full object-contain rounded-2xl group-hover:scale-105 transition-transform duration-500 shadow-2xl"
                />
              </div>

              {/* Top Badge Tag */}
              <div className="absolute top-3.5 left-3.5 z-20">
                <span
                  className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border backdrop-blur-md ${role.badgeColor}`}
                >
                  {role.badge}
                </span>
              </div>
            </div>

            {/* Bottom Content Body (Larger text & equal spacing) */}
            <div className="p-5 sm:p-6 lg:p-7 flex-1 flex flex-col justify-between gap-4 bg-[#161618] overflow-hidden">
              <div className="flex flex-col gap-2.5">
                <div>
                  <span className="text-[11px] sm:text-xs font-bold text-[#86868b] uppercase tracking-wider block mb-1">
                    {role.kicker}
                  </span>
                  <h2 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight">
                    {role.title}
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed line-clamp-2">
                  {role.description}
                </p>

                {/* Feature Bullet Checklist (Enlarged) */}
                <div className="flex flex-col gap-2 pt-2.5 border-t border-white/[0.06]">
                  {role.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-[#f5f5f7]">
                      <div className="h-4 w-4 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                        <Check className="h-2.5 w-2.5 text-[#30d158]" />
                      </div>
                      <span className="leading-tight font-medium truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button (Enlarged) */}
              <div className="pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectRole(role.id);
                  }}
                  className={`w-full py-3 sm:py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold tracking-wide transition-all shadow-md active:scale-[0.98] cursor-pointer flex items-center justify-center ${role.buttonClass}`}
                >
                  <span>{role.buttonText}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* Optical bottom breathing padding */}
      <div className="h-1" />
    </div>
  );
}
