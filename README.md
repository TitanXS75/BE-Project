# 🎓 AI-Powered Smart Learning Platform

> An AI-powered academic intelligence platform that transforms an institution's syllabus, textbooks, notes, previous-year question papers, assignments, and other learning resources into a curriculum-aware AI system for **Teachers and Students**.

---

## 📌 Overview

The **AI-Powered Smart Learning Platform** is designed for educational institutions (schools, colleges, universities, training centers) to index their academic content into an AI-powered knowledge base. Unlike generic AI models, this platform becomes an expert on the specific curriculum provided.

---

## 📚 Documentation Portal

To make the platform's specifications easier to read and maintain, the documentation has been split into the following sections:

* 📄 **[Product Requirements (PRD)](docs/PRD.md)** — Core features, user roles (Admin, Teacher, Student), question paper generation, PYQ analysis, and project roadmaps.
* 🏗️ **[System Architecture](docs/ARCHITECTURE.md)** — Core pipeline, agent coordination architecture, project directory structure, security, and infrastructure deployment strategies.
* 🧠 **[AI & RAG Design](docs/AI-RAG.md)** — Retrieval-Augmented Generation pipeline, query understanding, hybrid search, reranking, source verification, and AI evaluation metrics.
* 🗄️ **[Database Design](docs/DATABASE.md)** — Database schema entities (relational, vector), object storage structure, and background job processing.
* 📡 **[API Documentation](docs/API.md)** — Endpoint structure, versioning strategy, and real-time streaming chat integration.

---

## 🛠️ Recommended Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js, TypeScript, Tailwind CSS, shadcn/ui, React Query, Recharts |
| **Backend** | Python, FastAPI, Pydantic, SQLAlchemy, Alembic |
| **AI / Orchestration** | LangGraph, LlamaIndex / LangChain, pgvector, Reranking Models |
| **Database & Storage** | PostgreSQL, Redis (Celery/ARQ), Cloudinary (Free Tier) / S3-compatible Object Storage (Cloudflare R2/MinIO) |
| **DevOps** | Docker, Nginx, GitHub Actions |

---

## 🚀 Getting Started

The platform's local development environment is containerized using Docker Compose.

1. Clone the repository:
   ```bash
   git clone https://github.com/TitanXS75/BE-Project.git
   cd BE-Project
   ```
2. Set up your environment variables:
   ```bash
   cp .env.example .env
   ```
3. Start the services:
   ```bash
   docker compose up -d
   ```

Refer to the [System Architecture](docs/ARCHITECTURE.md) and [AI & RAG Design](docs/AI-RAG.md) documents for detailed setup and design rules.
