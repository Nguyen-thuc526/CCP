
export interface SubCategory {
  id: string;
  name: string;
  status: number;
}

export interface Category {
  id: string;
  name: string;
  status: number;
  subCategories: SubCategory[];
}

export interface CategoryResponse {
  success: boolean;
  data: Category[];
  error: string | null;
}

