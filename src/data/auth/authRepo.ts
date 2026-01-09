export interface authRepo {
  login(username: string, password: string): Promise<boolean>,
  logout(): Promise<void>,
  signUp(username: string, password: string, firstName: string, lastName: string): Promise<boolean>
}