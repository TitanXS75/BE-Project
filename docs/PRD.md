# 🎓 Product Requirements Document (PRD)

This document details the features, user roles, requirements, and development phases for the AI-Powered Smart Learning Platform.

---

## 📌 Overview & Target Audience

The platform transforms institution-specific documents (syllabus, notes, books, assignments, question papers) into a curriculum-aware AI assistant. It serves:
* Schools, Colleges, & Universities
* Coaching Institutes & Training Organizations
* Individual Educators & Academic Admins

---

## 🎯 Problem Statement

Traditional AI assistants provide generic answers that:
1. Do not follow the university syllabus.
2. Miss institution-specific terminology or topics.
3. Waste teachers' time on manual notes, assignments, and exam preparation.
4. Fail to analyze Previous Year Question Papers (PYQs) systematically.
5. Create duplicate or out-of-syllabus questions when generated manually.

This platform solves these problems by grounding AI interactions in **institution-specific academic data**.

---

## 👥 User Roles & Features

### 1. Institution Administrator
Manages the academic environment and metadata hierarchy:
* Create institutions, departments, academic years, semesters, courses, and subjects.
* Add and manage user accounts (teachers and students) with specific role-based permissions.
* Configure curriculum standards and subject regulations.

### 2. Teacher Mode
Enables educators to automate and enhance their academic workflow:
* **Content Management:** Upload subject materials (syllabus, notes, textbooks, PYQs, assignments) organized by subject, chapter, or unit.
* **AI Notes Generator:** Generate chapter/unit summaries, revision guides, formulas, definitions, and exam-oriented notes.
* **Presentation Generator:** Create lecture slide presentations (`.pptx` or `.pdf`) containing title slides, learning objectives, content, summaries, and review questions.
* **Assignment Generator:** Generate practice worksheets, case-study assignments, MCQs, or lab sheets. Includes generating model answer keys, mark distributions, difficulty rankings, and Bloom's Taxonomy classification.
* **Question Paper Generator:** Build balanced exam papers based on syllabus rules, units, target marks, and Bloom's taxonomy. Automatically avoids duplicate or out-of-syllabus questions.

### 3. Student Mode
Provides a personalized AI learning workspace for students:
* **AI Tutor:** Answer academic questions using university-specific context, supporting prompts like *"Explain overfitting according to my syllabus"* or *"Give me a 5-mark explanation."*
* **Syllabus Notes:** Create flashcards, revision guides, chapter summaries, and formula sheets.
* **PYQ Analysis & Prediction:** Auto-analyze past question papers to find topic frequencies, repetition trends, and mark distributions, marking topics as High/Medium/Low priority.
* **Quiz & Mock Test System:** Generate and take adaptive self-assessments (MCQs, true/false, written questions) with automated grading and detail explanations.
* **AI Study Roadmap:** Build structured, calendar-based preparation schedules based on exam dates, current preparation level, and available study hours.

---

## 🚀 Development Roadmap

### Phase 1 — Foundation
* Core authentication & authorization (RBAC).
* Basic database schema (Institutions, Courses, Subjects, Users).
* Admin dashboards and file upload services.

### Phase 2 — RAG MVP
* End-to-end document processing pipeline.
* Vector embedding & ingestion into PostgreSQL with pgvector.
* Basic "Ask your Subject" RAG chat with metadata filtering.

### Phase 3 — Teacher AI
* Chapter-wise Notes Generator.
* Quiz & Assignment Generator.
* Question Paper Generator with constraint validation.

### Phase 4 — Student AI
* Personal AI Tutor & revision tools.
* Previous Year Question (PYQ) analysis & topic prioritizer.
* Mock test system with automated assessment.

### Phase 5 — Advanced Intelligence
* Dynamic AI Study Roadmaps.
* Weakness detection and personalized content recommendation.
* Learning analytics dashboard for students & teachers.

### Phase 6 — Advanced Agents
* Introduction of specialized multi-agents (Tutor Agent, PYQ Agent, Teacher Agent, Study Planner Agent).
* Agent orchestrator routing user tasks dynamically.

### Phase 7 — Institutional Platform
* Multi-tenancy isolation.
* Departmental analytics & system usage auditing.
* Subscription management.

---

## 🧱 MVP Definition

The first working version (MVP) will consist of:
1. Relational database with Authentication (RBAC) and basic academic hierarchy.
2. Subject-wise Document Upload (PDF, DOCX, TXT).
3. Basic RAG Ingestion & Vector Search (pgvector).
4. AI Tutor Chat with syllabus grounding.
5. Teacher Notes Generator.
6. Basic PYQ frequency analysis.

---

## 🏆 Key Differentiator

* **Generic AI:** User Question -> General LLM -> Generic Answer (unverified, potentially out of syllabus).
* **This Platform:** User Question -> Academic Context Retrieval -> Syllabus Constraints Filter -> Hybrid Vector/Keyword Search -> Reranking -> LLM Reasoning -> Citations Verification -> Curriculum-Specific Answer.
