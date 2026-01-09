import { planRepo } from "@/data/plans/planRepoImpl";
import type { CoursePlan } from "@/lib/types";
import { ref } from "vue";

export function usePlans() {
    const currentPlans = ref<CoursePlan[]>([]);
    const currentPlan = ref<CoursePlan | null>(null);
    const loading = ref(false);
    const error = ref<Error | null>(null);

    const listPlans = async () => {
        loading.value = true;
        error.value = null;

        try {
            const plans = await planRepo.listPlans();
            currentPlans.value = plans;

            if (!currentPlan.value) {
                currentPlan.value = currentPlans.value.at(-1) ?? null;
            }

            return plans;
        } catch (e) {
            error.value = e as Error;
            throw e;
        } finally {
            loading.value = false;
        }
    }

    const createPlan = async (name: string) => {
        loading.value = true;
        error.value = null;

        try {
            const newPlan = await planRepo.createPlan(name);
            currentPlans.value.push(newPlan);
            currentPlan.value = newPlan;
            return newPlan;
        } catch (e) {
            error.value = e as Error;
            throw e;
        } finally {
            loading.value = false;
        }
    }

    const deletePlan = async (id: string) => {
        loading.value = true;
        error.value = null;
        try {
            const wasCurrent = id === currentPlan.value?.id;
            const success = await planRepo.deletePlan(id);
            if (!success) return false;

            currentPlans.value = currentPlans.value.filter((p: CoursePlan) => p.id !== id);

            if (wasCurrent) {
                currentPlan.value = currentPlans.value.at(-1) ?? null;
            }

            return true
        
        } catch (e) {
            error.value = e as Error;
            throw e;
        } finally {
            loading.value = false;
        }
    }

    const renamePlan = async (id: string, newName: string) => {
        loading.value = true;
        error.value = null;

        try {
            const wasCurrent = id === currentPlan.value?.id;

            const newPlan = await planRepo.renamePlan(id, newName);
            currentPlans.value = currentPlans.value.map((p: CoursePlan) => p.id === id ? newPlan : p);

            if (wasCurrent) {
                currentPlan.value = newPlan;
            }
        } catch (e) {
            error.value = e as Error;
            throw e;
        } finally {
            loading.value = false;
        }
    }

    return {
        // Functions
        listPlans,
        createPlan,
        deletePlan,
        renamePlan,

        // refs
        currentPlans,
        currentPlan,
        loading, 
        error,
    }
}