"""Verification test suite for Phase 4: Teacher Studio Tools."""

import asyncio
import shutil
from pathlib import Path
from app.config import settings
from app.db.connection import init_subject_database
from app.ai.teacher.exam_builder import ExamPaperBuilder
from app.ai.teacher.pyq_analyzer import PYQTrendAnalyzer
from app.ai.teacher.slide_generator import LectureSlideGenerator
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


async def test_exam_paper_builder():
    print("\n--- 1. Testing Exam Question Paper Builder ---")
    subject_id = "test-teacher-subject"
    builder = ExamPaperBuilder(subject_id=subject_id)
    paper = await builder.generate_exam_paper(
        exam_title="Mid-Semester Exam",
        total_marks=100,
        duration_minutes=180
    )

    assert paper["total_marks"] == 100
    assert len(paper["sections"]) == 3
    assert paper["sections"][0]["marks_per_question"] == 2
    assert paper["sections"][1]["marks_per_question"] == 5
    assert paper["sections"][2]["marks_per_question"] == 10
    assert "markdown_preview" in paper
    assert "# Test Teacher Subject" in paper["markdown_preview"]
    print(f"Generated exam paper with {len(paper['sections'])} sections and markdown preview.")
    print("[SUCCESS] Bloom's taxonomy exam blueprint builder validated!")
    return subject_id


async def test_pyq_analyzer(subject_id: str):
    print("\n--- 2. Testing PYQ Trend Analyzer ---")
    analyzer = PYQTrendAnalyzer(subject_id=subject_id)
    analysis = await analyzer.analyze_trends()

    assert analysis["subject_id"] == subject_id
    assert len(analysis["unit_distribution"]) >= 1
    assert len(analysis["high_probability_predictions"]) >= 1
    print(f"Analyzed PYQ trends. Identified {len(analysis['high_probability_predictions'])} high-probability exam topics.")
    print("[SUCCESS] PYQ trend analyzer validated!")


async def test_slide_generator(subject_id: str):
    print("\n--- 3. Testing PowerPoint (.pptx) Slide Generator ---")
    generator = LectureSlideGenerator(subject_id=subject_id)
    res = await generator.generate_presentation(
        topic="L1 and L2 Regularization",
        unit_title="Unit 3: Supervised Learning"
    )

    assert res["status"] == "generated"
    pptx_path = Path(res["file_path"])
    assert pptx_path.exists(), f"File {pptx_path} must exist on disk"
    assert pptx_path.stat().st_size > 5000, "PPTX file size should be > 5KB"
    assert res["slides_count"] >= 4
    print(f"Created PPTX file: {res['filename']} (Size: {res['size_bytes']} bytes, Slides: {res['slides_count']})")
    print("[SUCCESS] PowerPoint presentation generator validated!")


def test_teacher_api_endpoints(subject_id: str):
    print("\n--- 4. Testing Teacher API Endpoints ---")
    # 1. Question papers endpoint
    qp_res = client.post(
        "/api/v1/teacher/question-papers",
        json={"subject_id": subject_id, "exam_title": "End-Term Paper", "total_marks": 100}
    )
    assert qp_res.status_code == 200
    assert len(qp_res.json()["sections"]) == 3

    # 2. Presentations endpoint
    pres_res = client.post(
        "/api/v1/teacher/presentations",
        json={"subject_id": subject_id, "topic": "Gradient Descent Optimization"}
    )
    assert pres_res.status_code == 200
    assert pres_res.json()["status"] == "generated"

    # 3. PYQ trends endpoint
    pyq_res = client.get(f"/api/v1/teacher/pyq-trends/{subject_id}")
    assert pyq_res.status_code == 200
    assert "unit_distribution" in pyq_res.json()

    print("[SUCCESS] All Teacher API endpoints validated!")


async def main():
    try:
        subject_id = await test_exam_paper_builder()
        await test_pyq_analyzer(subject_id)
        await test_slide_generator(subject_id)
        test_teacher_api_endpoints(subject_id)
        print("\n=======================================================")
        print("[ALL PHASE 4 TESTS COMPLETED AND VERIFIED SUCCESSFULLY]")
        print("=======================================================")
    finally:
        test_dir = settings.SUBJECTS_DIR / "test-teacher-subject"
        if test_dir.exists():
            shutil.rmtree(test_dir, ignore_errors=True)


if __name__ == "__main__":
    asyncio.run(main())
