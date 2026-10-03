import React from 'react';

interface MarkdownParagraphProps {
  content: string;
  className?: string;
}

/**
 * Transforms badges and inline markdown into styled HTML markup.
 */
export const processBadgesAndMarkdownToHtml = (text: string): string => {
  if (!text) return '';

  let html = text;

  // 1. Verification Badges
  const confirmedBadgeHtml = `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 mr-2 uppercase tracking-wide align-middle select-none shadow-xs"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>CONFIRMADO</span>`;
  const inferredBadgeHtml = `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-950/90 border border-amber-500/50 text-amber-300 mr-2 uppercase tracking-wide align-middle select-none shadow-xs"><span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>INFERIDO</span>`;
  const speculativeBadgeHtml = `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-purple-950/90 border border-purple-500/50 text-purple-300 mr-2 uppercase tracking-wide align-middle select-none shadow-xs"><span class="w-1.5 h-1.5 rounded-full bg-purple-400"></span>ESPECULATIVO</span>`;

  html = html.replace(/(\*\*\[Confirmado\]:?\*\*|\[Confirmado\]:?)/gi, confirmedBadgeHtml);
  html = html.replace(/(\*\*\[Inferido\]:?\*\*|\[Inferido\]:?)/gi, inferredBadgeHtml);
  html = html.replace(/(\*\*\[Especulativo\]:?\*\*|\[Especulativo\]:?|\*\*\[Rumor\]:?\*\*|\[Rumor\]:?)/gi, speculativeBadgeHtml);

  // 2. Markdown Links: [label](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#ff6486] underline hover:text-[#ffc456] transition-colors font-medium">$1</a>');

  // 3. Markdown Bold: **text** (only if not inside an HTML tag)
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-bold">$1</strong>');

  // 4. Markdown Italic: *text*
  html = html.replace(/(^|[^*])\*([^*]+)\*([^*]|$)/g, '$1<em class="text-slate-200 italic">$2</em>$3');

  // 5. Enhance styling on anchor tags to match theme if not styled
  html = html.replace(/<a\s+(?![^>]*class=)([^>]+)>/gi, '<a class="text-[#ff6486] underline hover:text-[#ffc456] transition-colors font-medium" $1>');

  return html;
};

/**
 * Parses inline markdown tokens or HTML elements safely.
 */
