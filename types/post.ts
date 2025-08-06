export interface CreatePostRequest {
  title: string;
  description: string;
}

export interface CreatePostResponse {
  success: boolean;
  data: PostItem;
  error: any;
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
  createBy: string;
  createAt: string;
  status: number;
}
