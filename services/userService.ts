// services/userService.ts
import axiosInstance from './axiosInstance';

export const userService = {
   async getAllUsers() {
      try {
         // Lấy token từ localStorage
         const token = localStorage.getItem('authToken');

         if (!token) {
            throw new Error('Token không tồn tại');
         }

         // Gửi yêu cầu GET đến API với Authorization Bearer token
         const response = await axiosInstance.get('api/Account/all', {
            headers: {
               Authorization: `Bearer ${token}`, // Thêm token vào header
            },
         });

         // Kiểm tra phản hồi từ API và trả về dữ liệu người dùng
         if (response.data.success) {
            return response.data.data; // Dữ liệu người dùng trả về từ API
         } else {
            throw new Error('Không thể lấy dữ liệu người dùng');
         }
      } catch (error) {
         console.error('Lỗi khi gọi API lấy danh sách người dùng:', error);
         throw error;
      }
   },
};
