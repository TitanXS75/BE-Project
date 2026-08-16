"""Document Text Extractor for PDF, TXT, and Markdown files."""

from pathlib import Path
from typing import List, Dict, Any
import pypdf


class DocumentExtractor:
    @staticmethod
    def extract_text_from_file(file_path: Path) -> List[Dict[str, Any]]:
        """Extracts text page-by-page from a file.
        Returns a list of dicts: [{'page_number': 1, 'text': '...'}]
        """
        ext = file_path.suffix.lower()
        
        if ext == ".pdf":
            return DocumentExtractor._extract_from_pdf(file_path)
        elif ext in [".txt", ".md", ".markdown"]:
            return DocumentExtractor._extract_from_text(file_path)
        else:
            # Fallback to plain text read
            return DocumentExtractor._extract_from_text(file_path)

    @staticmethod
    def _extract_from_pdf(file_path: Path) -> List[Dict[str, Any]]:
        pages = []
        try:
            reader = pypdf.PdfReader(str(file_path))
            for idx, page in enumerate(reader.pages, 1):
                raw_text = page.extract_text() or ""
                clean_text = DocumentExtractor._clean_text(raw_text)
                if clean_text:
                    pages.append({
                        "page_number": idx,
                        "text": clean_text
                    })
        except Exception as e:
            raise ValueError(f"Failed to extract PDF text from {file_path.name}: {str(e)}")
        return pages

    @staticmethod
    def _extract_from_text(file_path: Path) -> List[Dict[str, Any]]:
        try:
            with open(file_path, "r", encoding="utf-8", errors="replace") as f:
                content = f.read()
            clean = DocumentExtractor._clean_text(content)
            return [{"page_number": 1, "text": clean}] if clean else []
        except Exception as e:
            raise ValueError(f"Failed to read text file {file_path.name}: {str(e)}")

    @staticmethod
    def _clean_text(text: str) -> str:
        """Removes excessive whitespace and null bytes."""
        text = text.replace("\x00", "")
        lines = [line.strip() for line in text.splitlines()]
        clean_lines = [l for l in lines if l]
        return "\n".join(clean_lines)
