import React from 'react';

/**
 * Strips leading Markdown hash symbols and bold delimiters from heading titles
 * e.g., "### 1. Thermodynamic Equilibrium" -> "1. Thermodynamic Equilibrium"
 */
export function cleanHeading(heading) {
  if (!heading || typeof heading !== 'string') return heading;
  return heading
    .replace(/^#+\s*/, '')
    .replace(/^\*\*|\*\*$/g, '')
    .trim();
}

/**
 * Renders inline Markdown tokens: **bold**, *italic*, `code`
 */
export function renderInlineMarkdown(text) {
  if (!text || typeof text !== 'string') return text;

  const tokens = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(text.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      tokens.push(
        <strong key={`b-${match.index}`} className="font-bold text-[#222222]">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      tokens.push(
        <em key={`i-${match.index}`} className="italic text-[#252525]">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      tokens.push(
        <code 
          key={`c-${match.index}`} 
          className="px-1.5 py-0.5 rounded bg-[#FAF8F5] border border-[#E7E0D8] text-[11px] font-mono text-[#C65D32]"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push(text.substring(lastIndex));
  }

  return tokens.length > 0 ? tokens : text;
}

/**
 * Component to render structured Markdown with headings, lists, blockquotes,
 * and inline styles, avoiding raw literal markdown characters like #, ##, etc.
 */
export default function MarkdownRenderer({ content, className = '' }) {
  if (!content) return null;

  const rawLines = typeof content === 'string' ? content.split('\n') : [];
  const elements = [];
  let currentList = null;

  const flushList = () => {
    if (currentList) {
      if (currentList.type === 'ul') {
        elements.push(
          <ul key={`ul-${elements.length}`} className="space-y-2 my-2.5 pl-1">
            {currentList.items}
          </ul>
        );
      } else {
        elements.push(
          <ol key={`ol-${elements.length}`} className="space-y-2 my-2.5 pl-1">
            {currentList.items}
          </ol>
        );
      }
      currentList = null;
    }
  };

  rawLines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Empty line separates paragraphs/lists
    if (!trimmed) {
      flushList();
      return;
    }

    // Heading 4: #### Heading
    if (trimmed.startsWith('#### ')) {
      flushList();
      elements.push(
        <h6 key={idx} className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#C65D32] mt-4 mb-2">
          {renderInlineMarkdown(trimmed.slice(5))}
        </h6>
      );
      return;
    }

    // Heading 3: ### Heading
    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h5 key={idx} className="text-sm sm:text-base font-bold text-[#222222] mt-4 mb-2">
          {renderInlineMarkdown(trimmed.slice(4))}
        </h5>
      );
      return;
    }

    // Heading 2: ## Heading
    if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(
        <h4 key={idx} className="text-base sm:text-lg font-bold text-[#222222] tracking-tight mt-5 mb-2 pb-1 border-b border-[#E7E0D8]">
          {renderInlineMarkdown(trimmed.slice(3))}
        </h4>
      );
      return;
    }

    // Heading 1: # Heading
    if (trimmed.startsWith('# ')) {
      flushList();
      elements.push(
        <h3 key={idx} className="text-lg sm:text-xl font-extrabold text-[#222222] tracking-tight mt-6 mb-3 pb-1 border-b border-[#E7E0D8]">
          {renderInlineMarkdown(trimmed.slice(2))}
        </h3>
      );
      return;
    }

    // Blockquote: > Quote
    if (trimmed.startsWith('> ')) {
      flushList();
      elements.push(
        <blockquote key={idx} className="border-l-4 border-[#C65D32] pl-4 py-2 my-3 bg-[#FAF5EF] rounded-r-xl text-xs sm:text-sm italic text-[#706B66]">
          {renderInlineMarkdown(trimmed.slice(2))}
        </blockquote>
      );
      return;
    }

    // Horizontal Rule: --- or ***
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      flushList();
      elements.push(<hr key={idx} className="border-t border-[#E7E0D8] my-4" />);
      return;
    }

    // Unordered List (- or *)
    if (/^[-*]\s+/.test(trimmed)) {
      const itemContent = trimmed.replace(/^[-*]\s+/, '');
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(
        <li key={`li-${idx}`} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#252525] leading-relaxed">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C65D32] mt-2 shrink-0"></span>
          <span className="flex-1">{renderInlineMarkdown(itemContent)}</span>
        </li>
      );
      return;
    }

    // Ordered List (1. 2.)
    const olMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
    if (olMatch) {
      const num = olMatch[1];
      const itemContent = olMatch[2];
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(
        <li key={`li-${idx}`} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#252525] leading-relaxed">
          <span className="font-mono text-xs font-bold text-[#C65D32] shrink-0 mt-0.5">{num}.</span>
          <span className="flex-1">{renderInlineMarkdown(itemContent)}</span>
        </li>
      );
      return;
    }

    // Regular paragraph
    flushList();
    elements.push(
      <p key={idx} className="text-xs sm:text-sm text-[#252525] leading-relaxed mb-3">
        {renderInlineMarkdown(trimmed)}
      </p>
    );
  });

  flushList();

  return <div className={`markdown-content space-y-1 ${className}`}>{elements}</div>;
}
