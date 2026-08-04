import os
import streamlit as st


st.set_page_config(
    page_title="AI Research Paper Assistant",
    page_icon="📄",
    layout="wide"
)


st.title("AI Research Paper Assistant")
st.write("Upload a research paper (PDF) to extract and view its text.")


st.sidebar.title("Navigation")
st.sidebar.write("Upload your research paper from here.")


uploaded_file = st.sidebar.file_uploader(
    "Upload Research Paper",
    type=["pdf"]
)


os.makedirs("uploads", exist_ok=True)


if uploaded_file is not None:


    if not uploaded_file.name.lower().endswith(".pdf"):
        st.error(" Please upload a valid PDF file.")

    elif uploaded_file.size == 0:
        st.error("The uploaded PDF is empty.")

    
    else:
        file_path = os.path.join("uploads", uploaded_file.name)

        with open(file_path, "wb") as file:
            file.write(uploaded_file.getbuffer())

        st.success(" PDF uploaded and saved successfully!")