import React from 'react';
import { MarkdownParagraph, renderFormattedInline } from './MarkdownParagraph';

interface SectionParagraphsRendererProps {
  paragraphs: string[];
}

interface ParsedAsciiBox {
  title: string;
  rows: Array<{ label: string; value: string }>;
}

function parseAsciiBoxLines(lines: string[]): ParsedAsciiBox | null {
  const contentLines = lines
    .map(l => l.trim())
    .filter(l => l && !l.startsWith('```') && !/^[┌├└─┬┼┴┐┤┘]+$/.test(l));

  if (contentLines.length === 0) return null;

  let title = '';
  const rows: Array<{ label: string; value: string }> = [];

  for (const line of contentLines) {
    // Strip outer box characters │ or |
    const inner = line.replace(/^[│|]\s*/, '').replace(/\s*[│|]$/, '');
    const parts = inner.split(/[│|]/).map(s => s.trim());

    if (parts.length === 1 && !title && rows.length === 0) {
      title = parts[0];
    } else if (parts.length >= 2) {
      const col1 = parts[0];
      const col2 = parts.slice(1).join(' ');
      if (!col1 && rows.length > 0) {
        // Continuation of previous row's second column
        rows[rows.length - 1].value += ' ' + col2;
      } else if (col1 && !col2 && rows.length > 0) {
        rows[rows.length - 1].label += ' ' + col1;
      } else if (col1 || col2) {
        rows.push({ label: col1, value: col2 });
      }
    } else if (parts.length === 1 && parts[0]) {
      rows.push({ label: parts[0], value: '' });
    }
  }

  return { title: title || 'ESQUEMA TÁCTICO', rows };
}

function parseMarkdownTableLines(lines: string[]): { headers: string[]; rows: string[][] } | null {
  const cleanLines = lines.map(l => l.trim()).filter(Boolean);
  if (cleanLines.length < 2) return null;

  const parseRow = (line: string) =>
    line
      .replace(/^\|\s*/, '')
      .replace(/\s*\|$/, '')
      .split('|')
      .map(c => c.trim());

  const headers = parseRow(cleanLines[0]);
  const dataLines = cleanLines.slice(1).filter(l => !/^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?$/.test(l));
  const rows = dataLines.map(parseRow);

  return { headers, rows };
}

export const SectionParagraphsRenderer: React.FC<SectionParagraphsRendererProps> = ({ paragraphs }) => {
  if (!paragraphs || paragraphs.length === 0) return null;

  const blocks: React.ReactNode[] = [];
  let i = 0;

  while (i < paragraphs.length) {
    const current = (paragraphs[i] || '').trim();

    // 1. Detect Code Block / ASCII Diagram starting with ``` or box characters ┌
    if (current.startsWith('```') || current.startsWith('┌')) {
      const boxLines: string[] = [];

      if (current.startsWith('```') && current.endsWith('```') && current.length > 6) {
        boxLines.push(current.slice(3, -3));
        i++;
      } else if (current.startsWith('```')) {
        i++; // skip opening ```
        while (i < paragraphs.length && !(paragraphs[i] || '').trim().startsWith('```')) {
          boxLines.push(paragraphs[i]);
          i++;
        }
        if (i < paragraphs.length) i++; // skip closing ```
      } else {
        while (
          i < paragraphs.length &&
          /^[┌├└│─]/.test((paragraphs[i] || '').trim())
        ) {
          boxLines.push(paragraphs[i]);
          i++;
        }
      }

      const hasAsciiTable = boxLines.some(l => /[┌├└│]/.test(l));
      if (hasAsciiTable) {
        const parsedBox = parseAsciiBoxLines(boxLines);
        if (parsedBox && parsedBox.rows.length > 0) {
          blocks.push(
            <div key={`ascii-box-${i}`} className="my-6 not-prose rounded-xl overflow-hidden border border-slate-800 bg-slate-900/70 shadow-lg">
              <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ff6486]" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#ffc456]">
                  {parsedBox.title}
                </span>
              </div>
              <div className="divide-y divide-slate-800/70">
                {parsedBox.rows.map((r, rIdx) => (
                  <div key={rIdx} className="p-3.5 sm:px-5 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 hover:bg-slate-900/90 transition-colors">
                    <div className="sm:w-2/5 font-bold text-white text-xs sm:text-sm font-display">
                      {renderFormattedInline(r.label)}
                    </div>
                    {r.value && (
                      <div className="sm:w-3/5 text-slate-300 text-xs sm:text-sm leading-relaxed">
                        {renderFormattedInline(r.value)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
          continue;
        }
      }

      // Flow diagram (e.g. [A] ──> [B])
      blocks.push(
        <div key={`flow-box-${i}`} className="my-5 not-prose p-4 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-xs sm:text-sm text-[#ffc456] space-y-2 shadow-md overflow-x-auto">
          {boxLines.map((line, lIdx) => (
            <div key={lIdx} className="leading-relaxed whitespace-pre-wrap">
              {line}
            </div>
          ))}
        </div>
      );
      continue;
    }

    // 2. Detect Markdown Table (lines starting and ending with |)
    if (current.startsWith('|') && current.endsWith('|')) {
      const tableLines: string[] = [];
      while (
        i < paragraphs.length &&
        (paragraphs[i] || '').trim().startsWith('|') &&
        (paragraphs[i] || '').trim().endsWith('|')
      ) {
        tableLines.push(paragraphs[i]);
        i++;
      }

      const parsedTable = parseMarkdownTableLines(tableLines);
      if (parsedTable && parsedTable.headers.length > 0) {
        blocks.push(
          <div key={`md-table-${i}`} className="my-6 overflow-x-auto not-prose rounded-xl border border-slate-800 shadow-lg">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-900 text-xs font-mono uppercase text-[#ffc456]">
                <tr>
                  {parsedTable.headers.map((h, hIdx) => (
                    <th key={hIdx} className="p-3.5 font-bold border-b border-slate-800">
                      {renderFormattedInline(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-950/60">
                {parsedTable.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-900/40 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-3.5 text-slate-200 leading-relaxed">
                        {renderFormattedInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    // 3. Standard paragraph
    blocks.push(<MarkdownParagraph key={`p-${i}`} content={paragraphs[i]} />);
    i++;
  }

  return <>{blocks}</>;
};
