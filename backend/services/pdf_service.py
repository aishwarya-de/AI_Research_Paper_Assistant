import fitz  # PyMuPDF
from typing import List, Dict, Any, Tuple
from utils.text_cleaner import clean_text

class PDFProcessor:
    """
    Handles PDF parsing using PyMuPDF and text chunking for vector indexing.
    """

    @staticmethod
    def extract_and_chunk(
        file_bytes: bytes,
        chunk_size: int = 1200,
        chunk_overlap: int = 200
    ) -> Tuple[List[Dict[str, Any]], int]:
        """
        Extracts text from PDF bytes page by page and chunks text with metadata.
        
        Returns:
            Tuple of (chunks_list, total_pages)
            where each chunk dict contains:
            {
                "chunk_id": int,
                "page_number": int,
                "text": str
            }
        """
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        total_pages = len(doc)
        all_chunks = []
        chunk_counter = 0

        for page_num in range(total_pages):
            page = doc.load_page(page_num)
            page_text = page.get_text("text")
            cleaned_text = clean_text(page_text)

            if not cleaned_text:
                continue

            # Sliding window text chunking on page text
            start = 0
            text_length = len(cleaned_text)

            while start < text_length:
                end = min(start + chunk_size, text_length)
                
                # If not at the end of the text, try ending at space or sentence boundary
                if end < text_length:
                    last_period = cleaned_text.rfind('. ', start, end)
                    last_space = cleaned_text.rfind(' ', start, end)
                    
                    if last_period != -1 and last_period > start + (chunk_size // 2):
                        end = last_period + 1
                    elif last_space != -1 and last_space > start + (chunk_size // 2):
                        end = last_space

                chunk_str = cleaned_text[start:end].strip()
                if len(chunk_str) > 50:  # Ignore tiny artifact chunks
                    all_chunks.append({
                        "chunk_id": chunk_counter,
                        "page_number": page_num + 1,
                        "text": chunk_str
                    })
                    chunk_counter += 1

                # Move window
                start = end - chunk_overlap if end < text_length else text_length

        doc.close()
        return all_chunks, total_pages
