from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import uuid
import json
import aiosqlite
from app.config import settings
from app.db.connection import init_app_database
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
    subject_id: Optional[str] = "general"
    quiz_id: Optional[str] = None
    questions: List[Dict[str, Any]]
    submitted_answers: Dict[str, Any]


class TeachBackEvaluationRequest(BaseModel):
    subject_id: str
    concept: str
    student_explanation: str
    cloud_api_key: Optional[str] = None
    cloud_provider: Optional[str] = "gemini"
    cloud_model: Optional[str] = None


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
    """Grades student answers, computes diagnostic feedback, and records attempt in SQLite."""
    try:
        graded = QuizGenerator.grade_quiz(
            questions=payload.questions,
            submitted_answers=payload.submitted_answers
        )

        # Record quiz attempt in app.db for persistent progress tracking
        try:
            quiz_id = payload.quiz_id or f"qz_{uuid.uuid4().hex[:8]}"
            subject_id = payload.subject_id or "general"
            score_pct = graded.get("score_percentage", 0.0)
            attempt_id = f"att_{uuid.uuid4().hex[:8]}"
            answers_json = json.dumps(payload.submitted_answers)

            db_path = settings.APP_DB_PATH
            if not db_path.exists():
                await init_app_database()

            async with aiosqlite.connect(db_path) as db:
                await db.execute(
                    """
                    INSERT INTO user_quiz_attempts (id, subject_id, quiz_id, score_percentage, answers_json)
                    VALUES (?, ?, ?, ?, ?)
                    """,
                    (attempt_id, subject_id, quiz_id, score_pct, answers_json)
                )
                await db.commit()
            graded["attempt_id"] = attempt_id
            graded["quiz_id"] = quiz_id
            graded["subject_id"] = subject_id
        except Exception:
            pass  # Non-blocking for grading response

        return graded
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to grade quiz: {str(e)}")


@router.post("/teach-back/evaluate", summary="Evaluate student explanation using Feynman technique")
async def evaluate_teach_back(payload: TeachBackEvaluationRequest):
    """Assesses student grasp against curriculum truth and identifies misconceptions."""
    try:
        evaluator = TeachBackEvaluator(subject_id=payload.subject_id)
        result = await evaluator.evaluate_explanation(
            concept=payload.concept,
            student_explanation=payload.student_explanation,
            cloud_api_key=payload.cloud_api_key,
            cloud_provider=payload.cloud_provider,
            cloud_model=payload.cloud_model
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
