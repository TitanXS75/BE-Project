"""Hybrid RAG Retrieval Engine using Reciprocal Rank Fusion (RRF)."""

from typing import List, Dict, Any, Optional
from pathlib import Path
import aiosqlite
from app.config import settings
from app.db.repository import SubjectRepository
from app.rag.vector.lancedb_client import LanceVectorStore
from app.ai.embeddings import EmbeddingGenerator


class HybridRetriever:
    def __init__(self, subject_id: str):
        self.subject_id = subject_id
        self.subject_dir = settings.SUBJECTS_DIR / subject_id
        self.db_path = self.subject_dir / "subject.db"
        self.vector_dir = self.subject_dir / "vectors"
        self.embedder = EmbeddingGenerator()

    async def retrieve(
        self,
        query: str,
        limit: int = 5,
        unit_id: Optional[str] = None,
        vector_weight: float = 0.6
    ) -> List[Dict[str, Any]]:
        """Performs hybrid vector + FTS search merged via Reciprocal Rank Fusion."""
        fts_results: List[Dict[str, Any]] = []
        vector_results: List[Dict[str, Any]] = []

        # 1. SQLite FTS5 Keyword Search
        if self.db_path.exists():
            try:
                async with aiosqlite.connect(self.db_path) as db:
                    db.row_factory = aiosqlite.Row
                    repo = SubjectRepository(db)
                    fts_results = await repo.search_chunks_fts(query, limit=limit * 2)
            except Exception:
                fts_results = []

        # 2. LanceDB Vector Semantic Search
        if self.vector_dir.exists():
            try:
                store = LanceVectorStore(self.vector_dir)
                if store.count() > 0:
                    query_vec = await self.embedder.generate_embedding(query)
                    vector_results = store.search(query_vec, limit=limit * 2, unit_id=unit_id)
            except Exception:
                vector_results = []

        # 3. Reciprocal Rank Fusion (RRF)
        return self._reciprocal_rank_fusion(fts_results, vector_results, limit=limit, k=60)

    @staticmethod
    def _reciprocal_rank_fusion(
        fts_chunks: List[Dict[str, Any]],
        vec_chunks: List[Dict[str, Any]],
        limit: int = 5,
        k: int = 60
    ) -> List[Dict[str, Any]]:
        scores: Dict[str, float] = {}
        chunks_map: Dict[str, Dict[str, Any]] = {}

        # Process Vector search rankings
        for rank, item in enumerate(vec_chunks, 1):
            cid = item.get("id") or item.get("chunk_id")
            if not cid:
                continue
            scores[cid] = scores.get(cid, 0.0) + (1.0 / (k + rank))
            chunks_map[cid] = {
                "id": cid,
                "text_content": item.get("text", "") or item.get("text_content", ""),
                "page_number": item.get("page_number", 1),
                "unit_id": item.get("unit_id"),
                "chapter_id": item.get("chapter_id"),
                "source_type": "vector",
                "score": scores[cid]
            }

        # Process FTS keyword search rankings
        for rank, item in enumerate(fts_chunks, 1):
            cid = item.get("id") or item.get("chunk_id")
            if not cid:
                continue
            scores[cid] = scores.get(cid, 0.0) + (1.0 / (k + rank))
            if cid in chunks_map:
                chunks_map[cid]["score"] = scores[cid]
                chunks_map[cid]["source_type"] = "hybrid"
            else:
                chunks_map[cid] = {
                    "id": cid,
                    "text_content": item.get("text_content", ""),
                    "page_number": item.get("page_number", 1),
                    "unit_id": item.get("unit_id"),
                    "chapter_id": item.get("chapter_id"),
                    "source_type": "keyword",
                    "score": scores[cid]
                }

        # Sort chunks by fused RRF score descending
        sorted_chunks = sorted(chunks_map.values(), key=lambda x: x["score"], reverse=True)
        return sorted_chunks[:limit]
