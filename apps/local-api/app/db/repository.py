"""Repository layer for SQLite database CRUD and FTS5 operations."""

import aiosqlite
import uuid
import json
from typing import Optional, List, Dict, Any


class SubjectRepository:
    def __init__(self, db: aiosqlite.Connection):
        self.db = db
        self.db.row_factory = aiosqlite.Row

    @staticmethod
    def _row_dict(row: Any) -> Dict[str, Any]:
        if isinstance(row, aiosqlite.Row):
            return dict(row)
        return {k: row[k] for k in row.keys()} if hasattr(row, "keys") else {}

    # ── Units & Chapters ──
    async def create_unit(self, unit_number: int, title: str, description: Optional[str] = None, unit_id: Optional[str] = None) -> str:
        uid = unit_id or f"unit_{unit_number}_{uuid.uuid4().hex[:6]}"
        await self.db.execute(
            "INSERT INTO units (id, unit_number, title, description) VALUES (?, ?, ?, ?)",
            (uid, unit_number, title, description)
        )
        await self.db.commit()
        return uid

    async def list_units(self) -> List[Dict[str, Any]]:
        async with self.db.execute("SELECT * FROM units ORDER BY unit_number ASC") as cursor:
            rows = await cursor.fetchall()
            return [dict(row) for row in rows]

    async def create_chapter(self, unit_id: str, chapter_number: int, title: str, description: Optional[str] = None) -> str:
        cid = f"ch_{chapter_number}_{uuid.uuid4().hex[:6]}"
        await self.db.execute(
            "INSERT INTO chapters (id, unit_id, chapter_number, title, description) VALUES (?, ?, ?, ?, ?)",
            (cid, unit_id, chapter_number, title, description)
        )
        await self.db.commit()
        return cid

    async def list_chapters(self, unit_id: Optional[str] = None) -> List[Dict[str, Any]]:
        if unit_id:
            query = "SELECT * FROM chapters WHERE unit_id = ? ORDER BY chapter_number ASC"
            params = (unit_id,)
        else:
            query = "SELECT * FROM chapters ORDER BY chapter_number ASC"
            params = ()
        async with self.db.execute(query, params) as cursor:
            rows = await cursor.fetchall()
            return [dict(row) for row in rows]

    # ── Documents ──
    async def insert_document(self, filename: str, doc_type: str, file_size_bytes: int = 0, unit_id: Optional[str] = None, doc_id: Optional[str] = None) -> str:
        did = doc_id or f"doc_{uuid.uuid4().hex[:8]}"
        await self.db.execute(
            "INSERT INTO documents (id, filename, doc_type, file_size_bytes, unit_id) VALUES (?, ?, ?, ?, ?)",
            (did, filename, doc_type, file_size_bytes, unit_id)
        )
        await self.db.commit()
        return did

    async def list_documents(self) -> List[Dict[str, Any]]:
        async with self.db.execute("SELECT * FROM documents ORDER BY created_at DESC") as cursor:
            rows = await cursor.fetchall()
            return [dict(row) for row in rows]

    # ── Chunks & FTS5 Search ──
    async def insert_chunks(self, chunks_data: List[Dict[str, Any]]) -> int:
        """Inserts text chunks into the chunks table and indexes them in FTS5."""
        count = 0
        for item in chunks_data:
            cid = item.get("id") or f"chk_{uuid.uuid4().hex[:8]}"
            await self.db.execute(
                """INSERT INTO chunks (id, document_id, unit_id, chapter_id, chunk_index, text_content, page_number, token_count)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
                (
                    cid,
                    item["document_id"],
                    item.get("unit_id"),
                    item.get("chapter_id"),
                    item.get("chunk_index", 0),
                    item["text_content"],
                    item.get("page_number"),
                    item.get("token_count", len(item["text_content"].split()))
                )
            )
            # Insert into FTS5 virtual table
            await self.db.execute(
                "INSERT INTO chunks_fts (chunk_id, text_content) VALUES (?, ?)",
                (cid, item["text_content"])
            )
            count += 1

        await self.db.commit()
        return count

    async def search_chunks_fts(self, query: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Performs fast full-text search against the SQLite FTS5 table."""
        # Sanitize query for FTS5
        clean_query = "".join(c for c in query if c.isalnum() or c.isspace()).strip()
        if not clean_query:
            return []

        # Split into terms with prefix matching
        terms = " OR ".join(f'"{term}"*' for term in clean_query.split() if len(term) > 1)
        if not terms:
            terms = f'"{clean_query}"*'

        sql = """
        SELECT c.*, bm25(chunks_fts) as rank_score
        FROM chunks_fts fts
        JOIN chunks c ON c.id = fts.chunk_id
        WHERE chunks_fts MATCH ?
        ORDER BY rank_score ASC
        LIMIT ?
        """
        async with self.db.execute(sql, (terms, limit)) as cursor:
            rows = await cursor.fetchall()
            return [dict(row) for row in rows]

    # ── PYQ Questions ──
    async def insert_pyq(self, year: int, question_text: str, marks: int = 5, exam_term: str = "Final", unit_id: Optional[str] = None) -> str:
        qid = f"pyq_{uuid.uuid4().hex[:8]}"
        await self.db.execute(
            "INSERT INTO pyq_questions (id, year, exam_term, question_text, marks, unit_id) VALUES (?, ?, ?, ?, ?, ?)",
            (qid, year, exam_term, question_text, marks, unit_id)
        )
        await self.db.commit()
        return qid

    async def list_pyqs(self, unit_id: Optional[str] = None) -> List[Dict[str, Any]]:
        if unit_id:
            query = "SELECT * FROM pyq_questions WHERE unit_id = ? ORDER BY year DESC"
            params = (unit_id,)
        else:
            query = "SELECT * FROM pyq_questions ORDER BY year DESC"
            params = ()
        async with self.db.execute(query, params) as cursor:
            rows = await cursor.fetchall()
            return [dict(row) for row in rows]

    # ── Quizzes ──
    async def insert_quiz(self, title: str, questions: List[Dict[str, Any]], unit_id: Optional[str] = None, difficulty: str = "medium") -> str:
        qid = f"quiz_{uuid.uuid4().hex[:8]}"
        await self.db.execute(
            "INSERT INTO quizzes (id, unit_id, title, difficulty, questions_json) VALUES (?, ?, ?, ?, ?)",
            (qid, unit_id, title, difficulty, json.dumps(questions))
        )
        await self.db.commit()
        return qid

    async def list_quizzes(self) -> List[Dict[str, Any]]:
        async with self.db.execute("SELECT * FROM quizzes ORDER BY created_at DESC") as cursor:
            rows = await cursor.fetchall()
            result = []
            for row in rows:
                item = dict(row)
                item["questions"] = json.loads(item["questions_json"])
                result.append(item)
            return result
