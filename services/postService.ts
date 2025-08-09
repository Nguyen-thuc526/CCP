import {
   CreatePostRequest,
   CreatePostResponse,
   PostItem,
   UpdatePostRequest,
} from '@/types/post';
import axiosInstance from './axiosInstance';

export const PostService = {
   async createPost(data: CreatePostRequest): Promise<CreatePostResponse> {
      const response = await axiosInstance.post('/api/Post', data);
      return response.data;
   },

   async getPosts(): Promise<PostItem[]> {
      const response = await axiosInstance.get('/api/Post');
      return response.data.data;
   },

   async getPostById(id: string): Promise<PostItem> {
      const response = await axiosInstance.get(`/api/Post/${id}`);
      return response.data.data;
   },

   async updatePost(data: UpdatePostRequest): Promise<{ success: boolean }> {
      const response = await axiosInstance.put('/api/Post', data);
      return response.data;
   },

   async deletePost(id: string): Promise<{ success: boolean }> {
      const response = await axiosInstance.delete(`/api/Post/${id}`);
      return response.data;
   },
};
