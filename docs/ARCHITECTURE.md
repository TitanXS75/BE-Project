# 🏗️ System Architecture

This document describes the high-level system architecture, user flows, directory structure, and deployment strategies of the platform.

---

## 💡 Core Data Ingestion & Retrieval Flow

The system processes and retrieves knowledge using the following pipeline:

```text
Institution -> Upload Academic Content (Syllabus, Notes, PYQs)
     │
     ▼
Document Processing Pipeline (Text extraction, OCR, metadata tagging)
     │
     ▼
Embedding Generation (pgvector + PostgreSQL)
     │
     ▼
Retrieval & Reranking (Metadata filtering + Hybrid search)
     │
     ▼
AI Agent Layer (Teacher, Student, PYQ, Question Paper agents)
     │
     ▼
Modes (Teacher dashboard / Student workspace)
```

---

## 🔐 Academic Data Isolation

Data isolation is enforced at the database and query levels to prevent mixing resources between different institutions or departments.

* Even if Subject names are identical (e.g., "Machine Learning" in College A and College B), their syllabi and reference books are isolated.
* Every query is filtered using metadata tags:
  ```json
  {
    "institution_id": "...",
    "department_id": "...",
    "course_id": "...",
    "semester_id": "...",
    "subject_id": "...",
    "academic_year": "..."
  }
  ```

---

## 🤖 Multi-Agent Architecture

Instead of running a single large prompt, the AI engine coordinates tasks across specialized agents led by an Orchestrator:

```text
                    AI Orchestrator
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
 Student Agent       Teacher Agent       Admin Agent
        │                  │
        ├── Tutor          ├── Notes
        ├── Quiz           ├── PPT
        ├── PYQ            ├── Assignment
        └── Roadmap        └── Lesson Plan
```

### Specialized Agents
* **Document Agent:** Handles indexing, chunking, and file validation.
* **PYQ Analysis Agent:** Computes question frequencies and exam trends.
* **Question Generation Agent:** Creates exam sheets adhering to Bloom's taxonomy.
* **Evaluation Agent:** Automatically grades quizzes and answers.
* **Citation Agent:** Validates LLM responses against document source chunks to prevent hallucinations.
* **Study Planner Agent:** Evaluates dates and outlines study roadmaps.

---

## 🏗️ Project Directory Structure

The project is structured as a monorepo containing the following layout:

```text
smart-learning-platform/
├── apps/
│   ├── web/                     # Next.js frontend (auth, dashboards, chat)
│   └── api/                     # FastAPI backend (endpoints, services, worker tasks)
├── packages/
│   ├── ui/                      # Shared UI component library
│   ├── types/                   # Common TypeScript definitions
│   └── config/                  # Linter and builder configuration
├── infrastructure/
│   ├── docker/                  # Local configuration files for Docker
│   ├── postgres/                # PostgreSQL schema and migration hooks
│   └── nginx/                   # Reverse proxy configuration
├── docs/                        # Specifications and design documentation
├── scripts/                     # Ingestion scripts & DB seeding tools
├── docker-compose.yml           # Local multi-container development setup
└── package.json                 # Monorepo workspace configuration
```

---

## ⚡ Performance Strategy

* **Asynchronous Jobs:** Large documents are processed out-of-band by background workers (Redis + Celery or ARQ) to keep the API responsive.
* **Result Caching:** Frequently generated materials (such as PYQ statistics, standard notes, and class structure) are cached in Redis.
* **Streaming Responses:** AI chat interactions and long-form document generation utilize HTTP streaming (Server-Sent Events) to minimize perceived latency.

---

## 📦 Local Development Environment

The development stack runs inside isolated Docker containers:

* **`web`**: Next.js Node container.
* **`api`**: FastAPI Python container.
* **`postgres`**: Relational store with the `pgvector` extension enabled.
* **`redis`**: Cache layer and task queue broker.
* **`worker`**: Celery/ARQ task processor.
* **`storage`**: Local MinIO container simulating S3 object storage.

---

## 🌳 Git & Testing Strategy

### Branching
* `main`: Production-ready code.
* `develop`: Active integration branch.
* `feature/*`: Short-lived branches for specific tasks (e.g., `feature/rag-pipeline`).

### Testing
* **Frontend:** Vitest for units/components, Playwright for end-to-end user journeys.
* **Backend:** Pytest for endpoint unit tests, integration tests, and RAG retrieval quality regression tracking.
```

---

## 🛡️ Security Requirements

* **Role-Based Access Control (RBAC):** Permissions are validated at the route, API, and row levels.
* **Tenant Isolation:** Explicit database partition checks ensure data from Institution A is never mixed or leaked to queries from Institution B.
* **Secrets Management:** Sensitive keys (LLM APIs, database connection strings, S3 credentials) are loaded strictly via background environment configuration, never exposed to client bundles.
