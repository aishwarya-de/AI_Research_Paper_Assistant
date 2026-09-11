import os
import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

class GeminiService:
    """
    Service wrapper for Google Gemini API integration.
    Reads GEMINI_API_KEY from environment variables.
    """

    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY", "").strip()
        self.model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
        self.client = None
        self._setup_client()

    def _setup_client(self):
        """Initialize Google GenAI client if API key is present."""
        if not self.api_key or self.api_key == "your_google_gemini_api_key_here":
            logger.warning("[GeminiService] GEMINI_API_KEY is not set or using default placeholder.")
            return

        try:
            # Try official google.genai SDK
            from google import genai
            self.client = genai.Client(api_key=self.api_key)
            logger.info(f"[GeminiService] Initialized google.genai client with model '{self.model_name}'.")
        except ImportError:
            try:
                # Fallback to google.generativeai SDK
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                self.client = genai.GenerativeModel(self.model_name)
                logger.info(f"[GeminiService] Initialized legacy google.generativeai model '{self.model_name}'.")
            except Exception as e:
                logger.error(f"[GeminiService] Failed to initialize Gemini client: {e}")

    def generate_rag_answer(self, question: str, retrieved_chunks: List[Dict[str, Any]]) -> str:
        """
        Synthesize answer to user query based strictly on retrieved document chunks.
        """
        # Format context from retrieved chunks
        context_blocks = []
        for i, chunk in enumerate(retrieved_chunks, start=1):
            context_blocks.append(
                f"--- [Chunk {chunk['chunk_id']} | Page {chunk['page_number']}] ---\n{chunk['text']}"
            )
        context_str = "\n\n".join(context_blocks)

        prompt = f"""You are an elite academic AI Research Assistant.
Answer the user's question accurately and concisely based ONLY on the provided research paper context below.

Rules:
1. Rely ONLY on the provided context. If the context does not contain the answer, state clearly: "Based on the provided paper sections, this topic is not discussed."
2. Cite page numbers or chunk IDs inline when referencing specific claims (e.g., "[Page 4]" or "[Chunk 2]").
3. Maintain an academic, professional, and clear tone.

--- RESEARCH PAPER CONTEXT ---
{context_str}

--- USER QUESTION ---
{question}

--- GROUNDED ANSWER ---"""

        return self._generate_text(prompt)

    def generate_insight(self, prompt_template: str, document_text: str) -> str:
        """
        Generate specialized paper insights (summary, key points, research gaps, etc.).
        """
        full_prompt = f"{prompt_template}\n\n--- RESEARCH PAPER CONTENT ---\n{document_text[:30000]}"
        return self._generate_text(full_prompt)

    def _generate_text(self, prompt: str) -> str:
        """Helper to invoke Gemini API with fallback mock response if key is missing."""
        if not self.api_key or self.api_key == "your_google_gemini_api_key_here":
            return (
                "⚠️ **Gemini API Key Required**\n\n"
                "Please configure a valid `GEMINI_API_KEY` in your `.env` file to enable AI generation.\n\n"
                "*(Demo preview response: The uploaded paper discusses advanced methodologies, experimental setups, and empirical evaluations.)*"
            )

        try:
            if hasattr(self.client, 'models'):
                # New google.genai client syntax
                response = self.client.models.generate_content(
                    model=self.model_name,
                    contents=prompt,
                )
                return response.text.strip()
            elif hasattr(self.client, 'generate_content'):
                # Legacy google.generativeai syntax
                response = self.client.generate_content(prompt)
                return response.text.strip()
            else:
                # Direct HTTP or re-init fallback
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                model = genai.GenerativeModel(self.model_name)
                response = model.generate_content(prompt)
                return response.text.strip()
        except Exception as e:
            logger.error(f"[GeminiService] Error calling Gemini API: {e}")
            # Try fallback model if gemini-2.5-flash fails
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                fallback_model = genai.GenerativeModel("gemini-1.5-flash")
                response = fallback_model.generate_content(prompt)
                return response.text.strip()
            except Exception as fallback_err:
                return f"❌ **Error generating response from Gemini API**: {str(e)}"

# Global service instance
gemini_service = GeminiService()
