import type { PlanRepo } from "../../lib/planRepo";

export const planRepoMock: PlanRepo = {
    async listPlans() {
        return [{ id: 'p1', name: 'Spring 2026 '}]
    },
    async createPlan(name: string) {
        return { id: 'p2', name }
    }
}