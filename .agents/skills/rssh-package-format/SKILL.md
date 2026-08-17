---
name: rssh-package-format
description: Specification for the .rssh (Relational Syllabus Subject Hub) portable course archive standard, packaging pipelines, checksum verification, and SQLite schemas.
---

# .rssh (Relational Syllabus Subject Hub) Package Standard

## When to Use This Skill
Load this skill ONLY when developing package compilation, file extraction, archive validation, or syllabus import/export in `apps/local-api` or `packages/common`.

---

## 1. Archive Container Structure
An `.rssh` file is a compressed zip container with the following internal layout:
```text
course_package.rssh
├── manifest.json            # Version, subject metadata, checksums, author info
├── curriculum.sqlite3       # Relational curriculum tree (Units, Topics, Flashcards)
├── vectors.lance/           # Embedded LanceDB vector table directory
│   ├── _indices/
│   └── data/
└── assets/                  # Extracted diagrams, figures, and document PDFs
```

---

## 2. Manifest Schema (`manifest.json`)
```json
{
  "rssh_version": "1.0.0",
  "subject_id": "cs401-machine-learning",
  "subject_name": "CS401 Machine Learning",
  "instructor": "Prof. S. Gupta",
  "created_at": "2026-08-17T20:00:00Z",
  "embedding_model": "all-MiniLM-L6-v2",
  "units_count": 5,
  "checksum_sha256": "8f4d9ae31b2..."
}
```

---

## 3. Ingestion & Packaging Pipeline
1. **Extraction**: Parse input course files (PDFs, DOCX, PPTX) using local PyMuPDF and python-docx.
2. **Chunking & Indexing**: Generate vector embeddings and persist directly into `vectors.lance/`.
3. **Relational Build**: Populate `curriculum.sqlite3` with subject, unit, and flashcard records.
4. **Validation & Compression**: Calculate SHA-256 integrity hash and package into final `.rssh` bundle.
