import { Course, CourseNotFoundError } from '@/lib/types';
import { CourseRepo } from './courseRepo';

const getAllCoursesFromLocalStorage = (): Course[] => {
    const rawCourses = localStorage.getItem('courses');
    const courses = rawCourses ? JSON.parse(rawCourses) : [];
    return courses;
}

const getCourseByIdFromLocalStorage = (courseId: number): Course => {
    const courses = getAllCoursesFromLocalStorage();
    const course = courses.find(c => c.id === courseId);

    if (!course) {
        throw new CourseNotFoundError(`Course with id ${courseId} not found`);
    }

    return course;
}

const setAllCoursesInLocalStorage = (courses: Course[]) => {
    localStorage.setItem("courses", JSON.stringify(courses));
}

const setCourseByIdInLocalStorage = (courseId: number, updatedCourse: Course): Course => {
    const courses = getAllCoursesFromLocalStorage();
    const course = getCourseByIdFromLocalStorage(courseId);

    if (!course) {
        throw new CourseNotFoundError(`Course with id ${courseId} not found`);
    }

    const updatedCourses = courses.map(c => c.id === courseId ? updatedCourse : c);
    setAllCoursesInLocalStorage(updatedCourses);
    return course;
}


export const courseRepoMock: CourseRepo = {
    listCourses: async () => {
        return getAllCoursesFromLocalStorage();
    },
    createCourse: async (course: Course) => {
        const id = course.id;
        const newCourse = setCourseByIdInLocalStorage(id, course);
        return newCourse;
    },
    deleteCourse: async (courseId: number) => {
        let courses = getAllCoursesFromLocalStorage();
        courses = courses.filter((c: Course) => c.id !== courseId);
        setAllCoursesInLocalStorage(courses);
        return true;
    },
    updateCourse: async (courseId: number, course: Course) => {
        const newCourse = setCourseByIdInLocalStorage(courseId, course);
        return newCourse;
    },
    getCourseById: async (courseId: number) => {
        return getCourseByIdFromLocalStorage(courseId);
    },
    searchCourses: async (query: string, term?: string) => {
        return [];
    }
}