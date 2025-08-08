import { UpdateCounselorProfileRequest, UserResponse } from '@/types/user';
import axiosInstance from './axiosInstance';

// API service for counselor profile
export const userService = {
   // Get current counselor profile
   async getCounselorProfile(): Promise<UserResponse> {
      const response = await axiosInstance.get<UserResponse>(
         '/api/Account/counselor-my-profile'
      );
      return response.data;
   },

   // Update counselor profile
   async updateCounselorProfile(
      payload: UpdateCounselorProfileRequest
   ): Promise<UserResponse> {
      const response = await axiosInstance.put<UserResponse>(
         '/api/Account/counselor-edit-profile',
         payload
      );
      return response.data;
   },
};
