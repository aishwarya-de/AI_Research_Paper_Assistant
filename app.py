import os
import streamlit as st

from utils.pdf_reader import extract_text_from_pdf
from utils.embeddings import process_document
from utils.summarizer import analyze_paper
from utils.chatbot import ask_question

# =====================================================
# Page Configuration
# =====================================================

st.set_page_config(
    page_title="AI Research Paper Assistant",
    page_icon="📄",
    layout="wide"
)

# =====================================================
# Custom CSS
# =====================================================

st.markdown("""
<style>

.stApp{
    background:#F4F8FB;
}

[data-testid="stSidebar"]{
    background:#E8F0FE;
}

h1{
    color:#1F4E79;
}

h2,h3{
    color:#2C3E50;
}

textarea{
    font-size:15px;
}

</style>
""", unsafe_allow_html=True)

# =====================================================
# Main Title
# =====================================================

st.title("📄 AI Research Paper Assistant")

st.write("""
Upload a research paper (PDF) and let AI automatically:

- 📄 Extract Text
- 📝 Generate Summary
- ⭐ Extract Key Points
- 🔍 Identify Research Gaps
- 💡 Generate Project Ideas
- 🎓 Generate Viva Questions
- 💬 Chat with the Research Paper
""")

st.divider()

# =====================================================
# Sidebar
# =====================================================

st.sidebar.title("Navigation")

st.sidebar.info(
    "Upload a PDF research paper to begin."
)

uploaded_file = st.sidebar.file_uploader(
    "Upload PDF",
    type=["pdf"]
)

# =====================================================
# Create Upload Folder
# =====================================================

os.makedirs("uploads", exist_ok=True)

# =====================================================
# Validate, Save and Read PDF
# =====================================================

if uploaded_file is not None:

    if not uploaded_file.name.lower().endswith(".pdf"):
        st.error("Please upload a valid PDF.")

    elif uploaded_file.size == 0:
        st.error("Uploaded file is empty.")

    else:

        file_path = os.path.join(
            "uploads",
            uploaded_file.name
        )

        with open(file_path, "wb") as f:
            f.write(uploaded_file.getbuffer())

        try:

            with st.spinner("Processing Research Paper..."):

                # Extract Text
                text = extract_text_from_pdf(file_path)

                # Build Embeddings + FAISS Index
                process_document(text)

                # AI Analysis
                results = analyze_paper(text)

            st.success(
                f"{uploaded_file.name} processed successfully!"
            )

            st.divider()

            # =====================================================
            # Display Extracted Text
            # =====================================================

            st.subheader("📑 Extracted Research Paper")

            st.text_area(
                "Research Paper Content",
                text,
                height=350
            )

            # =====================================================
            # AI Summary
            # =====================================================

            st.divider()

            st.subheader("📄 AI Summary")
            st.write(results["summary"])


            # =====================================================
            # Key Points
            # =====================================================

            st.divider()

            st.subheader("⭐ Key Points")
            st.write(results["key_points"])


            # =====================================================
            # Research Gaps
            # =====================================================

            st.divider()

            st.subheader("🔍 Research Gaps")
            st.write(results["research_gaps"])


            # =====================================================
            # Project Ideas
            # =====================================================

            st.divider()

            st.subheader("💡 AI Project Ideas")
            st.write(results["project_ideas"])


            # =====================================================
            # Viva Questions
            # =====================================================

            st.divider()
            st.subheader("🎓 Viva Questions")
            st.write(results["viva_questions"])
            # =====================================================
            # Chat With Research Paper
            # =====================================================
            st.divider()
        

            st.subheader("💬 Chat with Research Paper")

            question = st.text_input(
                "Ask anything about this research paper:"
            )

            if question:

                with st.spinner("Thinking..."):

                    answer = ask_question(question)

                st.success("Answer:")
                st.write(answer)



            st.divider()


        except Exception as e:
            st.error(f"❌ {e}")

        