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
        # Open the PDF
        doc = fitz.open(pdf_path)

        # Store extracted text
        extracted_text = ""

        # Read every page
        for page in doc:
            extracted_text += page.get_text()

        # Close the PDF
        doc.close()

        # Check if any text was extracted
        if extracted_text.strip() == "":
            raise ValueError("No extractable text found in the PDF.")

        return extracted_text

    except Exception as e:
        raise Exception(f"Error reading PDF: {e}")


def get_pdf_page_count(pdf_path):
    """
    Returns the total number of pages in the PDF.

    Args:
        pdf_path (str): Path to the PDF file.

    Returns:
        int: Number of pages in the PDF.
    """

    try:
        doc = fitz.open(pdf_path)
        page_count = len(doc)
        doc.close()

        return page_count

    except Exception as e:
        raise Exception(f"Error counting PDF pages: {e}")