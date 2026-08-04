import streamlit as st
import os

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
    file_path = os.path.join("uploads", uploaded_file.name)

    with open(file_path, "wb") as f:
        f.write(uploaded_file.getbuffer())

    st.success("PDF uploaded and saved successfully!")