export interface GetCounselorsParams {
   PageNumber: number;
   PageSize: number;
   Status?: number;
}

export interface PaginatedResponse<T> {
   items: T[];
   totalCount: number;
   pageNumber: number;
   pageSize: number;
}

export interface Counselor {
   id: string;
   fullname: string;
   avatar: string;
   description: string;
   price: number;
   yearOfJob: number;
   rating: number;
   reviews: number;
   phone: string;
   status: number;
}
