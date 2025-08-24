import { createSlice } from '@reduxjs/toolkit';
import { Role } from '@/utils/enum';
import { storage } from '@/utils/storage';
import { getRoleFromToken, getNameFromToken } from '@/utils/tokenUtils';

interface AuthState {
   token: string | null;
   role: Role | null;
   name: string | null; // <-- thêm
   isAuthenticated: boolean;
}

// Lấy token/role/name an toàn (chỉ client)
const getInitialState = (): AuthState => {
   if (typeof window !== 'undefined') {
      const token = storage.getToken();
      const role = token ? getRoleFromToken(token) : null;
      const name =
         token && role === Role.Counselor ? getNameFromToken(token) : null;

      return {
         token: token || null,
         role: role || null,
         name,
         isAuthenticated: !!token && !!role,
      };
   }
   return {
      token: null,
      role: null,
      name: null,
      isAuthenticated: false,
   };
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
   name: 'auth',
   initialState,
   reducers: {
      // nhớ truyền name khi login counselor
      login: (
         state,
         action: {
            payload: { token: string; role: Role; name?: string | null };
         }
      ) => {
         state.token = action.payload.token;
         state.role = action.payload.role;
         state.name =
            action.payload.role === Role.Counselor
               ? (action.payload.name ?? getNameFromToken(action.payload.token))
               : null;
         state.isAuthenticated = true;
      },
      logout: (state) => {
         state.token = null;
         state.role = null;
         state.name = null;
         state.isAuthenticated = false;
      },
   },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
