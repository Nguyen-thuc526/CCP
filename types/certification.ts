export interface SubCategory {
   id: string;
   name: string;
   status: number;
}
export interface CategoryDetail {
   categoryId: string;
   categoryName: string;
   subCategories: SubCategory[];
}
export interface Certification {
   id: string;
   name: string;
   description: string;
   image: string;
   rejectReason: string | null;
   time: string | null;
   status: number;
   categories: CategoryDetail[];
}
export interface MyCertificationsResponse {
   success: boolean;
   data: Certification[];
   error?: string;
}

export interface CertificationResponse {
   success: boolean;
   data?: any;
   error?: string;
}
