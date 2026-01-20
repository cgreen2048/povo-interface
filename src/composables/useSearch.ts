import { ref } from 'vue';
import { Course } from '@/lib/types';
import { courseRepo } from '@/data/courses/courseRepoImpl';

export function useSearch() {
    const currentCourses = ref<Course[] | string>([]);
    const loading = ref(false);
    const error = ref<Error | null>(null);

    const searchCourses = async (query: string, term?: string) => {
        loading.value = true;
        error.value = null;

        try {
            const results = await courseRepo.searchCourses(query, term);
            currentCourses.value = results.length > 0 ? results : "No results found.";
            return currentCourses.value;
        } catch (e) {
            error.value = e as Error;
            throw e;
        } finally {
            loading.value = false;
        }
    }

    return {
        currentCourses,
        loading,
        error,

        searchCourses
    }
}