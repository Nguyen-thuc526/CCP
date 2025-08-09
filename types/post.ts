export interface CreatePostRequest {
   title: string;
   description: string;
   image?: string | null; // <- thêm nếu chưa có
}

export interface UpdatePostRequest {
   id: string;
   title: string;
   description: string;
   status: number;
   image?: string | null; // <- thêm nếu chưa có
}

export interface UpdatePostRequest {
   id: string;
   title: string;
   description: string;
   status: number;
}

export interface PostItem {
   id: string;
   title: string;
   description: string;
   createAt: string;
   status: number;
   image?: string | null;
   views?: number;
}
