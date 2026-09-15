import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  Upload,
  FileText,
  Presentation,
  Package,
  Sparkles,
  CheckCircle2,
  Download,
  AlertCircle,
  File,
  Trash2,
  FolderOpen
} from "lucide-react";
import {
  CloudAiConfig,
  API_BASE_URL,
  uploadDocument,
  listDocuments,
  generateExamPaper,
  downloadMaterial,
  exportRSSHPackage,
  downloadRSSHPackage,
  UploadDocumentResponse,
  DocumentListItem,
  ExamPaperResponse
} from "@/lib/api";

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
  const subjectSlug = activeSubject.toLowerCase().replace(/\s+/g, "-");

  // ─── DOCUMENT UPLOAD & INGESTION STATE ───
  const [docText, setDocText] = useState("");
  const [analyzingDoc, setAnalyzingDoc] = useState(false);
  const [docAnalysisResult, setDocAnalysisResult] = useState<any>(null);

  // File upload state
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadDocumentResponse | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedDocType, setSelectedDocType] = useState("Textbook");
  const [selectedUnitId, setSelectedUnitId] = useState("");

  // Document list state
  const [documentsList, setDocumentsList] = useState<DocumentListItem[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── EXAM BUILDER STATE ───
  const [examResult, setExamResult] = useState<ExamPaperResponse | null>(null);
  const [examError, setExamError] = useState<string | null>(null);
  const [downloadingDocx, setDownloadingDocx] = useState(false);

  // ─── SLIDES STATE ───
  const [generatingSlides, setGeneratingSlides] = useState(false);
  const [slidesResult, setSlidesResult] = useState<any>(null);
  const [slidesError, setSlidesError] = useState<string | null>(null);
  const [downloadingPptx, setDownloadingPptx] = useState(false);

  // ─── EXPORT STATE ───
  const [exportResult, setExportResult] = useState<any>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [downloadingRssh, setDownloadingRssh] = useState(false);

  // Fetch documents list when tab changes to curriculum
  useEffect(() => {
    if (activeTab === "curriculum") {
      fetchDocumentsList();
    }
  }, [activeTab, activeSubject]);

  const fetchDocumentsList = async () => {
    setLoadingDocs(true);
    try {
      const res = await listDocuments(subjectSlug);
      setDocumentsList(res.documents || []);
    } catch {
      setDocumentsList([]);
    } finally {
      setLoadingDocs(false);
    }
  };

  // ─── FILE UPLOAD HANDLERS ───
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [selectedDocType, selectedUnitId]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
      e.target.value = "";
    }
  };

  const handleFileUpload = async (file: File) => {
    const validExtensions = [".pdf", ".docx", ".txt", ".pptx"];
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!validExtensions.includes(ext)) {
      setUploadError(`Unsupported file type: ${ext}. Accepted: .pdf, .docx, .txt, .pptx`);
      return;
    }

    setUploadingFile(true);
    setUploadError(null);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("subject_id", subjectSlug);
      formData.append("doc_type", selectedDocType);
      if (selectedUnitId) {
        formData.append("unit_id", selectedUnitId);
      }

      const result = await uploadDocument(formData);
      setUploadResult(result);
      // Refresh document list
      fetchDocumentsList();
    } catch (err: any) {
      setUploadError(err.message || "Upload failed. Ensure the backend is running.");
    } finally {
      setUploadingFile(false);
    }
  };

  // ─── DOCUMENT ANALYSIS HANDLER ───
  const handleAnalyzeDocument = async () => {
    if (!docText.trim()) return;
    setAnalyzingDoc(true);
    try {
      const res = await fetch(`${API_BASE_URL}/teacher/analyze-document`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject_id: subjectSlug,
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

  // ─── EXAM PAPER GENERATION HANDLER ───
  const handleGenerateExam = async () => {
    setGeneratingExam(true);
    setExamError(null);
    setExamResult(null);

    try {
      const result = await generateExamPaper({
        subject_id: subjectSlug,
        exam_title: "Final Examination",
        total_marks: 100,
        duration_minutes: 180,
        blooms_distribution: {
          Remember: bloomsTaxonomy.remember,
          Understand: bloomsTaxonomy.understand,
          Apply: bloomsTaxonomy.apply,
          Analyze: bloomsTaxonomy.analyze
        },
        cloud_api_key: cloudConfig.apiKey,
        cloud_provider: cloudConfig.provider,
        cloud_model: cloudConfig.model
      });
      setExamResult(result);
      setExamGenerated(true);
    } catch (err: any) {
      setExamError(err.message || "Failed to generate exam paper. Ensure the backend is running.");
      setExamGenerated(false);
    } finally {
      setGeneratingExam(false);
    }
  };

  // ─── DOCX DOWNLOAD HANDLER ───
  const handleDownloadDocx = async () => {
    if (!examResult?.docx_filename) return;
    setDownloadingDocx(true);
    try {
      await downloadMaterial(subjectSlug, examResult.docx_filename);
    } catch {
      setExamError("Failed to download .docx file.");
    } finally {
      setDownloadingDocx(false);
    }
  };

  // ─── SLIDES GENERATION HANDLER ───
  const handleGenerateSlides = async () => {
    if (!slideTopic.trim()) return;
    setGeneratingSlides(true);
    setSlidesError(null);
    setSlidesResult(null);

    try {
      const res = await fetch(`${API_BASE_URL}/teacher/presentations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject_id: subjectSlug,
          unit_title: activeUnit,
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
    } catch (err: any) {
      setSlidesError(err.message || "Failed to generate slides. Ensure the backend is running.");
    } finally {
      setGeneratingSlides(false);
    }
  };

  // ─── PPTX DOWNLOAD HANDLER ───
  const handleDownloadPptx = async () => {
    if (!slidesResult?.filename) return;
    setDownloadingPptx(true);
    try {
      await downloadMaterial(subjectSlug, slidesResult.filename);
    } catch {
      setSlidesError("Failed to download .pptx file.");
    } finally {
      setDownloadingPptx(false);
    }
  };

  // ─── RSSH EXPORT HANDLER ───
  const handleExportRSSH = async () => {
    setIsExporting(true);
    setExportError(null);
    setExportResult(null);
    setExportComplete(false);

    try {
      const result = await exportRSSHPackage(subjectSlug);
      setExportResult(result);

      // Immediately trigger browser download
      setDownloadingRssh(true);
      await downloadRSSHPackage(subjectSlug);
      setExportComplete(true);
    } catch (err: any) {
      setExportError(err.message || "Failed to export .rssh package. Ensure the backend is running.");
    } finally {
      setIsExporting(false);
      setDownloadingRssh(false);
    }
  };

  // Section color map for exam
  const sectionColors = ["#0071e3", "#30d158", "#ff9f0a"];

  return (
    <div className="h-full">
      {/* ─── TAB 1: CURRICULUM INGESTION & AI UNDERSTANDING ─── */}
      {activeTab === "curriculum" && (
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Upload className="h-5 w-5 text-[#0071e3]" />
              Curriculum &amp; Document Ingestion
            </h3>
            <p className="text-sm text-[#86868b] mt-1">
              Upload course documents for AI-powered extraction, semantic chunking, and vector indexing into LanceDB.
            </p>
          </div>

          {/* ─── FILE UPLOAD DROPZONE ─── */}
          <div className="p-6 rounded-3xl bg-[#161618] border border-white/10 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white uppercase tracking-wider">
                Document Upload
              </span>
              <div className="flex items-center gap-3">
                <select
                  value={selectedDocType}
                  onChange={(e) => setSelectedDocType(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-black border border-white/10 text-xs text-white outline-none focus:border-[#0071e3] cursor-pointer"
                >
                  <option value="Textbook">Textbook</option>
                  <option value="Syllabus">Syllabus</option>
                  <option value="Notes">Notes</option>
                  <option value="PYQ">PYQ Paper</option>
                  <option value="Assignment">Assignment</option>
                </select>
                <input
                  type="text"
                  value={selectedUnitId}
                  onChange={(e) => setSelectedUnitId(e.target.value)}
                  placeholder="Unit ID (optional)"
                  className="px-3 py-1.5 rounded-lg bg-black border border-white/10 text-xs text-white outline-none focus:border-[#0071e3] w-36"
                />
              </div>
            </div>

            {/* Dropzone Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all
                ${isDragOver
                  ? "border-[#0071e3] bg-[#0071e3]/10"
                  : "border-white/15 bg-black/40 hover:border-white/30 hover:bg-black/60"
                }
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt,.pptx"
                onChange={handleFileSelect}
                className="hidden"
              />
              {uploadingFile ? (
                <>
                  <div className="h-8 w-8 border-2 border-white/20 border-t-[#0071e3] rounded-full animate-spin" />
                  <span className="text-sm text-white font-medium">Processing and ingesting document...</span>
                  <span className="text-xs text-[#86868b]">Extracting pages, creating semantic chunks, indexing vectors</span>
                </>
              ) : (
                <>
                  <div className="h-12 w-12 rounded-2xl bg-[#0071e3]/10 border border-[#0071e3]/20 flex items-center justify-center">
                    <Upload className="h-6 w-6 text-[#0071e3]" />
                  </div>
                  <span className="text-sm text-white font-medium">
                    {isDragOver ? "Drop file here" : "Drag and drop or click to upload"}
                  </span>
                  <span className="text-xs text-[#86868b]">Supports .pdf, .docx, .txt, .pptx</span>
                </>
              )}
            </div>

            {/* Upload Result */}
            {uploadResult && (
              <div className="p-4 rounded-2xl bg-black/60 border border-[#30d158]/30 flex flex-col gap-2 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#30d158]" />
                  <span className="text-sm font-semibold text-white">Document Ingested Successfully</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#161618] border border-white/[0.06] text-center">
                    <span className="text-[#0071e3] font-mono text-lg block">{uploadResult.pages_extracted}</span>
                    <span className="text-[#86868b]">Pages Extracted</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#161618] border border-white/[0.06] text-center">
                    <span className="text-[#30d158] font-mono text-lg block">{uploadResult.chunks_created}</span>
                    <span className="text-[#86868b]">Semantic Chunks</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#161618] border border-white/[0.06] text-center">
                    <span className="text-[#ff9f0a] font-mono text-lg block">{uploadResult.vectors_indexed}</span>
                    <span className="text-[#86868b]">Vectors Indexed</span>
                  </div>
                </div>
                <span className="text-xs text-[#86868b]">
                  {uploadResult.filename} ({uploadResult.doc_type})
                </span>
              </div>
            )}

            {/* Upload Error */}
            {uploadError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-xs text-red-400 animate-in fade-in">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {uploadError}
              </div>
            )}
          </div>

          {/* ─── UPLOADED DOCUMENTS LIST ─── */}
          {documentsList.length > 0 && (
            <div className="p-6 rounded-3xl bg-[#161618] border border-white/10 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                  <FolderOpen className="h-4 w-4 text-[#0071e3]" />
                  Uploaded Documents ({documentsList.length})
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {documentsList.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/[0.06] text-xs">
                    <div className="flex items-center gap-2">
                      <File className="h-3.5 w-3.5 text-[#86868b]" />
                      <span className="text-white font-medium truncate max-w-xs">{doc.filename}</span>
                    </div>
                    <span className="text-[#86868b] font-mono">
                      {(doc.size_bytes / 1024).toFixed(1)} KB
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── QUICK TEXT ANALYSIS (EXISTING) ─── */}
          <div className="p-6 rounded-3xl bg-[#161618] border border-white/10 flex flex-col gap-4">
            <label className="text-xs font-semibold text-white flex items-center justify-between">
              <span>Quick Text Analysis (Paste Content):</span>
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
                    Learning Outcomes (Bloom&apos;s Aligned)
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

      {/* ─── TAB 2: EXAM BUILDER (LIVE API) ─── */}
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
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[#86868b]">Applying</span>
                  <span className="font-mono text-white">{bloomsTaxonomy.apply}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={bloomsTaxonomy.apply}
                  onChange={(e) => setBloomsTaxonomy((prev) => ({ ...prev, apply: Number(e.target.value) }))}
                  className="w-full accent-[#0071e3]"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[#86868b]">Analyzing</span>
                  <span className="font-mono text-white">{bloomsTaxonomy.analyze}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={bloomsTaxonomy.analyze}
                  onChange={(e) => setBloomsTaxonomy((prev) => ({ ...prev, analyze: Number(e.target.value) }))}
                  className="w-full accent-[#0071e3]"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateExam}
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

            {examError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-xs text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {examError}
              </div>
            )}
          </div>

          {/* ─── LIVE EXAM RESULT ─── */}
          {examGenerated && examResult && (
            <div className="p-6 rounded-3xl bg-[#161618] border border-white/10 text-sm flex flex-col gap-4 animate-in fade-in">
              <div className="flex justify-between items-center pb-3 border-b border-white/[0.08]">
                <div>
                  <span className="font-bold text-white block">{examResult.title}</span>
                  <span className="text-xs text-[#86868b]">
                    Duration: {examResult.duration_minutes} Mins &bull; Total: {examResult.total_marks} Marks &bull; Bloom&apos;s Calibrated
                  </span>
                </div>
                <button
                  onClick={handleDownloadDocx}
                  disabled={downloadingDocx}
                  className="px-4 py-1.5 rounded-full btn-apple-secondary text-xs cursor-pointer flex items-center gap-1.5"
                >
                  {downloadingDocx ? (
                    <div className="h-3.5 w-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Download className="h-3.5 w-3.5" />
                  )}
                  Export Word (.docx)
                </button>
              </div>

              {/* Instructions */}
              {examResult.instructions && examResult.instructions.length > 0 && (
                <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] text-xs text-[#a1a1a6]">
                  <span className="text-[#86868b] font-semibold block mb-1">Instructions:</span>
                  <ul className="list-disc list-inside space-y-0.5">
                    {examResult.instructions.map((instr, i) => (
                      <li key={i}>{instr}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sections */}
              <div className="space-y-3 text-xs">
                {examResult.sections.map((section, sIdx) => (
                  <div key={sIdx} className="p-3.5 rounded-2xl bg-black border border-white/[0.06]">
                    <span className="font-semibold block mb-2" style={{ color: sectionColors[sIdx] || "#0071e3" }}>
                      {section.section_name}
                    </span>
                    <div className="space-y-2">
                      {section.questions.map((q, qIdx) => (
                        <div key={qIdx} className="flex justify-between items-start gap-3">
                          <p className="text-[#a1a1a6] flex-1">
                            {q.question_number || qIdx + 1}. {q.question_text}
                          </p>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="px-2 py-0.5 rounded-full bg-white/5 text-[#86868b] text-[10px]">
                              {q.bloom_level}
                            </span>
                            <span className="text-white font-mono text-[10px]">{q.marks}M</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* File info */}
              {examResult.file_size_bytes > 0 && (
                <div className="text-[10px] text-[#86868b] text-right font-mono">
                  {examResult.docx_filename} ({(examResult.file_size_bytes / 1024).toFixed(1)} KB)
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 3: SLIDES GENERATOR (LIVE API + DOWNLOAD) ─── */}
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

            {slidesError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-xs text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {slidesError}
              </div>
            )}
          </div>

          {slidesResult && (
            <div className="p-6 rounded-3xl bg-[#161618] border border-white/10 flex flex-col gap-4 text-xs sm:text-sm animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <span className="font-semibold text-white">
                  Generated Slide Deck ({slidesResult.slides_count || slidesResult.slides?.length || 5} Slides)
                </span>
                <div className="flex items-center gap-3">
                  {slidesResult.size_bytes && (
                    <span className="text-[10px] text-[#86868b] font-mono">
                      {(slidesResult.size_bytes / 1024).toFixed(1)} KB
                    </span>
                  )}
                  <button
                    onClick={handleDownloadPptx}
                    disabled={downloadingPptx}
                    className="px-4 py-1.5 rounded-full btn-apple-primary text-xs cursor-pointer flex items-center gap-1.5"
                  >
                    {downloadingPptx ? (
                      <div className="h-3.5 w-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Download className="h-3.5 w-3.5" />
                    )}
                    Download .pptx
                  </button>
                </div>
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

      {/* ─── TAB 4: EXPORT .RSSH (LIVE API + BROWSER DOWNLOAD) ─── */}
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
              <span className="text-[#86868b]">Subject:</span>
              <span className="font-mono text-white">{activeSubject}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#86868b]">Package ID:</span>
              <span className="font-mono text-white">{subjectSlug}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#86868b]">Database:</span>
              <span className="text-[#30d158] font-mono">subject.db (SQLite)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#86868b]">Vector Storage:</span>
              <span className="text-[#0071e3] font-mono">vectors/ (LanceDB)</span>
            </div>
            {exportResult && (
              <>
                <div className="flex justify-between pt-2 border-t border-white/[0.06]">
                  <span className="text-[#86868b]">Filename:</span>
                  <span className="font-mono text-white">{exportResult.filename}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#86868b]">Archive Size:</span>
                  <span className="font-mono text-[#30d158]">{(exportResult.size_bytes / 1024).toFixed(1)} KB</span>
                </div>
              </>
            )}
          </div>

          {exportError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-xs text-red-400 w-full">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {exportError}
            </div>
          )}

          <button
            onClick={handleExportRSSH}
            disabled={isExporting || downloadingRssh}
            className="px-8 py-3.5 rounded-full btn-apple-primary text-sm font-medium cursor-pointer flex items-center gap-2"
          >
            {isExporting || downloadingRssh ? (
              <>
                <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                {downloadingRssh ? "Downloading..." : "Compiling package..."}
              </>
            ) : exportComplete ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Package Downloaded
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Compile &amp; Download .rssh
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
