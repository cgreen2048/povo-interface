import { CoursePlan } from '@/lib/types';

export interface PlanRepo {
    listPlans(): Promise<CoursePlan[]>;
    createPlan(name: string): Promise<CoursePlan>;
    deletePlan(id: string): Promise<boolean>;
    renamePlan(id: string, name: string): Promise<CoursePlan>;
    addCourseToPlan(planId: string, courseId: number): Promise<CoursePlan>;
    removeCourseFromPlan(planId: string, courseId: number): Promise<CoursePlan>;
}