"""Verification test suite for Phase 5: Student Learning Tools (Quizzes, Teach-Back, Flashcards, Study Plan)."""

import asyncio
import shutil
from pathlib import Path
from app.config import settings
from app.ai.student.quiz_generator import QuizGenerator
from app.ai.student.teach_back import TeachBackEvaluator
from app.ai.student.flashcard_generator import FlashcardGenerator
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


async def test_quiz_generator_and_grader():
    print("\n--- 1. Testing Quiz Generator & Automated Grader ---")
    subject_id = "test-student-subject"
    generator = QuizGenerator(subject_id=subject_id)

    # 1. Generate Quiz
    quiz = await generator.generate_quiz(topic="Regularization & Overfitting", questions_count=3)
    assert quiz["total_questions"] == 3
    assert len(quiz["questions"]) == 3
    assert "explanation" in quiz["questions"][0]
    print(f"Generated quiz with {quiz['total_questions']} questions.")

    # 2. Grade Quiz
    q1 = quiz["questions"][0]
    q2 = quiz["questions"][1]
    submitted = {
        q1["id"]: q1["correct_option"],
        q2["id"]: "WRONG_OPTION"
    }

    grading = QuizGenerator.grade_quiz(quiz["questions"][:2], submitted)
    assert grading["total_questions"] == 2
    assert grading["correct_answers"] == 1
    assert grading["score_percentage"] == 50.0
    print(f"Graded quiz successfully. Score: {grading['score_percentage']}% ({grading['grade']})")
    print("[SUCCESS] Quiz generator and grader validated!")
    return subject_id


async def test_teach_back_evaluator(subject_id: str):
    print("\n--- 2. Testing Feynman Teach-Back Evaluator ---")
    evaluator = TeachBackEvaluator(subject_id=subject_id)

    # Test good student explanation
    good_explanation = (
        "L1 regularization adds a penalty based on the absolute values of the weights to the loss function. "
        "This minimizes error while forcing unimportant feature weights to exactly zero, preventing the model from fitting training noise and overfitting."
    )
    result = await evaluator.evaluate_explanation(
        concept="L1 Regularization and Sparsity",
        student_explanation=good_explanation
    )

    assert result["comprehension_score"] >= 80
    assert len(result["strengths"]) >= 1
    assert "socratic_challenge" in result
    print(f"Evaluated explanation. Score: {result['comprehension_score']} ({result['grade']})")
    print(f"Socratic Challenge: {result['socratic_challenge']}")
    print("[SUCCESS] Feynman Teach-Back evaluator validated!")


async def test_flashcard_and_study_plan(subject_id: str):
    print("\n--- 3. Testing Flashcards & Study Planner ---")
    gen = FlashcardGenerator(subject_id=subject_id)

    # 1. Flashcard Deck
    deck = await gen.generate_deck(count=4)
    assert deck["total_cards"] == 4
    assert "front" in deck["cards"][0]
    assert "back" in deck["cards"][0]
    print(f"Generated flashcard deck with {deck['total_cards']} cards.")

    # 2. Study Plan
    plan = FlashcardGenerator.generate_study_plan(days_remaining=7, daily_hours=2.5)
    assert plan["days_plan"] == 7
    assert len(plan["schedule"]) >= 7
    print(f"Generated {plan['days_plan']}-day study plan ({plan['total_study_hours']} total hours).")
    print("[SUCCESS] Flashcards and study timetable planner validated!")


def test_student_api_endpoints(subject_id: str):
    print("\n--- 4. Testing Student API Endpoints ---")
    # 1. Quiz generate endpoint
    qz_res = client.post("/api/v1/student/quizzes/generate", json={"subject_id": subject_id, "questions_count": 2})
    assert qz_res.status_code == 200
    questions = qz_res.json()["questions"]

    # 2. Quiz grade endpoint
    grade_res = client.post(
        "/api/v1/student/quizzes/grade",
        json={
            "questions": questions,
            "submitted_answers": {questions[0]["id"]: questions[0]["correct_option"]}
        }
    )
    assert grade_res.status_code == 200
    assert grade_res.json()["correct_answers"] == 1

    # 3. Teach-back endpoint
    tb_res = client.post(
        "/api/v1/student/teach-back/evaluate",
        json={
            "subject_id": subject_id,
            "concept": "Bias-Variance Tradeoff",
            "student_explanation": "High bias leads to underfitting because model is too simple, high variance overfits noise."
        }
    )
    assert tb_res.status_code == 200
    assert "comprehension_score" in tb_res.json()

    # 4. Flashcards endpoint
    fc_res = client.post("/api/v1/student/flashcards/generate", json={"subject_id": subject_id, "count": 3})
    assert fc_res.status_code == 200
    assert fc_res.json()["total_cards"] == 3

    # 5. Study plan endpoint
    sp_res = client.post("/api/v1/student/study-plan", json={"days_remaining": 10, "daily_hours": 2.0})
    assert sp_res.status_code == 200
    assert sp_res.json()["days_plan"] == 10

    print("[SUCCESS] All Student API endpoints validated!")


async def main():
    try:
        subject_id = await test_quiz_generator_and_grader()
        await test_teach_back_evaluator(subject_id)
        await test_flashcard_and_study_plan(subject_id)
        test_student_api_endpoints(subject_id)
        print("\n=======================================================")
        print("[ALL PHASE 5 TESTS COMPLETED AND VERIFIED SUCCESSFULLY]")
        print("=======================================================")
    finally:
        test_dir = settings.SUBJECTS_DIR / "test-student-subject"
        if test_dir.exists():
            shutil.rmtree(test_dir, ignore_errors=True)


if __name__ == "__main__":
    asyncio.run(main())
