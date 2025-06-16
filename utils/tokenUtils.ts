import {jwtDecode} from 'jwt-decode';

import { Role } from '@/utils/enum';
import { ROLE_CLAIM_KEY } from '@/constants/constants';

interface DecodedToken {
  [ROLE_CLAIM_KEY]: string;
}

export const getRoleFromToken = (token: unknown): Role | null => {
  if (typeof token !== 'string' || !token) {
    console.error('Invalid token: must be a non-empty string', { token });
    return null;
  }

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const roleValue = decoded[ROLE_CLAIM_KEY];
    const role = roleValue ? parseInt(roleValue, 10) : null;

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