import type { PlanRepo } from "./planRepo";
import { 
    Course, 
    CoursePlan, 
    CourseAlreadyInPlanError, 
    CourseNotFoundError, 
    PlanNotFoundError  
} from "@/lib/types";


const getAllPlansFromLocalStorage = (): CoursePlan[] => {
    const rawPlans = localStorage.getItem("plans");
    const plans = rawPlans ? JSON.parse(rawPlans) : [];
    return plans;
}

const getPlanFromLocalStorage = (planId: string): CoursePlan => {
    const plans = getAllPlansFromLocalStorage();
    const returnedPlan = plans.find((p: CoursePlan) => p.id === planId);
    if (!returnedPlan) {
        throw new PlanNotFoundError("Plan not found");
    }
    return returnedPlan;
}

const setPlansInLocalStorage = (plans: CoursePlan[]) => {
    const rawPlans = JSON.stringify(plans);
    localStorage.setItem("plans", rawPlans);
}

const getAllCoursesFromLocalStorage = (): Course[] => {
    const rawCourses = localStorage.getItem("courses");
    const courses = rawCourses ? JSON.parse(rawCourses) : [];
    return courses;
}

const getCourseFromLocalStorage = (courseId: number): Course => {
    const courses = getAllCoursesFromLocalStorage();
    const returnedCourse = courses.find((c: Course) => c.id === courseId);

    if (!returnedCourse) {
        throw new CourseNotFoundError("Course not found");
    }
    return returnedCourse
}

export const planRepoMock: PlanRepo = {
    async listPlans() {
        return getAllPlansFromLocalStorage();
    },
    async createPlan(name: string) {
        const newPlan: CoursePlan = {
            id: crypto.randomUUID(),
            name: name,
            courses: []
        }

        const plansList = getAllPlansFromLocalStorage();
        plansList.push(newPlan);
        setPlansInLocalStorage(plansList);

        return newPlan;
    },
    async deletePlan(id: string) {
        let plans = getAllPlansFromLocalStorage();

        plans = plans.filter((p: CoursePlan) => p.id !== id);
        setPlansInLocalStorage(plans);

        return true;
    },
    async renamePlan(id: string, name: string) {
        let plans = getAllPlansFromLocalStorage();
        const planToBeRenamed = plans.find((p: CoursePlan) => p.id === id);
        if (!planToBeRenamed) {
            throw new PlanNotFoundError("Plan not found");
        }

        const updated = { ...planToBeRenamed, name: name };
        plans = plans.map((p: CoursePlan) => p.id === id ? updated : p);
        setPlansInLocalStorage(plans);

        return updated;
    },
    async addCourseToPlan(planId: string, courseId: number) {
        const plans = getAllPlansFromLocalStorage();
        const planToUpdate = getPlanFromLocalStorage(planId);
        const course = getCourseFromLocalStorage(courseId);

        if (planToUpdate.courses.find((c: Course) => c.id === courseId)) {
            throw new CourseAlreadyInPlanError("Course already in plan");
        }

        planToUpdate.courses.push(course);
        const updatedPlans = plans.map((p: CoursePlan) => p.id === planId ? planToUpdate : p);
        setPlansInLocalStorage(updatedPlans);
        
        return planToUpdate;
    },
    async removeCourseFromPlan(planId: string, courseId: number) {
        const plans = getAllPlansFromLocalStorage();
        const planToUpdate = getPlanFromLocalStorage(planId);

        planToUpdate.courses = planToUpdate.courses.filter((c: Course) => c.id !== courseId);

        const updatedPlans = plans.map((p: CoursePlan) => p.id === planId ? planToUpdate : p);
        setPlansInLocalStorage(updatedPlans);

        return planToUpdate;
    }
}

