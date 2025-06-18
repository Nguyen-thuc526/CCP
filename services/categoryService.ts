

import { CategoryResponse } from '@/types/category';
import axiosInstance from './axiosInstance';

export const categoryService = {
  // API lấy danh sách danh mục hoạt động với subcates
  async getActiveCategoriesWithSub(): Promise<CategoryResponse> {
    const response = await axiosInstance.get('/api/Category/active-with-sub');
    return response.data;
  },
};