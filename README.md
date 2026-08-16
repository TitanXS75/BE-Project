# 🎓 AI-Based Curriculum-Aware Learning & Teaching System

> A local-first AI education platform designed for colleges, schools, and coaching institutes. It enables teachers to package their complete subject curriculum into portable knowledge files (`.rssh`) that students run entirely offline with their own local AI models (via Ollama).

---

## 📌 The Central Concept

Unlike traditional generic AI models or cloud-based "chat with PDF" apps, this platform decouples the **academic intelligence** from the **AI reasoning engine**. 

```text
  [Teacher Uploads Academic Material] (Syllabus, Textbooks, Notes, PYQs)
                  │
                  ▼
          [AI RAG Ingestion]
                  │
                  ▼
    [Subject Package: Subject.rssh] ───(Shared via USB, LAN, or Cloud)───┐
                                                                        │
                                                                        ▼
                                                              [Student Imports Package]
                                                                        │
                                                                        ▼
                                                            [Runs Local AI via Ollama]
                                                          (Qwen, Gemma, Llama, Mistral)
```

1. **Teacher Mode (Subject Packaging):** A teacher imports course documents (syllabus, books, notes, assignments, previous year question papers - PYQs) and packages them into a portable, structured Subject Knowledge Package with the **`.rssh`** extension.
2. **Student Mode (Offline Import & Study):** The student imports the `Subject.rssh` file. The local app mounts the curriculum database and vector search indexes.
3. **Local AI Execution:** The student runs queries locally using Ollama. RAG retrieval extracts syllabus-grounded context from the imported `.rssh` file and feeds it to the local AI model (e.g., Qwen, Gemma, Llama, Mistral) to produce accurate, curriculum-guided responses.

---

## 📚 Documentation Portal

The project specification is organized into modular sections:

* 📄 **[Product Requirements (PRD)](docs/PRD.md)** — User flows, features (Teacher/Student modes), PYQ analysis, question paper generator, and development phases.
* 🏗️ **[System Architecture](docs/ARCHITECTURE.md)** — Core local processing pipelines, directory structure, `.rssh` package details, and local runtime architecture.
* 🧠 **[AI & RAG Design](docs/AI-RAG.md)** — Local RAG pipeline, chunking strategies, hybrid search, and local model provider integration (Ollama).
* 🗄️ **[Database Design](docs/DATABASE.md)** — Local SQLite database structure, vector storage schema (sqlite-vec/LanceDB), and the `.rssh` file layout.
* 📡 **[API Documentation](docs/API.md)** — Local server API endpoints, package export/import, Ollama model manager, and SSE streaming chat.

---

## 🛠️ Recommended Local-First Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Desktop Shell** | Tauri (or Electron) | Cross-platform desktop application container |
| **Frontend UI** | Next.js, React, Tailwind CSS, shadcn/ui | Beautiful, responsive, interactive UI |
| **Local Backend** | Python, FastAPI, Pydantic | Ingestion pipeline, local API endpoints, RAG helper |
| **Relational Database** | SQLite | Lightweight database stored inside `.rssh` |
| **Vector Search** | LanceDB or sqlite-vec | Desktop-friendly embedding database stored inside `.rssh` |
| **AI Inference** | Ollama | Offline local model runner (Qwen, Gemma, Llama, Mistral) |

---

## 🚀 Getting Started (Development Setup)

To run the local-first application stack in a simulated developer environment:

1. Clone the repository:
   ```bash
   git clone https://github.com/TitanXS75/BE-Project.git
   cd BE-Project
   ```

2. Make sure you have [Ollama](https://ollama.com) installed and running on your machine.

3. Run the development environment:
   ```bash
   npm install
   npm run dev
   ```
   *(Note: This boots up the Tauri desktop container, the local FastAPI backend server, and points to the running local Ollama service.)*
