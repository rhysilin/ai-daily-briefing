import fs from 'node:fs';

const articles = JSON.parse(fs.readFileSync(new URL('../data/seed-articles.json', import.meta.url), 'utf8'));
if (!Array.isArray(articles)) throw new Error('seed-articles.json must be an array');
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

const courses = JSON.parse(fs.readFileSync(new URL('../data/courses.json', import.meta.url), 'utf8'));
if (!Array.isArray(courses) || courses.length === 0) throw new Error('courses.json must be a non-empty array');
const courseSlugs = new Set();
for (const course of courses) {
  for (const key of ['slug', 'title', 'description', 'level', 'category', 'summary']) {
    if (!course[key]) throw new Error(`course missing ${key}`);
  }
  if (courseSlugs.has(course.slug)) throw new Error(`duplicate course slug: ${course.slug}`);
  courseSlugs.add(course.slug);
  if (!Array.isArray(course.lessons) || course.lessons.length === 0) throw new Error(`${course.slug}: lessons must be non-empty array`);
  for (const lesson of course.lessons) {
    for (const key of ['id', 'title', 'summary', 'sourceUrl']) {
      if (!lesson[key]) throw new Error(`${course.slug}: lesson missing ${key}`);
    }
  }
}

console.log(`seed-articles.json ok (${articles.length} articles)`);
console.log(`courses.json ok (${courses.length} courses)`);
