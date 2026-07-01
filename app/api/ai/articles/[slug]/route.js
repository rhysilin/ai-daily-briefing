import { NextResponse } from 'next/server';
import { getArticleBySlug, upsertArticle } from '@/lib/cms';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

function checkAuth(request) {
  const token = process.env.AI_CMS_TOKEN;
  if (!token) return false;
  const header = request.headers.get('authorization') || '';
  return header === `Bearer ${token}`;
}

export async function GET(request, { params }) {
  if (!checkAuth(request)) return unauthorized();
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ article });
}

export async function PUT(request, { params }) {
  if (!checkAuth(request)) return unauthorized();
  try {
    const { slug } = await params;
    const payload = await request.json();
    const article = await upsertArticle({ ...payload, slug });
    return NextResponse.json({ ok: true, article, url: `/articles/${article.slug}` });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
