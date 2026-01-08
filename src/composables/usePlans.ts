import { planRepo } from "@/api/wrappers/planRepoImpl";

export function usePlans() {
    return {
        listPlans: () => planRepo.listPlans(),
        createPlan: (name: string) => planRepo.createPlan(name),
    }
}