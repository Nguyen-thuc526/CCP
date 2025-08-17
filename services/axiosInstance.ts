// services/axiosInstance.ts
import axios from 'axios';

const axiosInstance = axios.create({
   baseURL: 'https://ppcbackend.azurewebsites.net', // Thay bằng base URL thực tế
   timeout: 30000,
   headers: {
      'Content-Type': 'application/json',
   },
});

axiosInstance.interceptors.request.use(
   (config) => {
      const token = localStorage.getItem('token');
      if (token) {
         config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
   },
   (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Lấy message từ server nếu có
    const serverMsg =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      null;

    // Chuẩn hóa message nhưng GIỮ nguyên error gốc để still có error.response
    error.message =
      serverMsg ||
      error?.message ||
      'Request failed';

    return Promise.reject(error); // ❗ KHÔNG new Error(...) để không mất error.response
  }
);

export default axiosInstance;
