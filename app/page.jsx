import Link from 'next/link';
import { ArrowRight, CalendarDays, Database, FileText, LockKeyhole, Sparkles } from 'lucide-react';
import { getArticles } from '@/lib/cms';

function formatDate(date) {
  return new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' }).format(new Date(`${date}T08:00:00+08:00`));
}

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const articles = await getArticles();
  const latest = articles[0];
  const dates = [...new Set(articles.map((article) => article.date))];

  return (
    <main className="site-shell">
      <nav className="topbar">
        <div className="brand">AI</div>
        <div>
          <strong>AI 创业资讯 CMS</strong>
          <span>AI 维护 · 中文正文 · 持续归档</span>
        </div>
      </nav>

      <section className="hero cms-hero">
        <div className="hero-kicker"><Sparkles size={16} /> AI-maintained CMS</div>
        <h1>不只是日报页面，而是一套由 AI 维护的内容系统</h1>
        <p>每天的资讯会写入 Vercel Blob 内容库，前台展示文章列表、日期归档和可点击的中文正文详情页。后台 API 只给 AI 使用。</p>
        <div className="metrics-row">
          <div><FileText size={20} /><strong>{articles.length}</strong><span>文章</span></div>
          <div><CalendarDays size={20} /><strong>{dates.length}</strong><span>日期</span></div>
          <div><Database size={20} /><strong>Blob</strong><span>Vercel 存储</span></div>
          <div><LockKeyhole size={20} /><strong>API</strong><span>AI 私有后台</span></div>
        </div>
      </section>

      {latest && (
        <section className="featured-card">
          <div>
            <span className="pill">最新文章 · {formatDate(latest.date)}</span>
            <h2>{latest.title}</h2>
            <p>{latest.excerpt}</p>
            <div className="tag-row">{latest.tags?.map((tag) => <span key={tag}>{tag}</span>)}</div>
          </div>
          <Link className="primary-link" href={`/articles/${latest.slug}`}>阅读全文 <ArrowRight size={18} /></Link>
        </section>
      )}

      <div className="content-grid">
        <aside className="archive-panel glass-card">
          <h3>日期列表</h3>
          <div className="date-list">
            {dates.map((date) => (
              <a key={date} href={`#date-${date}`}>{formatDate(date)}<small>{date}</small></a>
            ))}
          </div>
        </aside>

        <section className="article-list">
          {dates.map((date) => (
            <div id={`date-${date}`} className="date-section" key={date}>
              <h2>{formatDate(date)} <span>{date}</span></h2>
              <div className="article-cards">
                {articles.filter((article) => article.date === date).map((article) => (
                  <article className="article-card" key={article.slug}>
                    <div className="article-meta"><span>{article.category}</span><small>{article.date}</small></div>
                    <h3><Link href={`/articles/${article.slug}`}>{article.title}</Link></h3>
                    <p>{article.excerpt}</p>
                    <div className="tag-row">{article.tags?.map((tag) => <span key={tag}>{tag}</span>)}</div>
                    <Link className="read-link" href={`/articles/${article.slug}`}>查看正文 <ArrowRight size={16} /></Link>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
