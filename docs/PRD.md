# 🎓 Product Requirements Document (PRD)

This document details the features, user roles, requirements, and development phases for the **AI-Based Curriculum-Aware Learning & Teaching System**.

---

## 📌 Overview & Target Audience

The platform is a local-first application designed for schools, colleges, universities, and coaching institutes. It allows teachers to bundle curriculum-specific materials into a portable, compressed package format (**`.rssh`**) that students can import and run offline using their own local AI models via **Ollama**.

Target Audience:
* Schools, Colleges, & Universities (especially those with restricted/unreliable internet access or strict data privacy policies)
* Individual Teachers & Professors
* Students seeking personalized, syllabus-aligned tutoring without subscription fees or cloud dependencies

---

## 🎯 Problem Statement

Traditional educational AI solutions suffer from several issues:
1. **Out of Syllabus answers:** Generic cloud-based AI assistants (like ChatGPT) do not understand a specific college's syllabus boundaries, leading to incorrect or irrelevant exam prep.
2. **"Chat with PDF" limitations:** Modern tools require students to upload the same dozens of massive textbooks and slides repeatedly, wasting bandwidth and compute.
3. **Bandwidth & Privacy constraints:** Many educational institutions suffer from slow local internet connections or forbid uploading intellectual academic resources to third-party cloud servers.
4. **Model dependency:** Forcing students to use a specific, expensive cloud model limits accessibility.

This platform solves these problems by **decoupling academic knowledge from the AI inference model**, using a portable subject package (`.rssh`) and local-first execution.

---

## 👥 User Modes & Features

The desktop application operates in two primary modes: **Teacher Mode** (for packaging curriculum and generating resources) and **Student Mode** (for importing packages and offline learning).

### 1. Teacher Mode
Enables educators to build, distribute, and utilize curriculum intelligence:
* **Subject Package Builder (`.rssh` Creator):**
  * Create a new subject module (e.g., "Machine Learning", "Data Structures").
  * Ingest academic material: Syllabus, Reference Textbooks, Lecture Notes, Previous Year Question Papers (PYQs), and Assignments.
  * Trigger AI RAG Processing: Extracts text, structures units/chapters, pre-calculates semantic embeddings, and compiles everything into a single, compact **`[Subject].rssh`** package.
  * Share the package easily via LAN, local network, USB pendrive, or cloud storage.
* **Teacher AI Assistants:**
  * **Notes & Slides Generator:** Automatically create chapter-wise revision summaries, lecture slide outlines (`.pptx` or `.pdf`), and reference handouts grounded strictly in the uploaded textbooks.
  * **Assignment Generator:** Create MCQs, practice worksheets, and lab instructions, complete with model answers and marks distribution.
  * **Question Paper Builder:** Generate balanced exam question papers matching syllabus weightage, target marks, and Bloom's Taxonomy cognitive levels, automatically avoiding out-of-syllabus content.
  * **PYQ Trend Analyzer:** Analyze uploaded past question papers to pinpoint historical trend patterns, important units, and marks distribution.

### 2. Student Mode
Provides a personalized, fully offline workspace grounded in the imported syllabus:
* **Subject Package Importer:** 
  * Import a **`.rssh`** package shared by the teacher. Immediately loads the subject syllabus, textbooks, notes, and pre-calculated retrieval indexes. No file re-processing required.
* **Local AI Model Manager:**
  * Connects directly to local **Ollama** service.
  * Allows students to pull and run lightweight open-source models (Qwen, Gemma, Llama, Mistral) directly inside the app shell.
* **Curriculum-Aware AI Tutor:**
  * Chat with the imported knowledge base. Supports prompts like *"Explain overfitting according to Unit 3"* or *"Give me a 5-mark answer for linear regression based on our lecture notes."*
  * RAG retrieves context from the `.rssh` database, formatting a prompt for the student's selected local Ollama model.
* **Study & Revision Tools:**
  * **PYQ Predictor:** View important chapters, repeated topics, and predicted questions based on the teacher's compiled PYQ data.
  * **Adaptive Practice Quizzes:** Take self-assessments generated from the curriculum, with local grading and explanations.
  * **Offline Flashcards:** Automatically extract key terms and formulas into flashcard decks for spaced repetition.

---

## 🚀 Development Roadmap

### Phase 1 — Local Application Foundation
* Develop the Tauri/Electron desktop wrapper running Next.js.
* Build a local SQLite database for subject structures and metadata.
* Implement the local file ingestion engine (PDF text extraction, unit structuring).

### Phase 2 — Local Vector Storage & RAG
* Integrate local vector search (e.g., LanceDB or `sqlite-vec`).
* Build a local embedding pipeline using a lightweight sentence-transformers model.
* Implement basic RAG retrieval using keyword (SQLite FTS) and vector similarity.

### Phase 3 — Subject Package Compiler (`.rssh`)
* Build the compiler mechanism that zips the local SQLite DB, LanceDB vector indexes, and metadata into the `.rssh` format.
* Implement the `.rssh` import/restore system to unpack and link subjects instantly.

### Phase 4 — Ollama Local AI Integration
* Integrate the desktop app with the local Ollama daemon.
* Implement the Local Model Manager (list, pull, delete models).
* Connect the RAG retrieval context with the local LLM inference API to support streaming responses.

### Phase 5 — Teacher AI Workspace
* Notes and lecture slides generator.
* Balanced exam question paper generator based on syllabus blueprints.
* PYQ analyzer and trend compiler.

### Phase 6 — Student AI Workspace
* Offline AI Tutor interface.
* Spaced-repetition flashcards and adaptive practice quiz generator.
* Study planner and progress tracker.

---

## 🧱 MVP Definition

The initial MVP will focus on the core offline package workflow:
1. Local desktop app shell with SQLite and local vector store.
2. Ingest PDFs (syllabus + notes + textbooks) and export as a `.rssh` package.
3. Import the `.rssh` package on another local machine.
4. Download/select a model via local Ollama.
5. Grounded RAG chat using the imported `.rssh` data and the local Ollama model.

---

## 🏆 Key Differentiator

* **Generic Cloud AI:** User Query ➔ Cloud API ➔ Generic Answer (requires internet, leaks privacy, prone to hallucinations).
* **Curriculum-Aware Portable AI (`.rssh`):** Teacher Compiles Curriculum (`.rssh`) ➔ Student Imports (`.rssh`) + Selects Local Model (Ollama) ➔ Local RAG Search ➔ Local Offline Inference ➔ Syllabus-Grounded Answer.

