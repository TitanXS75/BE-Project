"""SQLite Database Schema Definitions for Subject Package (subject.db) and Global App (app.db)."""

# Subject package relational schema (stored in subject.db)
SUBJECT_DB_INIT_SQL = """
-- 1. Units Table
CREATE TABLE IF NOT EXISTS units (
    id TEXT PRIMARY KEY,
    unit_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Chapters / Topics Table
CREATE TABLE IF NOT EXISTS chapters (
    id TEXT PRIMARY KEY,
    unit_id TEXT NOT NULL,
    chapter_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(unit_id) REFERENCES units(id) ON DELETE CASCADE
);

-- 3. Documents Ingested Table
CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    doc_type TEXT NOT NULL, -- Syllabus, Textbook, Notes, PYQ, Assignment
    file_size_bytes INTEGER DEFAULT 0,
    unit_id TEXT,
    chunk_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(unit_id) REFERENCES units(id) ON DELETE SET NULL
);

-- 4. Text Chunks Table
CREATE TABLE IF NOT EXISTS chunks (
    id TEXT PRIMARY KEY,
    document_id TEXT NOT NULL,
    unit_id TEXT,
    chapter_id TEXT,
    chunk_index INTEGER NOT NULL,
    text_content TEXT NOT NULL,
    page_number INTEGER,
    token_count INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(document_id) REFERENCES documents(id) ON DELETE CASCADE,
    FOREIGN KEY(unit_id) REFERENCES units(id) ON DELETE SET NULL,
    FOREIGN KEY(chapter_id) REFERENCES chapters(id) ON DELETE SET NULL
);

-- 5. Full-Text Search (FTS5) Virtual Table for Fast Keyword Retrieval
CREATE VIRTUAL TABLE IF NOT EXISTS chunks_fts USING fts5(
    chunk_id UNINDEXED,
    text_content,
    tokenize='porter unicode61'
);

-- 6. Previous Year Questions (PYQs)
CREATE TABLE IF NOT EXISTS pyq_questions (
    id TEXT PRIMARY KEY,
    year INTEGER NOT NULL,
    exam_term TEXT, -- Midterm, Final, End-Sem
    question_text TEXT NOT NULL,
    marks INTEGER DEFAULT 5,
    unit_id TEXT,
    chapter_id TEXT,
    frequency_score REAL DEFAULT 1.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(unit_id) REFERENCES units(id) ON DELETE SET NULL
);

-- 7. Pre-generated Quizzes & Question Banks
CREATE TABLE IF NOT EXISTS quizzes (
    id TEXT PRIMARY KEY,
    unit_id TEXT,
    title TEXT NOT NULL,
    difficulty TEXT DEFAULT 'medium',
    questions_json TEXT NOT NULL, -- JSON array of question objects
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(unit_id) REFERENCES units(id) ON DELETE SET NULL
);

-- Indexes for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_chunks_doc_id ON chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_chunks_unit_id ON chunks(unit_id);
CREATE INDEX IF NOT EXISTS idx_chapters_unit_id ON chapters(unit_id);
CREATE INDEX IF NOT EXISTS idx_pyq_unit_id ON pyq_questions(unit_id);
"""

# Global Application DB schema (stored in app.db)
APP_DB_INIT_SQL = """
CREATE TABLE IF NOT EXISTS imported_subjects (
    package_id TEXT PRIMARY KEY,
    subject_name TEXT NOT NULL,
    academic_year TEXT,
    version TEXT,
    teacher_name TEXT,
    institution_name TEXT,
    folder_path TEXT NOT NULL,
    imported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_chat_history (
    id TEXT PRIMARY KEY,
    subject_id TEXT NOT NULL,
    conversation_id TEXT NOT NULL,
    role TEXT NOT NULL, -- user / assistant
    content TEXT NOT NULL,
    citations_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_quiz_attempts (
    id TEXT PRIMARY KEY,
    subject_id TEXT NOT NULL,
    quiz_id TEXT NOT NULL,
    score_percentage REAL NOT NULL,
    answers_json TEXT NOT NULL,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"""
