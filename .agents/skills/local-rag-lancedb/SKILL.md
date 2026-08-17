---
name: local-rag-lancedb
description: LanceDB local vector database patterns, sentence-transformers embedding pipelines, cosine similarity search, and IVF-PQ indexing for air-gapped syllabus RAG.
---

# Local RAG & LanceDB Vector Engine

## When to Use This Skill
Load this skill ONLY when developing, optimizing, or debugging vector search, embedding models, semantic chunking, or LanceDB tables in `apps/local-api` or shared RAG packages.

---

## 1. LanceDB Table Schema
```python
import lancedb
import pyarrow as pa

schema = pa.schema([
    pa.field("vector", pa.list_(pa.float32(), 384)),  # all-MiniLM-L6-v2 embedding dimension
    pa.field("chunk_id", pa.string()),
    pa.field("text_content", pa.string()),
    pa.field("subject_id", pa.string()),
    pa.field("unit_number", pa.int32()),
    pa.field("topic_title", pa.string()),
    pa.field("source_doc", pa.string()),
    pa.field("page_number", pa.int32()),
    pa.field("confidence_score", pa.float32())
])
```

---

## 2. Chunking & Overlap Best Practices
- **Chunk Size**: 350–500 tokens (optimal for textbook paragraphs and mathematical derivations).
- **Overlap**: 15% sliding window overlap to maintain context across chapter section boundaries.
- **Metadata Tagging**: Always attach unit and source document identifiers during chunking.

---

## 3. Query & Cosine Search Strategy
```python
# Bounded unit query
tbl = db.open_table(f"subject_{subject_id}")
results = tbl.search(query_embedding) \
    .where(f"unit_number = {target_unit}") \
    .limit(3) \
    .to_list()
```
- Restrict candidate chunks strictly by active syllabus unit to prevent cross-topic hallucinations.
- Target latency: `< 35ms` for local IVF-PQ search on standard laptop SSDs.
