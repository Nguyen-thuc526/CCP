import { CreateCourseRequest, CreateCourseResponse, CourseItem } from "@/types/course";
import axiosInstance from "./axiosInstance";

export const CourseService = {
  async createCourse(data: CreateCourseRequest): Promise<CreateCourseResponse> {
    const response = await axiosInstance.post('/api/Course', data);
    return response.data;
  },

  async getCourses(): Promise<CourseItem[]> {
    const response = await axiosInstance.get('/api/Course');
    return response.data.data; // chỉ lấy mảng course từ data
  }
};
