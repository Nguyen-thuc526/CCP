// utils/storage.ts
export const storage = {
  setToken(token: string) {
    localStorage.setItem('token', token);
  },
  getToken(): string | null {
    return localStorage.getItem('token');
  },
  removeToken() {
    localStorage.removeItem('token');
  },
};