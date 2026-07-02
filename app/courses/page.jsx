import Link from 'next/link';
import { ArrowRight, BookOpen, GraduationCap } from 'lucide-react';
import { getCourses } from '@/lib/courses';

export const metadata = {
  title: '专题课程｜AI 学院',
  description: 'AI 学院专题课程列表：系统学习 AI 教程、工具使用与创业方法。',
};

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <main className="site-shell">
      <header className="masthead article-masthead">
        <Link href="/" className="wordmark">AI 学院</Link>
        <Link href="/" className="back-link">返回首页</Link>
      </header>

      <section className="course-index-hero">
        <div className="section-kicker"><GraduationCap size={15} /> Courses</div>
        <h1>专题课程</h1>
        <p>把零散的 AI 知识整理成可连续学习的系列课程。先建立基础认知，再进入工具实战、工作流和创业案例。</p>
      </section>

      <section className="course-list">
        {courses.map((course) => (
          <Link className="course-card" href={`/courses/${course.slug}`} key={course.slug}>
            <span>{course.level} / {course.category}</span>
            <h2>{course.title}</h2>
            <p>{course.description}</p>
            <div className="course-meta"><BookOpen size={15} /> {course.lessons.length} 节课 · {course.outcomes.length} 个学习目标</div>
            <div className="text-arrow">进入课程 <ArrowRight size={16} /></div>
          </Link>
        ))}
      </section>
    </main>
  );
}
