import { NextResponse } from 'next/server';
import { getArticles, upsertArticle } from '@/lib/cms';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

function checkAuth(request) {
  const token = process.env.AI_CMS_TOKEN;
  if (!token) return false;
  const header = request.headers.get('authorization') || '';
  return header === `Bearer ${token}`;
}

export async function GET(request) {
  if (!checkAuth(request)) return unauthorized();
  const articles = await getArticles({ includeDrafts: true });
  return NextResponse.json({ articles });
}

export async function POST(request) {
  if (!checkAuth(request)) return unauthorized();
  try {
    const payload = await request.json();
    const article = await upsertArticle(payload);
    return NextResponse.json({ ok: true, article, url: `/articles/${article.slug}` });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
