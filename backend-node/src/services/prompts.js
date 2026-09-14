export const PROMPT_MAP = {
  summary: 'Create a concise academic summary of the research paper.',
  'key-points': 'List the major contributions and key findings of the paper.',
  'research-gaps': 'Identify research gaps, limitations, and open questions.',
  'future-scope': 'Discuss future research avenues and scope for extension.',
  'project-ideas': 'Generate practical project ideas grounded in this paper.',
  viva: 'Generate viva voce questions and model answers based on this paper.',
};

export function getPromptTemplate(insightType) {
  if (!PROMPT_MAP[insightType]) {
    throw new Error(`Unknown insight type '${insightType}'. Supported types: ${Object.keys(PROMPT_MAP).join(', ')}`);
  }

  return PROMPT_MAP[insightType];
}
