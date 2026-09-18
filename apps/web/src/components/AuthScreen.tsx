"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldCheck,
  GraduationCap,
  BookOpen,
  Lock,
  Mail,
  User,
  Building2,
  Eye,
  EyeOff,
  CheckCircle2,
  ChevronLeft,
  Sparkles,
  KeyRound,
  IdCard
} from "lucide-react";

export interface AuthUser {
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
  idNumber?: string;
  department?: string;
}

interface AuthScreenProps {
  initialRole: "student" | "teacher" | "admin";
  onAuthSuccess: (user: AuthUser) => void;
  onBackToRoles: () => void;
  onExitHome: () => void;
}

export function AuthScreen({
  initialRole,
  onAuthSuccess,
  onBackToRoles
}: AuthScreenProps) {
  const [role, setRole] = useState<"student" | "teacher" | "admin">(initialRole);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [emailOrId, setEmailOrId] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic Theme Config based on Role
  const roleThemes = {
    student: {
      name: "Student Workspace",
      subtitle: "Curriculum AI Tutor & Verified Syllabus",
      icon: <GraduationCap className="h-4 w-4" />,
      badgeColor: "bg-[#0071e3]/15 text-[#0071e3] border-[#0071e3]/30",
      accentColor: "#0071e3",
      buttonClass: "bg-[#0071e3] hover:bg-[#0077ed] text-white",
      glowColor: "rgba(0, 113, 227, 0.15)",
      idPlaceholder: "Roll No / PRN (e.g. CS2026-084)",
      deptPlaceholder: "Program (e.g. B.Tech Computer Science)"
    },
    teacher: {
      name: "Teacher Studio",
      subtitle: "Pedagogy & Question Paper Generation",
      icon: <BookOpen className="h-4 w-4" />,
      badgeColor: "bg-[#ff9f0a]/15 text-[#ff9f0a] border-[#ff9f0a]/30",
      accentColor: "#ff9f0a",
      buttonClass: "bg-[#ff9f0a] hover:bg-[#ffb020] text-black",
      glowColor: "rgba(255, 159, 10, 0.15)",
      idPlaceholder: "Faculty ID (e.g. FAC-COMP-402)",
      deptPlaceholder: "Department (e.g. Computing Sciences)"
    },
    admin: {
      name: "Institution Admin ERP",
      subtitle: "Enterprise Attendance & Records",
      icon: <ShieldCheck className="h-4 w-4" />,
      badgeColor: "bg-[#30d158]/15 text-[#30d158] border-[#30d158]/30",
      accentColor: "#30d158",
      buttonClass: "bg-[#30d158] hover:bg-[#34e060] text-black",
      glowColor: "rgba(48, 209, 88, 0.15)",
      idPlaceholder: "Campus Code / Token",
      deptPlaceholder: "Institution Name"
    }
  };

  const currentTheme = roleThemes[role];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!emailOrId.trim()) {
      setErrorMsg("Please enter your institutional email or identification ID.");
      return;
    }

    if (!password.trim()) {
      setErrorMsg("Please enter your secure credentials.");
      return;
    }

    if (authMode === "signup") {
      if (!fullName.trim()) {
        setErrorMsg("Please provide your full legal name.");
        return;
      }
      if (password.length < 6) {
        setErrorMsg("Password must contain at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg("Passwords do not match. Please verify your entry.");
        return;
      }
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const user: AuthUser = {
        name: fullName.trim() || (role === "student" ? "Alex Vance" : role === "teacher" ? "Prof. Alan Mitchell" : "System Administrator"),
        email: emailOrId.trim(),
        role: role,
        idNumber: idNumber.trim() || undefined,
        department: department.trim() || undefined
      };

      if (rememberDevice) {
        try {
          localStorage.setItem("axiom_authenticated_user", JSON.stringify(user));
        } catch {
          // ignore
        }
      }

      onAuthSuccess(user);
    }, 500);
  };

  const handleQuickDemo = (demoRole: "student" | "teacher" | "admin") => {
    const demoUsers: Record<"student" | "teacher" | "admin", AuthUser> = {
      student: {
        name: "Alex Vance",
        email: "alex.vance@campus.edu",
        role: "student",
        idNumber: "CS2026-084",
        department: "Computer Science & Engineering"
      },
      teacher: {
        name: "Prof. Alan Mitchell",
        email: "alan.mitchell@faculty.edu",
        role: "teacher",
        idNumber: "FAC-COMP-402",
        department: "School of Computing Sciences"
      },
      admin: {
        name: "Dr. Eleanor Sterling",
        email: "admin@enterprise-erp.edu",
        role: "admin",
        idNumber: "INST-ADMIN-01",
        department: "Office of Academic Administration"
      }
    };

    onAuthSuccess(demoUsers[demoRole]);
  };

  const roleSwitchOptions = [
    {
      id: "student" as const,
      label: "Student",
      icon: <GraduationCap className="h-5 w-5" />,
      accent: "#0071e3"
    },
    {
      id: "teacher" as const,
      label: "Teacher",
      icon: <BookOpen className="h-5 w-5" />,
      accent: "#ff9f0a"
    },
    {
      id: "admin" as const,
      label: "Admin",
      icon: <ShieldCheck className="h-5 w-5" />,
      accent: "#30d158"
    }
  ];

  return (
    <div className="min-h-screen w-screen bg-black text-[#f5f5f7] flex flex-col justify-start items-center px-4 sm:px-8 lg:px-12 pl-20 sm:pl-24 xl:pl-8 pt-6 pb-12 select-none antialiased relative">
      {/* Dynamic Ambient Blur Glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full blur-[160px] pointer-events-none transition-all duration-700 opacity-60"
        style={{ backgroundColor: currentTheme.glowColor }}
      />

      {/* ─── TOP-LEFT BACK BUTTON (ON SAME TOP LINE AS LOGIN BOX) ─── */}
      <button
        type="button"
        onClick={onBackToRoles}
        className="fixed top-6 left-6 sm:left-8 z-50 flex items-center gap-2 px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-full bg-[#161618]/90 hover:bg-[#1c1c1e] text-xs sm:text-sm font-medium text-[#86868b] hover:text-white border border-white/10 backdrop-blur-xl transition-all cursor-pointer shadow-xl active:scale-95"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Back</span>
      </button>

      {/* ─── MAIN AUTH CARD CONTAINER (EXPANDED & ALIGNED AT TOP-6) ─── */}
      <main className="w-full max-w-[1240px] mx-auto relative z-10">
        <div className="w-full rounded-3xl bg-[#161618]/90 border border-white/10 backdrop-blur-2xl shadow-[0_24px_60px_rgba(0,0,0,0.85)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all duration-300">
          
          {/* ─── LEFT SHOWCASE PANEL ─── */}
          <div className="lg:col-span-5 bg-[#0e0e10] p-7 sm:p-8 lg:p-9 border-b lg:border-b-0 lg:border-r border-white/[0.08] flex flex-col justify-between gap-5 relative overflow-hidden transition-all duration-300">
            <div className="flex flex-col gap-4 sm:gap-5 relative z-10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-black border border-white/10 flex items-center justify-center shadow-inner">
                  <KeyRound className="h-5 w-5 text-white/80" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
                    Secure Workspace Gate
                  </h2>
                  <p className="text-xs text-[#86868b]">
                    Air-gapped curriculum authentication
                  </p>
                </div>
              </div>

              {/* 3D Visual Asset Showcase (Consistent size in signin & signup) */}
              <div className="w-full h-44 sm:h-52 lg:h-56 rounded-2xl bg-black/60 border border-white/[0.08] relative overflow-hidden flex items-center justify-center p-3.5 shadow-inner group">
                <img
                  src="/assets/3d/auth_security_3d.jpg"
                  alt="Axiom Security Shield"
                  className="max-h-full max-w-full object-contain rounded-xl drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* ─── VERTICAL WORKSPACE ROLE SELECTOR (NAMES ONLY, LARGER TEXT) ─── */}
              <div className="flex flex-col gap-2">
                <span className="text-xs uppercase font-bold tracking-wider text-[#86868b]">
                  Switch Workspace Role
                </span>
                <div className="flex flex-col gap-1.5 p-1.5 rounded-2xl bg-black border border-white/[0.08]">
                  {roleSwitchOptions.map((opt) => {
                    const isSelected = role === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setRole(opt.id);
                          setErrorMsg(null);
                        }}
                        className={`flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#1c1c1e] text-white shadow-sm border border-white/10"
                            : "text-[#86868b] hover:text-white hover:bg-white/[0.03]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${
                              isSelected ? "bg-white/10" : "bg-white/[0.04]"
                            }`}
                            style={{ color: isSelected ? opt.accent : "#86868b" }}
                          >
                            {opt.icon}
                          </div>
                          <span className="text-sm sm:text-base font-semibold tracking-tight">{opt.label}</span>
                        </div>
                        {isSelected && (
                          <div
                            className="h-2 w-2 rounded-full shadow-[0_0_8px_currentColor]"
                            style={{ backgroundColor: opt.accent, color: opt.accent }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Demo Access Bar */}
            <div className="pt-3.5 border-t border-white/[0.08] flex flex-col gap-1.5 relative z-10">
              <span className="text-xs text-[#86868b] block">
                Local Evaluation Environment
              </span>
              <button
                type="button"
                onClick={() => handleQuickDemo(role)}
                className="w-full py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs sm:text-sm font-semibold text-white border border-white/10 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
              >
                <Sparkles className="h-4 w-4 text-[#0071e3]" />
                <span>Instant Demo Access as {role === "student" ? "Student" : role === "teacher" ? "Faculty" : "Admin"}</span>
              </button>
            </div>
          </div>

          {/* ─── RIGHT FORM PANEL (Sign In & Sign Up Form - Spacious) ─── */}
          <div className="lg:col-span-7 p-7 sm:p-9 lg:p-11 flex flex-col justify-between gap-5 sm:gap-6 transition-all duration-300">
            <div>
              {/* Header Title and Tab Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-4 border-b border-white/[0.08]">
                <div className="min-h-[56px] flex flex-col justify-center">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={authMode + role}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                    >
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-tight">
                        {authMode === "signin" ? `Sign in to ${currentTheme.name}` : `Create ${currentTheme.name} Account`}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#86868b] mt-1">
                        {currentTheme.subtitle}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Sign In vs Sign Up Tabs with Smooth Animated Pill */}
                <div className="relative flex p-1 rounded-xl bg-black border border-white/10 flex-shrink-0 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("signin");
                      setErrorMsg(null);
                    }}
                    className={`relative z-10 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                      authMode === "signin"
                        ? "text-white font-bold"
                        : "text-[#86868b] hover:text-white"
                    }`}
                  >
                    {authMode === "signin" && (
                      <motion.div
                        layoutId="auth-mode-pill"
                        className="absolute inset-0 rounded-lg bg-[#1c1c1e] border border-white/10 shadow-sm z-[-1]"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("signup");
                      setErrorMsg(null);
                    }}
                    className={`relative z-10 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                      authMode === "signup"
                        ? "text-white font-bold"
                        : "text-[#86868b] hover:text-white"
                    }`}
                  >
                    {authMode === "signup" && (
                      <motion.div
                        layoutId="auth-mode-pill"
                        className="absolute inset-0 rounded-lg bg-[#1c1c1e] border border-white/10 shadow-sm z-[-1]"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                    Sign Up
                  </button>
                </div>
              </div>

              {/* Authentication Form with Smooth Transition */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5 mt-5">
                <AnimatePresence mode="wait" initial={false}>
                  {authMode === "signup" ? (
                    /* ─── SIGN UP COMPACT 2-COLUMN VIEW (SAME PROPORTIONS AS SIGN IN) ─── */
                    <motion.div
                      key="signup-fields"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className="flex flex-col gap-3 sm:gap-4"
                    >
                      {/* Row 1: Full Name & Email */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-[#86868b] uppercase tracking-wider">
                            Full Legal Name
                          </label>
                          <div className="relative flex items-center">
                            <User className="h-4 w-4 text-[#86868b] absolute left-3.5 pointer-events-none" />
                            <input
                              type="text"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              placeholder="Enter full name"
                              className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/60 border border-white/10 text-sm sm:text-base text-white placeholder-[#86868b] outline-none focus:border-[#0071e3] transition-all"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-[#86868b] uppercase tracking-wider">
                            {role === "student" ? "Student Email" : role === "teacher" ? "Faculty Email" : "Admin Email"}
                          </label>
                          <div className="relative flex items-center">
                            <Mail className="h-4 w-4 text-[#86868b] absolute left-3.5 pointer-events-none" />
                            <input
                              type="text"
                              value={emailOrId}
                              onChange={(e) => setEmailOrId(e.target.value)}
                              placeholder={role === "student" ? "student@campus.edu" : role === "teacher" ? "faculty@institution.edu" : "admin@system.edu"}
                              className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/60 border border-white/10 text-sm sm:text-base text-white placeholder-[#86868b] outline-none focus:border-[#0071e3] transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Row 2: Roll No / ID & Department */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-[#86868b] uppercase tracking-wider">
                            {role === "student" ? "Roll No / PRN" : role === "teacher" ? "Faculty ID" : "Campus Token"}
                          </label>
                          <div className="relative flex items-center">
                            <IdCard className="h-4 w-4 text-[#86868b] absolute left-3.5 pointer-events-none" />
                            <input
                              type="text"
                              value={idNumber}
                              onChange={(e) => setIdNumber(e.target.value)}
                              placeholder={currentTheme.idPlaceholder}
                              className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/60 border border-white/10 text-sm sm:text-base text-white placeholder-[#86868b] outline-none focus:border-[#0071e3] transition-all font-mono"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-[#86868b] uppercase tracking-wider">
                            {role === "student" ? "Program / Branch" : "Academic Department"}
                          </label>
                          <div className="relative flex items-center">
                            <Building2 className="h-4 w-4 text-[#86868b] absolute left-3.5 pointer-events-none" />
                            <input
                              type="text"
                              value={department}
                              onChange={(e) => setDepartment(e.target.value)}
                              placeholder={currentTheme.deptPlaceholder}
                              className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/60 border border-white/10 text-sm sm:text-base text-white placeholder-[#86868b] outline-none focus:border-[#0071e3] transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Row 3: Password & Confirm Password */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-[#86868b] uppercase tracking-wider">
                            Security Password
                          </label>
                          <div className="relative flex items-center">
                            <Lock className="h-4 w-4 text-[#86868b] absolute left-3.5 pointer-events-none" />
                            <input
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Create password"
                              className="w-full pl-10 pr-10 py-3 rounded-xl bg-black/60 border border-white/10 text-sm sm:text-base text-white placeholder-[#86868b] outline-none focus:border-[#0071e3] transition-all"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 text-[#86868b] hover:text-white transition-colors cursor-pointer"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-[#86868b] uppercase tracking-wider">
                            Confirm Password
                          </label>
                          <div className="relative flex items-center">
                            <Lock className="h-4 w-4 text-[#86868b] absolute left-3.5 pointer-events-none" />
                            <input
                              type={showPassword ? "text" : "password"}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Confirm password"
                              className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/60 border border-white/10 text-sm sm:text-base text-white placeholder-[#86868b] outline-none focus:border-[#0071e3] transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    /* ─── SIGN IN MODE (SPACIOUS & ELEGANT) ─── */
                    <motion.div
                      key="signin-fields"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className="flex flex-col gap-4"
                    >
                      {/* Email or Identifier */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs sm:text-sm font-semibold text-[#86868b] uppercase tracking-wider">
                          {role === "student" ? "Student Email or Roll Number" : role === "teacher" ? "Faculty Email or Employee ID" : "Administrator Email"}
                        </label>
                        <div className="relative flex items-center">
                          <Mail className="h-4.5 w-4.5 text-[#86868b] absolute left-3.5 pointer-events-none" />
                          <input
                            type="text"
                            value={emailOrId}
                            onChange={(e) => setEmailOrId(e.target.value)}
                            placeholder={role === "student" ? "student@campus.edu or Roll No" : role === "teacher" ? "faculty@institution.edu" : "admin@system.edu"}
                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/60 border border-white/10 text-sm sm:text-base text-white placeholder-[#86868b] outline-none focus:border-[#0071e3] transition-all"
                          />
                        </div>
                      </div>

                      {/* Password Input */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs sm:text-sm font-semibold text-[#86868b] uppercase tracking-wider">
                          Security Password
                        </label>
                        <div className="relative flex items-center">
                          <Lock className="h-4.5 w-4.5 text-[#86868b] absolute left-3.5 pointer-events-none" />
                          <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter security password"
                            className="w-full pl-11 pr-11 py-3 rounded-xl bg-black/60 border border-white/10 text-sm sm:text-base text-white placeholder-[#86868b] outline-none focus:border-[#0071e3] transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 text-[#86868b] hover:text-white transition-colors cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Remember Device Checkbox */}
                <div className="flex items-center gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="rememberDevice"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="h-4 w-4 rounded accent-[#0071e3] cursor-pointer"
                  />
                  <label htmlFor="rememberDevice" className="text-xs sm:text-sm text-[#86868b] cursor-pointer">
                    Remember credentials on this air-gapped machine
                  </label>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-[#ff453a]/10 border border-[#ff453a]/30 text-xs sm:text-sm text-[#ff453a] flex items-center gap-2">
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Action Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 mt-3 rounded-xl text-sm sm:text-base font-semibold tracking-wide transition-all shadow-lg active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 ${currentTheme.buttonClass} disabled:opacity-50`}
                >
                  {isSubmitting ? (
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={authMode + role}
                        initial={{ opacity: 0, y: 3 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -3 }}
                        transition={{ duration: 0.15 }}
                      >
                        {authMode === "signin"
                          ? `Sign In to ${role === "student" ? "Student" : role === "teacher" ? "Faculty" : "Administrator"} Portal`
                          : `Complete Registration`}
                      </motion.span>
                    </AnimatePresence>
                  )}
                </button>
              </form>
            </div>

            {/* Privacy & Air-Gap Compliance Note */}
            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs sm:text-sm text-[#86868b]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#30d158]" />
                <span>Zero telemetry. Relational data stored locally in subject.db.</span>
              </div>
              <span className="font-mono text-[11px]">Axiom v2.4</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
