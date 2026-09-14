import { Router } from 'express';
import { vectorStore } from '../services/vectorStore.js';
import { geminiService } from '../services/geminiService.js';

export const chatRouter = Router();

chatRouter.post('/chat', async (req, res) => {
  try {
    const docId = String(req.body?.doc_id || '').trim();
    const question = String(req.body?.question || '').trim();

    if (!question) {
      return res.status(400).json({ detail: 'Question cannot be empty.' });
    }

    if (!vectorStore.hasDocument(docId)) {
      return res.status(404).json({ detail: `Document ID '${docId}' not found. Please upload the paper first.` });
    }

    const topChunks = vectorStore.search(docId, question, 4);
    const answer = await geminiService.generateRagAnswer(question, topChunks);

    const citations = topChunks.map((chunk) => ({
      chunk_id: chunk.chunk_id,
      page_number: chunk.page_number,
      text_snippet: chunk.text.length > 150 ? chunk.text.slice(0, 150) + '...' : chunk.text,
    }));

    return res.json({
      doc_id: docId,
      question,
      answer,
      citations,
    });
  } catch (error) {
    return res.status(500).json({ detail: `Error processing RAG query: ${error.message}` });
  }
});
