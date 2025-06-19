
import axiosInstance from "./axiosInstance";

export const userService = {
 async getCounselorProfile(bookingId: string): Promise<UserResponse> {
    const response = await axiosInstance.get('/api/Account/counselor-my-profile');
    return response.data;
  },
};
