import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, BookOpen, CheckCircle2, ExternalLink, GraduationCap } from 'lucide-react';
import { getCourseBySlug, getCourses } from '@/lib/courses';

export async function generateStaticParams() {
  const courses = await getCourses();
  return courses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return { title: '课程不存在' };
  return { title: `${course.title}｜AI 学院`, description: course.description };
}

export default async function CoursePage({ params }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  return (
    <main className="site-shell article-page">
      <header className="masthead article-masthead">
        <Link href="/" className="wordmark">AI 学院</Link>
        <Link href="/courses" className="back-link"><ArrowLeft size={16} /> 返回课程列表</Link>
      </header>

      <article className="article-layout course-detail">
        <aside className="article-aside">
          <div className="section-kicker"><GraduationCap size={15} /> {course.level}</div>
          <div className="aside-date"><BookOpen size={16} /> {course.lessons.length} 节课</div>
          <div className="tag-row vertical"><span>{course.category}</span><span>专题课程</span><span>AI 学院</span></div>
        </aside>

        <div className="article-main">
          <header className="article-header">
            <div className="story-eyebrow">{course.category} / {course.level}</div>
            <h1>{course.title}</h1>
            <p>{course.subtitle}</p>
          </header>

          <blockquote>{course.summary}</blockquote>

          <section className="prose-card">
            <h2>你将学到</h2>
            <div className="outcome-grid">
              {course.outcomes.map((item) => (
                <div key={item}><CheckCircle2 size={18} /> <span>{item}</span></div>
              ))}
            </div>
          </section>

          <section className="lesson-list-panel">
            <h2>课程目录</h2>
            <div className="lesson-list">
              {course.lessons.map((lesson, index) => (
                <a href={lesson.sourceUrl} target="_blank" rel="noreferrer" className="lesson-row" key={lesson.id}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{lesson.title}</h3>
                    <p>{lesson.summary}</p>
                    <small>{lesson.duration} · 查看原文</small>
                  </div>
                  <ExternalLink size={16} />
                </a>
              ))}
            </div>
          </section>

          <section className="source-panel">
            <h2>课程来源</h2>
            <div className="source-list">
              <a href={course.source.url} target="_blank" rel="noreferrer">{course.source.title}<ExternalLink size={15} /></a>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}
