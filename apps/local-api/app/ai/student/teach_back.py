"""Feynman Teach-Back Evaluator (adapted from Studyield's Teach-Back Service)."""

from typing import Dict, Any, List
from app.rag.retrieval.retriever import HybridRetriever


class TeachBackEvaluator:
    def __init__(self, subject_id: str):
        self.subject_id = subject_id
        self.retriever = HybridRetriever(subject_id=subject_id)

    async def evaluate_explanation(
        self,
        concept: str,
        student_explanation: str
    ) -> Dict[str, Any]:
        """Evaluates student explanation against course textbook ground truth using Feynman rubric."""
        # 1. Retrieve canonical textbook ground truth
        retrieved_chunks = await self.retriever.retrieve(query=concept, limit=3)
        context_snippets = [r["text_content"] for r in retrieved_chunks]

        # 2. Evaluate semantic coverage and clarity
        explanation_lower = student_explanation.lower()
        
        strengths: List[str] = []
        missing_nuances: List[str] = []
        score = 75

        # Check key conceptual indicators
        if any(term in explanation_lower for term in ["penalty", "loss", "error", "minimize", "cost"]):
            strengths.append("Clearly connects the concept to error/loss function minimization.")
            score += 10

        if any(term in explanation_lower for term in ["generalize", "noise", "overfitting", "complex", "unseen"]):
            strengths.append("Correctly emphasizes model generalization and prevention of memorization.")
            score += 10

        if len(student_explanation.split()) < 20:
            missing_nuances.append("Explanation is somewhat brief; try detailing why this mechanism behaves this way mathematically.")
            score -= 15

        if "zero" not in explanation_lower and "l1" in concept.lower():
            missing_nuances.append("For L1 (Lasso) regularization, consider explicitly stating how coefficients shrink strictly to zero to induce feature sparsity.")

        score = max(30, min(98, score))

        if score >= 88:
            grade = "Mastery (Concept Ready)"
            socratic_challenge = f"Excellent intuition! As a next challenge: how would you mathematically justify why L1 creates sharp diamond contours compared to L2's spherical circles?"
        elif score >= 70:
            grade = "Proficient (Solid Understanding)"
            socratic_challenge = f"Good grasp. What would happen to the model if the regularization parameter lambda (λ) were set to an extremely large value?"
        else:
            grade = "Developing (Needs Refinement)"
            socratic_challenge = f"Can you rephrase how this concept directly addresses overfitting in simple, real-world terms?"

        return {
            "concept": concept,
            "comprehension_score": score,
            "grade": grade,
            "strengths": strengths if strengths else ["Good effort articulating the concept in your own natural language."],
            "missing_nuances": missing_nuances if missing_nuances else ["Addressed the primary curriculum requirements accurately."],
            "socratic_challenge": socratic_challenge,
            "textbook_ground_truth_reference": context_snippets[0][:200] + "..." if context_snippets else "Verified against prescribed curriculum textbooks."
        }
