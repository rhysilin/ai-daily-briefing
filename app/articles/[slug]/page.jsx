import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CalendarDays, ExternalLink, Sparkles } from 'lucide-react';
import { getArticleBySlug, getArticles } from '@/lib/cms';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: '文章不存在' };
  return { title: `${article.title}｜AI 创业资讯 CMS`, description: article.excerpt };
}

function paragraphs(text) {
  return String(text || '').split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <main className="site-shell article-shell">
      <Link href="/" className="back-link"><ArrowLeft size={17} /> 返回文章列表</Link>

      <article className="article-detail">
        <header className="detail-hero">
          <div className="hero-kicker"><Sparkles size={16} /> {article.category}</div>
          <h1>{article.title}</h1>
          <p>{article.subtitle || article.excerpt}</p>
          <div className="detail-meta"><CalendarDays size={17} /> {article.date}</div>
          <div className="tag-row large">{article.tags?.map((tag) => <span key={tag}>{tag}</span>)}</div>
        </header>

        {article.hero && <blockquote>{article.hero}</blockquote>}

        <section className="body-card">
          {paragraphs(article.body).map((para, index) => <p key={index}>{para}</p>)}
        </section>

        {article.sections?.length > 0 && (
          <section className="body-card sections-body">
            {article.sections.map((section) => (
              <div key={section.heading}>
                <h2>{section.heading}</h2>
                {paragraphs(section.body).map((para, index) => <p key={index}>{para}</p>)}
              </div>
            ))}
          </section>
        )}

        {article.actions?.length > 0 && (
          <section className="body-card action-box">
            <h2>可行动建议</h2>
            <ol>{article.actions.map((action) => <li key={action}>{action}</li>)}</ol>
          </section>
        )}

        {article.sources?.length > 0 && (
          <section className="body-card source-box">
            <h2>来源链接</h2>
            <div className="source-list">
              {article.sources.map((source) => (
                <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>{source.title}<ExternalLink size={15} /></a>
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}
