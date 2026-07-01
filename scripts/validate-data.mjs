import fs from 'node:fs';

const articles = JSON.parse(fs.readFileSync(new URL('../data/seed-articles.json', import.meta.url), 'utf8'));
if (!Array.isArray(articles) || articles.length === 0) throw new Error('seed-articles.json must be a non-empty array');
const slugs = new Set();
for (const article of articles) {
  for (const key of ['slug', 'date', 'title', 'excerpt', 'body']) {
    if (!article[key]) throw new Error(`article missing ${key}`);
  }
  if (slugs.has(article.slug)) throw new Error(`duplicate slug: ${article.slug}`);
  slugs.add(article.slug);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(article.date)) throw new Error(`invalid date: ${article.date}`);
  if (!Array.isArray(article.sources)) throw new Error(`${article.slug}: sources must be array`);
  for (const source of article.sources) {
    if (!source.title || !source.url) throw new Error(`${article.slug}: invalid source`);
  }
}
console.log(`seed-articles.json ok (${articles.length} articles)`);