export const renderFormattedInline = (text: string): React.ReactNode => {
  if (!text) return null;

  // If text contains HTML tags (e.g. <a href=, <strong>, <span>, etc.), render as HTML safely
  if (/<[a-z][\s\S]*>/i.test(text) || text.includes('</') || text.includes('<a ') || text.includes('<strong') || text.includes('<span')) {
    const processedHtml = processBadgesAndMarkdownToHtml(text);
    return <span dangerouslySetInnerHTML={{ __html: processedHtml }} />;
  }

  // Pure text/markdown token parsing
  let processed = text;
  const elements: React.ReactNode[] = [];
  const regex = /(\*\*\[Confirmado\]:?\*\*|\[Confirmado\]:?|\*\*\[Inferido\]:?\*\*|\[Inferido\]:?|\*\*\[Especulativo\]:?\*\*|\[Especulativo\]:?|\*\*\[Rumor\]:?\*\*|\[Rumor\]:?|\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\))/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(processed)) !== null) {
    if (match.index > lastIndex) {
      elements.push(processed.substring(lastIndex, match.index));
    }

    const token = match[0];

    if (/(\*\*\[Confirmado\]:?\*\*|\[Confirmado\]:?)/i.test(token)) {
      elements.push(
        <span
          key={`badge-conf-${match.index}`}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 mr-2 uppercase tracking-wide align-middle select-none shadow-xs"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          CONFIRMADO
        </span>
      );
    } else if (/(\*\*\[Inferido\]:?\*\*|\[Inferido\]:?)/i.test(token)) {
      elements.push(
        <span
          key={`badge-inf-${match.index}`}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-950/90 border border-amber-500/50 text-amber-300 mr-2 uppercase tracking-wide align-middle select-none shadow-xs"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          INFERIDO
        </span>
      );
    } else if (/(\*\*\[Especulativo\]:?\*\*|\[Especulativo\]:?|\*\*\[Rumor\]:?\*\*|\[Rumor\]:?)/i.test(token)) {
      elements.push(
        <span
          key={`badge-esp-${match.index}`}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-purple-950/90 border border-purple-500/50 text-purple-300 mr-2 uppercase tracking-wide align-middle select-none shadow-xs"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
          ESPECULATIVO
        </span>
      );
    } else if (token.startsWith('**') && token.endsWith('**')) {
      const inner = token.slice(2, -2);
      elements.push(
        <strong key={`bold-${match.index}`} className="text-white font-bold">
          {renderFormattedInline(inner)}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      const inner = token.slice(1, -1);
      elements.push(
        <em key={`italic-${match.index}`} className="text-slate-200 italic">
          {inner}
        </em>
      );
    } else if (token.startsWith('[') && token.includes('](') && token.endsWith(')')) {
      const label = token.substring(1, token.indexOf(']('));
      const url = token.substring(token.indexOf('](') + 2, token.length - 1);
      elements.push(
        <a
          key={`link-${match.index}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#ff6486] underline hover:text-[#ffc456] transition-colors font-medium"
        >
          {label}
        </a>
      );
    } else {
      elements.push(token);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < processed.length) {
    elements.push(processed.substring(lastIndex));
  }

  return elements;
};

export const MarkdownParagraph: React.FC<MarkdownParagraphProps> = ({ content, className = '' }) => {
  if (!content) return null;

  const trimmed = content.trim();

  // 1. Heading 3: "### Title" or Heading 4: "#### Title"
  if (trimmed.startsWith('### ') || trimmed.startsWith('#### ')) {
    const headingText = trimmed.replace(/^#{3,4}\s+/, '');
    return (
      <h4 className="text-base sm:text-lg font-bold text-white font-display mt-6 mb-3 flex items-center gap-2 border-l-2 border-[#ff6486] pl-3">
        {renderFormattedInline(headingText)}
      </h4>
    );
  }

  // 2. Pure Subheading formatted as "**Subheading**" (single bold line without punctuation or long text)
  if (
    trimmed.startsWith('**') && 
    trimmed.endsWith('**') && 
    !trimmed.includes('[Confirmado]') && 
    !trimmed.includes('[Inferido]') && 
    trimmed.length < 90 && 
    !trimmed.includes('.') &&
    !trimmed.includes('<')
  ) {
    const headingText = trimmed.slice(2, -2);
    return (
      <h4 className="text-sm sm:text-base font-bold text-[#ffc456] font-display mt-5 mb-2 flex items-center gap-2">
        <span className="w-1.5 h-3 bg-[#ff6486] rounded-xs"></span>
        <span>{headingText}</span>
      </h4>
    );
  }

  // 3. Bullet list item: "* Item" or "- Item" (when not inside HTML)
  if ((trimmed.startsWith('* ') || trimmed.startsWith('- ')) && !trimmed.startsWith('<ul>') && !trimmed.startsWith('<ol>')) {
    const itemText = trimmed.replace(/^(\*|-)\s+/, '');
    return (
      <div className={`flex items-start gap-2.5 my-2 pl-2 text-slate-300 leading-relaxed text-sm ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#ff6486] mt-2 shrink-0"></span>
        <div className="flex-1">
          {renderFormattedInline(itemText)}
        </div>
      </div>
    );
  }

  // 4. HTML formatted content (paragraphs, divs, lists, links, spans)
  if (/<[a-z][\s\S]*>/i.test(trimmed) || trimmed.includes('</') || trimmed.includes('<a ') || trimmed.includes('<p>') || trimmed.includes('<div>')) {
    const processedHtml = processBadgesAndMarkdownToHtml(trimmed);
    return (
      <div 
        className={`my-3 text-slate-300 leading-relaxed text-sm sm:text-base font-light prose prose-invert max-w-none ${className}`}
        dangerouslySetInnerHTML={{ __html: processedHtml }}
      />
    );
  }

  // 5. Standard paragraph with inline formatting
  return (
    <p className={`my-3 text-slate-300 leading-relaxed text-sm sm:text-base font-light ${className}`}>
      {renderFormattedInline(trimmed)}
    </p>
  );
};
