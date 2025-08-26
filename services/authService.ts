import axiosInstance from './axiosInstance';
import { LoginFormData, RegisterFormData } from '@/lib/validationSchemas';
import { getRoleFromToken, getNameFromToken } from '@/utils/tokenUtils';
import { Role } from '@/utils/enum';
import { ChangePasswordPayload } from '@/types/auth';

export const authService = {
   async loginAdmin(
      data: LoginFormData
   ): Promise<{ token: string; role: Role }> {
      const response = await axiosInstance.post(
         'api/Account/login-admin',
         data
      );
      const token = response.data.token || response.data.data || response.data;
      if (typeof token !== 'string') throw new Error('Invalid token format');
      const role = getRoleFromToken(token);
      if (!role) throw new Error('Invalid role in token');
      return { token, role }; // admin không cần name
   },

   async login(
      data: LoginFormData
   ): Promise<{ token: string; role: Role; name: string | null }> {
      const response = await axiosInstance.post(
         'api/Account/login-counselor',
         data
      );
      const token = response.data.token || response.data.data || response.data;
      if (typeof token !== 'string') throw new Error('Invalid token format');
      const role = getRoleFromToken(token);
      if (!role) throw new Error('Invalid role in token');

      // chỉ counselor mới cần name
      const name = role === Role.Counselor ? getNameFromToken(token) : null;

      return { token, role, name };
   },

   async register(data: RegisterFormData) {
      const response = await axiosInstance.post(
         'api/Account/register-counselor',
         data
      );
      return response.data;
   },
       async changePassword(data: ChangePasswordPayload) {
    const response = await axiosInstance.put('api/Account/change-password', data);
    return response.data;
  },
};
