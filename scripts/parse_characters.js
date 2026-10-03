import fs from 'fs';
import path from 'path';

const blogsDir = path.join(process.cwd(), 'BLOGS', 'personajes');
const files = fs.readdirSync(blogsDir).filter(f => f.endsWith('.md'));

export function parseMarkdownFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/);
  
  let inFrontmatter = false;
  const frontmatter = {};
  const bodyLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();
    if (trimmed === '---') {
      if (!inFrontmatter) {
        inFrontmatter = true;
      } else {
        inFrontmatter = false;
      }
      continue;
    }
    if (inFrontmatter) {
      const idx = rawLine.indexOf(':');
      if (idx !== -1) {
        const key = rawLine.slice(0, idx).trim();
        let val = rawLine.slice(idx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        frontmatter[key] = val;
      }
    } else {
      bodyLines.push(rawLine);
    }
  }

  // Parse Body into Sections
  let leadText = '';
  const sections = [];
  let currentSection = null;
  let currentSubheading = '';
  let currentParagraphs = [];

  const flushParagraphs = () => {
    if (currentParagraphs.length > 0) {
      if (currentSection) {
        if (!currentSection.paragraphs) currentSection.paragraphs = [];
        currentSection.paragraphs.push(...currentParagraphs);
      } else if (!leadText) {
        leadText = currentParagraphs.join(' ');
      }
      currentParagraphs = [];
    }
  };

  for (let i = 0; i < bodyLines.length; i++) {
    const line = bodyLines[i].trim();
    if (!line) {
      continue;
    }

    if (line.startsWith('# ')) {
      // Main H1 title
      continue;
    } else if (line.startsWith('## ')) {
      flushParagraphs();
      if (currentSection) {
        sections.push(currentSection);
      }
      const heading = line.replace('## ', '').trim();
      currentSection = {
        heading: heading,
        paragraphs: []
      };
    } else if (line.startsWith('### ')) {
      flushParagraphs();
      const sub = line.replace('### ', '').trim();
      if (currentSection) {
        currentSection.paragraphs.push(`**${sub}**`);
      } else {
        currentParagraphs.push(`**${sub}**`);
      }
    } else {
      // Regular text or bullet
      if (currentSection) {
        currentSection.paragraphs.push(line);
      } else {
        if (!leadText) {
          leadText = line;
        } else {
          leadText += ' ' + line;
        }
      }
    }
  }

  flushParagraphs();
  if (currentSection) {
    sections.push(currentSection);
  }

  return {
    frontmatter,
    leadText,
    sections,
    fullContent: content
  };
}

const parsedAll = files.map(file => {
  const parsed = parseMarkdownFile(path.join(blogsDir, file));
  return {
    file,
    ...parsed
  };
});

console.log(`Successfully parsed ${parsedAll.length} articles.`);
parsedAll.forEach(p => {
  console.log(`- [${p.frontmatter.slug}] ${p.frontmatter.title} (Sections: ${p.sections.length})`);
});
