import React from "react";
import { Upload, FileText, Presentation, Package } from "lucide-react";

export type TeacherTab = "curriculum" | "exam_builder" | "slides" | "export";

interface TeacherWorkspaceProps {
  activeTab: TeacherTab;
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
}

export function TeacherWorkspace({
  activeTab,
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
  setExportComplete
}: TeacherWorkspaceProps) {
  return (
    <div className="h-full">
      {/* ─── TAB 1: CURRICULUM INGESTION ─── */}
      {activeTab === "curriculum" && (
        <div className="max-w-3xl mx-auto flex flex-col gap-8">
          <div>
            <h3 className="text-base font-semibold text-white">
              Curriculum Ingestion &amp; Vector Indexing
            </h3>
            <p className="text-sm text-[#86868b] mt-1">
              Upload syllabus PDFs, textbooks, and notes. The local engine extracts chunks and builds dense vector embeddings.
            </p>
          </div>

          <div className="border-2 border-dashed border-white/10 hover:border-white/20 rounded-3xl p-12 flex flex-col items-center justify-center gap-4 text-center cursor-pointer transition-all bg-[#161618]">
            <Upload className="h-10 w-10 text-[#0071e3]" />
            <p className="text-sm font-semibold text-white">Drag and drop course documents</p>
            <p className="text-xs text-[#86868b]">PDF, DOCX, PPTX supported</p>
            <button className="mt-2 px-6 py-2.5 rounded-full btn-apple-primary text-sm font-medium cursor-pointer">
              Select Files
            </button>
          </div>
        </div>
      )}

      {/* ─── TAB 2: EXAM BUILDER ─── */}
      {activeTab === "exam_builder" && (
        <div className="max-w-3xl mx-auto flex flex-col gap-8">
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
              className="px-8 py-3 rounded-full btn-apple-primary text-sm font-medium self-start cursor-pointer"
            >
              {generatingExam ? "Generating..." : "Generate 100-Mark Blueprint"}
            </button>
          </div>

          {examGenerated && (
            <div className="p-6 rounded-3xl bg-[#161618] border border-white/10 text-sm flex flex-col gap-3">
              <div className="flex justify-between items-center pb-3 border-b border-white/[0.08]">
                <span className="font-semibold text-white">Mid-Term Paper: Machine Learning (CS-401)</span>
                <button className="px-4 py-1.5 rounded-full btn-apple-secondary text-xs cursor-pointer">
                  Export Word (.docx)
                </button>
              </div>
              <p className="text-[#a1a1a6]">Section A: 5 Short Questions (20 Marks)</p>
              <p className="text-[#a1a1a6]">Section B: 4 Analytical Questions (40 Marks)</p>
              <p className="text-[#a1a1a6]">Section C: 2 Comprehensive Questions (40 Marks)</p>
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
            <button className="self-start px-8 py-3 rounded-full btn-apple-primary text-sm font-medium cursor-pointer">
              Generate Presentation (.pptx)
            </button>
          </div>
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
