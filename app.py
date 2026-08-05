import os
import streamlit as st
from utils.pdf_reader import extract_text_from_pdf

# -----------------------------
# Page Configuration
# -----------------------------
st.set_page_config(
    page_title="AI Research Paper Assistant",
    page_icon="📄",
    layout="wide"
)

# -----------------------------
# Main Page
# -----------------------------
st.title("AI Research Paper Assistant")
st.write("Upload a research paper (PDF) to extract and view its text.")

# -----------------------------
# Sidebar
# -----------------------------
st.sidebar.title("Navigation")
st.sidebar.write("Upload your research paper from here.")

# -----------------------------
# PDF Upload
# -----------------------------
uploaded_file = st.sidebar.file_uploader(
    "Upload Research Paper",
    type=["pdf"]
)

# -----------------------------
# Create uploads folder
# -----------------------------
os.makedirs("uploads", exist_ok=True)

# -----------------------------
# Validate, Save and Read PDF
# -----------------------------
if uploaded_file is not None:

    # Validate file extension
    if not uploaded_file.name.lower().endswith(".pdf"):
        st.error("❌ Please upload a valid PDF file.")

    # Validate empty file
    elif uploaded_file.size == 0:
        st.error("❌ The uploaded PDF is empty.")

    else:
        # Save uploaded PDF
        file_path = os.path.join("uploads", uploaded_file.name)

        with open(file_path, "wb") as file:
            file.write(uploaded_file.getbuffer())

        st.success("✅ PDF uploaded and saved successfully!")

        # Extract and display text
        try:
            text = extract_text_from_pdf(file_path)

            st.subheader("Extracted Text")

            st.text_area(
                "Research Paper Content",
                text,
                height=400
            )

        except Exception as e:
            st.error(f" {e}")