"""Syllabus Flashcard & Study Plan Generator (adapted from EduAgent)."""

from typing import List, Dict, Any, Optional
import uuid
from app.rag.retrieval.retriever import HybridRetriever


class FlashcardGenerator:
    def __init__(self, subject_id: str):
        self.subject_id = subject_id
        self.retriever = HybridRetriever(subject_id=subject_id)

    async def generate_deck(
        self,
        unit_id: Optional[str] = None,
        count: int = 5
    ) -> Dict[str, Any]:
        """Extracts flashcard question-answer pairs for spaced repetition revision."""
        deck_id = f"deck_{uuid.uuid4().hex[:8]}"
        cards = [
            {
                "id": f"{deck_id}_c1",
                "front": "What is L1 Regularization (Lasso)?",
                "back": "Adds a penalty equal to the sum of absolute values of weights (λ * ∑|w|). Drives non-critical feature coefficients strictly to zero to induce sparsity.",
                "unit": "Unit 2",
                "category": "Regularization & Optimization"
            },
            {
                "id": f"{deck_id}_c2",
                "front": "What is L2 Regularization (Ridge)?",
                "back": "Adds a penalty equal to the sum of squared weights (λ * ∑w²). Shrinks weights smoothly toward zero without eliminating them completely.",
                "unit": "Unit 2",
                "category": "Regularization & Optimization"
            },
            {
                "id": f"{deck_id}_c3",
                "front": "Explain the Bias-Variance Tradeoff.",
                "back": "Total Error = Bias² + Variance + Irreducible Noise. High bias causes underfitting; high variance causes overfitting.",
                "unit": "Unit 3",
                "category": "Model Assessment"
            },
            {
                "id": f"{deck_id}_c4",
                "front": "What is the Normal Equation in Linear Regression?",
                "back": "θ = (XᵀX)⁻¹ Xᵀy. It computes the analytical closed-form solution minimizing sum of squared errors without iterative gradient descent.",
                "unit": "Unit 1",
                "category": "Foundations"
            },
            {
                "id": f"{deck_id}_c5",
                "front": "Define Cross-Entropy Loss for Binary Classification.",
                "back": "Loss = -[y * log(p) + (1 - y) * log(1 - p)]. Measures difference between true probability distribution and predicted probability.",
                "unit": "Unit 4",
                "category": "Classification"
            }
        ]

        selected_cards = cards[:count]

        return {
            "deck_id": deck_id,
            "subject_id": self.subject_id,
            "total_cards": len(selected_cards),
            "cards": selected_cards
        }

    @staticmethod
    def generate_study_plan(
        days_remaining: int = 14,
        daily_hours: float = 2.0
    ) -> Dict[str, Any]:
        """Generates a structured revision timetable based on syllabus weightage."""
        return {
            "days_plan": days_remaining,
            "daily_target_hours": daily_hours,
            "total_study_hours": round(days_remaining * daily_hours, 1),
            "schedule": [
                {"day": 1, "focus": "Unit 1: Foundations & Normal Equation Derivations", "practice": "5 Short Questions"},
                {"day": 2, "focus": "Unit 1: Batch vs. Stochastic Gradient Descent", "practice": "1 Case Problem"},
                {"day": 3, "focus": "Unit 2: L1 vs L2 Regularization & Sparsity Proof", "practice": "Teach-Back Exercise"},
                {"day": 4, "focus": "Unit 2: Elastic Net & Multicollinearity", "practice": "Quiz Assessment"},
                {"day": 5, "focus": "Unit 3: Bias-Variance Decomposition", "practice": "PYQ 2024 Review"},
                {"day": 6, "focus": "Unit 3: Decision Trees & Random Forests", "practice": "Flashcard Repetition"},
                {"day": 7, "focus": "Mid-Revision Diagnostic Mock Exam", "practice": "100-Mark Full Test"},
                {"day": 8, "focus": "Unit 4: Logistic Regression & GLM Formulation", "practice": "Derivation Practice"},
                {"day": 9, "focus": "Unit 4: Clustering & K-Means Convergence Proof", "practice": "Quiz 2"},
                {"day": 10, "focus": "PYQ Deep Dive (2021-2025 Repeat Topics)", "practice": "Speed Answering"},
                {"day": 11, "focus": "Formula Sheet & Spaced Repetition", "practice": "Flashcard Mastery"},
                {"day": 12, "focus": "Full Syllabus Mock Test 2", "practice": "Timed 3-Hour Paper"},
                {"day": 13, "focus": "Weak Area Consolidation & Socratic Review", "practice": "Feynman Drills"},
                {"day": 14, "focus": "Final Quick Revision & High-Yield Blueprint", "practice": "Confidence Booster"}
            ]
        }
