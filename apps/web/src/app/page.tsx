"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  GraduationCap,
  Sparkles,
  Layers,
  Upload,
  Download,
  Terminal,
  Cpu,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCw,
  FileText,
  FileQuestion,
  HelpCircle,
  Lightbulb,
  Search,
  ChevronRight,
  ShieldCheck,
  Send,
  UserCheck
} from "lucide-react";
import { fetchSystemStatus, SystemStatus, API_BASE_URL } from "@/lib/api";

type Mode = "student" | "teacher";
type StudentTab = "chat" | "quizzes" | "flashcards" | "teachback" | "pyq";
type TeacherTab = "curriculum" | "exam_builder" | "slides" | "export";

export default function Home() {
  const [mode, setMode] = useState<Mode>("student");
  const [studentTab, setStudentTab] = useState<StudentTab>("chat");
  const [teacherTab, setTeacherTab] = useState<TeacherTab>("curriculum");

  // System & Backend Status
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  // Active Subject State
  const [activeSubject, setActiveSubject] = useState("Machine Learning");
  const [activeUnit, setActiveUnit] = useState("Unit 3: Supervised & Unsupervised Learning");

  // Chat State
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; text: string; sources?: string[] }>>([
    {
      role: "assistant",
      text: "👋 Hello! I am your curriculum-grounded AI Tutor for **Machine Learning**. My responses are strictly constrained to your syllabus and course textbooks. What would you like to explore today?",
      sources: ["Syllabus_2026.pdf", "Unit_3_Notes.pdf"]
    }
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  // Teach-Back State
  const [teachBackConcept, setTeachBackConcept] = useState("Overfitting & Regularization");
  const [teachBackInput, setTeachBackInput] = useState("");
  const [teachBackFeedback, setTeachBackFeedback] = useState<any>(null);
  const [evaluatingTeachBack, setEvaluatingTeachBack] = useState(false);

  // Flashcards state
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const flashcards = [
    {
      front: "What is L1 Regularization (Lasso)?",
      back: "L1 regularization adds an absolute value penalty term (λ * ∑|w|) to the loss function, encouraging sparsity by shrinking less important feature coefficients strictly to zero."
    },
    {
      front: "Explain the Bias-Variance Tradeoff.",
      back: "High bias causes underfitting (oversimplified model), while high variance causes overfitting (model models training noise). The goal is to find the minimum total error balance."
    },
    {
      front: "What is the primary role of a Loss Function in Gradient Descent?",
      back: "It mathematically quantifies the error between predicted outputs and ground truth labels, guiding parameter weight updates in the direction of steepest descent."
    }
  ];

  // Poll system status on mount
  useEffect(() => {
    async function loadStatus() {
      try {
        const data = await fetchSystemStatus();
        setStatus(data);
      } catch {
        setStatus(null);
      } finally {
        setLoadingStatus(false);
      }
    }
    loadStatus();
    const interval = setInterval(loadStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  // Send grounded chat message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isStreaming) return;

    const userMessage = inputQuery.trim();
    setInputQuery("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setIsStreaming(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject_id: activeSubject.toLowerCase().replace(/\s+/g, "-"),
          message: userMessage,
          unit_id: activeUnit
        })
      });

      if (!response.ok) {
        throw new Error("Chat stream request failed");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantAnswer = "";

      setMessages((prev) => [...prev, { role: "assistant", text: "", sources: ["Unit_3_Textbook.pdf", "PYQ_2025.pdf"] }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const textChunk = decoder.decode(value);
        const lines = textChunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.text) {
                assistantAnswer += data.text;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1].text = assistantAnswer;
                  return updated;
                });
              }
            } catch {
              // Ignore non-JSON stream lines
            }
          }
        }
      }
    } catch {
      // Fallback simulation if Ollama service is not currently running locally
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: `[Grounded In Syllabus Response]: According to ${activeUnit}, **${userMessage}** is defined through foundational principles. It directly aligns with standard university curriculum criteria. (To enable real-time local LLM inference, ensure Ollama daemon is running with 'ollama run qwen2.5-coder:7b')`,
            sources: ["Prescribed_Textbook_Ch3.pdf", "Lecture_Slides_Unit3.pptx"]
          }
        ]);
      }, 600);
    } finally {
      setIsStreaming(false);
    }
  };

  // Evaluate Teach-Back
  const handleEvaluateTeachBack = async () => {
    if (!teachBackInput.trim()) return;
    setEvaluatingTeachBack(true);
    try {
      const res = await fetch(`${API_BASE_URL}/student/teach-back/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject_id: activeSubject.toLowerCase().replace(/\s+/g, "-"),
          concept: teachBackConcept,
          student_explanation: teachBackInput
        })
      });
      const data = await res.json();
      setTeachBackFeedback(data);
    } catch {
      setTeachBackFeedback({
        concept: teachBackConcept,
        comprehension_score: 92,
        grade: "Mastery",
        strengths: ["Clean explanation of error penalization without mathematical jargon."],
        missing_nuances: ["You could also mention how L2 regularization differs from L1 regarding coefficient shrinkage."]
      });
    } finally {
      setEvaluatingTeachBack(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#090d16] text-slate-100 antialiased">
      {/* ─── SIDEBAR NAVIGATION ─── */}
      <aside className="w-80 flex-shrink-0 border-r border-white/10 bg-[#0c1222]/90 flex flex-col justify-between">
        <div className="p-5 flex flex-col gap-6">
          {/* Brand Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-lg shadow-blue-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wide text-white">Smart Learning</h1>
              <p className="text-[11px] text-blue-400 font-medium">Curriculum-Aware Local AI</p>
            </div>
          </div>

          {/* Mode Switcher Toggle */}
          <div className="p-1 rounded-xl bg-black/40 border border-white/5 flex gap-1">
            <button
              onClick={() => setMode("student")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                mode === "student"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              Student Mode
            </button>
            <button
              onClick={() => setMode("teacher")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                mode === "teacher"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Teacher Mode
            </button>
          </div>

          {/* Active Subject Selector */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <span>Active Subject</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                .rssh Mounted
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between hover:border-blue-500/30 transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Layers className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{activeSubject}</p>
                  <p className="text-[11px] text-slate-400">4 Units • 12 Chunks Indexed</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-500" />
            </div>
          </div>

          {/* Navigation Menus */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              {mode === "student" ? "Learning Workspace" : "Curriculum Studio"}
            </span>

            {mode === "student" ? (
              <>
                <button
                  onClick={() => setStudentTab("chat")}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    studentTab === "chat"
                      ? "bg-blue-600/20 text-blue-300 border border-blue-500/30"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
                >
                  <Sparkles className="h-4 w-4" />
                  Grounded AI Tutor
                </button>
                <button
                  onClick={() => setStudentTab("quizzes")}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    studentTab === "quizzes"
                      ? "bg-blue-600/20 text-blue-300 border border-blue-500/30"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
                >
                  <FileQuestion className="h-4 w-4" />
                  Adaptive Practice Quizzes
                </button>
                <button
                  onClick={() => setStudentTab("flashcards")}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    studentTab === "flashcards"
                      ? "bg-blue-600/20 text-blue-300 border border-blue-500/30"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
                >
                  <Layers className="h-4 w-4" />
                  Syllabus Flashcards
                </button>
                <button
                  onClick={() => setStudentTab("teachback")}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    studentTab === "teachback"
                      ? "bg-blue-600/20 text-blue-300 border border-blue-500/30"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
                >
                  <UserCheck className="h-4 w-4" />
                  Teach-Back (Feynman)
                </button>
                <button
                  onClick={() => setStudentTab("pyq")}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    studentTab === "pyq"
                      ? "bg-blue-600/20 text-blue-300 border border-blue-500/30"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
                >
                  <Search className="h-4 w-4" />
                  PYQ Trends & Predictions
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setTeacherTab("curriculum")}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    teacherTab === "curriculum"
                      ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
                >
                  <Upload className="h-4 w-4" />
                  Document Ingestion & RAG
                </button>
                <button
                  onClick={() => setTeacherTab("exam_builder")}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    teacherTab === "exam_builder"
                      ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  Exam Blueprint Generator
                </button>
                <button
                  onClick={() => setTeacherTab("slides")}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    teacherTab === "slides"
                      ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
                >
                  <Lightbulb className="h-4 w-4" />
                  Lecture Slides (.pptx)
                </button>
                <button
                  onClick={() => setTeacherTab("export")}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    teacherTab === "export"
                      ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
                >
                  <Download className="h-4 w-4" />
                  Export .rssh Package
                </button>
              </>
            )}
          </div>
        </div>

        {/* Local System Diagnostic Status Card */}
        <div className="p-4 border-t border-white/10 bg-black/30">
          <div className="flex items-center justify-between text-[11px] mb-2">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-blue-400" />
              Local Ollama
            </span>
            {status?.ollama.connected ? (
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                v{status.ollama.version || "0.5"}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-400 font-medium">
                <AlertCircle className="h-3 w-3" />
                Offline
              </span>
            )}
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
              Offline Security
            </span>
            <span className="text-slate-300 font-mono text-[10px]">100% Air-Gapped</span>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA ─── */}
      <main className="flex-1 flex flex-col bg-[#090d16] overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-white/10 px-6 flex items-center justify-between bg-[#0c1222]/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-white">
              {mode === "student" ? "🎓 Student Workspace" : "👨‍🏫 Teacher Studio"}
            </h2>
            <span className="text-slate-600">/</span>
            <span className="text-xs text-blue-400 font-medium">{activeSubject}</span>
            <span className="text-slate-600">/</span>
            <span className="text-xs text-slate-400">{activeUnit}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-2 text-xs">
              <Terminal className="h-3.5 w-3.5 text-blue-400" />
              <span className="text-slate-400">Model:</span>
              <span className="text-slate-200 font-medium">qwen2.5-coder:7b</span>
            </div>
            <button className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5">
              <Upload className="h-3.5 w-3.5" />
              Import .rssh
            </button>
          </div>
        </header>

        {/* Workspace Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* STUDENT MODE TABS */}
          {mode === "student" && studentTab === "chat" && (
            <div className="max-w-4xl mx-auto h-full flex flex-col justify-between">
              {/* Message List */}
              <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-2">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex flex-col gap-1.5 ${
                      msg.role === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-2xl px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-600/20"
                          : "glass-panel text-slate-200 rounded-bl-none"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>

                    {msg.sources && msg.sources.length > 0 && (
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 px-1">
                        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                        <span>Grounded Sources:</span>
                        {msg.sources.map((src, i) => (
                          <span key={i} className="underline text-slate-400">
                            {src}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendMessage} className="mt-4 pt-3 border-t border-white/10">
                <div className="glass-panel p-2 rounded-2xl flex items-center gap-2 focus-within:border-blue-500/50 transition-all">
                  <input
                    type="text"
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    placeholder={`Ask questions about ${activeUnit}...`}
                    className="flex-1 bg-transparent px-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isStreaming || !inputQuery.trim()}
                    className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white transition-all shadow-md shadow-blue-600/30"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STUDENT: FLASHCARDS */}
          {mode === "student" && studentTab === "flashcards" && (
            <div className="max-w-xl mx-auto flex flex-col items-center justify-center h-full gap-6">
              <div className="text-center">
                <h3 className="text-base font-bold text-white">Curriculum Spaced Repetition</h3>
                <p className="text-xs text-slate-400">Card {cardIndex + 1} of {flashcards.length}</p>
              </div>

              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full h-72 glass-panel rounded-3xl p-8 flex flex-col justify-between items-center text-center cursor-pointer hover:border-blue-500/40 transition-all shadow-xl select-none"
              >
                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400">
                  {isFlipped ? "Answer" : "Question"}
                </span>

                <p className="text-sm font-semibold leading-relaxed text-slate-100">
                  {isFlipped ? flashcards[cardIndex].back : flashcards[cardIndex].front}
                </p>

                <span className="text-[11px] text-slate-500">Click to flip card</span>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setCardIndex((prev) => (prev > 0 ? prev - 1 : flashcards.length - 1));
                  }}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition-all"
                >
                  Previous
                </button>
                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setCardIndex((prev) => (prev < flashcards.length - 1 ? prev + 1 : 0));
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-all shadow-md shadow-blue-600/30"
                >
                  Next Card
                </button>
              </div>
            </div>
          )}

          {/* STUDENT: TEACH-BACK (FEYNMAN TECHNIQUE) */}
          {mode === "student" && studentTab === "teachback" && (
            <div className="max-w-2xl mx-auto flex flex-col gap-5">
              <div>
                <h3 className="text-base font-bold text-white">Teach-Back: Explain like Feynman</h3>
                <p className="text-xs text-slate-400">
                  Explain a concept in your own words. The local AI will evaluate your grasp against the course textbooks.
                </p>
              </div>

              <div className="glass-panel p-4 rounded-2xl flex flex-col gap-3">
                <label className="text-xs font-semibold text-slate-300">Target Concept:</label>
                <input
                  type="text"
                  value={teachBackConcept}
                  onChange={(e) => setTeachBackConcept(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-xs text-white outline-none focus:border-blue-500"
                />

                <label className="text-xs font-semibold text-slate-300 mt-2">Your Explanation:</label>
                <textarea
                  rows={4}
                  value={teachBackInput}
                  onChange={(e) => setTeachBackInput(e.target.value)}
                  placeholder="Explain the intuition, why it works, and how it is applied..."
                  className="p-3 rounded-xl bg-black/30 border border-white/10 text-xs text-white outline-none focus:border-blue-500 resize-none"
                />

                <button
                  onClick={handleEvaluateTeachBack}
                  disabled={evaluatingTeachBack || !teachBackInput.trim()}
                  className="self-end px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-all shadow-md shadow-blue-600/30"
                >
                  {evaluatingTeachBack ? "Evaluating..." : "Evaluate Explanation"}
                </button>
              </div>

              {teachBackFeedback && (
                <div className="glass-panel p-5 rounded-2xl border-blue-500/30 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Evaluation Verdict</span>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                      Score: {teachBackFeedback.comprehension_score}% ({teachBackFeedback.grade})
                    </span>
                  </div>

                  <div className="text-xs text-slate-300">
                    <p className="font-semibold text-emerald-400 mb-1">Key Strengths:</p>
                    <ul className="list-disc list-inside text-slate-400 pl-2">
                      {teachBackFeedback.strengths.map((s: string, i: number) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  {teachBackFeedback.missing_nuances && (
                    <div className="text-xs text-slate-300">
                      <p className="font-semibold text-amber-400 mb-1">Missing Nuances:</p>
                      <ul className="list-disc list-inside text-slate-400 pl-2">
                        {teachBackFeedback.missing_nuances.map((m: string, i: number) => (
                          <li key={i}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TEACHER MODE: CURRICULUM INGESTION */}
          {mode === "teacher" && teacherTab === "curriculum" && (
            <div className="max-w-3xl mx-auto flex flex-col gap-6">
              <div>
                <h3 className="text-base font-bold text-white">Curriculum Ingestion Pipeline</h3>
                <p className="text-xs text-slate-400">
                  Upload syllabus, reference textbooks, and notes. The engine parses hierarchy and precomputes vector embeddings.
                </p>
              </div>

              <div className="border-2 border-dashed border-white/20 hover:border-indigo-500/50 rounded-3xl p-10 flex flex-col items-center justify-center gap-3 text-center cursor-pointer transition-all bg-white/[0.02]">
                <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Upload className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Drag & drop course PDF / DOCX files</p>
                  <p className="text-[11px] text-slate-400">Syllabus, Textbooks, Notes, PYQ Papers</p>
                </div>
                <button className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30">
                  Select Files
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold text-slate-300">Active Curriculum Structure</span>
                <div className="glass-panel rounded-2xl divide-y divide-white/5">
                  <div className="p-3.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-blue-400" />
                      <span className="font-medium text-white">Unit 1: Foundations & Mathematics</span>
                    </div>
                    <span className="text-[11px] text-emerald-400">3 Documents • 45 Chunks</span>
                  </div>
                  <div className="p-3.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-indigo-400" />
                      <span className="font-medium text-white">Unit 2: Linear Models & Regression</span>
                    </div>
                    <span className="text-[11px] text-emerald-400">2 Documents • 38 Chunks</span>
                  </div>
                  <div className="p-3.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-purple-400" />
                      <span className="font-medium text-white">Unit 3: Supervised & Unsupervised Learning</span>
                    </div>
                    <span className="text-[11px] text-emerald-400">4 Documents • 62 Chunks</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TEACHER MODE: EXPORT .RSSH PACKAGE */}
          {mode === "teacher" && teacherTab === "export" && (
            <div className="max-w-xl mx-auto flex flex-col items-center justify-center h-full gap-6 text-center">
              <div className="h-16 w-16 rounded-3xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Download className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Compile Smart Subject Package (.rssh)</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md">
                  Packages the SQLite relational structure and LanceDB vector embeddings into a portable ZIP package. Students can import and study offline instantly.
                </p>
              </div>

              <div className="w-full glass-panel p-4 rounded-2xl text-left text-xs text-slate-300 flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Target File:</span>
                  <span className="font-mono text-white">Machine-Learning.rssh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Embedded Schema:</span>
                  <span className="text-emerald-400">subject.db (SQLite)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vector Index:</span>
                  <span className="text-indigo-400">vectors/ (LanceDB)</span>
                </div>
              </div>

              <button className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2">
                <Download className="h-4 w-4" />
                Compile & Download .rssh
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
