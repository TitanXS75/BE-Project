"""LangChain-based Curriculum-Grounded RAG Pipeline.

Implements standard LCEL (LangChain Expression Language) pipelines for
syllabus-bounded retrieval-augmented generation using ChatPromptTemplate,
ChatOllama, and StrOutputParser.
"""

from typing import List, Dict, Any, Optional, AsyncIterator
import logging
from app.config import settings
from app.rag.retrieval.retriever import HybridRetriever

logger = logging.getLogger("axiom.rag.chains")

try:
    from langchain_core.prompts import ChatPromptTemplate
    from langchain_core.output_parsers import StrOutputParser
    from langchain_ollama import ChatOllama
    LANGCHAIN_AVAILABLE = True
except ImportError:
    ChatPromptTemplate = None
    StrOutputParser = None
    ChatOllama = None
    LANGCHAIN_AVAILABLE = False


CURRICULUM_SYSTEM_PROMPT = """You are an expert curriculum-grounded AI Tutor for {subject_name}.
Your answers must be grounded strictly in the syllabus, textbooks, course notes, and .rssh course packages provided below.
{marks_instruction}
Always explain clearly with conceptual intuition, formulas, and key points.
Cite relevant textbook sections or syllabus units when explaining.
If a question is outside the course scope, answer politely while highlighting the nearest syllabus topic.

--- CURRICULUM CONTEXT ---
{context}
--- END CONTEXT ---"""


class CurriculumRAGChain:
    """Standard LangChain LCEL RAG Chain for Axiom curriculum learning."""

    def __init__(
        self,
        subject_id: str,
        model_name: Optional[str] = None,
        temperature: float = 0.3
    ):
        self.subject_id = subject_id
        self.model_name = model_name or settings.DEFAULT_CHAT_MODEL
        self.temperature = temperature
        self.retriever = HybridRetriever(subject_id=subject_id)
        self.subject_display_name = subject_id.replace("-", " ").title()

    def get_prompt_template(self) -> Any:
        """Returns the LangChain ChatPromptTemplate."""
        if not LANGCHAIN_AVAILABLE or ChatPromptTemplate is None:
            return None

        return ChatPromptTemplate.from_messages([
            ("system", CURRICULUM_SYSTEM_PROMPT),
            ("human", "{question}")
        ])

    def get_llm(self) -> Any:
        """Initializes the local LangChain ChatOllama instance."""
        if not LANGCHAIN_AVAILABLE or ChatOllama is None:
            return None

        return ChatOllama(
            model=self.model_name,
            base_url=settings.OLLAMA_BASE_URL,
            temperature=self.temperature
        )

    def build_lcel_chain(self) -> Any:
        """Assembles standard LangChain Expression Language (LCEL) chain: prompt | llm | parser."""
        if not LANGCHAIN_AVAILABLE:
            return None

        prompt = self.get_prompt_template()
        llm = self.get_llm()
        parser = StrOutputParser()

        if prompt and llm:
            return prompt | llm | parser
        return None

    async def astream_rag(
        self,
        question: str,
        unit_id: Optional[str] = None,
        marks_context: Optional[int] = None,
        retrieved_chunks: Optional[List[Dict[str, Any]]] = None
    ) -> AsyncIterator[str]:
        """Executes the LangChain RAG pipeline and streams tokens asynchronously."""
        # 1. Retrieve curriculum context if not pre-fetched
        if retrieved_chunks is None:
            try:
                retrieved_chunks = await self.retriever.retrieve(
                    query=question,
                    limit=4,
                    unit_id=unit_id
                )
            except Exception as e:
                logger.warning(f"Retrieval fallback: {e}")
                retrieved_chunks = []

        # 2. Build formatted curriculum context
        context_blocks = []
        for idx, chk in enumerate(retrieved_chunks, 1):
            page_info = chk.get("page_number", 1)
            content = chk.get("text_content", "")
            context_blocks.append(f"[Document Context {idx} | Page {page_info}]:\n{content}")

        context_str = "\n\n".join(context_blocks) if context_blocks else f"Subject: {self.subject_display_name}"

        marks_instruction = (
            f"Structure this as a clear {marks_context}-mark examination response."
            if marks_context
            else "Provide a clear, structured educational explanation."
        )

        # 3. Stream through LangChain LCEL chain
        chain = self.build_lcel_chain()
        if chain is not None:
            input_vars = {
                "subject_name": self.subject_display_name,
                "marks_instruction": marks_instruction,
                "context": context_str,
                "question": question
            }
            async for chunk in chain.astream(input_vars):
                yield chunk
        else:
            # Fallback if LangChain dependencies are not loaded
            yield f"Curriculum Response for {self.subject_display_name}:\nRegarding: {question}\n\n"
            if retrieved_chunks:
                yield f"Prescribed syllabus material (Page {retrieved_chunks[0].get('page_number', 1)}): {retrieved_chunks[0].get('text_content', '')[:160]}..."
