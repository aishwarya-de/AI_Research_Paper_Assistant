import os
import streamlit as st
from utils.pdf_reader import extract_text_from_pdf

# =====================================================
# Page Configuration
# =====================================================
st.set_page_config(
    page_title="AI Research Paper Assistant",
    page_icon="📄",
    layout="wide"
)
st.markdown("""
<style>

/* Main App Background */
.stApp {
    background-color: #F4F8FB;
}

/* Sidebar Background */
[data-testid="stSidebar"] {
    background-color: #E8F0FE;
}

/* Main Title */
h1 {
    color: #1F4E79;
}

/* Subheadings */
h2, h3 {
    color: #2C3E50;
}

</style>
""", unsafe_allow_html=True)

# =====================================================
# Main Title
# =====================================================
st.title("📄 AI Research Paper Assistant")

st.markdown("""
Upload a **research paper (PDF)** to extract and view its text.

This module is responsible for:
- 📄 Uploading PDF files
- 📖 Extracting text using PyMuPDF
- 👀 Displaying the extracted content
""")

st.divider()

# =====================================================
# Sidebar
# =====================================================
st.sidebar.title("Navigation")

st.sidebar.info(
    "📌 Upload a PDF research paper to begin text extraction."
)

# =====================================================
# PDF Upload
# =====================================================
uploaded_file = st.sidebar.file_uploader(
    "Upload Research Paper",
    type=["pdf"]
)

# =====================================================
# Create uploads folder
# =====================================================
os.makedirs("uploads", exist_ok=True)

# =====================================================
# Future AI Module Imports
# (Enable these when AI modules are implemented)
# =====================================================

# from utils.summarizer import summarize_text
# from utils.embeddings import generate_embeddings
# from utils.chatbot import ask_question

# =====================================================
# Validate, Save and Read PDF
# =====================================================
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

        try:

            # Loading spinner while extracting text
            with st.spinner("📖 Extracting text from your research paper..."):
                text = extract_text_from_pdf(file_path)

            # Success message
            st.success(
                f"✅ '{uploaded_file.name}' uploaded and processed successfully!"
            )

            st.divider()

            # =====================================================
            # Display Extracted Text
            # =====================================================
            st.subheader("📑 Extracted Research Paper")

            st.text_area(
                "Research Paper Content",
                text,
                height=400
            )

            # =====================================================
            # Future AI Module Integration
            # =====================================================
            st.divider()

            st.subheader("🤖 AI Features")

            st.info(
                """
AI modules will be integrated here.

Planned features:
• 📄 Research Paper Summarization
• 🔍 Semantic Search using Embeddings
• 💬 AI Chatbot for Question Answering
• 📝 Keyword Extraction
• 📚 Citation Assistance
                """
            )

        except Exception as e:
            st.error(f"❌ {e}")