import type { PlanRepo } from '../../lib/planRepo';
import { planRepoMock } from '../mock/planRepoMock';
import type { planRepoSupabase } from '../supabase/planRepoSupabase;

export const planRepo: PlanRepo = {
    import.meta.env.VITE_BACKEND === "mock" 
    ? planRepoMock
    : planRepoSupabase
}