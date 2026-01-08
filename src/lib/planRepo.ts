export interface PlanRepo {
    listPlans(): Promise<{ id: string; name: string; }[]>;
    createPlan(name: string): Promise<{ id: string; name: string }>;
    deletePlan(name: string): Promise<boolean>;
    renamePlan(name: string): Promise<boolean>;
}