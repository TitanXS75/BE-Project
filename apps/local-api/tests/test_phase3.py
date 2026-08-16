"""Verification test suite for Phase 3: Document Ingestion, Hybrid RRF Retrieval, and Grounded AI Tutor."""

import asyncio
import shutil
from pathlib import Path
from app.config import settings
from app.db.connection import init_subject_database
from app.rag.ingestion.pipeline import IngestionPipeline
from app.rag.retrieval.retriever import HybridRetriever
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


async def test_document_ingestion():
    print("\n--- 1. Testing Document Ingestion Pipeline ---")
    subject_id = "test-ingestion-subject"
    subject_dir = settings.SUBJECTS_DIR / subject_id
    if subject_dir.exists():
        shutil.rmtree(subject_dir, ignore_errors=True)
    subject_dir.mkdir(parents=True, exist_ok=True)

    db_path = subject_dir / "subject.db"
    await init_subject_database(db_path)

    # Create a mock academic textbook chapter text file
    sample_text = """
    Chapter 3: Supervised Learning & Overfitting

    Supervised learning algorithms build a mathematical model of a set of data that contains both the inputs and the desired outputs.
    The data is known as training data, and consists of a set of training examples.

    Overfitting occurs when a statistical model or machine learning algorithm captures the noise of the data along with the underlying data pattern.
    It occurs when the model or the algorithm fits the data too well. Overfitting is a problem because it negatively impacts how well a model generalizes to new data.

    Regularization is a technique used to prevent overfitting by penalizing complex models.
    L1 Regularization, also known as Lasso Regression, adds a penalty equal to the absolute value of the magnitude of coefficients.
    L2 Regularization, or Ridge Regression, adds a penalty equal to the square of the magnitude of coefficients.
    
    Gradient Descent is an optimization algorithm used to find the values of parameters of a function that minimizes a cost function.
    """
    
    sample_file = subject_dir / "sample_chapter.txt"
    with open(sample_file, "w", encoding="utf-8") as f:
        f.write(sample_text.strip())

    pipeline = IngestionPipeline(subject_id=subject_id)
    result = await pipeline.process_document(
        file_path=sample_file,
        doc_type="Textbook",
        unit_id="unit_03"
    )

    assert result["status"] == "completed"
    assert result["chunks_created"] >= 1
    assert result["vectors_indexed"] >= 1
    print(f"Processed document: {result['filename']} -> Chunks: {result['chunks_created']}, Vectors: {result['vectors_indexed']}")
    print("[SUCCESS] Automated ingestion pipeline validated!")
    return subject_id


async def test_hybrid_retrieval(subject_id: str):
    print("\n--- 2. Testing Hybrid RAG Retrieval (Vector + FTS5 with RRF) ---")
    retriever = HybridRetriever(subject_id=subject_id)

    # Query 1: Keyword match for exact terminology
    results = await retriever.retrieve(query="L1 Regularization Lasso Ridge", limit=2)
    assert len(results) > 0, "Should retrieve chunks matching Regularization"
    assert any("Regularization" in chk["text_content"] for chk in results)
    print(f"Retrieved {len(results)} chunks for keyword query. Top match score: {results[0]['score']:.4f}")

    # Query 2: Conceptual match
    results_concept = await retriever.retrieve(query="Why does a model fail to generalize to new data?", limit=2)
    assert len(results_concept) > 0
    assert any("Overfitting" in chk["text_content"] for chk in results_concept)
    print(f"Retrieved {len(results_concept)} chunks for conceptual query.")
    print("[SUCCESS] Hybrid vector + FTS retrieval with RRF validated!")


def test_grounded_chat_api(subject_id: str):
    print("\n--- 3. Testing Grounded RAG Chat API Endpoint ---")
    response = client.post(
        "/api/v1/chat/stream",
        json={
            "subject_id": subject_id,
            "message": "Explain what L1 Regularization is and how it prevents overfitting",
            "parameters": {
                "marks_context": 5,
                "temperature": 0.2
            }
        }
    )
    assert response.status_code == 200
    assert "text/event-stream" in response.headers.get("content-type", "")
    content = response.text
    assert "event: chunk" in content
    assert "event: citations" in content
    print("Streamed response and citation events received successfully.")
    print("[SUCCESS] Grounded RAG Chat API validated!")


async def main():
    try:
        subject_id = await test_document_ingestion()
        await test_hybrid_retrieval(subject_id)
        test_grounded_chat_api(subject_id)
        print("\n=======================================================")
        print("[ALL PHASE 3 TESTS COMPLETED AND VERIFIED SUCCESSFULLY]")
        print("=======================================================")
    finally:
        test_dir = settings.SUBJECTS_DIR / "test-ingestion-subject"
        if test_dir.exists():
            shutil.rmtree(test_dir, ignore_errors=True)


if __name__ == "__main__":
    asyncio.run(main())
