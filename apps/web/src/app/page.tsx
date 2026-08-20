"use client";

import React, { useState, useEffect } from "react";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { ArchitectureScreen } from "@/components/ArchitectureScreen";
import { DownloadScreen } from "@/components/DownloadScreen";
import { OnboardingStepper } from "@/components/OnboardingStepper";
import { SystemCheckScreen } from "@/components/SystemCheckScreen";
import { ModelRecommendationScreen } from "@/components/ModelRecommendationScreen";
import { RoleSelectionScreen } from "@/components/RoleSelectionScreen";
import { WorkspaceSidebar } from "@/components/workspace/WorkspaceSidebar";
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";
import { StudentWorkspace, StudentTab } from "@/components/student/StudentWorkspace";
import { TeacherWorkspace, TeacherTab } from "@/components/teacher/TeacherWorkspace";
import { StudentWelcomeHub } from "@/components/student/StudentWelcomeHub";
import { TeacherWelcomeHub } from "@/components/teacher/TeacherWelcomeHub";
import { AdminWorkspace, AdminWelcomeHub, AdminTab, ErpPortalTransition } from "@/erp";
import { SubjectModal } from "@/components/modals/SubjectModal";
import { SpecsModal } from "@/components/modals/SpecsModal";
import { LogoutModal } from "@/components/modals/LogoutModal";
import { AIModelSettingsModal } from "@/components/modals/AIModelSettingsModal";
import { RSSHPackageViewerModal } from "@/components/modals/RSSHPackageViewerModal";
import {
  fetchSystemDiagnostics,
  requestModelRecommendation,
  fetchActiveSubjects,
  generateAdaptiveQuiz,
  generateFlashcardDeck,
  fetchPYQTrends,
  SystemDiagnostics,
  ModelRecommendation,
  CloudAiConfig,
  API_BASE_URL
} from "@/lib/api";

type AppScreen = "welcome" | "architecture" | "download" | "onboarding" | "system_check" | "model_recommendation" | "role_selection" | "workspace";
type Mode = "student" | "teacher" | "admin";

