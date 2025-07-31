'use client';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';
import {
   createEmptyChapter,
   simulateVideoUpload,
   validateChapter,
} from '@/utils/course-content';
import { ToastType, useToast } from '@/hooks/useToast';
import { ChapterFormData, QuizBasicInfo } from '@/types/course';
import { VideoUploader } from './VideoUploader';
import { ArticleEditor } from './ArticleEditor';
import { QuizCreator } from './QuizCreator';
import { CourseService } from '@/services/courseService';

interface AddChapterFormProps {
   onAddChapter: (chapter: ChapterFormData) => void;
   onCancel: () => void;
   videoInputRef: React.RefObject<HTMLInputElement>;
   quizBasicInfo: QuizBasicInfo;
   onQuizBasicInfoChange: (info: QuizBasicInfo) => void;
   onResetQuizForm: () => void;
   createQuiz: (quizData: {
      courseId: string;
      name: string;
      description: string;
   }) => Promise<any>;
   courseId: string;
}

export function AddChapterForm({
   onAddChapter,
   onCancel,
   videoInputRef,
   quizBasicInfo,
   onQuizBasicInfoChange,
   onResetQuizForm,
   createQuiz,
   courseId,
}: AddChapterFormProps) {
   const [tempChapter, setTempChapter] =
      useState<ChapterFormData>(createEmptyChapter());
   const { showToast } = useToast();

   const updateChapter = (updates: Partial<ChapterFormData>) => {
      setTempChapter((prev) => ({ ...prev, ...updates }));
   };

   const handleTypeChange = (type: 'video' | 'article' | 'quiz') => {
      updateChapter({ type });
   };

   const handleSubmit = async () => {
      // Validate based on chapter type
      if (tempChapter.type === 'quiz') {
         if (!quizBasicInfo.name.trim() || !quizBasicInfo.description.trim()) {
            showToast(
               'Vui lòng điền đầy đủ tên và mô tả quiz.',
               ToastType.Error
            );
            return;
         }
         // For quiz, we only need name and description at creation
         const chapterToAdd: ChapterFormData = {
            title: quizBasicInfo.name,
            type: 'quiz',
            content: quizBasicInfo.description,
            description: quizBasicInfo.description,
            quiz: [], // Empty quiz questions initially
         };
         onAddChapter(chapterToAdd);
      } else {
         if (!validateChapter(tempChapter)) {
            showToast(
               'Vui lòng điền đầy đủ thông tin chương.',
               ToastType.Error
            );
            return;
         }
         onAddChapter(tempChapter);
      }

      onResetQuizForm();
   };

   const handleCancel = () => {
      onCancel();
      onResetQuizForm();
   };

   return (
      <div className="border rounded-lg bg-blue-50">
         <div className="p-3 bg-blue-100 border-b flex items-center justify-between">
            <h4 className="font-medium text-blue-800">🔧 Thêm chương mới</h4>
            <Button variant="ghost" size="sm" onClick={handleCancel}>
               <X className="h-4 w-4" />
            </Button>
         </div>
         <div className="p-4 space-y-4">
            <div className="space-y-2">
               <Label>Loại chương</Label>
               <Select
                  value={tempChapter.type}
                  onValueChange={handleTypeChange}
               >
                  <SelectTrigger>
                     <SelectValue placeholder="Chọn loại chương" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="video">Video</SelectItem>
                     <SelectItem value="article">Bài viết</SelectItem>
                     <SelectItem value="quiz">Quiz</SelectItem>
                  </SelectContent>
               </Select>
            </div>

            {tempChapter.type === 'video' && (
               <VideoUploader
                  videoUrl={tempChapter.videoUrl}
                  duration={tempChapter.duration}
                  uploadProgress={tempChapter.uploadProgress}
                  title={tempChapter.title}
                  description={tempChapter.description}
                  onTitleChange={(title) => updateChapter({ title })}
                  onDescriptionChange={(desc) =>
                     updateChapter({ description: desc })
                  }
                  onUploadComplete={(videoUrl, duration) => {
                     updateChapter({
                        videoUrl,
                        content: videoUrl,
                        duration,
                        uploadProgress: undefined,
                     });
                     showToast('Video đã được tải lên.', ToastType.Success);
                  }}
                  id="add-chapter"
               />
            )}

            {tempChapter.type === 'article' && (
               <ArticleEditor
                  title={tempChapter.title}
                  description={tempChapter.description || ''}
                  content={tempChapter.content}
                  onTitleChange={(title) => updateChapter({ title })}
                  onDescriptionChange={(description) =>
                     updateChapter({ description })
                  }
                  onContentChange={(content) => updateChapter({ content })}
                  id="add-chapter"
               />
            )}

            {tempChapter.type === 'quiz' && (
               <QuizCreator
                  onTitleChange={(title) => updateChapter({ title })}
                  onDescriptionChange={(description) =>
                     updateChapter({ description })
                  }
                  basicInfo={quizBasicInfo}
                  onBasicInfoChange={onQuizBasicInfoChange}
               />
            )}

            <div className="flex justify-end gap-2">
               <Button variant="outline" onClick={handleCancel}>
                  Hủy
               </Button>
               <Button onClick={handleSubmit}>Thêm chương</Button>
            </div>
         </div>
      </div>
   );
}
