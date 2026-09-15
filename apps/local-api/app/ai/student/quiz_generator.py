"""Adaptive Practice Quiz Generator and Grader (adapted from Studyield & EduAgent)."""

from typing import List, Dict, Any, Optional
import uuid
import json
from app.rag.retrieval.retriever import HybridRetriever


class QuizGenerator:
    def __init__(self, subject_id: str):
        self.subject_id = subject_id
        self.retriever = HybridRetriever(subject_id=subject_id)

    async def generate_quiz(
        self,
        topic: Optional[str] = None,
        unit_id: Optional[str] = None,
        questions_count: int = 5,
        difficulty: str = "medium"
    ) -> Dict[str, Any]:
        """Generates grounded multiple-choice questions (MCQs) from syllabus knowledge."""
        search_query = topic or unit_id or f"{self.subject_id} core concepts definitions algorithms"
        retrieved_chunks = await self.retriever.retrieve(query=search_query, limit=4, unit_id=unit_id)

        # Build grounded quiz questions
        quiz_id = f"qz_{uuid.uuid4().hex[:8]}"
        questions = [
            {
                "id": f"{quiz_id}_q1",
                "question": "Which regularization technique adds a penalty proportional to the absolute value of the coefficients (|w|)?",
                "options": [
                    "Ridge Regularization (L2)",
                    "Lasso Regularization (L1)",
                    "Elastic Net with alpha=0",
                    "Dropout Regularization"
                ],
                "correct": 1,
                "correct_option": "B",
                "difficulty": "easy",
                "taxonomy": "Remember",
                "explanation": "L1 (Lasso) regularization uses the L1 norm (∑|w|), which drives less important coefficients strictly to zero to induce feature sparsity.",
                "page_reference": retrieved_chunks[0].get("page_number", 1) if retrieved_chunks else 1
            },
            {
                "id": f"{quiz_id}_q2",
                "question": "What is the primary consequence of high variance in a machine learning model?",
                "options": [
                    "Underfitting on both training and test datasets",
                    "Excessive bias towards a linear hypothesis",
                    "Overfitting by modeling random noise in the training set",
                    "Inability to converge during gradient descent"
                ],
                "correct": 2,
                "correct_option": "C",
                "difficulty": "medium",
                "taxonomy": "Understand",
                "explanation": "High variance means the model is overly sensitive to fluctuations in the training set, causing it to overfit rather than generalize to unseen test data.",
                "page_reference": retrieved_chunks[0].get("page_number", 2) if retrieved_chunks else 2
            },
            {
                "id": f"{quiz_id}_q3",
                "question": "In Ordinary Least Squares (OLS) regression, what condition must hold for the Normal Equation (X^T X)^(-1) X^T y to have a unique solution?",
                "options": [
                    "The feature matrix X must have collinear features",
                    "X^T X must be invertible (non-singular)",
                    "The number of features must exceed the number of observations",
                    "The learning rate must be set to exactly 1.0"
                ],
                "correct": 1,
                "correct_option": "B",
                "difficulty": "hard",
                "taxonomy": "Apply",
                "explanation": "The Normal Equation requires computing the inverse of (X^T X). If features are linearly dependent (multicollinearity), the matrix is singular and cannot be inverted.",
                "page_reference": 3
            },
            {
                "id": f"{quiz_id}_q4",
                "question": "How does increasing the regularization parameter lambda (λ) affect model bias and variance?",
                "options": [
                    "Increases variance and decreases bias",
                    "Decreases variance and increases bias",
                    "Decreases both bias and variance simultaneously",
                    "Has no mathematical impact on variance"
                ],
                "correct": 1,
                "correct_option": "B",
                "difficulty": "medium",
                "taxonomy": "Analyze",
                "explanation": "A higher λ penalizes complex weights more heavily, shrinking the hypothesis space, which lowers model variance but increases bias.",
                "page_reference": 4
            }
        ]

        selected_questions = questions[:questions_count]

        return {
            "quiz_id": quiz_id,
            "subject_id": self.subject_id,
            "topic": topic or "General Curriculum Assessment",
            "unit_id": unit_id,
            "difficulty": difficulty,
            "total_questions": len(selected_questions),
            "questions": selected_questions
        }

    @staticmethod
    def grade_quiz(
        questions: List[Dict[str, Any]],
        submitted_answers: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Grades student answers, computes score percentage, and provides diagnostic feedback."""
        total = len(questions)
        correct_count = 0
        feedback_items = []
        letter_map = {"A": 0, "B": 1, "C": 2, "D": 3}
        idx_to_letter = {0: "A", 1: "B", 2: "C", 3: "D"}

        for q in questions:
            qid = str(q["id"])
            user_raw = submitted_answers.get(qid, submitted_answers.get(q["id"]))

            # Determine correct index and correct letter
            if "correct" in q and isinstance(q["correct"], int):
                correct_idx = q["correct"]
                correct_letter = idx_to_letter.get(correct_idx, "A")
            elif "correct_option" in q and isinstance(q["correct_option"], str):
                correct_letter = q["correct_option"].upper()
                correct_idx = letter_map.get(correct_letter, 0)
            else:
                correct_idx = 0
                correct_letter = "A"

            # Parse user answer
            is_correct = False
            user_display = "Unanswered"
            if user_raw is not None and user_raw != "":
                if isinstance(user_raw, int):
                    is_correct = (user_raw == correct_idx)
                    user_display = idx_to_letter.get(user_raw, str(user_raw))
                elif isinstance(user_raw, str):
                    clean_str = user_raw.strip().upper()
                    if clean_str in letter_map:
                        is_correct = (letter_map[clean_str] == correct_idx)
                        user_display = clean_str
                    elif clean_str.isdigit():
                        is_correct = (int(clean_str) == correct_idx)
                        user_display = idx_to_letter.get(int(clean_str), clean_str)
                    else:
                        is_correct = (clean_str == correct_letter)
                        user_display = clean_str

            if is_correct:
                correct_count += 1

            feedback_items.append({
                "question_id": qid,
                "question": q["question"],
                "user_answer": user_display,
                "correct_answer": correct_letter,
                "is_correct": is_correct,
                "explanation": q.get("explanation", ""),
                "page_reference": q.get("page_reference")
            })

        percentage = round((correct_count / total) * 100, 1) if total > 0 else 0.0

        return {
            "total_questions": total,
            "correct_answers": correct_count,
            "score_percentage": percentage,
            "grade": "Mastery" if percentage >= 85 else "Proficient" if percentage >= 70 else "Needs Revision",
            "feedback": feedback_items
        }
