import Link from 'next/link';
import { ArrowRight, BookOpen, CalendarDays, Database, GraduationCap, Newspaper, Rocket, Sparkles } from 'lucide-react';
import { getArticles } from '@/lib/cms';
import { getCourses } from '@/lib/courses';

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
  const [articles, courses] = await Promise.all([getArticles(), getCourses()]);
  const latest = articles[0];
  const groups = groupByDate(articles);
  const secondary = articles.slice(1, 4);
  const featuredCourse = courses[0];

  return (
    <main className="site-shell">
      <header className="masthead">
        <Link href="/" className="wordmark">AI 学院</Link>
        <nav className="slash-nav" aria-label="主导航">
          <a href="#courses">专题课程</a><span>/</span>
          <a href="#intelligence">资讯情报</a><span>/</span>
          <Link href="/courses">课程列表</Link>
        </nav>
        <div className="system-chip"><GraduationCap size={14} /> Learn / Tools / Startup</div>
      </header>

      <section className="front-hero" id="top">
        <div className="hero-copy">
          <div className="section-kicker"><Sparkles size={16} /> AI learning hub for builders</div>
          <h1>系统学习 AI，发现新的生产力与创业机会</h1>
          <p>AI 学院持续整理 AI 教程、工具指南、行业资讯和创业情报，帮助个人和小团队把 AI 真正用起来。</p>
        </div>
        <aside className="hero-ledger" id="cms">
          <div><strong>{courses.length}</strong><span>专题课程</span></div>
          <div><strong>{articles.length}</strong><span>资讯与情报</span></div>
          <div><strong>AI</strong><span>学习、工具、创业</span></div>
        </aside>
      </section>

      <section className="course-feature" id="courses">
        <div className="course-feature-copy">
          <div className="section-kicker"><BookOpen size={15} /> 专题课程</div>
          <h2>从课程开始，建立可复用的 AI 能力</h2>
          <p>专题课程会按系列组织，从基础概念、工具使用、工作流到创业案例，帮助你不只是“看资讯”，而是持续积累方法。</p>
          <Link className="text-arrow" href="/courses">查看全部课程 <ArrowRight size={17} /></Link>
        </div>
        {featuredCourse && (
          <Link className="course-card hero-course-card" href={`/courses/${featuredCourse.slug}`}>
            <span>{featuredCourse.level} / {featuredCourse.category}</span>
            <h3>{featuredCourse.title}</h3>
            <p>{featuredCourse.description}</p>
            <div className="course-meta"><strong>{featuredCourse.lessons.length}</strong> 节课 · {featuredCourse.outcomes.length} 个学习目标</div>
          </Link>
        )}
      </section>

      <section className="topic-grid" aria-label="内容方向">
        <div><BookOpen size={20} /><strong>AI 教程</strong><span>基础概念、提示词、工作流、实战课程</span></div>
        <div><Database size={20} /><strong>AI 工具</strong><span>工具推荐、横评、国内可用方案</span></div>
        <div><Newspaper size={20} /><strong>AI 资讯</strong><span>模型更新、产品动态、行业观察</span></div>
        <div><Rocket size={20} /><strong>AI 创业情报</strong><span>机会拆解、商业模式、可执行建议</span></div>
      </section>

      <section id="intelligence">
        {latest ? (
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
        ) : (
          <section className="empty-state">
            <div className="section-kicker"><Newspaper size={15} /> 资讯情报</div>
            <h2>资讯与创业情报即将更新</h2>
            <p>测试文章已清空。后续这里会发布 AI 工具、行业资讯、创业机会和实战案例。</p>
          </section>
        )}
      </section>

      {groups.length > 0 && (
        <section className="archive-layout" id="archive">
          <aside className="date-rail">
            <div className="rail-heading"><CalendarDays size={16} /> 日期</div>
            {groups.map((group) => (
              <a href={`#date-${group.date}`} key={group.date}>
                <strong>{group.label}</strong>
                <span>{group.date} · {group.articles.length} 篇</span>
              </a>
            ))}
            <div className="storage-note"><Database size={15} /> 内容由 AI 学院私有 API 更新。</div>
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
      )}
    </main>
  );
}
