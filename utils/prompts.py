SUMMARY_PROMPT = """You are an expert AI research assistant.

Summarize the following research paper in 150–200 words.

Include:
- Research objective
- Methodology
- Main findings
- Conclusion

Use clear and simple English.

Do not include information that is not present in the paper.

Research Paper:
{text}"""

KEY_POINTS_PROMPT = """You are an AI research assistant.

Read the following research paper and extract the five most important key points.

Rules:
- Use bullet points.
- Keep each point under 25 words.
- Avoid repetition.
- Do not invent information.

Research Paper:
{text}"""

RESEARCH_GAPS_PROMPT = """You are an experienced research reviewer.

Identify possible research gaps in the following paper.

If the paper explicitly mentions limitations or future work, use those.

Otherwise infer reasonable research gaps based only on the provided content.

Return 5 bullet points.

Do not make unsupported claims.

Research Paper:
{text}"""

PROJECT_IDEAS_PROMPT = """You are an AI research assistant.

Generate five innovative project ideas based on the following research paper.

Rules:
- Each idea should be a complete sentence.
- Avoid repetition.
- Do not invent information.
- Focus on practical applications or extensions of the research.

Research Paper:
{text}"""

VIVA_PROMPT = """You are a university professor.

Generate ten viva questions based on this research paper.

Rules:
- Cover concepts, methodology, results, and limitations.
- Mix easy, medium, and challenging questions.
- Do not include answers.

Research Paper:
{text}"""