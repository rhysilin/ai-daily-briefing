import Link from 'next/link';
import { ArrowRight, CalendarDays, Database, LockKeyhole, Sparkles } from 'lucide-react';
import { getArticles } from '@/lib/cms';

function formatDate(date) {
  return new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' }).format(new Date(`${date}T08:00:00+08:00`));
}

function groupByDate(articles) {
  return [...new Set(articles.map((article) => article.date))].map((date) => ({
    date,
    label: formatDate(date),
    articles: articles.filter((article) => article.date === date),
  }));
}

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const articles = await getArticles();
  const latest = articles[0];
  const groups = groupByDate(articles);
  const secondary = articles.slice(1, 4);

  return (
    <main className="site-shell">
      <header className="masthead">
        <Link href="/" className="wordmark">AI Briefing</Link>
        <nav className="slash-nav" aria-label="主导航">
          <a href="#latest">最新</a><span>/</span>
          <a href="#archive">归档</a><span>/</span>
          <a href="#cms">AI CMS</a>
        </nav>
        <div className="system-chip"><LockKeyhole size={14} /> AI-only backend</div>
      </header>

      <section className="front-hero" id="latest">
        <div className="hero-copy">
          <div className="section-kicker"><Sparkles size={16} /> Daily intelligence for builders</div>
          <h1>面向小团队的 AI 创业情报库</h1>
          <p>每天由 AI 检索、筛选和写作，把新闻、开源项目和学习资源沉淀为可点击、可归档、可复盘的中文长文。</p>
        </div>
        <aside className="hero-ledger" id="cms">
          <div><strong>{articles.length}</strong><span>已收录文章</span></div>
          <div><strong>{groups.length}</strong><span>归档日期</span></div>
          <div><strong>Blob</strong><span>Vercel 内容库</span></div>
        </aside>
      </section>

      {latest && (
        <section className="lead-layout">
          <article className="lead-story">
            <div className="story-eyebrow">最新 / {formatDate(latest.date)} / {latest.category}</div>
            <h2><Link href={`/articles/${latest.slug}`}>{latest.title}</Link></h2>
            <p>{latest.excerpt}</p>
            <div className="tag-row">{latest.tags?.map((tag) => <span key={tag}>{tag}</span>)}</div>
            <Link className="text-arrow" href={`/articles/${latest.slug}`}>阅读全文 <ArrowRight size={17} /></Link>
          </article>

          <aside className="side-stack">
            <div className="side-title">编辑精选</div>
            {secondary.map((article) => (
              <Link className="mini-story" href={`/articles/${article.slug}`} key={article.slug}>
                <span>{article.category}</span>
                <strong>{article.title}</strong>
                <small>{article.date}</small>
              </Link>
            ))}
          </aside>
        </section>
      )}

      <section className="archive-layout" id="archive">
        <aside className="date-rail">
          <div className="rail-heading"><CalendarDays size={16} /> 日期</div>
          {groups.map((group) => (
            <a href={`#date-${group.date}`} key={group.date}>
              <strong>{group.label}</strong>
              <span>{group.date} · {group.articles.length} 篇</span>
            </a>
          ))}
          <div className="storage-note"><Database size={15} /> 内容由 Vercel Blob 驱动，AI 通过私有 API 更新。</div>
        </aside>

        <div className="archive-feed">
          {groups.map((group) => (
            <section id={`date-${group.date}`} className="feed-day" key={group.date}>
              <div className="day-heading">
                <span>{group.label}</span>
                <small>{group.date}</small>
              </div>
              <div className="feed-list">
                {group.articles.map((article) => (
                  <article className="feed-card" key={article.slug}>
                    <div className="feed-meta"><span>{article.category}</span><time>{article.date}</time></div>
                    <h3><Link href={`/articles/${article.slug}`}>{article.title}</Link></h3>
                    <p>{article.excerpt}</p>
                    <div className="feed-footer">
                      <div className="tag-row compact">{article.tags?.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
                      <Link href={`/articles/${article.slug}`} className="text-arrow">查看正文 <ArrowRight size={15} /></Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
