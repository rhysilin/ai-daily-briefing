import fs from 'node:fs';

const reports = JSON.parse(fs.readFileSync(new URL('../data/reports.json', import.meta.url), 'utf8'));
if (!Array.isArray(reports) || reports.length === 0) {
  throw new Error('reports.json must be a non-empty array');
}

const seen = new Set();
for (const report of reports) {
  for (const key of ['date', 'title', 'subtitle', 'summary', 'sections', 'actions']) {
    if (!(key in report)) throw new Error(`report missing required field: ${key}`);
  }
  if (seen.has(report.date)) throw new Error(`duplicate report date: ${report.date}`);
  seen.add(report.date);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(report.date)) throw new Error(`invalid date: ${report.date}`);
  if (!Array.isArray(report.sections) || report.sections.length === 0) {
    throw new Error(`${report.date}: sections must be a non-empty array`);
  }
  for (const section of report.sections) {
    if (!section.name || !Array.isArray(section.items)) {
      throw new Error(`${report.date}: each section needs name and items[]`);
    }
    for (const item of section.items) {
      for (const key of ['title', 'summary', 'why', 'url']) {
        if (!item[key]) throw new Error(`${report.date}: item missing ${key}`);
      }
    }
  }
  if (!Array.isArray(report.actions) || report.actions.length === 0) {
    throw new Error(`${report.date}: actions must be a non-empty array`);
  }
}

console.log(`reports.json ok (${reports.length} reports)`);
