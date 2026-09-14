import pdfParse from 'pdf-parse';

const MAX_CHARS_PER_CHUNK = 900;

export async function extractAndChunkPdf(fileBuffer) {
  const parsed = await pdfParse(fileBuffer);
  const text = (parsed.text || '').replace(/\r/g, '').trim();
  const totalPages = Math.max(1, parsed.numpages || Math.max(1, (parsed.text || '').split(/\n{2,}/).length));

  if (!text || text.length < 80) {
    throw new Error('Could not extract readable text from the uploaded PDF. It may be scanned or image-only.');
  }

  const chunks = makeChunks(text);

  return {
    chunks,
    totalPages,
  };
}

function makeChunks(text) {
  const normalizedText = text
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\t+/g, ' ')
    .trim();

  const paragraphs = normalizedText
    .split(/\n{2,}|(?<=\.\s)/)
    .map((p) => p.trim())
    .filter(Boolean);

  const chunks = [];
  let paragraphBuffer = '';

  for (const paragraph of paragraphs) {
    if ((paragraphBuffer + ' ' + paragraph).trim().length > MAX_CHARS_PER_CHUNK) {
      if (paragraphBuffer) {
        chunks.push(paragraphBuffer);
      }
      paragraphBuffer = paragraph;
    } else {
      paragraphBuffer = (paragraphBuffer ? paragraphBuffer + ' ' : '') + paragraph;
    }
  }

  if (paragraphBuffer) {
    chunks.push(paragraphBuffer);
  }

  return chunks.map((chunk, index) => ({
    chunk_id: `chunk-${index + 1}`,
    page_number: 1,
    text: chunk,
  }));
}
