import { Category, CategoryResponse } from "@/types/category";
import axiosInstance from "./axiosInstance";

export const getCategoryData = async (): Promise<Category[]> => {
    const response = await axiosInstance.get<CategoryResponse>('/api/Category');
    const { success, data, error } = response.data;

    if (success) {
        return data;
    } else {
        throw new Error(error || 'Failed to fetch categories');
    }
};
export const createCategory = async (name: string): Promise<Category> => {
  const response = await axiosInstance.post<Category>('/api/Category', { name });

  return response.data;
};