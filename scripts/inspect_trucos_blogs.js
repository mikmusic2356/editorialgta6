import fs from 'fs';
import path from 'path';

const dir = path.join(process.cwd(), 'BLOGS', 'trucos y consejos');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

console.log(`Found ${files.length} markdown files in BLOGS/trucos y consejos\n`);

const summary = [];

files.forEach((file, index) => {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  let meta = {};
  if (frontmatterMatch) {
    frontmatterMatch[1].split('\n').forEach(line => {
      const parts = line.split(':');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts.slice(1).join(':').trim().replace(/^["']|["']$/g, '');
        meta[key] = val;
      }
    });
  }
  
  summary.push({
    index: index + 1,
    file,
    title: meta.title || 'NO_TITLE',
    slug: meta.slug || file.replace('.md', ''),
    focus_keyword: meta.focus_keyword,
    category: meta.category,
    length: content.length
  });
});

console.log(JSON.stringify(summary, null, 2));
