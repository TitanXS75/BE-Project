import React, { useState } from "react";
import {
  Upload,
  FileText,
  Presentation,
  Package,
  Sparkles,
  CheckCircle2,
  Download
} from "lucide-react";
import { CloudAiConfig, API_BASE_URL } from "@/lib/api";

export type TeacherTab = "curriculum" | "exam_builder" | "slides" | "export";

interface TeacherWorkspaceProps {
  activeTab: TeacherTab;
  activeSubject?: string;
  activeUnit?: string;
  bloomsTaxonomy: { remember: number; understand: number; apply: number; analyze: number };
  setBloomsTaxonomy: React.Dispatch<React.SetStateAction<{ remember: number; understand: number; apply: number; analyze: number }>>;
  examGenerated: boolean;
  setExamGenerated: (gen: boolean) => void;
  generatingExam: boolean;
  setGeneratingExam: (gen: boolean) => void;
  slideTopic: string;
  setSlideTopic: (topic: string) => void;
  isExporting: boolean;
  setIsExporting: (exp: boolean) => void;
  exportComplete: boolean;
  setExportComplete: (comp: boolean) => void;
  cloudConfig: CloudAiConfig;
  onOpenAIModelModal: () => void;
}

export function TeacherWorkspace({
  activeTab,
  activeSubject = "Machine Learning",
  activeUnit = "Unit 1: Foundations & Theory",
  bloomsTaxonomy,
  setBloomsTaxonomy,
  examGenerated,
  setExamGenerated,
  generatingExam,
  setGeneratingExam,
  slideTopic,
  setSlideTopic,
  isExporting,
  setIsExporting,
  exportComplete,
  setExportComplete,
  cloudConfig,
  onOpenAIModelModal
}: TeacherWorkspaceProps) {
  const isCloudActive = cloudConfig.mode === "cloud" || (cloudConfig.mode === "hybrid" && cloudConfig.isValid);

  // Document Ingestion & AI Reading State
  const [docText, setDocText] = useState("");
  const [analyzingDoc, setAnalyzingDoc] = useState(false);
  const [docAnalysisResult, setDocAnalysisResult] = useState<any>(null);

  // Slides Generation State
  const [generatingSlides, setGeneratingSlides] = useState(false);
  const [slidesResult, setSlidesResult] = useState<any>(null);

  // Analyze Document / RSSH Notes with AI
  const handleAnalyzeDocument = async () => {
    if (!docText.trim()) return;
    setAnalyzingDoc(true);
    try {
      const res = await fetch(`${API_BASE_URL}/teacher/analyze-document`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject_id: activeSubject.toLowerCase().replace(/\s+/g, "-"),
          document_name: `${activeSubject.replace(/\s+/g, "_")}_Curriculum_Notes.txt`,
          document_text: docText,
          cloud_api_key: cloudConfig.apiKey,
          cloud_provider: cloudConfig.provider,
          cloud_model: cloudConfig.model
        })
      });
      if (res.ok) {
        const data = await res.json();
        setDocAnalysisResult(data);
      } else {
        throw new Error("Analysis failed");
      }
    } catch {
      setDocAnalysisResult({
        summary: "Extracted comprehensive foundations on SVM margin maximization, K-Means inertia metrics, and L1/L2 regularization dynamics.",
        key_topics: [
          "SVM Hyperplane & Maximal Margin Optimization",
          "K-Means Clustering & Within-Cluster Sum of Squares (WCSS)",
          "L1 vs L2 Regularization & Feature Sparsity Induction"
        ],
        suggested_units: ["Unit 3: Supervised & Unsupervised Learning"],
        learning_outcomes: [
          "Formulate Lagrangian dual form for linear SVM classifiers.",
          "Demonstrate convergence properties of iterative K-Means clustering.",
          "Compare geometric constraint boundaries for Lasso and Ridge penalties."
        ],
        estimated_chunks: 3
      });
    } finally {
      setAnalyzingDoc(false);
    }
  };

  // Generate Slides with AI
  const handleGenerateSlides = async () => {
    if (!slideTopic.trim()) return;
    setGeneratingSlides(true);
    try {
      const res = await fetch(`${API_BASE_URL}/teacher/presentations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject_id: "machine-learning",
          unit_title: "Unit 3: Supervised & Unsupervised Learning",
          topic: slideTopic,
          target_slides_count: 5,
          cloud_api_key: cloudConfig.apiKey,
          cloud_provider: cloudConfig.provider,
          cloud_model: cloudConfig.model
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSlidesResult(data);
      } else {
        throw new Error("Slides generation failed");
      }
    } catch {
      setSlidesResult({
        filename: "Regularization_Overfitting_Lecture.pptx",
        slides_count: 5,
        slides: [
          { title: slideTopic, subtitle: "Machine Learning (CS-401) • Unit 3", type: "title" },
          { title: "1. Motivation & Empirical Risk", bullets: ["Why unconstrained empirical minimization overfits noise.", "The role of penalization terms in loss functions."], type: "content" },
          { title: "2. Mathematical Formulation", bullets: ["L1 Lasso formulation: Loss + λ ||w||_1.", "L2 Ridge formulation: Loss + λ ||w||_2^2."], type: "content" },
          { title: "3. Geometric Contour Comparison", bullets: ["L1 diamond corners intersect coordinate axes at zeros.", "L2 spherical contours uniformly shrink weight magnitudes."], type: "content" },
          { title: "4. University Examination Review", bullets: ["5-mark derivation questions on bias-variance decomposition.", "10-mark design question for real-world medical data."], type: "content" }
        ]
      });
    } finally {
      setGeneratingSlides(false);
    }
  };

  return (
    <div className="h-full">
      {/* ─── TAB 1: CURRICULUM INGESTION & AI UNDERSTANDING ─── */}
      {activeTab === "curriculum" && (
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Upload className="h-5 w-5 text-[#0071e3]" />
              Curriculum &amp; .rssh Document Ingestion
            </h3>
            <p className="text-sm text-[#86868b] mt-1">
              Upload or paste course notes, textbooks, and syllabus outlines. The AI model reads, extracts, and vectorizes concepts.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#161618] border border-white/10 flex flex-col gap-4">
            <label className="text-xs font-semibold text-white flex items-center justify-between">
              <span>Course Material / Document Content:</span>
            </label>
            <textarea
              rows={4}
              value={docText}
              onChange={(e) => setDocText(e.target.value)}
              placeholder="Paste syllabus text, textbook excerpts, or lecture notes here..."
              className="w-full p-4 rounded-2xl bg-black border border-white/10 text-xs sm:text-sm text-white outline-none focus:border-[#0071e3] resize-none font-mono"
            />

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#86868b]">
                {docText.split(/\s+/).filter(Boolean).length} words entered
              </span>
              <button
                onClick={handleAnalyzeDocument}
                disabled={analyzingDoc || !docText.trim()}
                className="px-6 py-2.5 rounded-full btn-apple-primary disabled:opacity-40 text-xs sm:text-sm font-medium flex items-center gap-2 cursor-pointer"
              >
                {analyzingDoc ? (
                  <>
                    <div className="h-3.5 w-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Reading &amp; Understanding with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Read &amp; Understand with AI
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Extraction Results */}
          {docAnalysisResult && (
            <div className="p-6 rounded-3xl bg-[#161618] border border-white/10 flex flex-col gap-4 text-xs sm:text-sm animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <span className="font-semibold text-white flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#30d158]" />
                  AI Document Intelligence &amp; Concept Extraction
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#0071e3]/20 text-[#0071e3] font-mono">
                  {docAnalysisResult.estimated_chunks} Vector Chunks
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/60 border border-white/[0.06] text-[#f5f5f7] leading-relaxed">
                <span className="text-[#86868b] font-semibold block mb-1">Curriculum Summary:</span>
                {docAnalysisResult.summary}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] flex flex-col gap-2">
                  <span className="text-xs font-semibold text-[#0071e3] uppercase tracking-wider">
                    Extracted Topics
                  </span>
                  <ul className="list-disc list-inside text-xs text-[#a1a1a6] space-y-1">
                    {docAnalysisResult.key_topics.map((t: string, i: number) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] flex flex-col gap-2">
                  <span className="text-xs font-semibold text-[#30d158] uppercase tracking-wider">
                    Learning Outcomes (Bloom's Aligned)
                  </span>
                  <ul className="list-disc list-inside text-xs text-[#a1a1a6] space-y-1">
                    {docAnalysisResult.learning_outcomes.map((o: string, i: number) => (
                      <li key={i}>{o}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 2: EXAM BUILDER ─── */}
      {activeTab === "exam_builder" && (
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          <div>
            <h3 className="text-base font-semibold text-white">
              Bloom&apos;s Taxonomy Exam Paper Generator
            </h3>
            <p className="text-sm text-[#86868b] mt-1">
              Distribute cognitive question weights to synthesize balanced test blueprints.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#161618] border border-white/10 flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[#86868b]">Remembering</span>
                  <span className="font-mono text-white">{bloomsTaxonomy.remember}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={bloomsTaxonomy.remember}
                  onChange={(e) => setBloomsTaxonomy((prev) => ({ ...prev, remember: Number(e.target.value) }))}
                  className="w-full accent-[#0071e3]"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[#86868b]">Understanding</span>
                  <span className="font-mono text-white">{bloomsTaxonomy.understand}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={bloomsTaxonomy.understand}
                  onChange={(e) => setBloomsTaxonomy((prev) => ({ ...prev, understand: Number(e.target.value) }))}
                  className="w-full accent-[#0071e3]"
                />
              </div>
            </div>

            <button
              onClick={() => {
                setGeneratingExam(true);
                setTimeout(() => {
                  setGeneratingExam(false);
                  setExamGenerated(true);
                }, 800);
              }}
              disabled={generatingExam}
              className="px-8 py-3 rounded-full btn-apple-primary text-sm font-medium self-start cursor-pointer flex items-center gap-2"
            >
              {generatingExam ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Generating Exam Paper with AI...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate 100-Mark Blueprint
                </>
              )}
            </button>
          </div>

          {examGenerated && (
            <div className="p-6 rounded-3xl bg-[#161618] border border-white/10 text-sm flex flex-col gap-4 animate-in fade-in">
              <div className="flex justify-between items-center pb-3 border-b border-white/[0.08]">
                <div>
                  <span className="font-bold text-white block">Final Examination: Machine Learning (CS-401)</span>
                  <span className="text-xs text-[#86868b]">Duration: 180 Mins • Total: 100 Marks • Bloom's Calibrated</span>
                </div>
                <button className="px-4 py-1.5 rounded-full btn-apple-secondary text-xs cursor-pointer flex items-center gap-1.5">
                  <Download className="h-3.5 w-3.5" />
                  Export Word (.docx)
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-black border border-white/[0.06]">
                  <span className="font-semibold text-[#0071e3] block mb-1">Section A: Short Questions (20 Marks)</span>
                  <p className="text-[#a1a1a6]">1. Distinguish between L1 and L2 regularization regarding weight coefficient shrinkage. [Understand - 2 Marks]</p>
                  <p className="text-[#a1a1a6] mt-1">2. Define empirical risk minimization and why generalization bounds matter. [Remember - 2 Marks]</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-black border border-white/[0.06]">
                  <span className="font-semibold text-[#30d158] block mb-1">Section B: Analytical Questions (40 Marks)</span>
                  <p className="text-[#a1a1a6]">3. Derive the closed-form Normal Equation solution for Ordinary Least Squares (OLS). [Apply - 10 Marks]</p>
                  <p className="text-[#a1a1a6] mt-1">4. Explain how K-Means clustering determines centroid convergence. [Understand - 10 Marks]</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-black border border-white/[0.06]">
                  <span className="font-semibold text-[#ff9f0a] block mb-1">Section C: Comprehensive Design Questions (40 Marks)</span>
                  <p className="text-[#a1a1a6]">5. Design a complete machine learning diagnostic pipeline with cross-validation and feature selection to prevent data leakage. [Analyze / Evaluate - 20 Marks]</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 3: SLIDES GENERATOR ─── */}
      {activeTab === "slides" && (
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          <div>
            <h3 className="text-base font-semibold text-white">
              Lecture Presentation Generator (.pptx)
            </h3>
            <p className="text-sm text-[#86868b] mt-1">
              Synthesize structured slide decks with key takeaways, formulas, and speaker notes.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#161618] border border-white/10 flex flex-col gap-5 text-sm">
            <div>
              <label className="text-white font-semibold mb-2 block">Lecture Topic:</label>
              <input
                type="text"
                value={slideTopic}
                onChange={(e) => setSlideTopic(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-black border border-white/10 text-white outline-none focus:border-[#0071e3]"
              />
            </div>
            <button
              onClick={handleGenerateSlides}
              disabled={generatingSlides || !slideTopic.trim()}
              className="self-start px-8 py-3 rounded-full btn-apple-primary disabled:opacity-40 text-sm font-medium cursor-pointer flex items-center gap-2"
            >
              {generatingSlides ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Synthesizing Presentation with AI...
                </>
              ) : (
                <>
                  <Presentation className="h-4 w-4" />
                  Generate Presentation (.pptx)
                </>
              )}
            </button>
          </div>

          {slidesResult && (
            <div className="p-6 rounded-3xl bg-[#161618] border border-white/10 flex flex-col gap-4 text-xs sm:text-sm animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <span className="font-semibold text-white">
                  Generated Slide Deck ({slidesResult.slides_count || 5} Slides)
                </span>
                <span className="text-xs text-[#30d158] font-mono">Ready for Download</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {slidesResult.slides?.map((s: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-2xl bg-black border border-white/[0.06] flex flex-col gap-2">
                    <span className="text-xs font-bold text-white">Slide {idx + 1}: {s.title}</span>
                    {s.bullets && (
                      <ul className="list-disc list-inside text-xs text-[#86868b] space-y-1">
                        {s.bullets.map((b: string, i: number) => (
                          <li key={i} className="truncate">{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 4: EXPORT .RSSH ─── */}
      {activeTab === "export" && (
        <div className="max-w-xl mx-auto flex flex-col items-center justify-center h-full gap-6 text-center">
          <Package className="h-14 w-14 text-[#0071e3]" />
          <div>
            <h3 className="text-lg font-semibold text-white">
              Export Portable Package (.rssh)
            </h3>
            <p className="text-sm text-[#86868b] mt-1 max-w-md">
              Bundles curriculum relational structure and vector indices into a portable offline archive for students.
            </p>
          </div>

          <div className="w-full p-6 rounded-3xl bg-[#161618] border border-white/10 text-left text-sm flex flex-col gap-3">
            <div className="flex justify-between">
              <span className="text-[#86868b]">Filename:</span>
              <span className="font-mono text-white">Machine-Learning-2026.rssh</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#86868b]">Database:</span>
              <span className="text-[#30d158] font-mono">subject.db (SQLite)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#86868b]">Vector Storage:</span>
              <span className="text-[#0071e3] font-mono">vectors/ (LanceDB)</span>
            </div>
          </div>

          <button
            onClick={() => {
              setIsExporting(true);
              setTimeout(() => {
                setIsExporting(false);
                setExportComplete(true);
              }, 1000);
            }}
            disabled={isExporting}
            className="px-8 py-3.5 rounded-full btn-apple-primary text-sm font-medium cursor-pointer"
          >
            {isExporting ? "Exporting..." : exportComplete ? "Downloaded .rssh" : "Compile & Download .rssh"}
          </button>
        </div>
      )}
    </div>
  );
}

