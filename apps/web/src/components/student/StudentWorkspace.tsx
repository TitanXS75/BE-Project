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
  quizDifficulty: "easy" | "medium" | "hard";
  setQuizDifficulty: (diff: "easy" | "medium" | "hard") => void;
  quizQuestions: any[];
  selectedAnswers: Record<number, number>;
  onSelectAnswer: (qId: number, optionIdx: number) => void;

  // Flashcards Props
  flashcards: Array<{ unit: string; front: string; back: string }>;
  cardIndex: number;
  setCardIndex: React.Dispatch<React.SetStateAction<number>>;
  isFlipped: boolean;
  setIsFlipped: React.Dispatch<React.SetStateAction<boolean>>;

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
}

export function StudentWorkspace({
  activeTab,
  activeUnit,
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
  flashcards,
  cardIndex,
  setCardIndex,
  isFlipped,
  setIsFlipped,
  teachBackConcept,
  setTeachBackConcept,
  teachBackInput,
  setTeachBackInput,
  teachBackFeedback,
  evaluatingTeachBack,
  onEvaluateTeachBack,
  pyqTopics
}: StudentWorkspaceProps) {
  return (
    <div className="h-full">
      {/* ─── TAB 1: GROUNDED AI TUTOR CHAT ─── */}
      {activeTab === "chat" && (
        <div className="max-w-4xl mx-auto h-full flex flex-col justify-between">
          <div className="flex-1 overflow-y-auto flex flex-col gap-5 pr-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col gap-2 ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-2xl p-5 rounded-3xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#0071e3] text-white rounded-br-sm"
                      : "apple-card text-[#f5f5f7] border border-white/10 rounded-bl-sm"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-2.5 pb-2 border-b border-white/[0.08]">
                    <span className="font-semibold text-xs text-[#a1a1a6] flex items-center gap-2">
                      {msg.role === "user" ? (
                        "You"
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 text-[#0071e3]" />
                          Curriculum AI Tutor
                        </>
                      )}
                    </span>
                    <div className="flex items-center gap-2">
                      {msg.confidence && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1c1c1e] text-[#30d158] font-mono">
                          {msg.confidence}% Grounded
                        </span>
                      )}
                      <button
                        onClick={() => onCopy(msg.text, index)}
                        className="p-1 rounded hover:bg-white/10 text-[#86868b] hover:text-white transition-colors cursor-pointer"
                        title="Copy"
                      >
                        {copiedIndex === index ? (
                          <Check className="h-4 w-4 text-[#30d158]" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="whitespace-pre-wrap space-y-2.5">{msg.text}</div>
                </div>

                {msg.sources && msg.sources.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#86868b] px-3">
                    <span className="text-[#30d158] font-medium">Verified Sources:</span>
                    {msg.sources.map((src, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-md bg-[#1c1c1e] text-[#a1a1a6]">
                        {src}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.08] flex flex-col gap-4">
            <div className="flex flex-wrap gap-2.5">
              {samplePrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => onSendMessage(prompt)}
                  className="text-xs px-4 py-2 rounded-full bg-[#161618] hover:bg-[#1c1c1e] text-[#a1a1a6] hover:text-white border border-white/10 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Lightbulb className="h-3.5 w-3.5 text-[#ff9f0a]" />
                  {prompt}
                </button>
              ))}
            </div>

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
                Questions synthesized from course notes with verified rationale.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {(["easy", "medium", "hard"] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setQuizDifficulty(lvl)}
                  className={`text-xs capitalize px-4 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
                    quizDifficulty === lvl
                      ? "bg-[#0071e3] text-white"
                      : "bg-[#1c1c1e] text-[#86868b] hover:text-white"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {quizQuestions.map((q, idx) => {
            const isAnswered = selectedAnswers[q.id] !== undefined;
            const isCorrect = selectedAnswers[q.id] === q.correct;

            return (
              <div
                key={q.id}
                className="p-8 rounded-3xl bg-[#161618] border border-white/10 flex flex-col gap-5"
              >
                <div className="flex items-center justify-between text-xs text-[#86868b]">
                  <span>Question {idx + 1} of {quizQuestions.length} • {q.unit}</span>
                  <span>Difficulty: {q.difficulty}</span>
                </div>

                <h4 className="text-base font-medium text-white leading-relaxed">
                  {q.question}
                </h4>

                <div className="flex flex-col gap-2.5">
                  {q.options.map((opt: string, optIdx: number) => {
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
                    <span className="text-xs text-[#86868b]">{q.source}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ─── TAB 3: SYLLABUS FLASHCARDS ─── */}
      {activeTab === "flashcards" && (
        <div className="max-w-xl mx-auto flex flex-col items-center justify-center h-full gap-8">
          <div className="text-center">
            <h3 className="text-base font-semibold text-white">
              Curriculum Spaced Repetition
            </h3>
            <p className="text-sm text-[#86868b] mt-1">
              Card {cardIndex + 1} of {flashcards.length} • {flashcards[cardIndex].unit}
            </p>
          </div>

          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full h-80 apple-card p-10 rounded-3xl flex flex-col justify-between items-center text-center cursor-pointer select-none border border-white/10 hover:border-white/20 transition-all shadow-xl"
          >
            <span className="text-xs uppercase font-semibold tracking-wider text-[#86868b]">
              {isFlipped ? "Answer" : "Question"}
            </span>
            <p className="text-base font-medium leading-relaxed text-white px-4">
              {isFlipped ? flashcards[cardIndex].back : flashcards[cardIndex].front}
            </p>
            <span className="text-xs text-[#86868b]">Click to flip card</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setIsFlipped(false);
                setCardIndex((prev) => (prev > 0 ? prev - 1 : flashcards.length - 1));
              }}
              className="px-6 py-2.5 rounded-full btn-apple-secondary text-sm cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => {
                setIsFlipped(false);
                setCardIndex((prev) => (prev < flashcards.length - 1 ? prev + 1 : 0));
              }}
              className="px-8 py-2.5 rounded-full btn-apple-primary text-sm font-medium cursor-pointer"
            >
              Next Card
            </button>
          </div>
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
              Explain a concept in your own words. The local AI evaluates your intuition against course textbooks.
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
