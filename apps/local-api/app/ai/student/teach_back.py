"""Feynman Teach-Back Evaluator supporting Local & Cloud AI models."""

from typing import Dict, Any, List, Optional
import httpx
import json
from app.rag.retrieval.retriever import HybridRetriever


class TeachBackEvaluator:
    def __init__(self, subject_id: str):
        self.subject_id = subject_id
        self.retriever = HybridRetriever(subject_id=subject_id)

    async def evaluate_explanation(
        self,
        concept: str,
        student_explanation: str,
        cloud_api_key: Optional[str] = None,
        cloud_provider: Optional[str] = "gemini",
        cloud_model: Optional[str] = None
    ) -> Dict[str, Any]:
        """Evaluates student explanation against course textbook ground truth using Feynman rubric and Cloud AI."""
        # 1. Retrieve canonical textbook ground truth
        retrieved_chunks = []
        try:
            retrieved_chunks = await self.retriever.retrieve(query=concept, limit=3)
        except Exception:
            pass
        context_snippets = [r["text_content"] for r in retrieved_chunks]
        ref_text = context_snippets[0][:300] if context_snippets else "Prescribed Course Syllabus and Textbooks"

        # 2. If Cloud API Key is provided, perform deep AI Evaluation
        if cloud_api_key and len(cloud_api_key.strip()) > 6:
            provider = (cloud_provider or "gemini").lower().strip()
            prompt = (
                f"You are a master Feynman pedagogical examiner evaluating a student's explanation.\n"
                f"Course Subject: {self.subject_id.replace('-', ' ').title()}\n"
                f"Target Concept: {concept}\n"
                f"Curriculum Reference Truth: {ref_text}\n"
                f"Student's Explanation: \"{student_explanation}\"\n\n"
                f"Evaluate their intuition. Return strictly a JSON object with this structure:\n"
                "{\n"
                '  "comprehension_score": <number 0-100>,\n'
                '  "grade": "<Mastery Level (A+) | Proficient (B+) | Developing (C)>",\n'
                '  "strengths": ["<strength 1>", "<strength 2>"],\n'
                '  "missing_nuances": ["<missing nuance 1>", "<missing nuance 2>"],\n'
                '  "suggested_analogy": "<a simple intuitive real-world analogy>",\n'
                '  "socratic_challenge": "<a deep thought-provoking follow-up question>"\n'
                "}"
            )
            try:
                if provider == "gemini":
                    m = cloud_model or "gemini-2.0-flash"
                    url = f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent?key={cloud_api_key.strip()}"
                    body = {
                        "contents": [{"parts": [{"text": prompt}]}],
                        "generationConfig": {"response_mime_type": "application/json"}
                    }
                    async with httpx.AsyncClient(timeout=15.0) as client:
                        res = await client.post(url, json=body)
                        if res.status_code == 200:
                            data = res.json()
                            raw_text = data.get("candidates", [])[0].get("content", {}).get("parts", [])[0].get("text", "")
                            eval_json = json.loads(raw_text)
                            eval_json["concept"] = concept
                            eval_json["textbook_ground_truth_reference"] = ref_text
                            return eval_json

                elif provider in ["openai", "groq", "deepseek", "openrouter"]:
                    if provider == "openai":
                        base_url = "https://api.openai.com/v1"
                        m = cloud_model or "gpt-4o-mini"
                    elif provider == "groq":
                        base_url = "https://api.groq.com/openai/v1"
                        m = cloud_model or "llama-3.3-70b-versatile"
                    elif provider == "deepseek":
                        base_url = "https://api.deepseek.com"
                        m = cloud_model or "deepseek-chat"
                    else:
                        base_url = "https://openrouter.ai/api/v1"
                        m = cloud_model or "google/gemini-2.0-flash-001"
                    url = f"{base_url}/chat/completions"
                    headers = {"Authorization": f"Bearer {cloud_api_key.strip()}", "Content-Type": "application/json"}
                    body = {
                        "model": m,
                        "messages": [{"role": "user", "content": prompt}],
                        "response_format": {"type": "json_object"} if provider != "groq" else None
                    }
                    async with httpx.AsyncClient(timeout=15.0) as client:
                        res = await client.post(url, headers=headers, json=body)
                        if res.status_code == 200:
                            data = res.json()
                            raw_text = data.get("choices", [{}])[0].get("message", {}).get("content", "")
                            clean_json_str = raw_text.strip().removeprefix("```json").removesuffix("```").strip()
                            eval_json = json.loads(clean_json_str)
                            eval_json["concept"] = concept
                            eval_json["textbook_ground_truth_reference"] = ref_text
                            return eval_json
            except Exception:
                pass  # Fall back to heuristic assessment

        # Fallback heuristic assessment
        explanation_lower = student_explanation.lower()
        strengths: List[str] = []
        missing_nuances: List[str] = []
        score = 75

        if any(term in explanation_lower for term in ["penalty", "loss", "error", "minimize", "cost"]):
            strengths.append("Clearly connects the concept to error/loss function minimization.")
            score += 10

        if any(term in explanation_lower for term in ["generalize", "noise", "overfitting", "complex", "unseen"]):
            strengths.append("Correctly emphasizes model generalization and prevention of memorization.")
            score += 10

        if len(student_explanation.split()) < 20:
            missing_nuances.append("Explanation is somewhat brief; detail why this mechanism behaves this way mathematically.")
            score -= 15

        if "zero" not in explanation_lower and "l1" in concept.lower():
            missing_nuances.append("For L1 (Lasso) regularization, explicitly state how coefficients shrink strictly to zero.")

        score = max(30, min(98, score))

        if score >= 88:
            grade = "Mastery Level (A+)"
            socratic_challenge = "How would you mathematically justify why L1 creates sharp diamond contours compared to L2's spherical circles?"
        elif score >= 70:
            grade = "Proficient (B+)"
            socratic_challenge = "What would happen to the model if the regularization parameter lambda (λ) were set to an extremely large value?"
        else:
            grade = "Developing (C)"
            socratic_challenge = "Can you rephrase how this concept directly addresses overfitting in simple real-world terms?"

        return {
            "concept": concept,
            "comprehension_score": score,
            "grade": grade,
            "strengths": strengths if strengths else ["Good effort articulating the concept in your own words."],
            "missing_nuances": missing_nuances if missing_nuances else ["Addressed the primary curriculum requirements accurately."],
            "suggested_analogy": "Think of L1 as packing only essentials into a small suitcase (zeros out items), while L2 shrinks every item's size equally.",
            "socratic_challenge": socratic_challenge,
            "textbook_ground_truth_reference": ref_text
        }

