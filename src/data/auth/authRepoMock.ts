import { User } from '@/lib/types';
import type { AuthRepo } from './authRepo';

export const authRepoMock: AuthRepo = {
    login: async (username: string, password: string) => {
        return true;
    },
    logout: async () => {
        return;
    },
    signUp: async (username: string, password: string, firstName: string, lastName: string) => {
        return true;
    },
    updateUserInfo: async (user: User) => {
        return user;
    },
    deleteUser: async (userId: string) => {
        return true;
    }
}