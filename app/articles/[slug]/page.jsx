import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CalendarDays, ExternalLink, Sparkles } from 'lucide-react';
import { getArticleBySlug } from '@/lib/cms';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: '文章不存在' };
  return { title: `${article.title}｜AI Briefing`, description: article.excerpt };
}

function paragraphs(text) {
  return String(text || '').split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <main className="site-shell article-page">
      <header className="masthead article-masthead">
        <Link href="/" className="wordmark">AI Briefing</Link>
        <Link href="/" className="back-link"><ArrowLeft size={16} /> 返回首页</Link>
      </header>

      <article className="article-layout">
        <aside className="article-aside">
          <div className="section-kicker"><Sparkles size={15} /> {article.category}</div>
          <div className="aside-date"><CalendarDays size={16} /> {article.date}</div>
          <div className="tag-row vertical">{article.tags?.map((tag) => <span key={tag}>{tag}</span>)}</div>
        </aside>

        <div className="article-main">
          <header className="article-header">
            <div className="story-eyebrow">{article.category} / {article.date}</div>
            <h1>{article.title}</h1>
            <p>{article.subtitle || article.excerpt}</p>
          </header>

          {article.hero && <blockquote>{article.hero}</blockquote>}

          <section className="prose-card">
            {paragraphs(article.body).map((para, index) => <p key={index}>{para}</p>)}
          </section>

          {article.sections?.length > 0 && (
            <section className="prose-card sections-body">
              {article.sections.map((section) => (
                <div key={section.heading}>
                  <h2>{section.heading}</h2>
                  {paragraphs(section.body).map((para, index) => <p key={index}>{para}</p>)}
                </div>
              ))}
            </section>
          )}

          {article.actions?.length > 0 && (
            <section className="action-panel">
              <h2>可行动建议</h2>
              <ol>{article.actions.map((action) => <li key={action}>{action}</li>)}</ol>
            </section>
          )}

          {article.sources?.length > 0 && (
            <section className="source-panel">
              <h2>来源链接</h2>
              <div className="source-list">
                {article.sources.map((source) => (
                  <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>{source.title}<ExternalLink size={15} /></a>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </main>
  );
}
