import { jwtDecode } from 'jwt-decode';
import { Role } from '@/utils/enum';
import { ROLE_CLAIM_KEY } from '@/constants/constants';

// Cho phép nhiều claim phổ biến để fallback nếu backend khác naming
type DecodedToken = Record<string, unknown> & {
   sub?: string;
   name?: string;
   unique_name?: string;
   given_name?: string;
   family_name?: string;
};

export const getRoleFromToken = (token: unknown): Role | null => {
   if (typeof token !== 'string' || !token) {
      console.error('Invalid token: must be a non-empty string', { token });
      return null;
   }
   try {
      const decoded = jwtDecode<DecodedToken>(token);
      const roleValue = decoded[ROLE_CLAIM_KEY] as string | undefined;
      const role = roleValue ? parseInt(roleValue, 10) : NaN;

      if (role !== Role.Admin && role !== Role.Counselor) {
         console.error('Role value is not valid', { roleValue });
         return null;
      }
      return role;
   } catch (error) {
      console.error('Error decoding token:', error);
      return null;
   }
};

export const getNameFromToken = (token: unknown): string | null => {
   if (typeof token !== 'string' || !token) return null;
   try {
      const t = jwtDecode<DecodedToken>(token);
      const full =
         t.sub?.toString().trim() ||
         t.name?.toString().trim() ||
         t.unique_name?.toString().trim() ||
         (t.given_name && t.family_name
            ? `${t.given_name} ${t.family_name}`.trim()
            : '');

      return full || null;
   } catch (e) {
      console.error('Error decoding token (name):', e);
      return null;
   }
};
