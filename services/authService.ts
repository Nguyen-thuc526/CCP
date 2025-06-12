// services/authService.ts
import axiosInstance from "./axiosInstance";
import { LoginFormData, RegisterFormData } from "@/lib/validationSchemas";

export const authService = {
  async login(data: LoginFormData) {
    const response = await axiosInstance.post("api/Account/login-counselor", data);
    return response.data; 
  },

  async register(data: RegisterFormData) {
    const response = await axiosInstance.post("api/Account/register-counselor", data);
    return response.data; 
  },
};