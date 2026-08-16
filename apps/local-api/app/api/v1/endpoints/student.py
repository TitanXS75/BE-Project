from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from app.ai.student.quiz_generator import QuizGenerator
from app.ai.student.teach_back import TeachBackEvaluator
from app.ai.student.flashcard_generator import FlashcardGenerator

router = APIRouter()


class QuizGenerationRequest(BaseModel):
    subject_id: str
    topic: Optional[str] = None
    unit_id: Optional[str] = None
    questions_count: int = 4
    difficulty: str = "medium"


class QuizGradeRequest(BaseModel):
    questions: List[Dict[str, Any]]
    submitted_answers: Dict[str, str]


class TeachBackEvaluationRequest(BaseModel):
    subject_id: str
    concept: str
    student_explanation: str


class FlashcardDeckRequest(BaseModel):
    subject_id: str
    unit_id: Optional[str] = None
    count: int = 5


class StudyPlanRequest(BaseModel):
    days_remaining: int = 14
    daily_hours: float = 2.0


@router.post("/quizzes/generate", summary="Generate adaptive practice quiz from curriculum")
async def generate_quiz(payload: QuizGenerationRequest):
    """Generates MCQs grounded in the active curriculum unit and textbooks."""
    try:
        generator = QuizGenerator(subject_id=payload.subject_id)
        result = await generator.generate_quiz(
            topic=payload.topic,
            unit_id=payload.unit_id,
            questions_count=payload.questions_count,
            difficulty=payload.difficulty
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate quiz: {str(e)}")


@router.post("/quizzes/grade", summary="Grade submitted quiz answers")
async def grade_quiz(payload: QuizGradeRequest):
    """Grades student answers and provides instant diagnostic feedback."""
    try:
        return QuizGenerator.grade_quiz(
            questions=payload.questions,
            submitted_answers=payload.submitted_answers
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to grade quiz: {str(e)}")


@router.post("/teach-back/evaluate", summary="Evaluate student explanation using Feynman technique")
async def evaluate_teach_back(payload: TeachBackEvaluationRequest):
    """Assesses student grasp against curriculum truth and identifies misconceptions."""
    try:
        evaluator = TeachBackEvaluator(subject_id=payload.subject_id)
        result = await evaluator.evaluate_explanation(
            concept=payload.concept,
            student_explanation=payload.student_explanation
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to evaluate teach-back: {str(e)}")


@router.post("/flashcards/generate", summary="Generate spaced repetition flashcards")
async def generate_flashcards(payload: FlashcardDeckRequest):
    """Extracts key formulas, definitions, and theorems into flashcards."""
    try:
        gen = FlashcardGenerator(subject_id=payload.subject_id)
        result = await gen.generate_deck(
            unit_id=payload.unit_id,
            count=payload.count
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate flashcards: {str(e)}")


@router.post("/study-plan", summary="Generate adaptive study schedule")
async def create_study_plan(payload: StudyPlanRequest):
    """Generates day-by-day revision schedule with milestones."""
    try:
        return FlashcardGenerator.generate_study_plan(
            days_remaining=payload.days_remaining,
            daily_hours=payload.daily_hours
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate study plan: {str(e)}")
