import { list, put } from '@vercel/blob';
import seedArticles from '@/data/seed-articles.json';

const CMS_BLOB_PATH = 'cms/articles.json';

function sortedArticles(articles) {
  return [...articles]
    .filter((article) => article.status !== 'draft')
    .sort((a, b) => `${b.date || ''}${b.updatedAt || ''}`.localeCompare(`${a.date || ''}${a.updatedAt || ''}`));
}

async function readBlobJson() {
  if (process.env.ENABLE_REMOTE_ARTICLES !== '1') return null;
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return null;

  const result = await list({ prefix: CMS_BLOB_PATH, limit: 1, token });
  const blob = result.blobs.find((item) => item.pathname === CMS_BLOB_PATH) || result.blobs[0];
  if (!blob) return null;

  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(blob.downloadUrl || blob.url, {
    cache: 'no-store',
    headers,
  });
  if (!response.ok) {
    throw new Error(`Failed to read CMS blob: ${response.status}`);
  }
  return response.json();
}

export async function getArticles({ includeDrafts = false } = {}) {
  let articles = null;
  try {
    articles = await readBlobJson();
  } catch (error) {
    console.warn(error);
  }
  const source = Array.isArray(articles) ? articles : seedArticles;
  const filtered = includeDrafts ? source : source.filter((article) => article.status !== 'draft');
  return sortedArticles(filtered);
}

export async function getArticleBySlug(slug) {
  const articles = await getArticles({ includeDrafts: true });
  return articles.find((article) => article.slug === slug && article.status !== 'draft') || null;
}

export function normalizeArticle(input) {
  const now = new Date().toISOString();
  if (!input || typeof input !== 'object') throw new Error('Article payload must be an object');
  if (!input.title) throw new Error('title is required');
  if (!input.body) throw new Error('body is required');

  const date = input.date || now.slice(0, 10);
  const slug = input.slug || `${date}-${String(input.title).toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/gi, '-').replace(/^-|-$/g, '').slice(0, 60)}`;

  return {
    slug,
    date,
    title: String(input.title),
    subtitle: input.subtitle ? String(input.subtitle) : '',
    excerpt: input.excerpt ? String(input.excerpt) : String(input.body).slice(0, 140),
    category: input.category ? String(input.category) : 'AI 日报',
    tags: Array.isArray(input.tags) ? input.tags.map(String) : [],
    status: input.status === 'draft' ? 'draft' : 'published',
    hero: input.hero ? String(input.hero) : '',
    body: String(input.body),
    sections: Array.isArray(input.sections) ? input.sections : [],
    sources: Array.isArray(input.sources) ? input.sources : [],
    actions: Array.isArray(input.actions) ? input.actions.map(String) : [],
    createdAt: input.createdAt || now,
    updatedAt: now,
  };
}

export async function upsertArticle(input) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) throw new Error('BLOB_READ_WRITE_TOKEN is not configured');

  const incoming = normalizeArticle(input);
  const existing = await getArticles({ includeDrafts: true });
  const index = existing.findIndex((article) => article.slug === incoming.slug);
  const next = [...existing];
  if (index >= 0) {
    next[index] = { ...existing[index], ...incoming, createdAt: existing[index].createdAt || incoming.createdAt };
  } else {
    next.unshift(incoming);
  }

  const normalized = sortedArticles(next);
  await put(CMS_BLOB_PATH, JSON.stringify(normalized, null, 2), {
    access: 'private',
    contentType: 'application/json; charset=utf-8',
    allowOverwrite: true,
    token,
  });
  return incoming;
}

export async function seedCmsIfEmpty() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) throw new Error('BLOB_READ_WRITE_TOKEN is not configured');
  const existing = await readBlobJson();
  if (Array.isArray(existing) && existing.length > 0) return existing;
  await put(CMS_BLOB_PATH, JSON.stringify(seedArticles, null, 2), {
    access: 'private',
    contentType: 'application/json; charset=utf-8',
    allowOverwrite: true,
    token,
  });
  return seedArticles;
}
