import axios from 'axios';

// Use environment variable or fallback to /api (proxied in Vite)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000, // 2 minutes for LLM processing
});

export const api = {
  // Health and Status
  checkHealth: async () => {
    const response = await client.get('/health');
    return response.data;
  },

  getDocumentStatus: async () => {
    const response = await client.get('/document/status');
    return response.data;
  },

  resetDocument: async () => {
    const response = await client.post('/document/reset');
    return response.data;
  },

  // PDF Upload
  uploadPDF: async (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await client.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    return response.data;
  },

  // Research Analysis Endpoints
  getSummary: async (text = null) => {
    const response = await client.post('/research/summary', text ? { text } : {});
    return response.data;
  },

  getKeyPoints: async (text = null) => {
    const response = await client.post('/research/key-points', text ? { text } : {});
    return response.data;
  },

  getResearchGaps: async (text = null) => {
    const response = await client.post('/research/gaps', text ? { text } : {});
    return response.data;
  },

  getProjectIdeas: async (text = null) => {
    const response = await client.post('/research/project-ideas', text ? { text } : {});
    return response.data;
  },

  getVivaQuestions: async (text = null) => {
    const response = await client.post('/research/viva', text ? { text } : {});
    return response.data;
  },

  // RAG Chatbot
  sendChatMessage: async (question, top_k = 4) => {
    const response = await client.post('/chat', { question, top_k });
    return response.data;
  },
};

export default api;
