import fs from 'node:fs';

const data = JSON.parse(fs.readFileSync(new URL('../data/daily.json', import.meta.url), 'utf8'));
const required = ['date', 'title', 'sections', 'actions'];
for (const key of required) {
  if (!(key in data)) throw new Error(`Missing required field: ${key}`);
}
if (!Array.isArray(data.sections) || data.sections.length === 0) {
  throw new Error('sections must be a non-empty array');
}
for (const section of data.sections) {
  if (!section.name || !Array.isArray(section.items)) {
    throw new Error('each section needs name and items[]');
  }
  for (const item of section.items) {
    for (const key of ['title', 'summary', 'why', 'url']) {
      if (!item[key]) throw new Error(`item missing ${key}`);
    }
  }
}
console.log('daily.json ok');
