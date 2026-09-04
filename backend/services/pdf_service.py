import fitz
import re
import os

def clean_text(text: str) -> str:
    """
    Cleans extracted PDF text by removing excessive whitespace and null characters.
    """
    if not text:
        return ""
    # Replace null bytes
    cleaned = text.replace("\x00", "")
    # Normalize excessive blank lines and spaces
    cleaned = re.sub(r"[ \t]+", " ", cleaned)
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned)
    return cleaned.strip()

def extract_text_from_pdf(pdf_path: str) -> tuple[str, int]:
    """
    Reads a PDF file, extracts and cleans text from all pages, and returns (text, page_count).
    
    Args:
        pdf_path (str): Path to the PDF file.
        
    Returns:
        tuple[str, int]: (Extracted text, Total page count)
    """
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF file not found at: {pdf_path}")
        
    try:
        doc = fitz.open(pdf_path)
        page_count = len(doc)
        
        if page_count == 0:
            doc.close()
            raise ValueError("The uploaded PDF has 0 pages.")
            
        extracted_pages = []
        for page_num in range(page_count):
            page = doc[page_num]
            text = page.get_text("text")
            if text:
                extracted_pages.append(text)
                
        doc.close()
        
        full_text = clean_text("\n\n".join(extracted_pages))
        
        if not full_text.strip():
            raise ValueError("No extractable text found in the PDF. It may be scanned or image-based.")
            
        return full_text, page_count
        
    except Exception as e:
        if isinstance(e, (FileNotFoundError, ValueError)):
            raise e
        raise RuntimeError(f"Failed to process PDF: {str(e)}")

def get_pdf_metadata(pdf_path: str) -> dict:
    """
    Extracts high-level metadata from PDF.
    """
    text, pages = extract_text_from_pdf(pdf_path)
    words = len(text.split())
    chars = len(text)
    return {
        "pages": pages,
        "characters": chars,
        "words": words,
        "preview": text[:500] + ("..." if len(text) > 500 else "")
    }
