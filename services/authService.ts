import axiosInstance from './axiosInstance';
import { LoginFormData, RegisterFormData } from '@/lib/validationSchemas';
import { getRoleFromToken } from '../utils/tokenUtils';
import { Role } from '@/utils/enum';

export const authService = {
  async loginAdmin(data: LoginFormData): Promise<{ token: string; role: Role }> {
    const response = await axiosInstance.post('api/Account/login-admin', data);
    const token = response.data.token || response.data.data || response.data;
    if (typeof token !== 'string') {
      throw new Error('Invalid token format');
    }
    const role = getRoleFromToken(token);
    if (!role) {
      throw new Error('Invalid role in token');
    }
    return { token, role };
  },

  async login(data: LoginFormData): Promise<{ token: string; role: Role }> {
    const response = await axiosInstance.post('api/Account/login-counselor', data);
    const token = response.data.token || response.data.data || response.data;
    if (typeof token !== 'string') {
      throw new Error('Invalid token format');
    }
    const role = getRoleFromToken(token);
    if (!role) {
      throw new Error('Invalid role in token');
    }
    return { token, role };
  },
  async register(data: RegisterFormData) {
    const response = await axiosInstance.post('api/Account/register-counselor', data);
    return response.data;
  },
};