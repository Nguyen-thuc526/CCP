import { createSlice } from '@reduxjs/toolkit';
import { Role } from '@/utils/enum';
import { storage } from '@/utils/storage';
import { getRoleFromToken } from '@/utils/tokenUtils';

// Hàm lấy token an toàn (chỉ chạy ở client-side)
const getInitialState = () => {
   if (typeof window !== 'undefined') {
      const token = storage.getToken();
      const role = token ? getRoleFromToken(token) : null;
      return {
         token: token || null,
         role: role || null,
         isAuthenticated: !!token && !!role,
      };
   }
   return {
      token: null,
      role: null,
      isAuthenticated: false,
   };
};

const initialState = getInitialState();

interface AuthState {
   token: string | null;
   role: Role | null;
   isAuthenticated: boolean;
}

const authSlice = createSlice({
   name: 'auth',
   initialState,
   reducers: {
      login: (state, action: { payload: { token: string; role: Role } }) => {
         state.token = action.payload.token;
         state.role = action.payload.role;
         state.isAuthenticated = true;
      },
      logout: (state) => {
         state.token = null;
         state.role = null;
         state.isAuthenticated = false;
      },
   },
});

export const { login, logout } = authSlice.actions;
const authReducer = authSlice.reducer;
export default authReducer;
