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
      const message = error.response?.data?.message || 'Request failed';
      return Promise.reject(new Error(message));
   }
);

export default axiosInstance;
