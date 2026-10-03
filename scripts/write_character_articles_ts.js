import fs from 'fs';
import path from 'path';

const articlesJsonPath = path.join(process.cwd(), 'scripts', 'generated_articles.json');
const articles = JSON.parse(fs.readFileSync(articlesJsonPath, 'utf-8'));

const tsCode = `import { Article } from '../types';

export const CHARACTER_ARTICLES: Article[] = ${JSON.stringify(articles, null, 2)};
`;

fs.writeFileSync(path.join(process.cwd(), 'src', 'data', 'characterArticles.ts'), tsCode, 'utf-8');
console.log('Successfully written src/data/characterArticles.ts');
