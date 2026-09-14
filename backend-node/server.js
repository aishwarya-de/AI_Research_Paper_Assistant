import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { healthRouter } from './src/routes/health.js';
import { uploadRouter } from './src/routes/upload.js';
import { chatRouter } from './src/routes/chat.js';
import { insightsRouter } from './src/routes/insights.js';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    title: 'AI Research Paper Assistant 2.0 API',
    status: 'online',
    docs_url: '/docs',
  });
});

app.use('/api', healthRouter);
app.use('/api', uploadRouter);
app.use('/api', chatRouter);
app.use('/api', insightsRouter);

app.use('/health', healthRouter);
app.use('/upload', uploadRouter);
app.use('/chat', chatRouter);
app.use('/insights', insightsRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ detail: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Node.js backend running on http://localhost:${PORT}`);
});
