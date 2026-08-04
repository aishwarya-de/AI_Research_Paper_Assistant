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

# Load environment variables from the .env file
load_dotenv()

# Read the OpenAI API key
api_key = os.getenv("OPENAI_API_KEY")

# Create the OpenAI client
client = OpenAI(api_key=api_key)


def generate_summary(paper_text):
    """
    Generates an AI summary for the given research paper.
    """

    # Insert the paper text into the prompt template
    prompt = SUMMARY_PROMPT.format(text=paper_text)

    # Send the prompt to the OpenAI model
    response = client.responses.create(
        model="gpt-5.5",
        input=prompt,
    )

    # Return only the generated text
    return response.output_text