import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, BookOpen, ExternalLink, GraduationCap } from 'lucide-react';
import { getLessonBySlug, getLessonStaticParams } from '@/lib/courses';
import { renderMarkdown } from '@/lib/markdown';

export async function generateStaticParams() {
  return getLessonStaticParams();
}

export async function generateMetadata({ params }) {
  const { slug, lesson } = await params;
  const data = await getLessonBySlug(slug, lesson);
  if (!data) return { title: '课程正文不存在' };
  return {
    title: `${data.lesson.title}｜${data.course.title}｜AI 学院`,
    description: data.lesson.summary,
  };
}

export default async function LessonPage({ params }) {
  const { slug, lesson } = await params;
  const data = await getLessonBySlug(slug, lesson);
  if (!data) notFound();

  const { course, lesson: currentLesson, markdown } = data;
  const currentIndex = course.lessons.findIndex((item) => item.id === currentLesson.id);
  const previousLesson = currentIndex > 0 ? course.lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < course.lessons.length - 1 ? course.lessons[currentIndex + 1] : null;

  return (
    <main className="site-shell article-page lesson-page">
      <header className="masthead article-masthead">
        <Link href="/" className="wordmark">AI 学院</Link>
        <Link href={`/courses/${course.slug}`} className="back-link"><ArrowLeft size={16} /> 返回课程目录</Link>
      </header>

      <article className="article-layout course-detail">
        <aside className="article-aside lesson-aside">
          <div className="section-kicker"><GraduationCap size={15} /> {course.level}</div>
          <div className="aside-date"><BookOpen size={16} /> 第 {currentIndex + 1} / {course.lessons.length} 节</div>
          <div className="tag-row vertical"><span>{course.category}</span><span>专题课程</span><span>Markdown 正文</span></div>
          <Link className="back-link inline-back" href={`/courses/${course.slug}`}>查看完整目录</Link>
        </aside>

        <div className="article-main">
          <header className="article-header lesson-header">
            <div className="story-eyebrow">{course.title}</div>
            <h1>{currentLesson.title}</h1>
            <p>{currentLesson.summary}</p>
          </header>

          <section
            className="markdown-body"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }}
          />

          <nav className="lesson-navigation" aria-label="课程章节导航">
            {previousLesson ? (
              <Link href={`/courses/${course.slug}/${previousLesson.id}`}>
                <span>上一节</span>
                <strong>{previousLesson.title}</strong>
              </Link>
            ) : <span />}
            {nextLesson ? (
              <Link href={`/courses/${course.slug}/${nextLesson.id}`}>
                <span>下一节</span>
                <strong>{nextLesson.title}</strong>
              </Link>
            ) : <span />}
          </nav>

          <section className="source-panel">
            <h2>原始资料</h2>
            <div className="source-list">
              <a href={currentLesson.sourceUrl} target="_blank" rel="noreferrer">查看 GitHub 原文<ExternalLink size={15} /></a>
              <a href={course.source.url} target="_blank" rel="noreferrer">{course.source.title}<ExternalLink size={15} /></a>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}
