export interface CreateCourseRequest {
  name: string;
}

export interface CreateCourseResponse {
  success: boolean;
  data: string; // ví dụ: "Course created successfully."
  error?: string | null;
}

// Dùng cho danh sách hiển thị
export interface CourseItem {
  id: string;
  name: string;
  thumble: string | null;
  description: string | null;
  price: number | null;
  chapterCount: number;
}
