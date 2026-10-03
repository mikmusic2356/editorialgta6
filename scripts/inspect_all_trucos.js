import fs from 'fs';
import path from 'path';

const dir = path.join(process.cwd(), 'BLOGS', 'trucos y consejos');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

const results = [];

files.forEach(file => {
  const raw = fs.readFileSync(path.join(dir, file), 'utf8');
  const lines = raw.split('\n');
  const headings = lines.filter(l => l.startsWith('#')).map(l => l.trim());
  
  // extract frontmatter
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const meta = {};
  if (match) {
    match[1].split('\n').forEach(line => {
      const p = line.split(':');
      if (p.length >= 2) {
        meta[p[0].trim()] = p.slice(1).join(':').trim().replace(/^["']|["']$/g, '');
      }
    });
  }
  
  results.push({
    file,
    slug: meta.slug || file.replace('.md', ''),
    title: meta.title,
    keyword: meta.focus_keyword,
    headings: headings.slice(0, 5)
  });
});

console.log(JSON.stringify(results, null, 2));
