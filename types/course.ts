export interface CreateCourseRequest {
   name: string;
}

export interface SubCategory {
   id: string;
   name: string;
   status: string | null;
}

export interface CreateCourseResponse {
   success: boolean;
   data: string;
   error?: string | null;
}

export interface ChapterItem {
   id: string;
   chapNum: number;
   courseId: string;
   name: string;
   description: string | null;
   chapterType: string;
   chapNo: number | null;
   createAt: string;
   status: string | null;
}

export interface ChapterDetail {
   id: string;
   name: string;
   chapNum: number;
   chapterType: string;
   lecture: {
      id: string;
      name: string;
      lectureMetadata: string;
   } | null;
   quiz: GetQuizResponse | null;
}

export interface CourseItem {
   id: string;
   name: string;
   thumble: string | null;
   description: string | null;
   price: number | null;
   rank: number | null;
   rating: number | null;
   chapterCount: number;
   chapters?: ChapterItem[];
   subCategories?: SubCategory[];
}

export interface CreateLectureRequest {
   courseId: string;
   name: string;
   description: string;
   lectureMetadata: string;
}

export interface CreateLectureResponse {
   success: boolean;
   data: ChapterItem;
   error?: string | null;
}

export interface CreateQuizRequest {
   courseId: string;
   name: string;
   description: string;
}

export interface CreateQuizResponse {
   success: boolean;
   data: ChapterItem;
   error?: string | null;
}

// Quiz-related interfaces
export interface CreateQuestionRequest {
   quizId: string;
   description: string;
   answers: {
      text: string;
      score: number;
   }[];
}

export interface CreateQuestionResponse {
   success: boolean;
   data: {
      id: string;
   };
   error?: string | null;
}

export interface UpdateQuestionRequest {
   id: string;
   description: string;
   answers: {
      text: string;
      score: number;
   }[];
}

export interface GetQuizResponse {
   id: string;
   name: string;
   description: string;
   questions: {
      id: string;
      description: string;
      answers: {
         text: string;
         score: number;
      }[];
   }[];
}
export interface AddSubCategoryToCourseRequest {
   courseID: string;
   subCategoryID: string;
}

export interface AddSubCategoryToCourseResponse {
   success: boolean;
   error?: string | null;
}
export interface Question {
   id: string;
   question: string;
   answers: { id: string; text: string; isCorrect: boolean }[];
}

export interface Chapter {
   id: string;
   title: string;
   type: 'video' | 'article' | 'quiz';
   content: string;
   description?: string;
   videoFile?: File;
   videoUrl?: string;
   duration?: string;
   uploadProgress?: number;
   quiz?: Question[];
   createdAt: string;
}

export interface CourseContentTabProps {
   isEditingMode: boolean;
   tempChapters: Chapter[];
   setTempChapters: (chapters: Chapter[]) => void;
   courseChapters: Chapter[];
   courseId: string;
   onEdit: () => void;
   onSave: () => void;
   onCancel: () => void;
   onRefreshCourse?: () => void;
}

export interface ChapterFormData {
  title: string;
  description?: string;

  // One of these 3:
  type: 'video' | 'article' | 'quiz';

  // General field you already use to store article body or video url
  content: string;

  // Video-only data (OPTIONAL so article/quiz chapters still type-check)
  videoUrl?: string;       // used by <VideoUploader>
  duration?: string;       // "HH:MM:SS" in your code
  uploadProgress?: number; // shown while uploading

  // Quiz-only
  quiz?: any[]; // or your QuizQuestion[] if you have it
}
export interface QuizBasicInfo {
   name: string;
   description: string;
}

export interface CreateVideoRequest {
   courseId: string;
   name: string;
   description: string;
   timeVideo: string;
   videoUrl: string;
}

export interface CreateVideoResponse {
   success: boolean;
   data: ChapterItem;
   error?: string | null;
}
export interface UpdateCourseRequest {
   courseId: string;
   name: string;
   thumble: string;
   description: string;
   price: number;
   rank: number;
}

export interface UpdateCourseResponse {
   success: boolean;
   error?: string | null;
}
export interface UpdateLectureRequest {
   chapterId: string;
   chapterName: string;
   chapterDescription: string;
   lectureMetadata: string;
}

export interface UpdateVideoRequest {
   chapterId: string;
   chapterName: string;
   chapterDescription: string;
   timeVideo: string;
   videoUrl: string;
}

export interface UpdateQuizRequest {
   chapterId: string;
   chapterName: string;
   chapterDescription: string;
}
// Thêm vào file "@/types/course"
export interface DeleteChapterResponse {
   success: boolean;
   data?: string; // Có thể trả về thông báo thành công, ví dụ: "Chapter deleted successfully"
   error?: string | null;
}
export interface GetQuestionsResponse {
   success: boolean;
   data: {
      id: string;
      description: string;
      maxScore: number;
      answers: {
         id: string;
         text: string;
         score: number;
      }[];
   }[];
   error: string | null;
}
