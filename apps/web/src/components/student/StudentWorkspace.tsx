import React, { useState, useEffect } from "react";
import {
  Sparkles,
  FileQuestion,
  UserCheck,
  TrendingUp,
  Lightbulb,
  Send,
  Check,
  Copy,
  CheckCircle,
  CheckCircle2,
  CalendarCheck,
  Clock,
  Calendar,
  BookOpen,
  RotateCcw,
  Award,
  AlertCircle,
  Target
} from "lucide-react";
import {
  CloudAiConfig,
  generateStudyPlan,
  gradeQuizAttempt,
  QuizGradeResult,
  UnitDistributionItem
} from "@/lib/api";

export type StudentTab = "chat" | "quizzes" | "teachback" | "pyq" | "study_plan";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  sources?: string[];
  confidence?: number;
}

interface StudentWorkspaceProps {
  activeTab: StudentTab;
  activeUnit: string;
  subjectId?: string;
  selectedModel: string;
  messages: ChatMessage[];
  inputQuery: string;
  setInputQuery: (q: string) => void;
  isStreaming: boolean;
  onSendMessage: (queryText?: string) => void;
  copiedIndex: number | null;
  onCopy: (text: string, index: number) => void;
  samplePrompts: string[];

  // Quiz Props
  quizDifficulty?: "easy" | "medium" | "hard";
  setQuizDifficulty?: (diff: "easy" | "medium" | "hard") => void;
  quizQuestions: any[];
  selectedAnswers: Record<number, number>;
  onSelectAnswer: (qId: number, optionIdx: number) => void;
  onGenerateQuiz?: () => void;
  generatingQuiz?: boolean;
  onGradeQuizAttempt?: (res: QuizGradeResult) => void;

  // Teach-back Props
  teachBackConcept: string;
  setTeachBackConcept: (c: string) => void;
  teachBackInput: string;
  setTeachBackInput: (i: string) => void;
  teachBackFeedback: any;
  evaluatingTeachBack: boolean;
  onEvaluateTeachBack: () => void;

  // PYQ Props
  pyqTopics: any[];
  unitDistribution?: UnitDistributionItem[];

  // Cloud AI settings
  cloudConfig: CloudAiConfig;
  onOpenAIModelModal: () => void;
}

function FormattedMarkdownMessage({ content }: { content: string }) {
  const lines = content.split("\n");
  const renderedElements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockBuffer: string[] = [];

  lines.forEach((line, lineIdx) => {
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        renderedElements.push(
          <pre
            key={`code-${lineIdx}`}
            className="my-3 p-4 rounded-2xl bg-black/80 border border-white/10 text-xs font-mono text-[#30d158] overflow-x-auto"
          >
            <code>{codeBlockBuffer.join("\n")}</code>
          </pre>
        );
        codeBlockBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBlockBuffer.push(line);
      return;
    }

    if (line.startsWith("### ")) {
      renderedElements.push(
        <h3 key={lineIdx} className="text-base font-bold text-white mt-4 mb-2 first:mt-0 tracking-tight">
          {formatInline(line.replace("### ", ""))}
        </h3>
      );
      return;
    }
    if (line.startsWith("## ")) {
      renderedElements.push(
        <h2 key={lineIdx} className="text-lg font-bold text-white mt-5 mb-2 first:mt-0 tracking-tight">
          {formatInline(line.replace("## ", ""))}
        </h2>
      );
      return;
    }
    if (line.startsWith("# ")) {
      renderedElements.push(
        <h1 key={lineIdx} className="text-xl font-bold text-white mt-6 mb-2 first:mt-0 tracking-tight">
          {formatInline(line.replace("# ", ""))}
        </h1>
      );
      return;
    }

    const numberedMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (numberedMatch) {
      renderedElements.push(
        <div key={lineIdx} className="flex gap-2.5 my-1.5 ml-1 text-sm text-[#d1d1d6] leading-relaxed">
          <span className="font-semibold text-[#0071e3] min-w-[20px]">{numberedMatch[1]}.</span>
          <div className="flex-1">{formatInline(numberedMatch[2])}</div>
        </div>
      );
      return;
    }

    const bulletMatch = line.match(/^[\*\-]\s+(.*)/);
    if (bulletMatch) {
      renderedElements.push(
        <div key={lineIdx} className="flex gap-2.5 my-1.5 ml-2 text-sm text-[#d1d1d6] leading-relaxed">
          <span className="text-[#0071e3] font-bold">•</span>
          <div className="flex-1">{formatInline(bulletMatch[1])}</div>
        </div>
      );
      return;
    }

    if (!line.trim()) {
      renderedElements.push(<div key={lineIdx} className="h-2" />);
      return;
    }

    renderedElements.push(
      <p key={lineIdx} className="text-sm text-[#f5f5f7] leading-relaxed my-1 font-normal">
        {formatInline(line)}
      </p>
    );
  });

  return <div className="space-y-1">{renderedElements}</div>;
}

function formatInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*.*?\*\*|`.*?`|\*.*?\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let idx = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong key={idx++} className="font-semibold text-white">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code key={idx++} className="px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-[#0071e3] font-mono text-xs">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      parts.push(
        <em key={idx++} className="italic text-[#e5e5ea]">
          {token.slice(1, -1)}
        </em>
      );
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  return parts.length > 0 ? parts : text;
}

export function StudentWorkspace({
  activeTab,
  activeUnit,
  subjectId,
  selectedModel,
  messages,
  inputQuery,
  setInputQuery,
  isStreaming,
  onSendMessage,
  copiedIndex,
  onCopy,
  samplePrompts,
  quizDifficulty = "medium",
  setQuizDifficulty,
  quizQuestions,
  selectedAnswers,
  onSelectAnswer,
  onGenerateQuiz,
  generatingQuiz,
  onGradeQuizAttempt,
  teachBackConcept,
  setTeachBackConcept,
  teachBackInput,
  setTeachBackInput,
  teachBackFeedback,
  evaluatingTeachBack,
  onEvaluateTeachBack,
  pyqTopics,
  unitDistribution,
  cloudConfig,
  onOpenAIModelModal
}: StudentWorkspaceProps) {
  // ─── QUIZ GRADING & DIAGNOSTIC STATE ───
  const [localGradeResult, setLocalGradeResult] = useState<QuizGradeResult | null>(null);
  const [gradingAttempt, setGradingAttempt] = useState(false);

  // Reset grade report when a new quiz is synthesized
  useEffect(() => {
    setLocalGradeResult(null);
  }, [quizQuestions]);

  const handleGradeQuiz = async () => {
    if (quizQuestions.length === 0) return;
    setGradingAttempt(true);
    try {
      const res = await gradeQuizAttempt({
        subject_id: subjectId || "general",
        quiz_id: quizQuestions[0]?.id ? String(quizQuestions[0].id).split("_q")[0] : undefined,
        questions: quizQuestions,
        submitted_answers: selectedAnswers
      });
      setLocalGradeResult(res);
      if (onGradeQuizAttempt) {
        onGradeQuizAttempt(res);
      }
    } catch {
      // Diagnostic local fallback
      const total = quizQuestions.length;
      let correct = 0;
      const feedback = quizQuestions.map((q) => {
        const userSel = selectedAnswers[q.id];
        const isCorr = userSel === q.correct;
        if (isCorr) correct++;
        return {
          question_id: String(q.id),
          question: q.question,
          user_answer: userSel !== undefined ? (q.options?.[userSel] || String(userSel)) : "Unanswered",
          correct_answer: q.options?.[q.correct] || "Correct Solution",
          is_correct: isCorr,
          explanation: q.explanation || "",
          page_reference: q.page_reference
        };
      });
      const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
      const fallbackResult: QuizGradeResult = {
        total_questions: total,
        correct_answers: correct,
        score_percentage: pct,
        grade: pct >= 85 ? "Mastery" : pct >= 70 ? "Proficient" : "Needs Revision",
        feedback
      };
      setLocalGradeResult(fallbackResult);
      if (onGradeQuizAttempt) {
        onGradeQuizAttempt(fallbackResult);
      }
    } finally {
      setGradingAttempt(false);
    }
  };

  const handleRetakeQuiz = () => {
    setLocalGradeResult(null);
  };

  // ─── ADAPTIVE STUDY PLAN STATE (PERSISTENT) ───
  const [daysRemaining, setDaysRemaining] = useState(14);
  const [dailyHours, setDailyHours] = useState(2.0);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [completedDays, setCompletedDays] = useState<Record<number, boolean>>(() => {
    try {
      const storageKey = `axiom_study_completed_${subjectId || "sub"}`;
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [studyPlanSchedule, setStudyPlanSchedule] = useState<Array<{ day: number; focus: string; practice: string }>>([
    { day: 1, focus: `${activeUnit}: Core Foundations & Mathematical Proofs`, practice: "5 Short Practice Questions" },
    { day: 2, focus: `${activeUnit}: Parameter Convergence & Optimality`, practice: "1 Derivation Problem" },
    { day: 3, focus: "Regularization Techniques & Sparsity Constraints", practice: "Feynman Teach-Back Drill" },
    { day: 4, focus: "Cross-Validation & Hyperparameter Tuning", practice: "Adaptive Quiz Assessment" },
    { day: 5, focus: "Bias-Variance Decomposition & Generalization Limits", practice: "PYQ 2024 Exam Review" },
    { day: 6, focus: "Ensemble Methods & Algorithmic Complexity", practice: "Self-Assessment Practice & Problem Solving" },
    { day: 7, focus: "Mid-Term Diagnostic Mock Examination", practice: "Full 50-Mark Assessment" },
    { day: 8, focus: "High-Yield Derivations & Model Robustness", practice: "Speed Derivation Session" },
    { day: 9, focus: "Unsupervised Clustering & Convergence Theorems", practice: "Quiz Assessment 2" },
    { day: 10, focus: "Five-Year PYQ High-Frequency Recurring Themes", practice: "Section C Exam Focus" },
    { day: 11, focus: "Formula Consolidation & Theorem Sheets", practice: "Analytical Proofs Review" },
    { day: 12, focus: "Full University Mock Examination", practice: "Timed 3-Hour Simulation" },
    { day: 13, focus: "Targeted Weak Area Remediation", practice: "Diagnostic Teach-Back" },
    { day: 14, focus: "Final Syllabus Summary & High-Yield Blueprint", practice: "Final Confidence Review" },
  ]);

  const handleFetchStudyPlan = async () => {
    setGeneratingPlan(true);
    try {
      const res = await generateStudyPlan({
        days_remaining: daysRemaining,
        daily_hours: dailyHours
      });
      if (res && res.schedule && res.schedule.length > 0) {
        setStudyPlanSchedule(res.schedule);
      }
    } catch {
      // Offline fallback
      const newSched: Array<{ day: number; focus: string; practice: string }> = [];
      for (let d = 1; d <= daysRemaining; d++) {
        if (d === 1) {
          newSched.push({ day: d, focus: `${activeUnit}: Core Foundations & Proofs`, practice: "5 Short Practice Questions" });
        } else if (d === daysRemaining) {
          newSched.push({ day: d, focus: "Final Comprehensive Revision & High-Yield Blueprint", practice: "Final Confidence Drill" });
        } else if (d % 7 === 0) {
          newSched.push({ day: d, focus: `Comprehensive Milestone Diagnostic Test (Day ${d})`, practice: "Timed Mock Examination" });
        } else if (d % 3 === 0) {
          newSched.push({ day: d, focus: "PYQ Examination Questions & High-Probability Solutions", practice: "Speed Answering Drill" });
        } else if (d % 2 === 0) {
          newSched.push({ day: d, focus: "Algorithmic Formulations & Problem Solving", practice: "Adaptive Quiz Assessment" });
        } else {
          newSched.push({ day: d, focus: "Theoretical Rigor & Concept Clarification", practice: "Feynman Teach-Back Drill" });
        }
      }
      setStudyPlanSchedule(newSched);
    } finally {
      setGeneratingPlan(false);
    }
  };

  const toggleDayCompletion = (dayNum: number) => {
    setCompletedDays((prev) => {
      const next = {
        ...prev,
        [dayNum]: !prev[dayNum]
      };
      try {
        const storageKey = `axiom_study_completed_${subjectId || "sub"}`;
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* ─── TAB 1: AI TUTOR CHAT (EXTREME LEFT AND RIGHT) ─── */}
      {activeTab === "chat" && (
        <div className="w-full h-full flex flex-col justify-between gap-6 px-1 sm:px-2">
          <div className="flex-1 overflow-y-auto flex flex-col gap-6 pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`w-full flex ${msg.role === "assistant" ? "justify-start" : "justify-end"}`}
              >
                {msg.role === "assistant" ? (
                  <div className="flex gap-3.5 items-start max-w-4xl sm:max-w-5xl w-full">
                    <div className="h-9 w-9 rounded-2xl bg-[#0071e3]/10 text-[#0071e3] border border-[#0071e3]/20 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                      <Sparkles className="h-4 w-4" />
                    </div>

                    <div className="flex-1 rounded-3xl rounded-tl-md p-6 bg-[#161618] border border-white/10 text-white shadow-xl">
                      <FormattedMarkdownMessage content={msg.text} />

                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-4 pt-3.5 border-t border-white/[0.08] flex items-center justify-between text-xs text-[#86868b]">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-[#86868b]">Grounded in:</span>
                            {msg.sources.map((src, sIdx) => (
                              <span
                                key={sIdx}
                                className="px-2 py-0.5 rounded-lg bg-black/60 border border-white/10 font-mono text-[11px] text-[#0071e3]"
                              >
                                {src}
                              </span>
                            ))}
                          </div>
                          <button
                            onClick={() => onCopy(msg.text, idx)}
                            className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-white/5"
                          >
                            {copiedIndex === idx ? (
                              <Check className="h-3.5 w-3.5 text-[#30d158]" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                            <span className="text-xs">{copiedIndex === idx ? "Copied" : "Copy"}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3 items-start justify-end max-w-2xl">
                    <div className="rounded-3xl rounded-tr-md px-5 py-3.5 bg-[#0071e3] text-white text-sm leading-relaxed shadow-lg font-medium">
                      {msg.text}
                    </div>
                    <div className="h-9 w-9 rounded-2xl bg-[#2c2c2e] text-white flex items-center justify-center flex-shrink-0 text-xs font-semibold mt-0.5 shadow-sm">
                      You
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isStreaming && (
              <div className="w-full flex justify-start">
                <div className="flex gap-3.5 items-start max-w-xl">
                  <div className="h-9 w-9 rounded-2xl bg-[#0071e3]/10 text-[#0071e3] border border-[#0071e3]/20 flex items-center justify-center flex-shrink-0 animate-pulse">
                    <Sparkles className="h-4 w-4 animate-spin" />
                  </div>
                  <div className="p-4 rounded-2xl bg-[#161618] border border-white/10 text-xs text-[#86868b] flex items-center gap-2.5 shadow-md">
                    <div className="h-2 w-2 rounded-full bg-[#0071e3] animate-ping" />
                    Synthesizing curriculum-grounded explanation...
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 w-full">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSendMessage();
              }}
              className="p-3 rounded-2xl bg-[#161618] border border-white/10 flex items-center gap-3 focus-within:border-[#0071e3] transition-all shadow-xl"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder={`Ask questions regarding ${activeUnit}...`}
                className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder-[#86868b] outline-none"
              />
              <button
                type="submit"
                disabled={isStreaming || !inputQuery.trim()}
                className="p-2.5 rounded-xl btn-apple-primary disabled:opacity-40 text-white transition-all cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─── TAB 2: ADAPTIVE PRACTICE QUIZZES ─── */}
      {activeTab === "quizzes" && (
        <div className="max-w-3xl mx-auto flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#161618] border border-white/10 shadow-xl">
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2.5">
                <FileQuestion className="h-5 w-5 text-[#30d158]" />
                Adaptive Practice Quizzes
              </h3>
              <p className="text-sm text-[#86868b] mt-1">
                Questions synthesized from active course package (.rssh) with verified rationale.
              </p>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap">
              {/* Difficulty Selector Pills */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-black/60 border border-white/10">
                {(["easy", "medium", "hard"] as const).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setQuizDifficulty?.(diff)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer ${
                      quizDifficulty === diff
                        ? "bg-[#0071e3] text-white font-semibold shadow-sm"
                        : "text-[#86868b] hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>

              {onGenerateQuiz && (
                <button
                  type="button"
                  onClick={onGenerateQuiz}
                  disabled={generatingQuiz}
                  className="px-4 py-2 rounded-xl btn-apple-primary text-xs font-medium flex items-center gap-2 cursor-pointer disabled:opacity-40"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {generatingQuiz ? "Generating..." : "Generate New Quiz"}
                </button>
              )}
            </div>
          </div>

          {/* DIAGNOSTIC GRADE REPORT BANNER (WHEN GRADED) */}
          {localGradeResult && (
            <div className="p-8 rounded-3xl bg-[#161618] border border-white/15 shadow-2xl flex flex-col gap-6 animate-in zoom-in-95 duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                <div className="flex items-center gap-4">
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center border shadow-lg ${
                    localGradeResult.grade === "Mastery"
                      ? "bg-[#30d158]/15 border-[#30d158]/30 text-[#30d158]"
                      : localGradeResult.grade === "Proficient"
                      ? "bg-[#0071e3]/15 border-[#0071e3]/30 text-[#0071e3]"
                      : "bg-[#ff9f0a]/15 border-[#ff9f0a]/30 text-[#ff9f0a]"
                  }`}>
                    <Award className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h4 className="text-xl font-bold text-white tracking-tight">
                        Diagnostic Evaluation Complete
                      </h4>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        localGradeResult.grade === "Mastery"
                          ? "bg-[#30d158]/20 text-[#30d158]"
                          : localGradeResult.grade === "Proficient"
                          ? "bg-[#0071e3]/20 text-[#0071e3]"
                          : "bg-[#ff9f0a]/20 text-[#ff9f0a]"
                      }`}>
                        {localGradeResult.grade}
                      </span>
                    </div>
                    <p className="text-xs text-[#86868b] mt-1">
                      Recorded in local learning history • {localGradeResult.correct_answers} of {localGradeResult.total_questions} Questions Solved Correctly
                    </p>
                  </div>
                </div>

                <div className="flex items-baseline gap-2 self-start sm:self-auto">
                  <span className="text-4xl font-extrabold text-white font-mono">
                    {localGradeResult.score_percentage}%
                  </span>
                  <span className="text-xs text-[#86868b] uppercase font-semibold">Score</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 justify-end">
                <button
                  type="button"
                  onClick={handleRetakeQuiz}
                  className="px-4 py-2 rounded-xl btn-apple-secondary text-xs font-medium flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Review &amp; Retake</span>
                </button>
                {onGenerateQuiz && (
                  <button
                    type="button"
                    onClick={onGenerateQuiz}
                    disabled={generatingQuiz}
                    className="px-4 py-2 rounded-xl btn-apple-primary text-xs font-medium flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Synthesize Fresh Quiz</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {quizQuestions.length === 0 ? (
            <div className="p-12 rounded-3xl bg-[#161618] border border-white/10 flex flex-col items-center justify-center text-center gap-4">
              <FileQuestion className="h-10 w-10 text-[#86868b]" />
              <div>
                <h4 className="text-base font-bold text-white">No Active Quiz for this Unit</h4>
                <p className="text-xs text-[#86868b] mt-1 max-w-md">
                  Click below to synthesize a fresh adaptive MCQ quiz grounded in {activeUnit}.
                </p>
              </div>
              {onGenerateQuiz && (
                <button
                  type="button"
                  onClick={onGenerateQuiz}
                  disabled={generatingQuiz}
                  className="px-5 py-2.5 rounded-xl btn-apple-primary text-xs font-medium cursor-pointer"
                >
                  {generatingQuiz ? "Synthesizing Quiz..." : "Synthesize Quiz from Curriculum"}
                </button>
              )}
            </div>
          ) : (
            <>
              {quizQuestions.map((q, idx) => {
                const isAnswered = selectedAnswers[q.id] !== undefined;
                const isCorrect = selectedAnswers[q.id] === q.correct;

                return (
                  <div
                    key={q.id || idx}
                    className="p-8 rounded-3xl bg-[#161618] border border-white/10 flex flex-col gap-5 shadow-lg"
                  >
                    <div className="flex items-center justify-between text-xs text-[#86868b]">
                      <div className="flex items-center gap-2">
                        <span>Question {idx + 1} of {quizQuestions.length} • {q.unit || activeUnit}</span>
                        {q.taxonomy && (
                          <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[#0071e3] font-medium text-[11px]">
                            {q.taxonomy}
                          </span>
                        )}
                        {q.difficulty && (
                          <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[#86868b] capitalize text-[11px]">
                            {q.difficulty}
                          </span>
                        )}
                      </div>
                      <span className="text-[#30d158] font-mono text-[11px]">Curriculum Grounded</span>
                    </div>

                    <h4 className="text-base font-medium text-white leading-relaxed">
                      {q.question}
                    </h4>

                    <div className="flex flex-col gap-2.5">
                      {q.options?.map((opt: string, optIdx: number) => {
                        const isThisSelected = selectedAnswers[q.id] === optIdx;
                        let style = "bg-[#1c1c1e] border-white/10 text-[#a1a1a6] hover:text-white";

                        if (isAnswered) {
                          if (optIdx === q.correct) {
                            style = "bg-[#1c1c1e] border-[#30d158] text-[#30d158] font-medium";
                          } else if (isThisSelected && !isCorrect) {
                            style = "bg-[#1c1c1e] border-[#ff453a] text-[#ff453a] font-medium";
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={isAnswered && localGradeResult !== null}
                            onClick={() => onSelectAnswer(q.id, optIdx)}
                            className={`w-full text-left p-4 rounded-2xl border text-sm flex items-center justify-between transition-all cursor-pointer ${style}`}
                          >
                            <span>{opt}</span>
                            {isAnswered && optIdx === q.correct && (
                              <CheckCircle className="h-5 w-5 text-[#30d158]" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <div className="p-5 rounded-2xl bg-black/70 border border-white/10 text-sm flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className={isCorrect ? "text-[#30d158] font-semibold text-xs uppercase tracking-wider" : "text-[#ff453a] font-semibold text-xs uppercase tracking-wider"}>
                            {isCorrect ? "Correct Solution" : "Explanation & Rationale"}
                          </span>
                          {(q.source || q.page_reference) && (
                            <span className="text-xs text-[#0071e3] font-mono">
                              {q.source || `Page ${q.page_reference}`}
                            </span>
                          )}
                        </div>
                        <p className="text-[#a1a1a6] leading-relaxed text-sm">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* SUBMIT FOR EVALUATION BUTTON */}
              {!localGradeResult && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleGradeQuiz}
                    disabled={Object.keys(selectedAnswers).length === 0 || gradingAttempt}
                    className="w-full py-4 rounded-2xl btn-apple-primary text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 shadow-xl"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>
                      {gradingAttempt
                        ? "Grading Attempt & Recording..."
                        : `Submit Quiz for Diagnostic Evaluation (${Object.keys(selectedAnswers).length}/${quizQuestions.length} Answered)`}
                    </span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}



      {/* ─── TAB 4: FEYNMAN TEACH-BACK ─── */}
      {activeTab === "teachback" && (
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          <div>
            <h3 className="text-base font-semibold text-white">
              Feynman Teach-Back Evaluation
            </h3>
            <p className="text-sm text-[#86868b] mt-1">
              Explain a concept in your own words. The AI evaluates your intuition against course textbooks and .rssh course packages.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#161618] border border-white/10 flex flex-col gap-5">
            <div>
              <label className="text-sm font-semibold text-white mb-2 block">
                Concept to Explain:
              </label>
              <input
                type="text"
                value={teachBackConcept}
                onChange={(e) => setTeachBackConcept(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-black border border-white/10 text-sm text-white outline-none focus:border-[#0071e3]"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-white mb-2 block">
                Your Explanation:
              </label>
              <textarea
                rows={5}
                value={teachBackInput}
                onChange={(e) => setTeachBackInput(e.target.value)}
                placeholder="Explain the intuition, why it works, and how it is applied..."
                className="w-full p-4 rounded-2xl bg-black border border-white/10 text-sm text-white outline-none focus:border-[#0071e3] resize-none"
              />
            </div>

            <button
              onClick={onEvaluateTeachBack}
              disabled={evaluatingTeachBack || !teachBackInput.trim()}
              className="self-end px-8 py-3 rounded-full btn-apple-primary disabled:opacity-40 text-sm font-medium cursor-pointer"
            >
              {evaluatingTeachBack ? "Evaluating..." : "Evaluate Explanation"}
            </button>
          </div>

          {teachBackFeedback && (
            <div className="p-8 rounded-3xl bg-[#161618] border border-white/10 text-sm flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <span className="font-semibold text-white text-base">Comprehension Diagnostic</span>
                <span className="text-[#30d158] font-bold text-base">
                  Score: {teachBackFeedback.comprehension_score}% ({teachBackFeedback.grade})
                </span>
              </div>
              <div className="space-y-1.5">
                <span className="font-semibold text-[#30d158] block">Key Strengths:</span>
                <ul className="list-disc list-inside text-[#a1a1a6] pl-2 space-y-1">
                  {teachBackFeedback.strengths.map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
              {teachBackFeedback.missing_nuances && (
                <div className="space-y-1.5">
                  <span className="font-semibold text-[#ff9f0a] block">Missing Nuances:</span>
                  <ul className="list-disc list-inside text-[#a1a1a6] pl-2 space-y-1">
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

      {/* ─── TAB 5: PYQ TRENDS ─── */}
      {activeTab === "pyq" && (
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          <div>
            <h3 className="text-base font-semibold text-white">
              Previous Year Exam Questions (PYQ) Trend Analysis
            </h3>
            <p className="text-sm text-[#86868b] mt-1">
              Question frequency across 5 years of university semester examination papers.
            </p>
          </div>

          {/* Unit-Wise Historical Marks Weightage */}
          {unitDistribution && unitDistribution.length > 0 && (
            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">
                Unit-Wise Historical Examination Weightage
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {unitDistribution.map((unit, i) => (
                  <div
                    key={unit.unit_id || i}
                    className="p-5 rounded-2xl bg-[#161618] border border-white/10 flex flex-col justify-between gap-3 shadow-md hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#0071e3]">
                        Unit {unit.unit_number}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        unit.yield_level === "Critical"
                          ? "bg-[#ff453a]/15 text-[#ff453a] border border-[#ff453a]/30"
                          : unit.yield_level === "High"
                          ? "bg-[#ff9f0a]/15 text-[#ff9f0a] border border-[#ff9f0a]/30"
                          : "bg-white/5 text-[#86868b] border border-white/10"
                      }`}>
                        {unit.yield_level || "Core"}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-white leading-tight">
                        {unit.title}
                      </h4>
                      {unit.questions_count !== undefined && (
                        <p className="text-[11px] text-[#86868b] mt-1 font-mono">
                          {unit.questions_count} Questions Analyzed
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
                      <div className="flex items-baseline justify-between text-xs">
                        <span className="text-[#86868b]">Marks Weight</span>
                        <span className="text-white font-mono font-bold text-sm">
                          {unit.historical_marks_weightage_pct}%
                        </span>
                      </div>
                      <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#0071e3] to-[#30d158] h-full rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, unit.historical_marks_weightage_pct * 2)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">
              High-Yield Predictive Question Bank
            </span>
            <div className="rounded-3xl border border-white/10 bg-[#161618] overflow-hidden shadow-xl">
              <table className="w-full text-left text-sm">
                <thead className="bg-black border-b border-white/10 text-[#86868b] uppercase text-xs tracking-wider">
                  <tr>
                    <th className="p-4">Predicted Examination Topic</th>
                    <th className="p-4">Recurrence Frequency</th>
                    <th className="p-4">Weightage</th>
                    <th className="p-4">Exam Probability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] text-[#a1a1a6]">
                  {pyqTopics.map((topic, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 font-medium text-white">{topic.topic}</td>
                      <td className="p-4 font-mono text-[#0071e3]">{topic.frequency}</td>
                      <td className="p-4">{topic.weight}</td>
                      <td className="p-4 font-mono text-[#30d158] font-semibold">{topic.probability}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 6: ADAPTIVE STUDY PLANNER ─── */}
      {activeTab === "study_plan" && (
        <div className="max-w-4xl mx-auto flex flex-col gap-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <CalendarCheck className="h-5 w-5 text-[#38bdf8]" />
                Adaptive Revision Timetable &amp; Syllabus Study Planner
              </h3>
              <p className="text-sm text-[#86868b] mt-1">
                Dynamic milestone roadmap tailored to your examination date and daily preparation hours.
              </p>
            </div>
          </div>

          {/* Configuration Controls */}
          <div className="p-6 rounded-3xl bg-[#161618] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-xl">
            <div className="flex flex-wrap items-center gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#86868b] uppercase tracking-wider">
                  Days Remaining
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={3}
                    max={90}
                    value={daysRemaining}
                    onChange={(e) => setDaysRemaining(Math.max(3, parseInt(e.target.value) || 14))}
                    className="w-24 px-3.5 py-2 rounded-xl bg-black border border-white/10 text-white font-mono text-sm outline-none focus:border-[#0071e3]"
                  />
                  <span className="text-xs text-[#86868b]">Days to Exam</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#86868b] uppercase tracking-wider">
                  Daily Study Hours
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step={0.5}
                    min={0.5}
                    max={12}
                    value={dailyHours}
                    onChange={(e) => setDailyHours(Math.max(0.5, parseFloat(e.target.value) || 2.0))}
                    className="w-24 px-3.5 py-2 rounded-xl bg-black border border-white/10 text-white font-mono text-sm outline-none focus:border-[#0071e3]"
                  />
                  <span className="text-xs text-[#86868b]">Hours / Day</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFetchStudyPlan}
              disabled={generatingPlan}
              className="px-6 py-2.5 rounded-2xl btn-apple-primary text-xs font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-40 self-end md:self-auto"
            >
              <RotateCcw className={`h-3.5 w-3.5 ${generatingPlan ? "animate-spin" : ""}`} />
              <span>{generatingPlan ? "Synthesizing Schedule..." : "Recalculate Timetable"}</span>
            </button>
          </div>

          {/* Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-[#1c1c1e] border border-white/[0.08] flex flex-col gap-1">
              <span className="text-[11px] text-[#86868b] uppercase tracking-wider font-semibold">Total Days</span>
              <span className="text-xl font-bold text-white font-mono">{daysRemaining} Days</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#1c1c1e] border border-white/[0.08] flex flex-col gap-1">
              <span className="text-[11px] text-[#86868b] uppercase tracking-wider font-semibold">Daily Commitment</span>
              <span className="text-xl font-bold text-[#0071e3] font-mono">{dailyHours}h</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#1c1c1e] border border-white/[0.08] flex flex-col gap-1">
              <span className="text-[11px] text-[#86868b] uppercase tracking-wider font-semibold">Total Effort</span>
              <span className="text-xl font-bold text-[#ff9f0a] font-mono">{(daysRemaining * dailyHours).toFixed(1)}h</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#1c1c1e] border border-white/[0.08] flex flex-col gap-1">
              <span className="text-[11px] text-[#86868b] uppercase tracking-wider font-semibold">Progress</span>
              <span className="text-xl font-bold text-[#30d158] font-mono">
                {Object.values(completedDays).filter(Boolean).length} / {studyPlanSchedule.length}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden border border-white/10 p-0.5">
            <div
              className="bg-gradient-to-r from-[#0071e3] via-[#38bdf8] to-[#30d158] h-full rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${studyPlanSchedule.length > 0 ? (Object.values(completedDays).filter(Boolean).length / studyPlanSchedule.length) * 100 : 0}%`
              }}
            />
          </div>

          {/* Schedule Timeline */}
          <div className="flex flex-col gap-3">
            {studyPlanSchedule.map((item) => {
              const isDone = !!completedDays[item.day];
              return (
                <div
                  key={item.day}
                  onClick={() => toggleDayCompletion(item.day)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    isDone
                      ? "bg-[#1c1c1e]/60 border-[#30d158]/30 text-[#86868b]"
                      : "bg-[#161618] border-white/10 hover:border-white/20 text-white"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <button
                      type="button"
                      aria-label={`Mark Day ${item.day} as completed`}
                      className={`h-6 w-6 rounded-lg border flex items-center justify-center transition-all ${
                        isDone
                          ? "bg-[#30d158] border-[#30d158] text-black"
                          : "border-white/20 bg-black/40 text-transparent hover:border-white/40"
                      }`}
                    >
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </button>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                          isDone ? "bg-white/5 text-[#86868b]" : "bg-[#0071e3]/15 text-[#0071e3]"
                        }`}>
                          Day {item.day}
                        </span>
                        <span className={`text-sm font-medium ${isDone ? "line-through text-[#86868b]" : "text-white"}`}>
                          {item.focus}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-black border border-white/10 text-[#86868b] font-mono">
                      {item.practice}
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      isDone ? "bg-[#30d158]/10 text-[#30d158]" : "bg-white/5 text-[#86868b]"
                    }`}>
                      {isDone ? "Completed" : "Pending"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
