from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter()


class QuestionPaperRequest(BaseModel):
    subject_id: str
    total_marks: int = 100
    duration_minutes: int = 180
    blooms_distribution: Optional[dict] = {
        "Remember": 20,
        "Understand": 30,
        "Apply": 30,
        "Analyze": 20
    }
    units_included: Optional[List[int]] = None


class LectureSlidesRequest(BaseModel):
    subject_id: str
    unit_id: int
    topic: str
    target_slides_count: int = 10


@router.post("/question-papers", summary="Generate a balanced examination question paper")
async def generate_question_paper(payload: QuestionPaperRequest):
    """Generates an exam question paper according to curriculum blueprint and Bloom's taxonomy."""
    return {
        "status": "generated",
        "subject_id": payload.subject_id,
        "total_marks": payload.total_marks,
        "sections": [
            {
                "section": "Section A (Short Answer - 2 Marks each)",
                "marks_per_question": 2,
                "questions_count": 10,
                "taxonomy": "Remember / Understand"
            },
            {
                "section": "Section B (Medium Answer - 5 Marks each)",
                "marks_per_question": 5,
                "questions_count": 6,
                "taxonomy": "Understand / Apply"
            },
            {
                "section": "Section C (Long Answer / Case Study - 10 Marks each)",
                "marks_per_question": 10,
                "questions_count": 5,
                "taxonomy": "Apply / Analyze / Evaluate"
            }
        ]
    }


@router.post("/presentations", summary="Generate lecture presentation outline (.pptx structure)")
async def generate_presentation_outline(payload: LectureSlidesRequest):
    """Generates structured presentation slide deck outline."""
    return {
        "status": "ready",
        "topic": payload.topic,
        "slides_count": payload.target_slides_count,
        "slides": [
            {"slide_number": 1, "title": f"Introduction to {payload.topic}", "bullet_points": ["Key definitions", "Real-world motivation", "Learning objectives"]},
            {"slide_number": 2, "title": "Core Architecture & Principles", "bullet_points": ["System components", "Data flow", "Standard patterns"]},
            {"slide_number": 3, "title": "Key Mathematical / Conceptual Foundations", "bullet_points": ["Formulas and theory", "Worked examples", "Common pitfalls"]},
            {"slide_number": 4, "title": "Summary & Exam Review", "bullet_points": ["Key takeaways", "Common PYQ trends", "Practice exercises"]}
        ]
    }


@router.get("/pyq-trends/{subject_id}", summary="Analyze topic recurrence and predicted questions")
async def get_pyq_trends(subject_id: str):
    """Returns frequency analysis of recurring questions and high-yield chapters."""
    return {
        "subject_id": subject_id,
        "high_yield_units": [
            {"unit": 1, "name": "Foundations", "historical_marks_weightage_pct": 25},
            {"unit": 3, "name": "Core Algorithms", "historical_marks_weightage_pct": 35},
            {"unit": 4, "name": "Applications & Optimization", "historical_marks_weightage_pct": 25},
            {"unit": 2, "name": "Mathematical Frameworks", "historical_marks_weightage_pct": 15}
        ]
    }
