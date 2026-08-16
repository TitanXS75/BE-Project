# 🏗️ System Architecture

This document describes the high-level system architecture, local processing flows, directory structures, and deployment strategies of the **AI-Based Curriculum-Aware Learning & Teaching System**.

---

## 💡 Local Data Ingestion, Distribution, & Retrieval Flow

The system operates strictly on a local-first model, dividing tasks between package compilation (Teacher) and package ingestion/inference (Student).

### 1. Subject Package Compilation Flow (Teacher Mode)
```text
Teacher Ingests Documents (Syllabus, Textbooks, Notes, PYQs)
      │
      ▼
Document Parsing Pipeline (Local text extraction, OCR)
      │
      ▼
Semantic Chunking & Embedding Generation (Local Sentence-Transformers)
      │
      ▼
Relational Data Writing (Syllabus tree & PYQ analysis stored in SQLite)
      │
      ▼
Vector Index Compilation (LanceDB / sqlite-vec database)
      │
      ▼
Subject Packaging (Zip container compiled as [Subject].rssh)
```

### 2. Offline Distribution & Import Flow
```text
[Teacher shares Subject.rssh] (via USB, LAN, or Cloud)
      │
      ▼
[Student App: Import Subject]
      │
      ▼
Extracts [Subject].rssh to Local AppData directory
      │
      ▼
Mounts SQLite Database (subject structure & metadata)
      │
      ▼
Links Vector Index (LanceDB embedding lookup)
```

### 3. Local RAG Query & Inference Flow (Student Mode)
```text
Student inputs query: "Explain overfitting according to Unit 3"
      │
      ▼
App queries SQLite (syllabus structure) & LanceDB (semantic chunks)
      │
      ▼
Retrieve relevant context chunks with source verification
      │
      ▼
Construct prompt: Grounded Context + User Query + Syllabus Rules
      │
      ▼
Post prompt to local Ollama Daemon (/api/generate or /api/chat)
      │
      ▼
Stream response word-by-word via SSE (Server-Sent Events) to UI
```

---

## 🔐 Subject Package Isolation

Because this platform is local-first, data isolation is physical rather than logical. 
* There are no complex tenant multi-tenancy rules. 
* Every Subject is self-contained inside its own **`.rssh`** package.
* Unpacking a package creates a localized workspace database. The frontend queries the active workspace path, ensuring zero overlap between different subjects (e.g., "Machine Learning" is completely isolated from "Data Structures").

---

## 🤖 Specialized Local Agent Architecture

To manage multi-dimensional queries (like PYQ trend matching and custom quiz generation), the local FastAPI backend orchestrates tasks using specialized agents:

```text
                        Local AI Agent Controller
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         ▼                         ▼                         ▼
   Tutor Agent                Teacher Agent              PYQ Agent
(Offline QA, explanation)   (Generate QPs, slides)    (Predict frequencies)
```

* **Tutor Agent:** Handles grounding queries using the imported SQLite chunks, selecting the active Ollama model.
* **Teacher Agent:** Coordinates layout structures for slide generation (`.pptx`) and applies blueprints to draft PDF exam question papers.
* **PYQ Agent:** Computes question frequencies and mappings based on syllabus units.

---

## 🏗️ Project Directory Structure

The project is structured as a monorepo setup optimized for desktop packaging:

```text
smart-learning-platform/
├── apps/
│   ├── desktop/                 # Tauri desktop container configurations
│   ├── web/                     # Next.js local frontend application UI
│   └── local-api/               # Local FastAPI backend (python scripts, ingestion, RAG, Ollama client)
├── packages/
│   ├── ui/                      # Shared UI styling and component library
│   └── common/                  # Common TypeScript definitions & schemas
├── docs/                        # Specifications and design documentation
├── scripts/                     # Local packaging & build scripts (compiling Tauri desktop apps)
├── package.json                 # Monorepo configuration
└── README.md                    # Core project description
```

---

## ⚡ Local Performance & In-Memory Operations

Operating on local hardware requires lightweight resource footprints:
* **No Heavy Task Brokers:** Large files are processed directly on the client machine using python's `asyncio` or FastAPI background tasks, eliminating the need for Redis, Celery, or heavy brokers.
* **SQLite In-Process Storage:** Storing relational indexes inside local SQLite ensures sub-millisecond retrieval latency without running a Postgres server.
* **Vector Vector Operations:** Using `LanceDB` (serverless, disk-based vector storage) or `sqlite-vec` (sqlite extension) allows vector lookups directly in-process.
* **Streaming Response:** Connects to Ollama's stream parameter, updating the frontend in real-time.

---

## 📦 Local Development Environment

The development stack runs directly on the local machine:
* **`Ollama`**: Running locally on the developer's computer.
* **`local-api`**: FastAPI Python server executing locally on `localhost:8000`.
* **`web`**: Next.js client running locally on `localhost:3000` (wrapped inside the Tauri window frame).
* **`desktop`**: Tauri desktop client rendering the Next.js UI and executing system-level IPC handlers (handling imports, exports, and directory dialogs).

---

## 🛡️ Security & Privacy

* **100% Data Ownership:** All textbooks, syllabi, notes, and academic queries remain on the local machine. No documents are uploaded to cloud servers.
* **Sandbox Storage:** The application reads and writes data strictly within app-specific user directories:
  * **Windows:** `%APPDATA%\smart-learning\`
  * **macOS:** `~/Library/Application Support/smart-learning/`
  * **Linux:** `~/.config/smart-learning/`
* **Package Signatures:** Option for institutions to digitally sign `.rssh` packages to guarantee curriculum integrity and prevent tampering.

