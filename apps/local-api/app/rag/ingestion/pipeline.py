"""End-to-end Document Ingestion and Vectorization Pipeline."""

import aiosqlite
from pathlib import Path
from typing import Dict, Any, Optional
from app.config import settings
from app.db.connection import init_subject_database
from app.db.repository import SubjectRepository
from app.rag.ingestion.extractor import DocumentExtractor
from app.rag.ingestion.chunker import SemanticChunker
from app.ai.embeddings import EmbeddingGenerator
from app.rag.vector.lancedb_client import LanceVectorStore


class IngestionPipeline:
    def __init__(self, subject_id: str):
        self.subject_id = subject_id
        self.subject_dir = settings.SUBJECTS_DIR / subject_id
        self.subject_dir.mkdir(parents=True, exist_ok=True)
        self.db_path = self.subject_dir / "subject.db"
        self.vector_dir = self.subject_dir / "vectors"
        self.chunker = SemanticChunker(chunk_size=700, chunk_overlap=120)
        self.embedder = EmbeddingGenerator()

    async def process_document(
        self,
        file_path: Path,
        doc_type: str,
        unit_id: Optional[str] = None,
        chapter_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Runs end-to-end ingestion: Extraction -> Chunking -> SQLite & FTS5 Indexing -> Embedding -> LanceDB."""
        if not self.db_path.exists():
            await init_subject_database(self.db_path)

        # 1. Extract text page-by-page
        pages = DocumentExtractor.extract_text_from_file(file_path)
        if not pages:
            raise ValueError(f"No readable text could be extracted from {file_path.name}")

        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            repo = SubjectRepository(db)

            # 2. Register Document in SQLite
            doc_id = await repo.insert_document(
                filename=file_path.name,
                doc_type=doc_type,
                file_size_bytes=file_path.stat().st_size,
                unit_id=unit_id
            )

            # 3. Chunk text semantically
            chunks = self.chunker.chunk_pages(
                pages=pages,
                document_id=doc_id,
                unit_id=unit_id,
                chapter_id=chapter_id
            )

            # 4. Insert chunks into SQLite and FTS5
            await repo.insert_chunks(chunks)

            # Update document chunk count
            await db.execute("UPDATE documents SET chunk_count = ? WHERE id = ?", (len(chunks), doc_id))
            await db.commit()

        # 5. Generate Vector Embeddings and Index in LanceDB
        store = LanceVectorStore(self.vector_dir)
        vector_records = []
        for chk in chunks:
            emb = await self.embedder.generate_embedding(chk["text_content"])
            vector_records.append({
                "id": chk.get("id") or f"chk_{doc_id}_{chk['chunk_index']}",
                "document_id": doc_id,
                "unit_id": unit_id or "",
                "chapter_id": chapter_id or "",
                "text": chk["text_content"],
                "page_number": chk.get("page_number", 1),
                "vector": emb
            })

        vectors_added = store.add_vectors(vector_records)

        return {
            "status": "completed",
            "document_id": doc_id,
            "filename": file_path.name,
            "pages_extracted": len(pages),
            "chunks_created": len(chunks),
            "vectors_indexed": vectors_added
        }
