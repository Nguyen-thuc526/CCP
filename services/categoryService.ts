import { Category, CategoryResponse, SubCategory } from '@/types/category';
import axiosInstance from './axiosInstance';

export const categoryService = {
   // API lấy danh sách danh mục hoạt động với subcates
   async getActiveCategoriesWithSub(): Promise<CategoryResponse> {
      const response = await axiosInstance.get('/api/Category/active-with-sub');
      return response.data;
   },
};
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
   const response = await axiosInstance.post<Category>('/api/Category', {
      name,
   });
   return response.data;
};

export const updateCategory = async (category: Category): Promise<Category> => {
   const response = await axiosInstance.put(`/api/Category`, category);
   const { success, data, error } = response.data;

   if (success) return data as Category;
   throw new Error(error || 'Cập nhật danh mục thất bại');
};

interface CreateSubCategoryRequest {
   categoryId: string;
   name: string;
}
export const createSubCategory = async (
   payload: CreateSubCategoryRequest
): Promise<SubCategory> => {
   const response = await axiosInstance.post('/api/SubCategory', payload);
   const { success, data, error } = response.data;

   if (success) return data as SubCategory;
   throw new Error(error || 'Tạo sub category thất bại');
};
