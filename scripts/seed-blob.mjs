import fs from 'node:fs';
import { put } from '@vercel/blob';

const token = process.env.BLOB_READ_WRITE_TOKEN;
if (!token) throw new Error('BLOB_READ_WRITE_TOKEN is required');
const articles = fs.readFileSync(new URL('../data/seed-articles.json', import.meta.url), 'utf8');
await put('cms/articles.json', articles, {
  access: 'private',
  contentType: 'application/json; charset=utf-8',
  allowOverwrite: true,
  token,
});
console.log('Seeded cms/articles.json to Vercel Blob');
