# 📄 AI Research Paper Assistant

An AI-powered Research Paper Assistant that helps students and researchers quickly understand research papers by generating summaries, identifying research gaps, suggesting innovative project ideas, creating viva questions, and enabling intelligent paper-based Q&A.

---

## 🚀 Project Overview

Reading and understanding research papers can be time-consuming and challenging, especially for students who are new to research.

The AI Research Paper Assistant simplifies this process by allowing users to upload a research paper (PDF) and receive AI-generated insights such as summaries, research gaps, project ideas, and answers to questions about the paper.

---

## ✨ Features

- 📄 Upload Research Papers (PDF)
- 📝 AI-Generated Summary
- 🎯 Extract Key Points
- 🔍 Identify Research Gaps
- 💡 Generate Innovative AI/ML Project Ideas
- ❓ Generate Viva Questions with Answers
- 💬 Chat with the Uploaded Paper (RAG)
- 📥 Download Analysis Report *(Future Enhancement)*

---

## 🏗️ Project Workflow

```
Upload Research Paper (PDF)
            │
            ▼
Extract Text using PyMuPDF
            │
            ▼
AI Analysis using LLM
            │
            ├── Summary
            ├── Key Points
            ├── Research Gaps
            ├── Project Ideas
            ├── Viva Questions
            └── Chat with Paper (RAG)
            │
            ▼
Display Results in Streamlit
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Python | Backend Development |
| Streamlit | Web Application UI |
| PyMuPDF | PDF Text Extraction |
| OpenAI GPT / LLM | AI-powered Analysis |
| Sentence Transformers | Text Embeddings |
| FAISS | Vector Database for Semantic Search |
| VS Code | Development Environment |

---

## 📂 Project Structure

```
AI_Research_Paper_Assistant/
│
├── app.py
├── requirements.txt
├── uploads/
├── utils/
│   ├── pdf_reader.py
│   ├── summarizer.py
│   ├── embeddings.py
│   ├── chatbot.py
│   └── prompts.py
└── README.md
```

---

## ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/your-username/AI_Research_Paper_Assistant.git
```

Move into the project directory

```bash
cd AI_Research_Paper_Assistant
```

Create a virtual environment

```bash
python -m venv venv
```

Activate the virtual environment

### Windows

```bash
venv\Scripts\activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run the application

```bash
streamlit run app.py
```

---

## 🎯 Objectives

- Simplify research paper understanding.
- Reduce the time required to review research papers.
- Help students identify research gaps.
- Inspire innovative AI/ML project ideas.
- Assist students in viva and project presentations.

---

## 🔮 Future Scope

- Compare multiple research papers.
- Mind map generation.
- Automatic citation generation.
- Research trend analysis.
- Multi-language support.
- Voice-based interaction.
- Cloud deployment.

---

## 👩‍💻 Author

**Aishwarya**

Computer Science & Engineering Student | AI & Machine Learning Enthusiast

---

## ⭐ Project Status

🚧 Currently Under Development

This project is being developed step-by-step as part of an AI/ML learning journey.
