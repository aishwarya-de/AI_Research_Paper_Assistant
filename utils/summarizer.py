from openai import OpenAI
from dotenv import load_dotenv
import os

from utils.prompts import (
    SUMMARY_PROMPT,
    KEY_POINTS_PROMPT,
    RESEARCH_GAPS_PROMPT,
    PROJECT_IDEAS_PROMPT,
    VIVA_PROMPT,
)

load_dotenv()

api_key = os.getenv("OPENROUTER_API_KEY")

client = OpenAI(
    api_key=api_key,
    base_url="https://openrouter.ai/api/v1",
)

def generate_response(prompt_template, paper_text):
    """
    Sends a prompt to the OpenAI model and returns the generated text.
    """

    # Replace {text} with the actual research paper
    prompt = prompt_template.format(text=paper_text)

    # Send the request to OpenAI
    response = client.responses.create(
        model="nvidia/nemotron-3-ultra-550b-a55b:free",
        input=prompt,
    )

    # Return only the generated text
    return response.output_text
def generate_summary(paper_text):
    """
    Generates an AI summary for the given research paper.
    """

    return generate_response(SUMMARY_PROMPT, paper_text)

def generate_key_points(paper_text):
    """
    Extracts the key points from the given research paper.
    """

    return generate_response(KEY_POINTS_PROMPT, paper_text)

def generate_research_gaps(paper_text):
    """
    Identifies research gaps in the given research paper.
    """

    return generate_response(RESEARCH_GAPS_PROMPT, paper_text)