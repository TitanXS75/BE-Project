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
import { motion } from "motion/react";

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
        "Syllabus-grounded learning with strict zero hallucinations, Feynman teach-back evaluations, adaptive practice quizzes, and exam trend analytics.",
      features: [
        "Curriculum AI Tutor with citation bounds",
        "Feynman teach-back intuition evaluation",
        "Adaptive practice quizzes with diagnostic grading",
        "5-Year Past Exam (PYQ) trend analytics",
      ],
      buttonText: "Continue as Student",
      buttonClass: "bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold",
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
        "Centralized institutional records & database management",
        "Unified student directory & faculty registry",
        "Subject-wise attendance tracker & analytics",
        "Exam scheduler, routine planner & circulars",
      ],
      buttonText: "Continue as Administrator",
      buttonClass: "bg-[#30d158] hover:bg-[#34e060] text-black font-semibold",
    },
  ];

  return (
    <div className="min-h-[100dvh] w-full bg-black text-[#f5f5f7] flex flex-col justify-between px-4 sm:px-8 lg:px-12 xl:px-14 py-4 sm:py-6 select-none antialiased overflow-y-auto">
      {/* ─── RESPONSIVE HEADER ROW ─── */}
      <header className="w-full max-w-[1440px] mx-auto flex flex-col sm:relative sm:flex-row sm:items-center sm:justify-center pt-1 pb-3 sm:pb-4 gap-3 sm:gap-0">
        {/* Top Navigation Bar on Mobile / Absolute Left on Desktop */}
        <div className="flex items-center justify-between sm:absolute sm:left-0 sm:top-1/2 sm:-translate-y-1/2 w-full sm:w-auto">
          <button
            type="button"
            onClick={onExitHome}
            className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#161618] hover:bg-[#1c1c1e] text-xs sm:text-sm font-semibold text-[#86868b] hover:text-white border border-white/10 transition-all cursor-pointer shadow-md active:scale-95"
          >
            <Home className="h-4 w-4 text-[#0071e3]" />
            <span>Home</span>
          </button>

          {/* Mobile Profile Setup Tag */}
          <span className="sm:hidden text-[11px] font-semibold tracking-wider text-[#86868b] uppercase px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
            Workspace Setup
          </span>
        </div>

        {/* Center Header Title & Description */}
        <div className="text-center px-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Choose Your Axiom Workspace
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-[#86868b] mt-1 sm:mt-1.5 max-w-2xl mx-auto leading-relaxed">
            Select your primary operational profile to calibrate hardware diagnostics and local models.
          </p>
        </div>
      </header>

      {/* ─── 3 EXPANDED SHOWCASE CARDS (RESPONSIVE STACK ON PHONE, 3-COL ON DESKTOP) ─── */}
      <main className="w-full max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 flex-1 my-3 sm:my-4 items-stretch">
        {roles.map((role, index) => (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.08 }}
            onClick={() => onSelectRole(role.id)}
            className="group relative rounded-3xl bg-[#161618] border border-white/10 hover:border-white/25 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)] cursor-pointer h-auto md:h-full"
          >
            {/* Top 3D Artwork Showcase Container */}
            <div className="relative w-full h-40 sm:h-44 md:h-48 lg:h-56 xl:h-60 bg-[#0c0c0e] border-b border-white/[0.08] flex items-center justify-center p-3 sm:p-4 overflow-hidden flex-shrink-0">
              {/* Subtle Ambient Backlight Glow */}
              <div
                className="absolute inset-0 opacity-25 group-hover:opacity-50 transition-opacity duration-500 blur-2xl"
                style={{ backgroundColor: role.accentColor }}
              />

              {/* 3D Render Image */}
              <div className="relative z-10 h-full w-full flex items-center justify-center">
                <img
                  src={role.image}
                  alt={role.title}
                  className="max-h-[120px] sm:max-h-[140px] md:max-h-full max-w-full object-contain rounded-2xl group-hover:scale-105 transition-transform duration-500 shadow-2xl"
                />
              </div>

              {/* Top Badge Tag */}
              <div className="absolute top-3 left-3 sm:top-3.5 sm:left-3.5 z-20">
                <span
                  className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-1 sm:px-3 sm:py-1 rounded-full border backdrop-blur-md ${role.badgeColor}`}
                >
                  {role.badge}
                </span>
              </div>
            </div>

            {/* Bottom Content Body */}
            <div className="p-4 sm:p-5 lg:p-7 flex-1 flex flex-col justify-between gap-4 bg-[#161618]">
              <div className="flex flex-col gap-2 sm:gap-2.5">
                <div>
                  <span className="text-[11px] sm:text-xs font-bold text-[#86868b] uppercase tracking-wider block mb-1">
                    {role.kicker}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    {role.title}
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                  {role.description}
                </p>

                {/* Feature Bullet Checklist (Full visibility, NO truncation) */}
                <div className="flex flex-col gap-2 pt-2.5 border-t border-white/[0.06]">
                  {role.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#f5f5f7]">
                      <div className="h-4 w-4 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10 mt-0.5">
                        <Check className="h-2.5 w-2.5 text-[#30d158]" />
                      </div>
                      <span className="leading-snug font-medium text-left">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectRole(role.id);
                  }}
                  className={`w-full py-3 sm:py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-md active:scale-[0.98] cursor-pointer flex items-center justify-center min-h-[46px] ${role.buttonClass}`}
                >
                  <span>{role.buttonText}</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </main>

      {/* Optical bottom breathing padding */}
      <footer className="w-full text-center py-2 text-[11px] text-[#86868b]/60">
        Axiom Offline Pedagogical Engine • Fully Air-Gapped Local Learning
      </footer>
    </div>
  );
}
