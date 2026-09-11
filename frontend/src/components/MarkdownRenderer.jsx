import React from 'react';
import { FileText } from 'lucide-react';

export default function MarkdownRenderer({ content, onCitationClick }) {
  if (!content) return null;

  // Simple clean parser for headers, bold text, bullet points, numbered lists, and citation tags
  const renderFormattedText = (text) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();

      if (!trimmed) {
        return <div key={idx} className="h-3" />;
      }

      // Headers ###
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-lg font-bold text-indigo-300 mt-4 mb-2 flex items-center gap-2 border-b border-slate-800 pb-1">
            {trimmed.replace('### ', '')}
          </h3>
        );
      }

      // Headers ##
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-xl font-extrabold text-indigo-200 mt-5 mb-2">
            {trimmed.replace('## ', '')}
          </h2>
        );
      }

      // Bullet points
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const bulletText = trimmed.substring(2);
        return (
          <div key={idx} className="flex items-start gap-2.5 my-1.5 pl-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0 shadow-sm shadow-indigo-400" />
            <div className="text-slate-200 text-sm leading-relaxed">
              {formatInlineStyles(bulletText, onCitationClick)}
            </div>
          </div>
        );
      }

      // Numbered items (e.g. 1. , 2. )
      const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        return (
          <div key={idx} className="flex items-start gap-3 my-2 pl-1">
            <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
              {numMatch[1]}
            </span>
            <div className="text-slate-200 text-sm leading-relaxed pt-0.5">
              {formatInlineStyles(numMatch[2], onCitationClick)}
            </div>
          </div>
        );
      }

      // Default paragraph
      return (
        <p key={idx} className="text-slate-300 text-sm leading-relaxed my-2">
          {formatInlineStyles(line, onCitationClick)}
        </p>
      );
    });
  };

  return <div className="markdown-content space-y-1">{renderFormattedText(content)}</div>;
}

// Inline formatting helper for **bold**, `code`, and [Page X] or [Chunk Y] citations
function formatInlineStyles(text, onCitationClick) {
  // Replace citations pattern like [Page 3] or [Chunk 2]
  const parts = [];
  let lastIndex = 0;
  
  // Regex for **bold** and [Page X] / [Chunk Y]
  const regex = /(\*\*[^*]+\*\*|\[Page \d+\]|\[Chunk \d+\])/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Push preceding normal text
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const matchedStr = match[0];
    if (matchedStr.startsWith('**') && matchedStr.endsWith('**')) {
      parts.push(
        <strong key={match.index} className="font-semibold text-white">
          {matchedStr.slice(2, -2)}
        </strong>
      );
    } else if (matchedStr.startsWith('[Page ') || matchedStr.startsWith('[Chunk ')) {
      parts.push(
        <button
          key={match.index}
          onClick={() => onCitationClick && onCitationClick(matchedStr)}
          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 text-xs font-medium cursor-pointer transition-colors mx-1"
          title="Click to view citation context"
        >
          <FileText className="w-3 h-3" />
          {matchedStr}
        </button>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}
