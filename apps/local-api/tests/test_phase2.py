"""Verification test suite for Phase 2: Local SQLite, FTS5, LanceDB, and .rssh Packaging."""

import asyncio
import shutil
from pathlib import Path
from app.config import settings
from app.db.schema import SUBJECT_DB_INIT_SQL
from app.db.connection import init_subject_database, init_app_database
from app.db.repository import SubjectRepository
from app.rag.vector.lancedb_client import LanceVectorStore
from app.rag.packaging.packager import SubjectPackager
import aiosqlite


async def test_sqlite_and_fts():
    print("\n--- 1. Testing SQLite Schema & FTS5 Index ---")
    test_subject_id = "test-ml-subject"
    test_dir = settings.SUBJECTS_DIR / test_subject_id
    if test_dir.exists():
        shutil.rmtree(test_dir)
    test_dir.mkdir(parents=True, exist_ok=True)

    db_path = test_dir / "subject.db"
    await init_subject_database(db_path)
    assert db_path.exists(), "subject.db must exist"

    async with aiosqlite.connect(db_path) as db:
        db.row_factory = aiosqlite.Row
        repo = SubjectRepository(db)

        # 1. Create Unit & Chapter
        unit_id = await repo.create_unit(unit_number=1, title="Foundations of Machine Learning")
        ch_id = await repo.create_chapter(unit_id=unit_id, chapter_number=1, title="Linear Regression & Regularization")

        # 2. Insert Document
        doc_id = await repo.insert_document(filename="ML_Textbook_Ch1.pdf", doc_type="Textbook", unit_id=unit_id)

        # 3. Insert Chunks into SQLite and FTS5 index
        chunks_inserted = await repo.insert_chunks([
            {
                "document_id": doc_id,
                "unit_id": unit_id,
                "chapter_id": ch_id,
                "text_content": "L1 regularization, also known as Lasso regression, adds an absolute penalty to feature weights to induce sparsity.",
                "page_number": 14
            },
            {
                "document_id": doc_id,
                "unit_id": unit_id,
                "chapter_id": ch_id,
                "text_content": "Gradient descent minimizes the cost function by taking steps proportional to the negative of the gradient.",
                "page_number": 18
            }
        ])
        assert chunks_inserted == 2, "Must insert 2 chunks"

        # 4. Test FTS5 Keyword Search
        search_results = await repo.search_chunks_fts("Lasso regularization")
        assert len(search_results) > 0, "FTS5 search should find Lasso chunk"
        assert "Lasso" in search_results[0]["text_content"]

    print("[SUCCESS] SQLite tables and FTS5 search validated!")
    return test_subject_id


def test_lancedb_vector_store(subject_id: str):
    print("\n--- 2. Testing In-Process LanceDB Vector Store ---")
    vector_dir = settings.SUBJECTS_DIR / subject_id / "vectors"
    store = LanceVectorStore(vector_dir=vector_dir, dimension=4)

    # Insert mock 4D vectors for testing
    records = [
        {
            "id": "chk_001",
            "document_id": "doc_01",
            "unit_id": "unit_01",
            "text": "L1 regularization and feature sparsity",
            "page_number": 14,
            "vector": [0.9, 0.1, 0.0, 0.0]
        },
        {
            "id": "chk_002",
            "document_id": "doc_01",
            "unit_id": "unit_01",
            "text": "Gradient descent and cost optimization",
            "page_number": 18,
            "vector": [0.0, 0.1, 0.9, 0.2]
        }
    ]

    added = store.add_vectors(records)
    assert added == 2, "Must add 2 vectors to LanceDB"
    assert store.count() == 2, "LanceDB row count must be 2"

    # Search for nearest vector to [0.85, 0.15, 0.0, 0.0]
    results = store.search([0.85, 0.15, 0.0, 0.0], limit=1)
    assert len(results) == 1
    assert results[0]["id"] == "chk_001", "Vector search must retrieve closest match"

    print("[SUCCESS] LanceDB in-process vector store validated!")


async def test_packaging_engine(subject_id: str):
    print("\n--- 3. Testing .rssh Packaging (Export, Verify, Unpack) ---")
    # Initialize global app database
    await init_app_database()

    # 1. Export package
    rssh_path, manifest = await SubjectPackager.compile_package(subject_id)
    assert rssh_path.exists(), ".rssh ZIP package must be created"
    assert manifest.stats.units_count >= 1
    assert manifest.stats.chunks_count == 2
    assert manifest.stats.vectors_count == 2
    print(f"Exported package: {rssh_path.name} (Size: {rssh_path.stat().st_size} bytes)")

    # 2. Verify package
    is_valid, msg, verified_manifest = SubjectPackager.verify_package(rssh_path)
    assert is_valid, f"Package verification failed: {msg}"
    assert verified_manifest.package_id == subject_id

    # 3. Test Unpacking into fresh destination
    extracted_dir, imported_manifest = await SubjectPackager.unpack_package(rssh_path)
    assert (extracted_dir / "manifest.json").exists()
    assert (extracted_dir / "subject.db").exists()
    assert (extracted_dir / "vectors").exists()
    assert imported_manifest.package_id == subject_id

    print("[SUCCESS] .rssh packaging, verification, and unpacking engine validated!")


async def main():
    try:
        subject_id = await test_sqlite_and_fts()
        test_lancedb_vector_store(subject_id)
        await test_packaging_engine(subject_id)
        print("\n=======================================================")
        print("[ALL PHASE 2 TESTS COMPLETED AND VERIFIED SUCCESSFULLY]")
        print("=======================================================")
    finally:
        # Cleanup test files
        test_dir = settings.SUBJECTS_DIR / "test-ml-subject"
        if test_dir.exists():
            shutil.rmtree(test_dir, ignore_errors=True)
        rssh_file = settings.UPLOADS_DIR / "test-ml-subject.rssh"
        if rssh_file.exists():
            rssh_file.unlink()


if __name__ == "__main__":
    asyncio.run(main())
