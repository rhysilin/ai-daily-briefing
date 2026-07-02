import courses from '@/data/courses.json';
import lessonContent from '@/data/course-lessons.json';

export async function getCourses() {
  return courses.filter((course) => course.status !== 'draft');
}

export async function getCourseBySlug(slug) {
  const allCourses = await getCourses();
  return allCourses.find((course) => course.slug === slug) || null;
}

export async function getLessonBySlug(courseSlug, lessonId) {
  const course = await getCourseBySlug(courseSlug);
  if (!course) return null;

  const lesson = course.lessons.find((item) => item.id === lessonId);
  const markdown = lessonContent?.[courseSlug]?.[lessonId];
  if (!lesson || !markdown) return null;

  return { course, lesson, markdown };
}

export async function getLessonStaticParams() {
  const allCourses = await getCourses();
  return allCourses.flatMap((course) => (
    course.lessons.map((lesson) => ({ slug: course.slug, lesson: lesson.id }))
  ));
}
