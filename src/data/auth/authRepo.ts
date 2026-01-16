import { User } from '@/lib/types';

export interface AuthRepo {
  login(username: string, password: string): Promise<boolean>,
  logout(): Promise<void>,
  signUp(username: string, password: string, firstName: string, lastName: string): Promise<boolean>,
  updateUserInfo(user: User): Promise<User>,
  deleteUser(userId: string): Promise<boolean>
}