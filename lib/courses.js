import courses from '@/data/courses.json';

export async function getCourses() {
  return courses.filter((course) => course.status !== 'draft');
}

export async function getCourseBySlug(slug) {
  const allCourses = await getCourses();
  return allCourses.find((course) => course.slug === slug) || null;
}
