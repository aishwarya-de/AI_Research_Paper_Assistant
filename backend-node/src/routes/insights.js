import { Router } from 'express';
import { vectorStore } from '../services/vectorStore.js';
import { geminiService } from '../services/geminiService.js';
import { getPromptTemplate, PROMPT_MAP } from '../services/prompts.js';

export const insightsRouter = Router();

function resolvePaperText(req) {
  const text = String(req.body?.text || '').trim();
  if (text) return text;

  const docId = String(req.body?.doc_id || '').trim();
  if (!docId) {
    return null;
  }

  return vectorStore.getFullText(docId);
}

insightsRouter.post('/insights/:insightType', async (req, res) => {
  try {
    const insightType = req.params.insightType;
    const docId = String(req.body?.doc_id || '').trim();

    if (!vectorStore.hasDocument(docId)) {
      return res.status(404).json({ detail: `Document ID '${docId}' not found. Please upload the paper first.` });
    }

    const promptTemplate = getPromptTemplate(insightType);
    const fullText = vectorStore.getFullText(docId);
    const content = await geminiService.generateInsight(promptTemplate, fullText);

    return res.json({
      doc_id: docId,
      insight_type: insightType,
      content,
    });
  } catch (error) {
    if (error?.message?.includes('Unknown insight type')) {
      return res.status(400).json({ detail: error.message });
    }
    return res.status(500).json({ detail: `Error generating insight '${req.params.insightType}': ${error.message}` });
  }
});

insightsRouter.post('/summary', async (req, res) => {
  return routeInsight(req, res, 'summary');
});

insightsRouter.post('/key-points', async (req, res) => {
  return routeInsight(req, res, 'key-points');
});

insightsRouter.post('/research-gaps', async (req, res) => {
  return routeInsight(req, res, 'research-gaps');
});

insightsRouter.post('/future-scope', async (req, res) => {
  return routeInsight(req, res, 'future-scope');
});

insightsRouter.post('/project-ideas', async (req, res) => {
  return routeInsight(req, res, 'project-ideas');
});

insightsRouter.post('/viva', async (req, res) => {
  return routeInsight(req, res, 'viva');
});

async function routeInsight(req, res, insightType) {
  const docId = String(req.body?.doc_id || '').trim();
  if (!vectorStore.hasDocument(docId)) {
    return res.status(404).json({ detail: `Document ID '${docId}' not found. Please upload the paper first.` });
  }

  try {
    const promptTemplate = getPromptTemplate(insightType);
    const fullText = vectorStore.getFullText(docId);
    const content = await geminiService.generateInsight(promptTemplate, fullText);

    return res.json({
      doc_id: docId,
      insight_type: insightType,
      content,
    });
  } catch (error) {
    return res.status(500).json({ detail: `Error generating insight '${insightType}': ${error.message}` });
  }
}
