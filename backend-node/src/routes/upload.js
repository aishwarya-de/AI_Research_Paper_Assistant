import { Router } from 'express';
import multer from 'multer';
import { randomUUID } from 'crypto';
import { extractAndChunkPdf } from '../services/pdfService.js';
import { vectorStore } from '../services/vectorStore.js';

export const uploadRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.toLowerCase().endsWith('.pdf')) {
      cb(new Error('Invalid file format. Only PDF research papers (.pdf) are supported.'));
      return;
    }
    cb(null, true);
  },
});

uploadRouter.post('/upload', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ detail: 'Uploaded file is required.' });
    }

    if (!req.file.originalname.toLowerCase().endsWith('.pdf')) {
      return res.status(400).json({ detail: 'Invalid file format. Only PDF research papers (.pdf) are supported.' });
    }

    if (req.file.size === 0) {
      return res.status(400).json({ detail: 'Uploaded file is empty.' });
    }

    const { chunks, totalPages } = await extractAndChunkPdf(req.file.buffer);

    if (!chunks || chunks.length === 0) {
      return res.status(422).json({ detail: 'Could not extract readable text from the uploaded PDF. It may be scanned or image-only.' });
    }

    const docId = randomUUID().slice(0, 10);
    vectorStore.addDocument(docId, chunks);

    return res.status(201).json({
      doc_id: docId,
      filename: req.file.originalname,
      total_pages: totalPages,
      total_chunks: chunks.length,
      message: `Successfully parsed '${req.file.originalname}' (${totalPages} pages, ${chunks.length} chunks indexed).`,
    });
  } catch (error) {
    const message = error?.message || 'Error processing PDF document.';
    return res.status(500).json({ detail: `Error processing PDF document: ${message}` });
  }
});
