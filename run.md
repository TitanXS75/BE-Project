# Quick Start Guide: Running AXIOM Platform

This guide outlines how to start the local backend API server, local LLM inference engine (Ollama), and Next.js frontend web application.

---

## 📋 Prerequisites

Ensure you have the following installed on your machine:
* **Node.js** (v18.x or higher) & **npm**
* **Python** (v3.10, v3.11, v3.12, or v3.13)
* **Ollama** (Optional for local offline inference: [ollama.com](https://ollama.com))

---

## 🚀 Step-by-Step Launch

### 1. Start the Local Backend API (FastAPI)

Open a terminal window and run:

#### Windows (PowerShell):
```powershell
cd d:\BE-Project\apps\local-api
python -m uvicorn app.main:app --reload --port 8000
```

#### macOS / Linux:
```bash
cd apps/local-api
python3 -m uvicorn app.main:app --reload --port 8000
```

* **API Health check**: [http://127.0.0.1:8000/api/v1/health](http://127.0.0.1:8000/api/v1/health)
* **Interactive Swagger Documentation**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

### 2. Start the Frontend Web App (Next.js)

Open a second terminal window and run:

#### Windows / macOS / Linux:
```bash
cd apps/web
npm install
npm run dev
```

* Open your browser at: **[http://localhost:7575](http://localhost:7575)** *(or the port displayed in your terminal)*

---

### 3. (Optional) Run Local LLM Inference with Ollama

To enable local LLM generation without cloud dependencies:

1. Start the Ollama background daemon:
   ```bash
   ollama serve
   ```
2. Pull the recommended educational model:
   ```bash
   # Recommended for 16 GB RAM laptops
   ollama pull qwen2.5-coder:7b

   # Recommended for 8 GB RAM laptops
   ollama pull llama3.2:3b
   ```

*(Note: If Ollama is not currently active, the application automatically runs in local simulation mode for instant testing.)*

---

## 🌟 Onboarding Walkthrough

1. **Welcome Screen**: Review the local-first, air-gapped architecture features and click **"Get Started"**.
2. **System Diagnostics**: The platform automatically benchmarks your Python runtime, RAM, and CPU cores.
3. **Model & API Setup**: Select the optimal model for your machine and optionally provide a Google Gemini API key for hybrid guidance.
4. **Choose Role**: Enter as **Student** (AI Tutor, Flashcards, Quizzes, Feynman Teach-Back) or **Teacher** (Document Ingestion, Exam Blueprint Builder, Slide Generator, `.rssh` Exporter).

---

## 🛠️ Port Reference Summary

| Service | Technology | Default URL / Port |
| :--- | :--- | :--- |
| **Web Frontend** | Next.js 16 (React 19) | `http://localhost:7575` |
| **Backend API** | FastAPI (Python) | `http://127.0.0.1:8000` |
| **Interactive Docs** | OpenAPI / Swagger | `http://127.0.0.1:8000/docs` |
| **Local LLM Engine** | Ollama | `http://127.0.0.1:11434` |
