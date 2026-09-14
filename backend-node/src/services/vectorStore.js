class VectorStore {
  constructor() {
    this.docs = new Map();
  }

  addDocument(docId, chunks) {
    this.docs.set(docId, {
      docId,
      chunks,
      createdAt: new Date().toISOString(),
    });
  }

  hasDocument(docId) {
    return this.docs.has(docId);
  }

  getDocument(docId) {
    return this.docs.get(docId) || null;
  }

  getFullText(docId) {
    const doc = this.getDocument(docId);
    if (!doc) return '';
    return doc.chunks.map((chunk) => chunk.text).join('\n\n');
  }

  search(docId, question, topK = 4) {
    const doc = this.getDocument(docId);
    if (!doc) return [];

    const q = String(question || '').toLowerCase();
    const terms = q
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/\s+/)
      .filter(Boolean);

    const scored = doc.chunks
      .map((chunk) => {
        const text = (chunk.text || '').toLowerCase();
        const termMatches = terms.reduce((acc, term) => {
          return acc + (text.includes(term) ? 1 : 0);
        }, 0);

        const pageMatch = chunk.page_number || 1;
        const lengthBonus = Math.min(5, Math.max(0, Math.floor(text.length / 500)));
        const score = termMatches * 3 + lengthBonus + (pageMatch > 0 ? 1 : 0);

        return { ...chunk, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    return scored;
  }
}

export const vectorStore = new VectorStore();
