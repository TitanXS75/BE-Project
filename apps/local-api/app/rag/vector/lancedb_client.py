"""In-process LanceDB client for managing local subject vector stores."""

import lancedb
import pyarrow as pa
from pathlib import Path
from typing import List, Dict, Any, Optional


class LanceVectorStore:
    def __init__(self, vector_dir: Path, dimension: int = 384):
        self.vector_dir = vector_dir
        self.dimension = dimension
        self.vector_dir.mkdir(parents=True, exist_ok=True)
        self.db = lancedb.connect(str(self.vector_dir))
        self.table_name = "chunks"
        self._init_table()

    def _get_schema(self) -> pa.Schema:
        return pa.schema([
            pa.field("id", pa.string()),
            pa.field("document_id", pa.string()),
            pa.field("unit_id", pa.string()),
            pa.field("chapter_id", pa.string()),
            pa.field("text", pa.string()),
            pa.field("page_number", pa.int32()),
            pa.field("vector", pa.list_(pa.float32(), self.dimension))
        ])

    def _init_table(self):
        """Initializes or opens the chunks vector table."""
        if self.table_name not in self.db.table_names():
            schema = self._get_schema()
            self.table = self.db.create_table(self.table_name, schema=schema)
        else:
            self.table = self.db.open_table(self.table_name)

    def add_vectors(self, records: List[Dict[str, Any]]) -> int:
        """Adds vector embeddings and metadata to LanceDB."""
        if not records:
            return 0
        
        # Prepare records adhering to schema
        clean_records = []
        for r in records:
            clean_records.append({
                "id": str(r["id"]),
                "document_id": str(r.get("document_id", "")),
                "unit_id": str(r.get("unit_id", "") or ""),
                "chapter_id": str(r.get("chapter_id", "") or ""),
                "text": str(r.get("text", "")),
                "page_number": int(r.get("page_number", 1) or 1),
                "vector": [float(x) for x in r["vector"]]
            })
            
        self.table.add(clean_records)
        return len(clean_records)

    def search(self, query_vector: List[float], limit: int = 5, unit_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """Performs nearest-neighbor vector search."""
        query = self.table.search(query_vector).limit(limit)
        
        if unit_id:
            query = query.where(f"unit_id = '{unit_id}'")
            
        results = query.to_list()
        formatted = []
        for row in results:
            formatted.append({
                "id": row.get("id"),
                "document_id": row.get("document_id"),
                "unit_id": row.get("unit_id"),
                "chapter_id": row.get("chapter_id"),
                "text": row.get("text"),
                "page_number": row.get("page_number"),
                "distance": row.get("_distance", 0.0),
                "similarity": 1.0 - float(row.get("_distance", 0.0))
            })
        return formatted

    def count(self) -> int:
        """Returns total vector embeddings count in the table."""
        return self.table.count_rows()
