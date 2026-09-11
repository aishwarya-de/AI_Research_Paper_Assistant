import re

def clean_text(text: str) -> str:
    """
    Clean raw text extracted from PDF documents.
    
    - Normalizes whitespace and line breaks
    - Removes non-printable ASCII/control characters
    - Fixes hyphenation split across line endings
    """
    if not text:
        return ""

    # Fix hyphenated line breaks (e.g. "com- \n puter" -> "computer")
    text = re.sub(r'(\w+)-\s*\n\s*(\w+)', r'\1\2', text)

    # Normalize multiple line breaks to maximum two
    text = re.sub(r'\n{3,}', '\n\n', text)

    # Replace multiple spaces/tabs with single space
    text = re.sub(r'[ \t]+', ' ', text)

    # Remove non-printable control characters (except newline, tab)
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]', '', text)

    return text.strip()
