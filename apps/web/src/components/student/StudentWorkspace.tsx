import React from "react";
import {
  Sparkles,
  FileQuestion,
  Layers,
  UserCheck,
  TrendingUp,
  Lightbulb,
  Send,
  Check,
  Copy,
  CheckCircle
} from "lucide-react";
import { CloudAiConfig } from "@/lib/api";

export type StudentTab = "chat" | "quizzes" | "flashcards" | "teachback" | "pyq";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  sources?: string[];
  confidence?: number;
}

interface StudentWorkspaceProps {
  activeTab: StudentTab;
  activeUnit: string;
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

  // Flashcards Props
  flashcards: Array<{ unit: string; front: string; back: string }>;
  cardIndex: number;
  setCardIndex: React.Dispatch<React.SetStateAction<number>>;
  isFlipped: boolean;
  setIsFlipped: React.Dispatch<React.SetStateAction<boolean>>;
  onGenerateFlashcards?: () => void;
  generatingFlashcards?: boolean;

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

  // Cloud AI settings
  cloudConfig: CloudAiConfig;
  onOpenAIModelModal: () => void;
}

export function StudentWorkspace({
  activeTab,
  activeUnit,
  selectedModel,
  messages,
  inputQuery,
  setInputQuery,
  isStreaming,
  onSendMessage,
  copiedIndex,
  onCopy,
  samplePrompts,
  quizDifficulty,
  setQuizDifficulty,
  quizQuestions,
  selectedAnswers,
  onSelectAnswer,
  onGenerateQuiz,
  generatingQuiz,
  flashcards,
  cardIndex,
  setCardIndex,
  isFlipped,
  setIsFlipped,
  onGenerateFlashcards,
  generatingFlashcards,
  teachBackConcept,
  setTeachBackConcept,
  teachBackInput,
  setTeachBackInput,
  teachBackFeedback,
  evaluatingTeachBack,
  onEvaluateTeachBack,
  pyqTopics,
  cloudConfig,
  onOpenAIModelModal
}: StudentWorkspaceProps) {
  return (
    <div className="h-full flex flex-col">
      {/* ─── TAB 1: AI TUTOR CHAT ─── */}
      {activeTab === "chat" && (
        <div className="max-w-4xl mx-auto w-full h-full flex flex-col justify-between gap-6">
          <div className="flex-1 overflow-y-auto flex flex-col gap-6 pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-4 ${msg.role === "assistant" ? "items-start" : "items-start flex-row-reverse"}`}
              >
                <div
                  className={`h-9 w-9 rounded-2xl flex items-center justify-center flex-shrink-0 text-xs font-semibold ${
                    msg.role === "assistant"
                      ? "bg-[#0071e3]/10 text-[#0071e3] border border-[#0071e3]/20"
                      : "bg-[#2c2c2e] text-white"
                  }`}
                >
                  {msg.role === "assistant" ? <Sparkles className="h-4 w-4" /> : "You"}
                </div>

                <div
                  className={`max-w-2xl rounded-3xl p-6 ${
                    msg.role === "assistant"
                      ? "bg-[#161618] border border-white/10 text-white"
                      : "bg-[#0071e3] text-white"
                  }`}
                >
                  <div className="text-sm leading-relaxed whitespace-pre-wrap font-normal">
                    {msg.text}
                  </div>

                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-[#86868b]">
                      <div className="flex items-center gap-2">
                        <span>Grounded in:</span>
                        <span className="font-mono text-[#0071e3]">
                          {msg.sources.join(", ")}
                        </span>
                      </div>
                      <button
                        onClick={() => onCopy(msg.text, idx)}
                        className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                      >
                        {copiedIndex === idx ? (
                          <Check className="h-3.5 w-3.5 text-[#30d158]" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                        <span>{copiedIndex === idx ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isStreaming && (
              <div className="flex gap-4 items-start">
                <div className="h-9 w-9 rounded-2xl bg-[#0071e3]/10 text-[#0071e3] border border-[#0071e3]/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4 animate-spin" />
                </div>
                <div className="p-6 rounded-3xl bg-[#161618] border border-white/10 text-xs text-[#86868b] flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#0071e3] animate-ping" />
                  Generating grounded explanation from syllabus package...
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSendMessage();
              }}
              className="p-3 rounded-2xl bg-[#161618] border border-white/10 flex items-center gap-3 focus-within:border-[#0071e3] transition-all"
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
          <div className="flex items-center justify-between p-6 rounded-3xl bg-[#161618] border border-white/10">
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2.5">
                <FileQuestion className="h-5 w-5 text-[#30d158]" />
                Adaptive Practice Quizzes
              </h3>
              <p className="text-sm text-[#86868b] mt-1">
                Questions synthesized from active course package (.rssh) with verified rationale.
              </p>
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
            quizQuestions.map((q, idx) => {
              const isAnswered = selectedAnswers[q.id] !== undefined;
              const isCorrect = selectedAnswers[q.id] === q.correct;

              return (
                <div
                  key={q.id || idx}
                  className="p-8 rounded-3xl bg-[#161618] border border-white/10 flex flex-col gap-5"
                >
                  <div className="flex items-center justify-between text-xs text-[#86868b]">
                    <span>Question {idx + 1} of {quizQuestions.length} • {q.unit || activeUnit}</span>
                    <span className="text-[#30d158] font-mono">Curriculum Aligned</span>
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
                          disabled={isAnswered}
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
                    <div className="p-5 rounded-2xl bg-black border border-white/10 text-sm flex flex-col gap-2">
                      <span className={isCorrect ? "text-[#30d158] font-semibold" : "text-[#ff453a] font-semibold"}>
                        {isCorrect ? "Correct Solution" : "Explanation & Rationale"}
                      </span>
                      <p className="text-[#a1a1a6] leading-relaxed">{q.explanation}</p>
                      {q.source && <span className="text-xs text-[#86868b]">{q.source}</span>}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ─── TAB 3: SYLLABUS FLASHCARDS ─── */}
      {activeTab === "flashcards" && (
        <div className="max-w-xl mx-auto flex flex-col items-center justify-center h-full gap-8">
          <div className="text-center flex flex-col items-center gap-2">
            <h3 className="text-base font-semibold text-white">
              Curriculum Spaced Repetition
            </h3>
            {flashcards.length > 0 ? (
              <p className="text-sm text-[#86868b]">
                Card {cardIndex + 1} of {flashcards.length} • {flashcards[cardIndex]?.unit || activeUnit}
              </p>
            ) : (
              <p className="text-sm text-[#86868b]">
                No flashcards loaded for {activeUnit}
              </p>
            )}
            {onGenerateFlashcards && (
              <button
                type="button"
                onClick={onGenerateFlashcards}
                disabled={generatingFlashcards}
                className="mt-1 px-3 py-1.5 rounded-xl btn-apple-secondary text-xs font-medium cursor-pointer"
              >
                {generatingFlashcards ? "Generating Deck..." : "Generate New Flashcards Deck"}
              </button>
            )}
          </div>

          {flashcards.length > 0 ? (
            <>
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full h-80 rounded-3xl bg-[#161618] border border-white/10 p-8 flex flex-col justify-between items-center text-center cursor-pointer select-none hover:border-[#0071e3]/40 transition-all shadow-xl"
              >
                <span className="text-xs uppercase font-semibold tracking-wider text-[#86868b]">
                  {isFlipped ? "Ground Truth Definition" : "Prompt Question"}
                </span>
                <p className="text-base font-medium leading-relaxed text-white px-4">
                  {isFlipped ? flashcards[cardIndex]?.back : flashcards[cardIndex]?.front}
                </p>
                <span className="text-xs text-[#86868b]">Click to flip card</span>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setCardIndex((prev) => (prev > 0 ? prev - 1 : flashcards.length - 1));
                  }}
                  className="px-6 py-2.5 rounded-xl btn-apple-secondary text-xs font-medium cursor-pointer"
                >
                  Previous
                </button>
                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setCardIndex((prev) => (prev < flashcards.length - 1 ? prev + 1 : 0));
                  }}
                  className="px-6 py-2.5 rounded-xl btn-apple-primary text-xs font-medium cursor-pointer"
                >
                  Next Card
                </button>
              </div>
            </>
          ) : (
            <div className="p-8 rounded-3xl bg-[#161618] border border-white/10 text-center flex flex-col items-center gap-3">
              <Layers className="h-8 w-8 text-[#86868b]" />
              <p className="text-xs text-[#86868b]">Click &apos;Generate New Flashcards Deck&apos; above to create flashcards from course notes.</p>
            </div>
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

          <div className="rounded-3xl border border-white/10 bg-[#161618] overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-black border-b border-white/10 text-[#86868b] uppercase text-xs tracking-wider">
                <tr>
                  <th className="p-4">Topic</th>
                  <th className="p-4">Frequency</th>
                  <th className="p-4">Weight</th>
                  <th className="p-4">Exam Probability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-[#a1a1a6]">
                {pyqTopics.map((topic, i) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
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
      )}
    </div>
  );
}
