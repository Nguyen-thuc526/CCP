import { Category, CategoryResponse } from '@/types/category';
import axiosInstance from './axiosInstance';
import { SubCategory } from '@/types/certification';

export const categoryService = {
   // API lấy danh sách danh mục hoạt động với subcates
   async getActiveCategoriesWithSub(): Promise<CategoryResponse> {
      const response = await axiosInstance.get('/api/Category/active-with-sub');
      return response.data;
   },
};

export const getCategoryData = async (): Promise<Category[] | null> => {
   try {
      const response = await axiosInstance.get<CategoryResponse>('/api/Category');
      const { success, data, error } = response.data;

      if (success) {
         return data;
      } else {
         console.error('Error fetching categories:', error);
         return null;
      }
   } catch (err) {
      console.error('Network or server error fetching categories:', err);
      return null;
   }
};
export const createCategory = async (name: string): Promise<Category> => {
   const response = await axiosInstance.post<Category>('/api/Category', {
      name,
   });
   return response.data;
};

interface UpdateCategoryDto {
   id: string;
   name: string;
   status: number;
}

export const updateCategory = async (
   dto: UpdateCategoryDto
): Promise<Category> => {
   const response = await axiosInstance.put(`/api/Category`, dto);
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

export const updateSubCategory = async (sub: {
   id: string;
   name: string;
   status: number;
   categoryId: string;
}): Promise<SubCategory> => {
   const response = await axiosInstance.put('/api/SubCategory', sub);
   const { success, data, error } = response.data;

   if (success) return data as SubCategory;
   throw new Error(error || 'Cập nhật chủ đề con thất bại');
};
