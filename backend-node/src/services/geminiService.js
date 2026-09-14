import dotenv from 'dotenv';
dotenv.config({ path: process.cwd() + '/.env' });

const apiKey = process.env.GEMINI_API_KEY || '';
const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

class GeminiService {
  constructor() {
    this.apiKey = apiKey;
    this.modelName = modelName;
  }

  async generateRagAnswer(question, retrievedChunks) {
    const contextBlocks = retrievedChunks.map((chunk, index) => {
      return `--- [Chunk ${chunk.chunk_id} | Page ${chunk.page_number}] ---\n${chunk.text}`;
    });

    const prompt = `You are an elite academic AI Research Assistant.
Answer the user's question accurately and concisely based ONLY on the provided research paper context below.

Rules:
1. Rely ONLY on the provided context. If the context does not contain the answer, state clearly: "Based on the provided paper sections, this topic is not discussed."
2. Cite page numbers or chunk IDs inline when referencing specific claims (e.g., "[Page 4]" or "[Chunk 2]").
3. Maintain an academic, professional, and clear tone.

--- RESEARCH PAPER CONTEXT ---
${contextBlocks.join('\n\n')}

--- USER QUESTION ---
${question}

--- GROUNDED ANSWER ---`;

    return this.generateText(prompt);
  }

  async generateInsight(promptTemplate, documentText) {
    const fullPrompt = `${promptTemplate}\n\n--- RESEARCH PAPER CONTENT ---\n${documentText.slice(0, 30000)}`;
    return this.generateText(fullPrompt);
  }

  async generateText(prompt) {
    if (!this.apiKey || this.apiKey === 'your_google_gemini_api_key_here') {
      return `⚠️ **Gemini API Key Required**\n\nPlease configure a valid GEMINI_API_KEY in your .env file to enable AI generation.\n\n*(Demo preview response: The uploaded paper discusses advanced methodologies, experimental setups, and empirical evaluations.)*`;
    }

    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(this.apiKey);
      const model = genAI.getGenerativeModel({ model: this.modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      try {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(this.apiKey);
        const fallbackModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const fallbackResult = await fallbackModel.generateContent(prompt);
        const fallbackResponse = await fallbackResult.response;
        return fallbackResponse.text();
      } catch (fallbackError) {
        return `❌ **Error generating response from Gemini API**: ${error.message}`;
      }
    }
  }
}

export const geminiService = new GeminiService();
