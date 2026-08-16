"""Local Embedding Generation Engine supporting Ollama Embeddings and Deterministic Local Vectors."""

import httpx
import math
import hashlib
from typing import List
from app.config import settings


class EmbeddingGenerator:
    def __init__(self, model_name: str = "all-minilm", dimension: int = 384):
        self.model_name = model_name
        self.dimension = dimension

    async def generate_embedding(self, text: str) -> List[float]:
        """Generates embedding vector for a single text chunk."""
        # 1. Attempt to generate using local Ollama daemon
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                resp = await client.post(
                    f"{settings.OLLAMA_BASE_URL}/api/embeddings",
                    json={"model": self.model_name, "prompt": text}
                )
                if resp.status_code == 200:
                    emb = resp.json().get("embedding")
                    if emb and len(emb) == self.dimension:
                        return emb
                    elif emb:
                        # Pad or trim to expected dimension
                        return self._adjust_dimension(emb, self.dimension)
        except Exception:
            pass

        # 2. Fallback to deterministic local text embedding
        return self._generate_deterministic_embedding(text, self.dimension)

    async def generate_batch(self, texts: List[str]) -> List[List[float]]:
        """Generates embeddings for a batch of text chunks."""
        embeddings = []
        for text in texts:
            emb = await self.generate_embedding(text)
            embeddings.append(emb)
        return embeddings

    @staticmethod
    def _generate_deterministic_embedding(text: str, dim: int = 384) -> List[float]:
        """Creates a normalized semantic hash vector from text tokens and n-grams."""
        vector = [0.0] * dim
        words = text.lower().split()
        
        if not words:
            return vector

        # Map word hashes into vector dimensions
        for i, word in enumerate(words):
            h = int(hashlib.md5(word.encode("utf-8")).hexdigest(), 16)
            idx = h % dim
            sign = 1.0 if ((h >> 4) & 1) == 0 else -1.0
            weight = 1.0 / (math.log(i + 2) + 1.0)
            vector[idx] += sign * weight

        # Also hash bigrams for phrase semantics
        for i in range(len(words) - 1):
            bigram = f"{words[i]}_{words[i+1]}"
            h = int(hashlib.sha256(bigram.encode("utf-8")).hexdigest(), 16)
            idx = h % dim
            sign = 1.0 if ((h >> 3) & 1) == 0 else -1.0
            vector[idx] += sign * 1.5

        # Normalize to unit length (L2 norm)
        norm = math.sqrt(sum(x * x for x in vector))
        if norm > 0:
            vector = [x / norm for x in vector]

        return vector

    @staticmethod
    def _adjust_dimension(vec: List[float], target_dim: int) -> List[float]:
        if len(vec) == target_dim:
            return vec
        elif len(vec) > target_dim:
            return vec[:target_dim]
        else:
            return vec + [0.0] * (target_dim - len(vec))