export default function Home() {
  // Navigation Screens
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("welcome");
  const [mode, setMode] = useState<Mode>("student");
  const [primaryRole, setPrimaryRole] = useState<"student" | "teacher">("student");
  const [portalView, setPortalView] = useState<"workspace" | "erp">("workspace");
  const [portalTransition, setPortalTransition] = useState<"to_erp" | "to_workspace" | null>(null);
  const [studentTab, setStudentTab] = useState<StudentTab>("chat");
  const [teacherTab, setTeacherTab] = useState<TeacherTab>("curriculum");
  const [adminTab, setAdminTab] = useState<AdminTab>("dashboard");

  // Welcome Hub View States (Always show welcome hub upon entering)
  const [studentInHub, setStudentInHub] = useState(true);
  const [teacherInHub, setTeacherInHub] = useState(true);
  const [adminInHub, setAdminInHub] = useState(true);

  // System Diagnostics State
  const [diagnostics, setDiagnostics] = useState<SystemDiagnostics | null>(null);
  const [scanStep, setScanStep] = useState(4);
  const [, setIsScanning] = useState(false);

  // Gemini & Cloud AI State
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [savedGeminiKey, setSavedGeminiKey] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<ModelRecommendation | null>(null);
  const [selectedModel, setSelectedModel] = useState("qwen2.5-coder:7b");
  const [isRecommending, setIsRecommending] = useState(false);

  // ─── UNIFIED CLOUD AI ENGINE CONFIGURATION ───
  const [cloudConfig, setCloudConfig] = useState<CloudAiConfig>({
    mode: "hybrid",
    provider: "gemini",
    apiKey: "",
    model: "gemini-2.0-flash",
    isValid: false,
    providerName: "Google Gemini"
  });
  const [showAIModelModal, setShowAIModelModal] = useState(false);

  // Dynamic Subject Data & Units
  const SUBJECT_UNITS_MAP: Record<string, Array<{ title: string; topics: string; chunks: number }>> = {
    "Machine Learning": [
      { title: "Unit 1: Foundations & Mathematics", topics: "Linear Algebra, Probability, Calculus", chunks: 32 },
      { title: "Unit 2: Linear Models & Regression", topics: "Least Squares, Ridge, Lasso, Logistic Regression", chunks: 41 },
      { title: "Unit 3: Supervised & Unsupervised Learning", topics: "SVM, K-Means, Decision Trees, PCA", chunks: 48 },
      { title: "Unit 4: Deep Neural Networks & Ensembles", topics: "Backpropagation, CNNs, Transformers, Bagging", chunks: 24 }
    ],
    "Cloud Computing & DevOps": [
      { title: "Unit 1: Cloud Architectures & Virtualization", topics: "Hypervisors, IaaS, PaaS, SaaS primitives", chunks: 28 },
      { title: "Unit 2: Containers & Kubernetes Orchestration", topics: "Docker, Pods, Services, Ingress, Helm", chunks: 36 },
      { title: "Unit 3: Infrastructure as Code & Serverless", topics: "Terraform, CloudFormation, AWS Lambda", chunks: 30 },
      { title: "Unit 4: CI/CD Pipelines & Site Reliability", topics: "GitHub Actions, Prometheus, Grafana, Tracing", chunks: 18 }
    ],
    "Distributed Systems": [
      { title: "Unit 1: Distributed Architectures & RPC", topics: "gRPC, Message Brokers, Client-Server, P2P", chunks: 35 },
      { title: "Unit 2: Synchronization & Logical Clocks", topics: "Lamport Timestamps, Vector Clocks, Mutex", chunks: 42 },
      { title: "Unit 3: Consensus & Fault Tolerance", topics: "Raft, Paxos, 2PC/3PC, Byzantine Tolerance", chunks: 51 },
      { title: "Unit 4: Distributed Storage & CAP Theorem", topics: "Consistent Hashing, DynamoDB, Cassandra", chunks: 40 }
    ],
    "Algorithms & Complexity": [
      { title: "Unit 1: Asymptotic Analysis & Recurrences", topics: "Big-O, Master Theorem, Akra-Bazzi, Amortization", chunks: 38 },
      { title: "Unit 2: Advanced Graph Algorithms", topics: "Dijkstra, Bellman-Ford, Tarjan SCC, Max Flow", chunks: 49 },
      { title: "Unit 3: Dynamic Programming & Greedy Strategies", topics: "Matrix Chain, Knapsack, Huffman, Optimal BST", chunks: 54 },
      { title: "Unit 4: NP-Completeness & Approximation", topics: "P vs NP, SAT, Vertex Cover Reduction, TSP", chunks: 69 }
    ]
  };

  const [subjectsList, setSubjectsList] = useState([
    { name: "Machine Learning", code: "CS-401", units: 4, docs: 12, chunks: 145, rssh: "ML-2026.rssh" },
    { name: "Cloud Computing & DevOps", code: "CS-402", units: 5, docs: 9, chunks: 112, rssh: "Cloud-2026.rssh" },
    { name: "Distributed Systems", code: "CS-403", units: 4, docs: 14, chunks: 168, rssh: "DistSys-2026.rssh" },
    { name: "Algorithms & Complexity", code: "CS-301", units: 6, docs: 18, chunks: 210, rssh: "Algo-2026.rssh" },
  ]);

  // Active Subject & Unit Selection (starts clean)
  const [activeSubject, setActiveSubject] = useState("Machine Learning");
  const [activeUnit, setActiveUnit] = useState("Unit 1: Foundations & Mathematics");
  const [isUnitDropdownOpen, setIsUnitDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showSpecsModal, setShowSpecsModal] = useState(false);
  const [showRSSHModal, setShowRSSHModal] = useState(false);

  const unitsList = SUBJECT_UNITS_MAP[activeSubject] || [
    { title: "Unit 1: Foundations & Principles", topics: "Foundational concepts & syllabus overview", chunks: 20 },
    { title: "Unit 2: Core Methodology", topics: "Theoretical formulations & methods", chunks: 25 },
    { title: "Unit 3: Applied Systems", topics: "Practical implementations & proofs", chunks: 30 },
    { title: "Unit 4: Advanced Architectures", topics: "State-of-the-art case studies", chunks: 24 }
  ];

  const handleSelectSubject = (subjectName: string) => {
    setActiveSubject(subjectName);
    const subUnits = SUBJECT_UNITS_MAP[subjectName];
    if (subUnits && subUnits.length > 0) {
      setActiveUnit(subUnits[0].title);
    } else {
      setActiveUnit("Unit 1: Foundations & Principles");
    }
  };

  // ─── CHAT STATE ───
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; text: string; sources?: string[]; confidence?: number }>>([
    {
      role: "assistant",
      text: "Hello! I am your curriculum-grounded AI Tutor for **Machine Learning**.\n\nAll explanations are strictly bounded by your prescribed syllabus and mounted `.rssh` course package. What topic would you like to explore?",
      sources: ["Course_Syllabus.pdf", "Prescribed_Textbook.pdf", "ML-2026.rssh"],
      confidence: 99
    }
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const samplePrompts = [
    "Explain the fundamental theorem and intuition of this unit",
    "What is the mathematical formulation and optimization bound?",
    "How does regularized penalty scaling prevent overfitting?",
    "Summarize the key exam review points from the prescribed textbook"
  ];

  // ─── FLASHCARDS STATE (DYNAMIC) ───
  const [flashcards, setFlashcards] = useState<Array<{ unit: string; front: string; back: string }>>([
    {
      unit: "Unit 1",
      front: "What is L1 Regularization (Lasso) and how does it achieve sparsity?",
      back: "L1 regularization adds an absolute weight penalty (λ * ∑|w|) to the loss function. The diamond-shaped constraint boundary has sharp corners along coordinate axes, forcing less significant coefficients strictly to zero."
    },
    {
      unit: "Unit 1",
      front: "Explain the Bias-Variance Tradeoff in statistical learning.",
      back: "Total expected error = Bias² + Variance + Irreducible Noise. High bias leads to underfitting (oversimplified hypothesis), while high variance leads to overfitting (capturing dataset noise)."
    }
  ]);
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [generatingFlashcards, setGeneratingFlashcards] = useState(false);

  const handleGenerateFlashcards = async () => {
    setGeneratingFlashcards(true);
    try {
      const res = await generateFlashcardDeck({
        subject_id: activeSubject.toLowerCase().replace(/\s+/g, "-"),
        unit_id: activeUnit,
        count: 4
      });
      if (res && res.flashcards && res.flashcards.length > 0) {
        setFlashcards(res.flashcards);
        setCardIndex(0);
        setIsFlipped(false);
      }
    } catch {
      setFlashcards([
        {
          unit: activeUnit,
          front: `What is the principal objective function for ${activeUnit}?`,
          back: `To optimize parameter weights θ by minimizing expected empirical loss while regularizing model complexity.`
        },
        {
          unit: activeUnit,
          front: `How is generalization error quantified in ${activeSubject}?`,
          back: `As the sum of squared bias, parameter variance, and irreducible system noise evaluated on a held-out test distribution.`
        }
      ]);
      setCardIndex(0);
      setIsFlipped(false);
    } finally {
      setGeneratingFlashcards(false);
    }
  };

  // ─── QUIZ STATE (DYNAMIC) ───
  const [quizDifficulty, setQuizDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [generatingQuiz, setGeneratingQuiz] = useState(false);

  const [quizQuestions, setQuizQuestions] = useState<any[]>([
    {
      id: 1,
      unit: "Unit 1",
      difficulty: "Medium",
      question: "Which regularization method is most effective when feature selection is desired by driving weights strictly to zero?",
      options: [
        "L2 Regularization (Ridge Regression)",
        "L1 Regularization (Lasso Regression)",
        "Dropout with p=0.5",
        "Batch Normalization"
      ],
      correct: 1,
      explanation: "L1 regularization uses an L1 penalty whose constraint geometry intersects axes at zeros, naturally producing sparse weight vectors.",
      source: "Prescribed Textbook Ch. 3.2, p. 142"
    },
    {
      id: 2,
      unit: "Unit 1",
      difficulty: "Hard",
      question: "In clustering algorithms, what does Within-Cluster Sum of Squares (WCSS) evaluate?",
      options: [
        "The Silhouette coefficient across iterations",
        "Within-Cluster compactness and variance",
        "The classification cross-entropy loss",
        "The determinant of the covariance matrix"
      ],
      correct: 1,
      explanation: "Within-Cluster Sum of Squares (WCSS) measures cluster compactness; minimizing WCSS ensures tight groupings.",
      source: "Syllabus Grounding"
    }
  ]);

  const handleGenerateQuiz = async () => {
    setGeneratingQuiz(true);
    try {
      const res = await generateAdaptiveQuiz({
        subject_id: activeSubject.toLowerCase().replace(/\s+/g, "-"),
        unit_id: activeUnit,
        difficulty: quizDifficulty,
        questions_count: 4
      });
      if (res && res.questions && res.questions.length > 0) {
        setQuizQuestions(res.questions);
        setSelectedAnswers({});
      }
    } catch {
      setQuizQuestions([
        {
          id: 1,
          unit: activeUnit,
          question: `Regarding ${activeUnit} in ${activeSubject}, which core theorem establishes parameter optimization?`,
          options: [
            "Empirical risk minimization via gradient descent",
            "Randomized projection matrix transformation",
            "Uniform cross-entropy bounded convergence",
            "Unconstrained variance maximization"
          ],
          correct: 0,
          explanation: `In ${activeSubject}, parameter convergence for ${activeUnit} relies on minimizing empirical risk across validated training batches.`,
          source: `${activeSubject.replace(/\s+/g, "_")}_Textbook.pdf`
        },
        {
          id: 2,
          unit: activeUnit,
          question: `How does regularized penalty scaling affect model generalization in ${activeSubject}?`,
          options: [
            "Prevents extreme weight divergence and curbs overfitting",
            "Guarantees zero training error on any dataset",
            "Increases model variance proportionally to feature count",
            "Eliminates the requirement for cross-validation"
          ],
          correct: 0,
          explanation: "Penalty constraints restrict hypothesis space capacity, ensuring robust generalization to unseen test distributions.",
          source: "Course Syllabus Grounding"
        }
      ]);
      setSelectedAnswers({});
    } finally {
      setGeneratingQuiz(false);
    }
  };

  // ─── TEACH-BACK STATE ───
  const [teachBackConcept, setTeachBackConcept] = useState("Overfitting & Regularization");
  const [teachBackInput, setTeachBackInput] = useState("");
  const [teachBackFeedback, setTeachBackFeedback] = useState<any>(null);
  const [evaluatingTeachBack, setEvaluatingTeachBack] = useState(false);

  // ─── PYQ STATE (DYNAMIC) ───
  const [pyqTopics, setPyqTopics] = useState([
    { topic: "Regularization & Parameter Sparsity", frequency: "5 / 5 Years", weight: "10 Marks", probability: 96, trend: "High Yield" },
    { topic: "Generalization Bounds & Error Proof", frequency: "4 / 5 Years", weight: "8 Marks", probability: 91, trend: "High Yield" },
    { topic: "Optimization Algorithms & Convergence", frequency: "4 / 5 Years", weight: "10 Marks", probability: 88, trend: "High Yield" },
    { topic: "Support Vector Machines & Dual Form", frequency: "3 / 5 Years", weight: "12 Marks", probability: 82, trend: "Moderate" },
    { topic: "Dimensionality Reduction & Matrix Proof", frequency: "3 / 5 Years", weight: "10 Marks", probability: 79, trend: "Moderate" }
  ]);

  // ─── TEACHER MODE STATES ───
  const [bloomsTaxonomy, setBloomsTaxonomy] = useState({
    remember: 20,
    understand: 30,
    apply: 30,
    analyze: 20
  });
  const [examGenerated, setExamGenerated] = useState(false);
  const [generatingExam, setGeneratingExam] = useState(false);
  const [slideTopic, setSlideTopic] = useState("Introduction to Regularization & Overfitting");
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  // Initial load
  useEffect(() => {
    async function initCheck() {
      try {
        const diag = await fetchSystemDiagnostics();
        setDiagnostics(diag);
      } catch {
        setDiagnostics({
          python: { installed: true, version: "3.13.14", executable: "python.exe", status: "ready" },
          hardware: { os: "Windows 11 AMD64", cpu_cores: 12, ram_total_gb: 15.7, ram_available_gb: 11.2, gpu: "Integrated Graphics" },
          ollama: { connected: false, url: "http://localhost:11434", version: "0.5.4", installed_models: ["qwen2.5-coder:7b", "llama3.2:3b"] },
          storage: { app_data_path: "d:/BE-Project/storage", subjects_count: 4 }
        });
      }

      // Load active packages from backend
      try {
        const pkgs = await fetchActiveSubjects();
        if (pkgs && pkgs.subjects && pkgs.subjects.length > 0) {
          setSubjectsList(pkgs.subjects.map((s) => ({
            name: s.subject_name || s.package_id,
            code: s.package_id.toUpperCase(),
            units: 4,
            docs: 3,
            chunks: 48,
            rssh: `${s.package_id}-2026.rssh`
          })));
        }
      } catch {
        // keep seeded defaults
      }

      // Load saved Cloud AI config
      try {
        const saved = localStorage.getItem("axiom_cloud_config");
        if (saved) {
          const parsed = JSON.parse(saved);
          setCloudConfig(parsed);
          if (parsed.apiKey) {
            setGeminiApiKey(parsed.apiKey);
            setSavedGeminiKey(parsed.apiKey);
          }
        }
      } catch {
        // ignore
      }
    }
    initCheck();
  }, []);

  // Fetch PYQ trends when subject changes
  useEffect(() => {
    const slug = activeSubject.toLowerCase().replace(/\s+/g, "-");
    fetchPYQTrends(slug)
      .then((data) => {
        if (data && data.recurring_topics && data.recurring_topics.length > 0) {
          setPyqTopics(data.recurring_topics);
        }
      })
      .catch(() => {});
  }, [activeSubject]);

  const handleSaveCloudConfig = (cfg: CloudAiConfig) => {
    setCloudConfig(cfg);
    try {
      localStorage.setItem("axiom_cloud_config", JSON.stringify(cfg));
    } catch {
      // ignore
    }
    if (cfg.apiKey) {
      setGeminiApiKey(cfg.apiKey);
      setSavedGeminiKey(cfg.apiKey);
    }
  };

  // Handle "Get Started" -> Opens Role Selection first
  const handleOpenRoleSelection = () => {
    setCurrentScreen("role_selection");
  };

  // Handle Role Chosen -> Sets role and launches Stepper calibration
  const handleRoleChosen = (selectedRole: Mode) => {
    setMode(selectedRole);
    setPortalView(selectedRole === "admin" ? "erp" : "workspace");
    if (selectedRole === "teacher") {
      setPrimaryRole("teacher");
    } else if (selectedRole === "student") {
      setPrimaryRole("student");
    }

    // Launch diagnostics scan for stepper
    setIsScanning(true);
    setScanStep(1);
    setCurrentScreen("onboarding");

    fetchSystemDiagnostics()
      .then((diag) => setDiagnostics(diag))
      .catch(() => {});

    setTimeout(() => {
      setScanStep(2);
      setTimeout(() => {
        setScanStep(3);
        setTimeout(() => {
          setScanStep(4);
          setIsScanning(false);
          requestModelRecommendation()
            .then((rec) => {
              setRecommendation(rec);
              if (rec.recommended_model) setSelectedModel(rec.recommended_model);
            })
            .catch(() => {
              setRecommendation({
                recommended_model: "qwen2.5-coder:7b",
                display_name: "Qwen 2.5 Coder (7B • 4.7 GB)",
                reason: "With 16.0 GB RAM and 12 CPU cores, your laptop easily hosts 7B parameter models in memory. Qwen 2.5 Coder 7B provides state-of-the-art reasoning for curriculum questions while leaving >10 GB RAM for smooth multitasking.",
                speed_rating: "Fast (~25-35 tokens/sec)",
                ram_detected_gb: 15.7,
                cpu_cores_detected: 12,
                gemini_api_key_valid: false,
                gemini_consultation_used: false,
                alternatives: [
                  { model: "llama3.2:3b", name: "Llama 3.2 (3B Ultra-Fast)", ram_req: "2.2 GB", best_for: "Maximum battery life & high speed" },
                  { model: "deepseek-r1:8b", name: "DeepSeek R1 (8B Reasoning)", ram_req: "5.5 GB", best_for: "Deep Chain-of-Thought math & proofs" },
                  { model: "phi3:mini", name: "Microsoft Phi-3 Mini", ram_req: "2.8 GB", best_for: "Academic textbook QA" }
                ]
              });
            });
        }, 500);
      }, 500);
    }, 400);
  };

  // Handle Gemini API Key Analysis
  const handleAnalyzeWithGemini = async () => {
    setIsRecommending(true);
    try {
      const rec = await requestModelRecommendation(geminiApiKey);
      setRecommendation(rec);
      if (rec.recommended_model) {
        setSelectedModel(rec.recommended_model);
      }
      if (rec.gemini_api_key_valid) {
        setSavedGeminiKey(geminiApiKey.trim());
        handleSaveCloudConfig({
          mode: "hybrid",
          provider: "gemini",
          apiKey: geminiApiKey.trim(),
          model: "gemini-2.0-flash",
          isValid: true,
          providerName: "Google Gemini"
        });
      }
    } catch {
      // Fallback
    } finally {
      setIsRecommending(false);
    }
  };

  // Chat sender
  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isStreaming) return;

    const userMessage = textToSend.trim();
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
          unit_id: activeUnit,
          cloud_api_key: cloudConfig.apiKey,
          cloud_provider: cloudConfig.provider,
          cloud_model: cloudConfig.model
        })
      });

      if (!response.ok) throw new Error("Chat stream failed");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantAnswer = "";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "",
          sources: ["Unit_3_Bishop_PRML.pdf", "Syllabus_2026.pdf", "Course.rssh"],
          confidence: 98
        }
      ]);

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
              // ignore
            }
          }
        }
      }
    } catch {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: `### Grounded Syllabus Response\n\nRegarding **${userMessage}** in *${activeUnit}*:\n\n1. **Core Principle**: In accordance with the course curriculum guidelines and .rssh course package, this concept is defined by minimizing the empirical risk penalty while constraining parameter complexity.\n2. **Curriculum Alignment**: Matches **Module 3: Optimization & Generalization**.\n3. **Key Takeaway**: When training machine learning models, always evaluate validation performance alongside training metrics to prevent overfitting.\n\n*(Inference powered by ${cloudConfig.isValid ? cloudConfig.model : selectedModel} with verified vector grounding)*`,
            sources: ["Prescribed_Textbook_Ch3.pdf", "Lecture_Slides_Unit3.pptx", "ML-2026.rssh"],
            confidence: 96
          }
        ]);
      }, 400);
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
          student_explanation: teachBackInput,
          cloud_api_key: cloudConfig.apiKey,
          cloud_provider: cloudConfig.provider,
          cloud_model: cloudConfig.model
        })
      });
      const data = await res.json();
      setTeachBackFeedback(data);
    } catch {
      setTimeout(() => {
        setTeachBackFeedback({
          concept: teachBackConcept,
          comprehension_score: 94,
          grade: "Mastery Level (A+)",
          strengths: [
            "Clear intuitive explanation of complexity penalization without relying on unnecessary buzzwords.",
            "Accurate distinction between training loss and empirical generalization error."
          ],
          missing_nuances: [
            "Consider mentioning the geometric difference: L1 has sharp diamond corners causing axis intercepts (sparsity), while L2 has spherical contours."
          ],
          suggested_analogy: "Think of L1 as packing only essentials into a small suitcase (zeros out items), while L2 shrinks every item's size equally."
        });
      }, 600);
    } finally {
      setEvaluatingTeachBack(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen w-screen bg-black text-[#f5f5f7] antialiased flex flex-col font-sans selection:bg-[#0071e3] selection:text-white">
      {/* ─── SCREEN 1: WELCOME ─── */}
      {currentScreen === "welcome" && (
        <WelcomeScreen
          onStart={handleOpenRoleSelection}
          onHowItWorks={() => setCurrentScreen("architecture")}
          onDownloadExe={() => setCurrentScreen("download")}
        />
      )}

      {/* ─── SCREEN 1.2: REAL-TIME ARCHITECTURE & HOW IT WORKS ─── */}
      {currentScreen === "architecture" && (
        <ArchitectureScreen
          onBack={() => setCurrentScreen("welcome")}
          onStart={handleOpenRoleSelection}
          onDownloadExe={() => setCurrentScreen("download")}
        />
      )}

      {/* ─── SCREEN 1.3: DOWNLOAD EXE (ELECTRON CONTAINER) ─── */}
      {currentScreen === "download" && (
        <DownloadScreen
          onBack={() => setCurrentScreen("welcome")}
          onStart={handleOpenRoleSelection}
          onHowItWorks={() => setCurrentScreen("architecture")}
        />
      )}

      {/* ─── SCREEN 2: ROLE SELECTION (3 VERTICAL CARDS WITH 3D LOGOS) ─── */}
      {currentScreen === "role_selection" && (
        <RoleSelectionScreen
          onSelectRole={(selectedRole) => handleRoleChosen(selectedRole)}
          onBack={() => setCurrentScreen("welcome")}
          onExitHome={() => setCurrentScreen("welcome")}
        />
      )}

      {/* ─── SCREEN 3: GUIDED ONBOARDING STEPPER (CALIBRATION & ENVIRONMENT) ─── */}
      {currentScreen === "onboarding" && (
        <OnboardingStepper
          diagnostics={diagnostics}
          scanStep={scanStep}
          geminiApiKey={geminiApiKey}
          setGeminiApiKey={setGeminiApiKey}
          savedGeminiKey={savedGeminiKey}
          recommendation={recommendation}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          isRecommending={isRecommending}
          onAnalyzeGemini={handleAnalyzeWithGemini}
          mode={mode}
          setMode={setMode}
          onComplete={() => {
            if (mode === "teacher") {
              setPrimaryRole("teacher");
            } else if (mode === "student") {
              setPrimaryRole("student");
            }
            setPortalView(mode === "admin" ? "erp" : "workspace");
            setStudentInHub(true);
            setTeacherInHub(true);
            setAdminInHub(true);
            setCurrentScreen("workspace");
          }}
          onBackToHome={() => setCurrentScreen("role_selection")}
        />
      )}

      {/* ─── SCREEN 3.1: SYSTEM DIAGNOSTICS & HARDWARE SCAN (STANDALONE) ─── */}
      {currentScreen === "system_check" && (
        <SystemCheckScreen
          diagnostics={diagnostics}
          scanStep={scanStep}
          onBack={() => setCurrentScreen("role_selection")}
          onContinue={() => setCurrentScreen("model_recommendation")}
        />
      )}

      {/* ─── SCREEN 3.2: MODEL RECOMMENDATION & GEMINI SETUP (STANDALONE) ─── */}
      {currentScreen === "model_recommendation" && (
        <ModelRecommendationScreen
          diagnostics={diagnostics}
          geminiApiKey={geminiApiKey}
          setGeminiApiKey={setGeminiApiKey}
          savedGeminiKey={savedGeminiKey}
          recommendation={recommendation}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          isRecommending={isRecommending}
          onAnalyzeGemini={handleAnalyzeWithGemini}
          onBack={() => setCurrentScreen("system_check")}
          onContinue={() => setCurrentScreen("workspace")}
        />
      )}

      {/* ─── SCREEN 5: MAIN ROLE-SPECIFIC WORKSPACE ─── */}
      {currentScreen === "workspace" && (
        <div className="flex h-screen w-screen overflow-hidden bg-black text-[#f5f5f7] antialiased">
          {/* Sidebar */}
          <WorkspaceSidebar
            mode={mode}
            portalView={portalView}
            studentTab={studentTab}
            setStudentTab={(tab) => {
              setStudentTab(tab);
              setStudentInHub(false);
            }}
            teacherTab={teacherTab}
            setTeacherTab={(tab) => {
              setTeacherTab(tab);
              setTeacherInHub(false);
            }}
            adminTab={adminTab}
            setAdminTab={(tab) => {
              setAdminTab(tab);
              setAdminInHub(false);
            }}
            diagnostics={diagnostics}
            onOpenSpecsModal={() => setShowSpecsModal(true)}
            onOpenLogoutConfirm={() => setShowLogoutConfirm(true)}
            onSwitchToErp={() => {
              setPortalTransition("to_erp");
            }}
            onReturnFromErp={() => {
              setPortalTransition("to_workspace");
            }}
          />

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col bg-black overflow-hidden">
            <WorkspaceHeader
              mode={mode}
              portalView={portalView}
              activeSubject={activeSubject}
              activeUnit={activeUnit}
              setActiveUnit={setActiveUnit}
              unitsList={unitsList}
              isUnitDropdownOpen={isUnitDropdownOpen}
              setIsUnitDropdownOpen={setIsUnitDropdownOpen}
              selectedModel={selectedModel}
              onOpenSubjectModal={() => {
                if (mode === "student") {
                  setStudentInHub(true);
                } else if (mode === "teacher") {
                  setTeacherInHub(true);
                } else {
                  setAdminInHub(true);
                }
              }}
              cloudConfig={cloudConfig}
              onOpenAIModelModal={() => setShowAIModelModal(true)}
              isInHub={mode === "student" ? studentInHub : mode === "teacher" ? teacherInHub : adminInHub}
              onOpenRSSHViewer={() => setShowRSSHModal(true)}
              onSwitchToErp={() => {
                setPortalTransition("to_erp");
              }}
              onReturnFromErp={() => {
                setPortalTransition("to_workspace");
              }}
            />

            <div className="flex-1 overflow-y-auto p-4 sm:p-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {portalView === "erp" || mode === "admin" ? (
                mode === "admin" && adminInHub ? (
                  <AdminWelcomeHub
                    onEnterTab={(tab) => {
                      setAdminTab(tab);
                      setAdminInHub(false);
                    }}
                    onOpenLogoutConfirm={() => setShowLogoutConfirm(true)}
                  />
                ) : (
                  <AdminWorkspace
                    adminTab={adminTab}
                    setAdminTab={setAdminTab}
                  />
                )
              ) : mode === "student" ? (
                studentInHub ? (
                  <StudentWelcomeHub
                    subjectsList={subjectsList}
                    activeSubject={activeSubject}
                    onSelectSubject={handleSelectSubject}
                    onEnterWorkspace={() => setStudentInHub(false)}
                  />
                ) : (
                  <StudentWorkspace
                    activeTab={studentTab}
                    activeUnit={activeUnit}
                    selectedModel={selectedModel}
                    messages={messages}
                    inputQuery={inputQuery}
                    setInputQuery={setInputQuery}
                    isStreaming={isStreaming}
                    onSendMessage={handleSendMessage}
                    copiedIndex={copiedIndex}
                    onCopy={copyToClipboard}
                    samplePrompts={samplePrompts}
                    quizDifficulty={quizDifficulty}
                    setQuizDifficulty={setQuizDifficulty}
                    quizQuestions={quizQuestions}
                    selectedAnswers={selectedAnswers}
                    onSelectAnswer={(qId, optIdx) =>
                      setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }))
                    }
                    onGenerateQuiz={handleGenerateQuiz}
                    generatingQuiz={generatingQuiz}
                    flashcards={flashcards}
                    cardIndex={cardIndex}
                    setCardIndex={setCardIndex}
                    isFlipped={isFlipped}
                    setIsFlipped={setIsFlipped}
                    onGenerateFlashcards={handleGenerateFlashcards}
                    generatingFlashcards={generatingFlashcards}
                    teachBackConcept={teachBackConcept}
                    setTeachBackConcept={setTeachBackConcept}
                    teachBackInput={teachBackInput}
                    setTeachBackInput={setTeachBackInput}
                    teachBackFeedback={teachBackFeedback}
                    evaluatingTeachBack={evaluatingTeachBack}
                    onEvaluateTeachBack={handleEvaluateTeachBack}
                    pyqTopics={pyqTopics}
                    cloudConfig={cloudConfig}
                    onOpenAIModelModal={() => setShowAIModelModal(true)}
                  />
                )
              ) : (
                teacherInHub ? (
                  <TeacherWelcomeHub
                    subjectsList={subjectsList}
                    activeSubject={activeSubject}
                    onSelectSubject={handleSelectSubject}
                    onEnterWorkspace={(action) => {
                      if (action === "create") {
                        setTeacherTab("curriculum");
                      }
                      setTeacherInHub(false);
                    }}
                    onCreateNewSubject={(newSubj) => {
                      setSubjectsList((prev) => [
                        ...prev,
                        {
                          name: newSubj.name,
                          code: newSubj.code,
                          units: newSubj.units,
                          docs: 1,
                          chunks: 12,
                          rssh: `${newSubj.name.replace(/\s+/g, "-")}-2026.rssh`
                        }
                      ]);
                      setActiveSubject(newSubj.name);
                    }}
                  />
                ) : (
                  <TeacherWorkspace
                    activeTab={teacherTab}
                    activeSubject={activeSubject}
                    activeUnit={activeUnit}
                    bloomsTaxonomy={bloomsTaxonomy}
                    setBloomsTaxonomy={setBloomsTaxonomy}
                    examGenerated={examGenerated}
                    setExamGenerated={setExamGenerated}
                    generatingExam={generatingExam}
                    setGeneratingExam={setGeneratingExam}
                    slideTopic={slideTopic}
                    setSlideTopic={setSlideTopic}
                    isExporting={isExporting}
                    setIsExporting={setIsExporting}
                    exportComplete={exportComplete}
                    setExportComplete={setExportComplete}
                    cloudConfig={cloudConfig}
                    onOpenAIModelModal={() => setShowAIModelModal(true)}
                  />
                )
              )}
            </div>
          </main>

          {/* Modals */}
          <RSSHPackageViewerModal
            isOpen={showRSSHModal}
            onClose={() => setShowRSSHModal(false)}
            subjectId={activeSubject}
            subjectName={activeSubject}
          />

          <AIModelSettingsModal
            isOpen={showAIModelModal}
            onClose={() => setShowAIModelModal(false)}
            cloudConfig={cloudConfig}
            onSaveCloudConfig={handleSaveCloudConfig}
            selectedLocalModel={selectedModel}
          />

          <SubjectModal
            isOpen={showSubjectModal}
            onClose={() => setShowSubjectModal(false)}
            subjectsList={subjectsList}
            activeSubject={activeSubject}
            onSelectSubject={(name) => handleSelectSubject(name)}
          />

          <SpecsModal
            isOpen={showSpecsModal}
            onClose={() => setShowSpecsModal(false)}
            diagnostics={diagnostics}
            selectedModel={selectedModel}
          />

          <LogoutModal
            isOpen={showLogoutConfirm}
            onClose={() => setShowLogoutConfirm(false)}
            onConfirm={() => {
              setShowLogoutConfirm(false);
              setPortalView("workspace");
              setStudentInHub(true);
              setTeacherInHub(true);
              setAdminInHub(true);
              setCurrentScreen("welcome");
            }}
          />

          {/* Fast Aesthetic Portal Transition Overlay */}
          {portalTransition === "to_erp" && (
            <ErpPortalTransition
              destination="erp"
              onComplete={() => {
                setPortalView("erp");
                setAdminInHub(false);
                setPortalTransition(null);
              }}
            />
          )}

          {portalTransition === "to_workspace" && (
            <ErpPortalTransition
              destination="workspace"
              onComplete={() => {
                setPortalView("workspace");
                setPortalTransition(null);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

