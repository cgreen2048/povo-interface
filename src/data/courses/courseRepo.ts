import type { Course } from "@/lib/types";

export interface CourseRepo {
  listCourses(): Promise<Course[]>;
  createCourse(course: Course): Promise<boolean>;
  deleteCourse(courseId: number): Promise<boolean>;
  updateCourse(courseId: number, patch: Course): Promise<Course>;
  getCourseById(courseId: number): Promise<Course>;
  searchCourses(query: string, term?: string): Promise<Course[]>;
}