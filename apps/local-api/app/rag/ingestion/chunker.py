"""Hierarchical Semantic Text Chunker for academic documents."""

import re
from typing import List, Dict, Any, Optional


class SemanticChunker:
    def __init__(
        self,
        chunk_size: int = 800,
        chunk_overlap: int = 150,
        separator: str = "\n\n"
    ):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.separator = separator

    def chunk_pages(
        self,
        pages: List[Dict[str, Any]],
        document_id: str,
        unit_id: Optional[str] = None,
        chapter_id: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Processes extracted pages into structured chunks with offsets and token counts."""
        all_chunks: List[Dict[str, Any]] = []
        chunk_idx = 0

        for page in pages:
            page_num = page.get("page_number", 1)
            page_text = page.get("text", "")
            
            if not page_text.strip():
                continue

            page_chunks = self._chunk_text(page_text)
            for chunk_content in page_chunks:
                words = chunk_content.split()
                all_chunks.append({
                    "document_id": document_id,
                    "unit_id": unit_id,
                    "chapter_id": chapter_id,
                    "chunk_index": chunk_idx,
                    "text_content": chunk_content,
                    "page_number": page_num,
                    "token_count": len(words)
                })
                chunk_idx += 1

        return all_chunks

    def _chunk_text(self, text: str) -> List[str]:
        if not text or len(text.strip()) == 0:
            return []

        # Split by paragraph first
        paragraphs = [p.strip() for p in text.split(self.separator) if p.strip()]
        chunks: List[str] = []
        current_chunk = ""

        for para in paragraphs:
            if len(current_chunk) + len(para) + len(self.separator) > self.chunk_size:
                if current_chunk:
                    chunks.append(current_chunk.strip())
                    # Overlap from end of current chunk
                    overlap_start = max(0, len(current_chunk) - self.chunk_overlap)
                    current_chunk = current_chunk[overlap_start:]

            if len(para) > self.chunk_size:
                # If paragraph itself is too large, split by sentences
                sentence_chunks = self._chunk_sentences(para)
                for sc in sentence_chunks:
                    chunks.append(sc)
                current_chunk = ""
            else:
                current_chunk += (self.separator if current_chunk else "") + para

        if current_chunk.strip():
            chunks.append(current_chunk.strip())

        return [c for c in chunks if len(c.strip()) > 20]

    def _chunk_sentences(self, paragraph: str) -> List[str]:
        sentence_regex = r'[^.!?]+[.!?]+'
        sentences = [s.strip() for s in re.findall(sentence_regex, paragraph) if s.strip()]
        if not sentences:
            sentences = [paragraph]

        chunks: List[str] = []
        curr = ""
        for s in sentences:
            if len(curr) + len(s) + 1 > self.chunk_size and curr:
                chunks.append(curr.strip())
                overlap_start = max(0, len(curr) - self.chunk_overlap)
                curr = curr[overlap_start:]
            curr += (" " if curr else "") + s

        if curr.strip():
            chunks.append(curr.strip())
        return chunks
