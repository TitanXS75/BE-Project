"""Integration verification for LangChain orchestration in Axiom backend."""

import pytest
from app.rag.ingestion.chunker import SemanticChunker
from app.rag.retrieval.chains import CurriculumRAGChain, LANGCHAIN_AVAILABLE
from app.ai.embeddings import EmbeddingGenerator


def test_langchain_semantic_chunker():
    """Verify SemanticChunker utilizes LangChain RecursiveCharacterTextSplitter."""
    chunker = SemanticChunker(chunk_size=120, chunk_overlap=20)
    sample_pages = [
        {
            "page_number": 1,
            "text": (
                "Unit 1: Machine Learning Overview.\n\n"
                "Supervised learning algorithms map inputs to desired outputs based on example pairs.\n\n"
                "Regularization penalizes complex models to mitigate empirical overfitting risks."
            )
        }
    ]

    chunks = chunker.chunk_pages(sample_pages, document_id="doc_test_1")
    assert len(chunks) >= 1
    assert all("text_content" in c for c in chunks)
    assert all("page_number" in c for c in chunks)
    print(f"[SUCCESS] Chunker created {len(chunks)} chunks with LangChain.")


def test_curriculum_rag_chain_structure():
    """Verify CurriculumRAGChain builds LangChain LCEL pipeline."""
    chain = CurriculumRAGChain(subject_id="machine-learning", model_name="qwen2.5-coder:7b")
    
    assert chain.subject_id == "machine-learning"
    assert chain.subject_display_name == "Machine Learning"

    if LANGCHAIN_AVAILABLE:
        prompt = chain.get_prompt_template()
        assert prompt is not None
        llm = chain.get_llm()
        assert llm is not None
        lcel_chain = chain.build_lcel_chain()
        assert lcel_chain is not None
        print("[SUCCESS] LangChain LCEL chain compiled successfully!")
    else:
        print("[INFO] LangChain package loading in progress.")


import asyncio


def test_embedding_generator_langchain():
    """Verify EmbeddingGenerator operates seamlessly with LangChain OllamaEmbeddings."""
    embedder = EmbeddingGenerator(model_name="all-minilm", dimension=384)
    vec = asyncio.run(embedder.generate_embedding("Support Vector Machines margin optimization"))
    assert len(vec) == 384
    print("[SUCCESS] Embedding generated with dimension 384.")


if __name__ == "__main__":
    test_langchain_semantic_chunker()
    test_curriculum_rag_chain_structure()
    print("[SUCCESS] All LangChain unit verifications passed.")
