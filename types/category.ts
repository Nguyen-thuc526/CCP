export interface SubCategory {
  id: string;
  name: string;
  // Add other subcategory fields as needed
}

export interface Category {
  id: string;
  name: string;
  subCategories: SubCategory[];
  // Add other category fields as needed
}

export interface CategoryResponse {
  success: boolean;
  data: Category[];
  message?: string;
}