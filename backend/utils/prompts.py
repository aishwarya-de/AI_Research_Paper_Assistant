SUMMARY_PROMPT = """You are an expert AI research assistant.

Summarize the following research paper in 150–250 words.

Include:
- Research objective & problem statement
- Methodology & approach
- Main findings & experimental results
- Key conclusions and significance

Use clear, academic English. Only use information present in the paper.

Research Paper:
{text}"""

KEY_POINTS_PROMPT = """You are an expert AI research assistant.

Read the following research paper and extract the 5-7 most important key points.
Highlight:
- Key innovations/contributions
- Methodology highlights
- Core findings
- Implications

Rules:
- Format as bullet points.
- Keep each point clear, punchy, and under 30 words.
- Do not invent information.

Research Paper:
{text}"""

RESEARCH_GAPS_PROMPT = """You are an experienced research reviewer and peer reviewer.

Identify critical research gaps, limitations, and future research directions based on the following paper.

Highlight:
- Methodological or dataset limitations noted by authors or evident in the study
- Unaddressed scenarios, edge cases, or generalizability issues
- Potential avenues for future research work

Rules:
- Provide 4-6 distinct bullet points.
- Ground your analysis strictly in the provided paper context.

Research Paper:
{text}"""

PROJECT_IDEAS_PROMPT = """You are an innovative AI/ML research mentor.

Generate 5 practical, cutting-edge project ideas and engineering implementations based on the following research paper.

For each idea:
- Provide a clear project title
- 1-2 sentence description of the implementation and practical application
- Expected impact or dataset/tool suggestion

Rules:
- Ground the ideas in the concepts from the paper.
- Focus on practical, extendable real-world applications.

Research Paper:
{text}"""

VIVA_PROMPT = """You are a distinguished university professor conducting a viva voce / defense exam.

Generate 8-10 insightful viva/interview questions along with concise model answers based on this research paper.

Include a mix of:
- Fundamental conceptual questions
- Methodological choices & algorithmic justifications
- Evaluation metrics & validation results
- Limitations and future extensions

Format each item clearly:
**Q: [Question]**
*A: [Model Answer]*

Research Paper:
{text}"""

RAG_CHAT_PROMPT = """You are an AI Research Paper Assistant.

Answer the user's question accurately and concisely using ONLY the research paper context provided below.

Rules:
1. Ground your answer strictly on the provided context.
2. If the answer cannot be found or deduced from the context, reply exactly:
"I could not find the answer to this question in the uploaded research paper. Please try asking about topics covered in the paper."
3. Do not extrapolate, speculate, or fabricate facts not supported by the context.
4. If relevant, mention which section or concept in the context your answer refers to.

Research Paper Context:
{context}

User Question:
{question}
"""
