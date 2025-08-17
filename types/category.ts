export interface SubCategory {
   id: string;
   name: string;
  status?: string | number;
}

export interface Category {
   id: string;
   name: string;
   subCategories: SubCategory[];
   status: number; 
   // Add other category fields as needed
}

export interface CategoryResponse {
   success: boolean;
   data: Category[];
   error?: string;
}
