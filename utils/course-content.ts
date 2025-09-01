import { Chapter, ChapterFormData } from '@/types/course';

export const getChapterIcon = (type: string) => {
   switch (type) {
      case 'video':
         return 'PlayCircle';
      case 'article':
         return 'FileText';
      case 'quiz':
         return 'HelpCircle';
      default:
         return 'FileText';
   }
};

export const getChapterTypeLabel = (chapter: Chapter) => {
   switch (chapter.type) {
      case 'video':
         return `Video • ${chapter.duration || 'Chưa có thời lượng'}`;
      case 'article':
         return 'Bài viết';
      case 'quiz':
         return `Quiz`;
      default:
         return 'Không xác định';
   }
};

export const validateChapter = (c: ChapterFormData) => {
   if (!c.title?.trim()) return false;
   if (c.type === 'video') return !!c.videoUrl && !!c.duration;
   if (c.type === 'article') return !!c.content?.trim();
   if (c.type === 'quiz') return true; // you validate quiz name/desc elsewhere
   return false;
};

export const createEmptyChapter = (): ChapterFormData => ({
   title: '',
   description: '',
   type: 'video',
   content: '',
   // video fields start undefined; they’ll be filled after upload
   videoUrl: undefined,
   duration: undefined,
   uploadProgress: undefined,
   quiz: [],
});
export const simulateVideoUpload = (
   file: File,
   onProgress: (progress: number) => void,
   onComplete: (videoUrl: string) => void
) => {
   let progress = 0;
   const interval = setInterval(() => {
      progress += 10;
      onProgress(progress);

      if (progress >= 100) {
         clearInterval(interval);
         const videoUrl = URL.createObjectURL(file);
         onComplete(videoUrl);
      }
   }, 200);

   return interval;
};
