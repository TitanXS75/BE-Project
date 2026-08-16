# 🗄️ Database Design

This document details the local relational schemas, local vector storage, local file paths, and the physical structure of the portable **`.rssh`** package.

---

## 🗺️ Entity-Relationship Hierarchy

Inside the local application, each subject workspace relies on a relational and vector storage model mapped to the active curriculum:

* **Subject Workspace:** Structured as a localized system: `Subject ➔ Unit/Chapter ➔ Documents (Syllabus, Textbooks, Notes, PYQs)`.
* **RAG Content:** Documents partition into `Chunks` which link to `Embeddings` (stored in the vector index).
* **Local Student Data:** Stored in a separate user profile database to track local model settings, chat history, quiz attempts, and learning analytics.

---

## 📡 Local Database Strategy (SQLite)

To ensure the application runs offline with zero setup, **SQLite** is used as the relational database engine.

### Benefits of SQLite
* **Zero-Configuration:** Runs as a simple file database, eliminating the need to install or run a PostgreSQL database server.
* **Portability:** The database file is lightweight and can be zipped directly into the `.rssh` package.
* **Speed:** Offers sub-millisecond local query lookups for relational metadata and text chunks.
* **Full-Text Search:** Uses SQLite's native `FTS5` module to perform instant keyword queries.

---

## 💾 The `.rssh` Subject Package Structure

A **Smart Subject Package** (`.rssh`) is a compressed ZIP archive that bundles everything needed to run curriculum RAG queries offline. It contains the following structure:

```text
Subject-Package.rssh (ZIP archive)
├── manifest.json            # JSON file describing package metadata
├── subject.db               # SQLite database file containing relational schema
└── vectors/                 # Vector index database folder
    ├── data.lance           # LanceDB index segments (or sqlite-vec data tables)
    └── metadata.json        # Index properties and dimensions
```

### 1. `manifest.json` Schema
Stores package-level metadata used by the app to validate and display the package during import:
```json
{
  "package_id": "sub-101-ml",
  "subject_name": "Machine Learning",
  "academic_year": "2026-2027",
  "version": "1.0.0",
  "teacher_name": "Dr. Sarah Jenkins",
  "institution_name": "Department of Computer Science, University of Technology",
  "compiled_at": "2026-08-16T12:00:00Z",
  "embedding_model": "all-MiniLM-L6-v2",
  "embedding_dimension": 384
}
```

### 2. `subject.db` Relational Tables
SQLite contains the following core tables:
* `units`: ID, title, unit_number, description.
* `chapters`: ID, unit_id, title, chapter_number.
* `documents`: ID, file_name, file_type (Syllabus, Notes, Textbook, PYQ, Assignment), file_size, chunk_count.
* `chunks`: ID, document_id, unit_id, chapter_id, text_content, page_number.
* `pyq_questions`: ID, year, question_text, marks, unit_id, chapter_id.

---

## 🪓 Vector Database Strategy (LanceDB / sqlite-vec)

Vector index storage runs locally:
* **LanceDB:** A developer-friendly, serverless vector database written in Rust. It stores vectors directly in flat files (saved in the `vectors/` directory of the `.rssh` archive), enabling fast local vector distance searches (`L2` or `Cosine`).
* **Alternative (sqlite-vec):** A lightweight SQLite extension that allows vector tables to reside directly inside the same `subject.db` file.

---

## 📁 Local Filesystem Sandbox Storage

When a user imports a package, the application unpacks the `.rssh` contents into the local sandbox folder (e.g., `%APPDATA%\smart-learning\` on Windows).

### Sandbox Layout
```text
smart-learning/
├── app.db                       # Local user settings, downloaded models list, and chat logs
└── subjects/                    # Extracted subject packages
    ├── machine-learning/
    │   ├── manifest.json
    │   ├── subject.db
    │   └── vectors/
    └── data-structures/
        ├── manifest.json
        ├── subject.db
        └── vectors/
```

* **No cloud storage dependency:** Original textbook files are stored in the local sandbox or kept packaged. Raw PDFs are not stored inside SQLite to prevent file bloat.
* **Signed packages:** Digital signature files may be added to `manifest.json` to prevent students from modifying the underlying databases.

---

## ⚡ Background Tasks
Because the application runs on a single user's desktop, we replace Celery and Redis with simple in-app asynchronous tasks.
* **Ingestion Worker:** Python `asyncio` background tasks handle text extraction and vector generation.
* **Progress Tracking:** The FastAPI backend pushes chunking and embedding progress to the Tauri frontend in real-time via WebSockets or polling, allowing teachers to monitor package creation.

