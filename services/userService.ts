// services/userService.ts
import {
  UpdateCounselorProfileRequest,
  UserResponse,
  MyDashboardResponse,
} from '@/types/user';
import axiosInstance from './axiosInstance';

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

  // Get booking dashboard
  async getMyDashboard(): Promise<MyDashboardResponse> {
    const response = await axiosInstance.get<MyDashboardResponse>(
      '/api/Booking/my-dashboard'
    );
    return response.data;
  },
};
