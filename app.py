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

/* Main Background */
.stApp{
    background-color: #F8FAFC;
    color: #1F2937;
}

/* Sidebar */
[data-testid="stSidebar"]{
    background-color: #E2E8F0;
}

/* Sidebar Text */
[data-testid="stSidebar"] *{
    color: #1F2937;
}

/* Main Title */
h1{
    color: #0F172A;
    text-align: center;
    font-size: 42px;
    font-weight: bold;
}

/* Subheadings */
h2, h3{
    color: #1E3A8A;
}

/* Normal Text */
p, label, div{
    color: #1F2937;
}

/* Text Input */
.stTextInput input{
    color: #1F2937;
    background-color: white;
}

/* Text Area */
textarea{
    color: #1F2937 !important;
    background-color: white !important;
}

/* Buttons */
.stButton>button{
    background-color: #2563EB;
    color: white;
    border-radius: 10px;
}

.stButton>button:hover{
    background-color: #1D4ED8;
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

               text = extract_text_from_pdf(file_path)

               process_document(text)

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

        