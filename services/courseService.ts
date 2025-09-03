import {
   CreateCourseRequest,
   CreateCourseResponse,
   CourseItem,
   ChapterDetail,
   CreateLectureRequest,
   CreateLectureResponse,
   CreateQuizRequest,
   CreateQuizResponse,
   CreateQuestionRequest,
   CreateQuestionResponse,
   UpdateQuestionRequest,
   GetQuizResponse,
   AddSubCategoryToCourseRequest,
   AddSubCategoryToCourseResponse,
   CreateVideoRequest,
   CreateVideoResponse,
   UpdateCourseRequest,
   UpdateCourseResponse,
   UpdateLectureRequest,
   UpdateVideoRequest,
   UpdateQuizRequest,
   DeleteChapterResponse,
   GetQuestionsResponse,
} from '@/types/course';

import axiosInstance from './axiosInstance';
import { StringifyOptions } from 'querystring';

export const CourseService = {
   async createCourse(
      data: CreateCourseRequest
   ): Promise<CreateCourseResponse> {
      const response = await axiosInstance.post('/api/Course', data);
      return response.data;
   },

   async getCourses(): Promise<CourseItem[]> {
      const response = await axiosInstance.get('/api/Course');
      return response.data.data;
   },

   async getCourseById(id: string): Promise<CourseItem> {
      const response = await axiosInstance.get(`/api/Course/${id}`);
      return response.data.data;
   },
   async getChapterDetail(id: string): Promise<ChapterDetail> {
      const response = await axiosInstance.get(
         `/api/Course/${id}/chapter-detail`
      );
      return response.data.data;
   },

   async createLecture(
      data: CreateLectureRequest
   ): Promise<CreateLectureResponse> {
      const response = await axiosInstance.post(
         '/api/Course/create-lecture',
         data
      );
      return response.data;
   },

   async createQuiz(data: CreateQuizRequest): Promise<CreateQuizResponse> {
      const response = await axiosInstance.post(
         '/api/Course/create-quiz',
         data
      );
      return response.data;
   },

   async createQuestion(
      data: CreateQuestionRequest
   ): Promise<CreateQuestionResponse> {
      const response = await axiosInstance.post(
         '/api/Course/create-question',
         data
      );
      return response.data;
   },

   async getQuizById(quizId: string): Promise<GetQuizResponse> {
      const response = await axiosInstance.get(`/api/Course/by-quiz/${quizId}`);
      return response.data;
   },

   async deleteQuestion(questionId: string): Promise<{ success: boolean }> {
      const response = await axiosInstance.delete(
         `/api/Course/delete-question/${questionId}`
      );
      return response.data;
   },

   async updateQuestion(
      data: UpdateQuestionRequest
   ): Promise<{ success: boolean }> {
      const response = await axiosInstance.put(
         '/api/Course/update-question',
         data
      );
      return response.data;
   },
   async addSubCategoryToCourse(
      data: AddSubCategoryToCourseRequest
   ): Promise<AddSubCategoryToCourseResponse> {
      const response = await axiosInstance.post(
         '/api/Course/add-subcate',
         data
      );
      return response.data;
   },
   async createVideo(data: CreateVideoRequest): Promise<CreateVideoResponse> {
      const response = await axiosInstance.post(
         '/api/Course/create-video',
         data
      );
      return response.data;
   },
   async updateCourse(
      data: UpdateCourseRequest
   ): Promise<UpdateCourseResponse> {
      const response = await axiosInstance.post(
         '/api/Course/update-course',
         data
      );
      return response.data;
   },
   async updateLecture(
      data: UpdateLectureRequest
   ): Promise<CreateLectureResponse> {
      const response = await axiosInstance.put('/api/Course/lecture', data);
      return response.data;
   },

   async updateVideo(data: UpdateVideoRequest): Promise<CreateVideoResponse> {
      const response = await axiosInstance.put('/api/Course/video', data);
      return response.data;
   },

   async updateQuiz(data: UpdateQuizRequest): Promise<CreateQuizResponse> {
      const response = await axiosInstance.put('/api/Course/quiz', data);
      return response.data;
   },
   async changeCourseStatus(data: {
      courseId: string;
      newStatus: number;
   }): Promise<{ success: boolean }> {
      const response = await axiosInstance.put(
         '/api/Course/change-status',
         data
      );
      return response.data;
   },
   async deleteChapter(chapterId: string): Promise<DeleteChapterResponse> {
      const response = await axiosInstance.delete(`/api/Course/${chapterId}`);
      return response.data;
   },
   async removeSubCategoryFromCourse(data: {
      courseId: string;
      subCategoryId: string;
   }): Promise<{ success: boolean }> {
      const response = await axiosInstance.delete(
         '/api/Course/remove-subcate',
         { data }
      );
      return response.data;
   },
};
