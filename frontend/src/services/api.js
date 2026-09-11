import axios from 'axios';

// API base URL configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000, // 2 min timeout for AI analysis tasks
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      message: error.response?.data?.detail || error.message || 'An unexpected server error occurred.',
      status: error.response?.status,
    };
    return Promise.reject(customError);
  }
);

/**
 * Health check connection test.
 */
export const getHealth = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};

/**
 * Upload PDF research paper.
 * @param {File} file - PDF file instance
 * @param {Function} onProgress - Upload progress callback
 */
export const uploadPDF = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      }
    },
  });
  return response.data;
};

/**
 * Send query for RAG document chat.
 * @param {string} docId - Uploaded document identifier
 * @param {string} question - User question
 */
export const sendChatMessage = async (docId, question) => {
  const response = await apiClient.post('/chat', {
    doc_id: docId,
    question: question,
  });
  return response.data;
};

/**
 * Fetch specific AI insight for document.
 * @param {string} docId - Uploaded document identifier
 * @param {string} type - summary | key-points | research-gaps | future-scope | project-ideas | viva
 */
export const getInsight = async (docId, type) => {
  const response = await apiClient.post(`/insights/${type}`, {
    doc_id: docId,
  });
  return response.data;
};

export default apiClient;
