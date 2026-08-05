import fitz


def extract_text_from_pdf(pdf_path):
    """
    Reads a PDF file and extracts text from all pages.

    Args:
        pdf_path (str): Path to the PDF file.

    Returns:
        str: Extracted text from the PDF.
    """

    try:
        # Open PDF
        doc = fitz.open(pdf_path)

        extracted_text = ""

        # Read every page
        for page in doc:
            extracted_text += page.get_text()

        doc.close()

        # Check if text was extracted
        if extracted_text.strip() == "":
            raise ValueError("No extractable text found in the PDF.")

        return extracted_text

    except Exception as e:
        raise Exception(f"Error reading PDF: {e}")