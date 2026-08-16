from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict
from app.ai.teacher.exam_builder import ExamPaperBuilder
from app.ai.teacher.pyq_analyzer import PYQTrendAnalyzer
from app.ai.teacher.slide_generator import LectureSlideGenerator

router = APIRouter()


class QuestionPaperRequest(BaseModel):
    subject_id: str
    exam_title: str = "Final Examination"
    total_marks: int = 100
    duration_minutes: int = 180
    blooms_distribution: Optional[Dict[str, int]] = {
        "Remember": 20,
        "Understand": 30,
        "Apply": 30,
        "Analyze": 20
    }
    units_included: Optional[List[str]] = None


class LectureSlidesRequest(BaseModel):
    subject_id: str
    unit_title: str = "Unit 3: Core Foundations"
    topic: str
    target_slides_count: int = 5


@router.post("/question-papers", summary="Generate a balanced examination question paper")
async def generate_question_paper(payload: QuestionPaperRequest):
    """Generates a complete exam question paper mapped to syllabus units and Bloom's taxonomy."""
    try:
        builder = ExamPaperBuilder(subject_id=payload.subject_id)
        result = await builder.generate_exam_paper(
            exam_title=payload.exam_title,
            total_marks=payload.total_marks,
            duration_minutes=payload.duration_minutes,
            units_included=payload.units_included,
            blooms_weights=payload.blooms_distribution
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate exam paper: {str(e)}")


@router.post("/presentations", summary="Generate lecture presentation (.pptx file)")
async def generate_presentation_outline(payload: LectureSlidesRequest):
    """Generates structured presentation and exports a real .pptx PowerPoint file."""
    try:
        gen = LectureSlideGenerator(subject_id=payload.subject_id)
        result = await gen.generate_presentation(
            topic=payload.topic,
            unit_title=payload.unit_title,
            target_slides=payload.target_slides_count
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate lecture presentation: {str(e)}")


@router.get("/pyq-trends/{subject_id}", summary="Analyze topic recurrence and predicted questions")
async def get_pyq_trends(subject_id: str):
    """Returns frequency analysis of recurring questions and high-yield chapters."""
    try:
        analyzer = PYQTrendAnalyzer(subject_id=subject_id)
        result = await analyzer.analyze_trends()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze PYQ trends: {str(e)}")
