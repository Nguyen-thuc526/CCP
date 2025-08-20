'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Save, X, Plus } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { ToastType, useToast } from '@/hooks/useToast';
import { validateChapter } from '@/utils/course-content';
import { ChapterList } from './ChapterList';
import { AddChapterForm } from './AddChapterForm';
import { CourseService } from '@/services/courseService';
import type {
   Chapter,
   CourseContentTabProps,
   Question,
   QuizBasicInfo,
   ChapterDetail,
} from '@/types/course';

export function CourseContentTab(props: CourseContentTabProps) {
   const [isAddingChapter, setIsAddingChapter] = useState(false);
   const [editingChapterId, setEditingChapterId] = useState<string | null>(
      null
   );
   const [currentEditingChapter, setCurrentEditingChapter] =
      useState<Chapter | null>(null);
   const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
      new Set()
   );
   const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(
      new Set()
   );
   const [quizBasicInfo, setQuizBasicInfo] = useState<QuizBasicInfo>({
      name: '',
      description: '',
   });
   const [chapterDetails, setChapterDetails] = useState<
      Map<string, ChapterDetail>
   >(new Map());
   const [chapterErrors, setChapterErrors] = useState<Map<string, string>>(
      new Map()
   );
   const [loadingChapters, setLoadingChapters] = useState<Set<string>>(
      new Set()
   );

   const videoInputRef = useRef<HTMLInputElement>(null);
   const editingVideoInputRef = useRef<HTMLInputElement>(null);
   const { showToast } = useToast();

   const toggleChapterExpansion = useCallback(
      (chapterId: string) => {
         const newExpanded = new Set(expandedChapters);
         if (newExpanded.has(chapterId)) {
            newExpanded.delete(chapterId);
         } else {
            newExpanded.add(chapterId);
         }
         setExpandedChapters(newExpanded);
      },
      [expandedChapters]
   );
   const sortChaptersByCreatedAt = (chs: Chapter[]) =>
      [...chs].sort(
         (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
   const toggleQuestionExpansion = useCallback(
      (questionId: string) => {
         const newExpanded = new Set(expandedQuestions);
         if (newExpanded.has(questionId)) {
            newExpanded.delete(questionId);
         } else {
            newExpanded.add(questionId);
         }
         setExpandedQuestions(newExpanded);
      },
      [expandedQuestions]
   );

   const loadChapterDetail = useCallback(
      async (chapterId: string) => {
         if (chapterDetails.has(chapterId) || loadingChapters.has(chapterId))
            return;

         setLoadingChapters((prev) => new Set([...prev, chapterId]));
         setChapterErrors((prev) => {
            const newErrors = new Map(prev);
            newErrors.delete(chapterId);
            return newErrors;
         });

         try {
            const detail = await CourseService.getChapterDetail(chapterId);

            if (!detail || typeof detail !== 'object') {
               console.error(
                  `❌ Không có dữ liệu chi tiết cho chương ${chapterId}`,
                  detail
               );
               setChapterErrors((prev) =>
                  new Map(prev).set(chapterId, 'Không có dữ liệu chi tiết.')
               );
               return;
            }

            console.log(`✅ Chi tiết chương ${chapterId}:`, detail);
            setChapterDetails((prev) => new Map(prev).set(chapterId, detail));
         } catch (error: any) {
            console.error(
               `❌ Lỗi khi tải chi tiết chương ${chapterId}:`,
               error?.response || error
            );
            const message =
               error?.response?.data?.message ||
               error?.message ||
               'Lỗi không xác định khi tải chi tiết chương.';
            setChapterErrors((prev) => new Map(prev).set(chapterId, message));
            showToast(message, ToastType.Error);
         } finally {
            setLoadingChapters((prev) => {
               const newLoading = new Set(prev);
               newLoading.delete(chapterId);
               return newLoading;
            });
         }
      },
      [chapterDetails, loadingChapters, showToast]
   );

   const prevChapters = useRef<Chapter[]>([]);

   const areArraysEqual = (arr1: Chapter[], arr2: Chapter[]) => {
      if (arr1.length !== arr2.length) return false;
      return arr1.every((item, index) => item.id === arr2[index].id);
   };

   useEffect(() => {
      const chaptersToLoad = props.isEditingMode
         ? props.tempChapters
         : props.courseChapters;
      if (chaptersToLoad.length > 0) {
         const hasChanged =
            !prevChapters.current ||
            !areArraysEqual(chaptersToLoad, prevChapters.current);
         if (hasChanged) {
            // Clear details, errors, and loading when chapters change
            setChapterDetails(new Map());
            setChapterErrors(new Map());
            setLoadingChapters(new Set());
            prevChapters.current = chaptersToLoad;
         }
      }
   }, [props.isEditingMode, props.tempChapters, props.courseChapters]);

   // Sau khi loadChapterDetail xong, nếu đang edit quiz, cập nhật lại currentEditingChapter.quiz
   useEffect(() => {
      if (
         editingChapterId &&
         currentEditingChapter &&
         currentEditingChapter.type === 'quiz'
      ) {
         const detail = chapterDetails.get(editingChapterId);
         if (detail?.quiz?.questions) {
            setCurrentEditingChapter({
               ...currentEditingChapter,
               quiz: detail.quiz.questions.map((q) => ({
                  id: q.id,
                  question: q.description,
                  answers: q.answers.map((a: any, index: number) => ({
                     id: `answer_${index}`,
                     text: a.text,
                     isCorrect: a.score > 0,
                  })),
               })),
            });
         }
      }
   }, [chapterDetails, editingChapterId]);

   const createLecture = useCallback(
      async (lectureData: {
         courseId: string;
         name: string;
         description: string;
         lectureMetadata: string;
      }) => {
         try {
            const response = await CourseService.createLecture(lectureData);
            if (response?.success) {
               return response;
            }
            showToast('Không thể tạo bài giảng.', ToastType.Error);
            return null;
         } catch (error) {
            showToast('Lỗi khi tạo lecture.', ToastType.Error);
            return null;
         }
      },
      [showToast]
   );

   const createVideo = useCallback(
      async (videoData: {
         courseId: string;
         name: string;
         description: string;
         timeVideo: string;
         videoUrl: string;
      }) => {
         try {
            const response = await CourseService.createVideo(videoData);
            if (response?.success) {
               return response;
            }
            showToast('Không thể tạo video.', ToastType.Error);
            return null;
         } catch (error) {
            showToast('Lỗi khi tạo video.', ToastType.Error);
            return null;
         }
      },
      [showToast]
   );

   const createQuiz = useCallback(
      async (quizData: {
         courseId: string;
         name: string;
         description: string;
      }) => {
         try {
            const response = await CourseService.createQuiz(quizData);
            if (response?.success) {
               return response;
            }
            showToast('Không thể tạo quiz.', ToastType.Error);
            return null;
         } catch (error) {
            showToast('Lỗi khi tạo quiz.', ToastType.Error);
            return null;
         }
      },
      [showToast]
   );

   const createQuizQuestions = useCallback(
      async (chapterId: string, questions: Question[]) => {
         try {
            const detail = chapterDetails.get(chapterId);
            console.log('📦 Chi tiết chương khi tạo câu hỏi:', detail);

            if (!detail?.quiz?.id) {
               console.error('❌ Không tìm thấy quizId:', detail?.quiz);
               showToast(
                  'Không tìm thấy quiz để thêm câu hỏi.',
                  ToastType.Error
               );
               return false;
            }

            const quizId = detail.quiz.id;
            console.log('✅ quizId lấy được:', quizId);

            let allSuccess = true;
            for (const question of questions) {
               // Xóa dòng này vì questions ở đây luôn là mới (pending), id chỉ là tạm thời
               // if (question.id) continue;

               const questionData = {
                  quizId: quizId,
                  description: question.question,
                  answers: question.answers.map((a) => ({
                     text: a.text,
                     score: a.isCorrect ? 1 : 0,
                  })),
               };

               console.log('🚀 Đang gửi dữ liệu tạo câu hỏi:', questionData);
               const response =
                  await CourseService.createQuestion(questionData);

               if (!response?.success) {
                  console.error('❌ Lỗi khi tạo câu hỏi:', response);
                  showToast(
                     `Lỗi khi tạo câu hỏi: ${question.question}`,
                     ToastType.Error
                  );
                  allSuccess = false;
               }
            }

            if (allSuccess) {
               // Sau khi tạo xong, luôn reload lại toàn bộ course/chapter
               await props.onRefreshCourse?.();
               await loadChapterDetail(chapterId);
               return true;
            } else {
               showToast(
                  'Một số câu hỏi mới không được tạo.',
                  ToastType.Warning
               );
               return false;
            }
         } catch (error) {
            console.error('❌ Lỗi khi tạo câu hỏi:', error);
            showToast('Lỗi khi tạo câu hỏi.', ToastType.Error);
            // Sau khi tạo xong, luôn reload lại toàn bộ course/chapter
            await props.onRefreshCourse?.();
            await loadChapterDetail(chapterId);
            return false;
         }
      },
      [showToast, chapterDetails, loadChapterDetail, props.onRefreshCourse]
   );

   const updateQuestion = useCallback(
      async (questionId: string, questionData: any, chapterId?: string) => {
         try {
            const response = await CourseService.updateQuestion({
               id: questionId,
               ...questionData,
            });

            if (response?.success) {
               showToast('Câu hỏi đã được cập nhật.', ToastType.Success);

               if (chapterId) {
                  const updatedDetail =
                     await CourseService.getChapterDetail(chapterId);
                  setChapterDetails((prev) =>
                     new Map(prev).set(chapterId, updatedDetail)
                  );
               }

               return true;
            }

            showToast('Không thể cập nhật câu hỏi.', ToastType.Error);

            if (chapterId) {
               const updatedDetail =
                  await CourseService.getChapterDetail(chapterId);
               setChapterDetails((prev) =>
                  new Map(prev).set(chapterId, updatedDetail)
               );
            }

            return false;
         } catch (error) {
            showToast('Lỗi khi cập nhật câu hỏi.', ToastType.Error);

            if (chapterId) {
               const updatedDetail =
                  await CourseService.getChapterDetail(chapterId);
               setChapterDetails((prev) =>
                  new Map(prev).set(chapterId, updatedDetail)
               );
            }

            return false;
         }
      },
      [showToast, setChapterDetails]
   );

const deleteQuestion = useCallback(
  async (questionId: string, chapterId?: string) => {
    try {
      const response = await CourseService.deleteQuestion(questionId);

      if (response?.success) {
        showToast('Câu hỏi đã được xóa.', ToastType.Success);

        if (chapterId) {
          // ✅ cập nhật UI ngay
          setChapterDetails(prev => {
            const map = new Map(prev);
            const detail = map.get(chapterId);
            if (detail?.quiz?.questions) {
              map.set(chapterId, {
                ...detail,
                quiz: {
                  ...detail.quiz,
                  questions: detail.quiz.questions.filter((q: any) => q.id !== questionId),
                },
              });
            }
            return map;
          });

        // đồng bộ lại với server (không chặn UI)
          CourseService.getChapterDetail(chapterId).then(updated =>
            setChapterDetails(prev => new Map(prev).set(chapterId, updated))
          );
        }

        return true;
      }

      showToast('Không thể xóa câu hỏi.', ToastType.Error);
      if (chapterId) {
        const updatedDetail = await CourseService.getChapterDetail(chapterId);
        setChapterDetails(prev => new Map(prev).set(chapterId, updatedDetail));
      }
      return false;
    } catch (error) {
      showToast('Lỗi khi xóa câu hỏi.', ToastType.Error);
      if (chapterId) {
        const updatedDetail = await CourseService.getChapterDetail(chapterId);
        setChapterDetails(prev => new Map(prev).set(chapterId, updatedDetail));
      }
      return false;
    }
  },
  [showToast]
);


   const updateLecture = useCallback(
      async (
         chapterId: string,
         lectureData: {
            chapterName: string;
            chapterDescription: string;
            lectureMetadata: string;
         }
      ) => {
         try {
            const response = await CourseService.updateLecture({
               chapterId,
               ...lectureData,
            });
            if (response?.success) {
               return true;
            }
            showToast('Không thể cập nhật lecture.', ToastType.Error);
            return false;
         } catch (error) {
            showToast('Lỗi khi cập nhật lecture.', ToastType.Error);
            return false;
         }
      },
      [showToast]
   );

   const updateVideo = useCallback(
      async (
         chapterId: string,
         videoData: {
            chapterName: string;
            chapterDescription: string;
            timeVideo: string;
            videoUrl: string;
         }
      ) => {
         try {
            const response = await CourseService.updateVideo({
               chapterId,
               ...videoData,
            });
            if (response?.success) {
               return true;
            }
            showToast('Không thể cập nhật video.', ToastType.Error);
            return false;
         } catch (error) {
            showToast('Lỗi khi cập nhật video.', ToastType.Error);
            return false;
         }
      },
      [showToast]
   );

   const updateQuiz = useCallback(
      async (
         chapterId: string,
         quizData: {
            chapterName: string;
            chapterDescription: string;
         }
      ) => {
         try {
            const response = await CourseService.updateQuiz({
               chapterId,
               ...quizData,
            });
            if (response?.success) {
               return true;
            }
            showToast('Không thể cập nhật quiz.', ToastType.Error);
            return false;
         } catch (error) {
            showToast('Lỗi khi cập nhật quiz.', ToastType.Error);
            return false;
         }
      },
      [showToast]
   );

   const resetQuizForm = useCallback(() => {
      setQuizBasicInfo({ name: '', description: '' });
   }, []);

   const addChapter = async (chapterData: Omit<Chapter, 'id'>) => {
      let chapterId = Date.now().toString();

      let created;

      if (chapterData.type === 'article') {
         created = await createLecture({
            courseId: props.courseId,
            name: chapterData.title,
            description: chapterData.description || chapterData.title,
            lectureMetadata: chapterData.content,
         });
      } else if (chapterData.type === 'video') {
         created = await createVideo({
            courseId: props.courseId,
            name: chapterData.title,
            description: chapterData.description || chapterData.title,
            timeVideo: chapterData.duration || '00:00:00',
            videoUrl: chapterData.videoUrl || chapterData.content,
         });
      } else if (chapterData.type === 'quiz') {
         created = await createQuiz({
            courseId: props.courseId,
            name: chapterData.title,
            description: chapterData.description || chapterData.title,
         });
      }

      if (!created) return;

      chapterId = created.data.id;

      // ✅ Gọi lại API getCourseById để cập nhật lại danh sách chapter
      await props.onRefreshCourse?.();

      // ✅ Giờ thì mới gọi getChapterDetail được
      const newDetail = await CourseService.getChapterDetail(chapterId);
      const newDetails = new Map(chapterDetails);
      newDetails.set(chapterId, newDetail);
      setChapterDetails(newDetails);

      const createdAtFromApi =
         (created.data as any)?.createAt ||
         (created.data as any)?.createdAt ||
         new Date().toISOString();
      const chapterToAdd: Chapter = {
         id: chapterId,
         ...chapterData,
         createdAt: createdAtFromApi, // ✅ gán thời gian tạo
      };
      const newTempChapters = sortChaptersByCreatedAt([
         ...props.tempChapters,
         chapterToAdd,
      ]); // ✅ sort cũ → mới
      props.setTempChapters(newTempChapters);
      showToast('Chương mới đã được thêm.', ToastType.Success);

      setIsAddingChapter(false);
      resetQuizForm();
      if (videoInputRef.current) videoInputRef.current.value = '';
   };

   const removeChapter = async (chapterId: string) => {
      const originalChapters = [...props.tempChapters];
      const originalDetails = new Map(chapterDetails);

      try {
         const response = await CourseService.deleteChapter(chapterId);

         if (response?.success) {
            showToast('Chương đã được xóa.', ToastType.Success);

            // Cập nhật lại danh sách chương
            const newChapters = originalChapters.filter(
               (chap) => chap.id !== chapterId
            );
            props.setTempChapters(newChapters);

            // Xoá chi tiết chương bị xoá
            const newDetails = new Map(originalDetails);
            newDetails.delete(chapterId);
            setChapterDetails(newDetails);

            // Nếu các chương còn lại chưa có detail thì gọi lại
            for (const chap of newChapters) {
               if (!newDetails.has(chap.id)) {
                  await loadChapterDetail(chap.id); // giống như xử lý sau khi update
               }
            }
         } else {
            showToast(
               response?.error || 'Không thể xóa chương.',
               ToastType.Error
            );
            // Khôi phục lại nếu xóa thất bại
            props.setTempChapters(originalChapters);
            setChapterDetails(originalDetails);
         }
      } catch (error) {
         showToast('Lỗi khi xóa chương.', ToastType.Error);
         props.setTempChapters(originalChapters);
         setChapterDetails(originalDetails);
      }
   };

   const startEditingChapter = (chapter: Chapter) => {
      let editedChapter = { ...chapter };
      const detail = chapterDetails.get(chapter.id);
      if (chapter.type === 'quiz' && detail?.quiz?.questions) {
         editedChapter.quiz = detail.quiz.questions.map((q) => ({
            id: q.id,
            question: q.description,
            answers: q.answers.map((a, index) => ({
               id: `answer_${index}`,
               text: a.text,
               isCorrect: a.score > 0,
            })),
         }));
      }
      setEditingChapterId(chapter.id);
      setCurrentEditingChapter(editedChapter);
   };

   const saveEditingChapter = async () => {
      if (!currentEditingChapter) return;

      if (!validateChapter(currentEditingChapter)) {
         showToast('Vui lòng điền đầy đủ thông tin chương.', ToastType.Error);
         return;
      }

      const originalChapters = [...props.tempChapters];
      const originalDetails = new Map(chapterDetails);

      const updatedChapters = props.tempChapters.map((chap) =>
         chap.id === currentEditingChapter.id ? currentEditingChapter : chap
      );
      props.setTempChapters(updatedChapters);

      let success = false;

      try {
         if (currentEditingChapter.type === 'article') {
            const lectureData = {
               chapterName: currentEditingChapter.title,
               chapterDescription:
                  currentEditingChapter.description ||
                  currentEditingChapter.title,
               lectureMetadata: currentEditingChapter.content,
            };
            success = await updateLecture(
               currentEditingChapter.id,
               lectureData
            );
         } else if (currentEditingChapter.type === 'video') {
            const videoData = {
               chapterName: currentEditingChapter.title,
               chapterDescription:
                  currentEditingChapter.description ||
                  currentEditingChapter.title,
               timeVideo: currentEditingChapter.duration || '00:00:00',
               videoUrl:
                  currentEditingChapter.videoUrl ||
                  currentEditingChapter.content,
            };
            success = await updateVideo(currentEditingChapter.id, videoData);
         } else if (currentEditingChapter.type === 'quiz') {
            const quizData = {
               chapterName: currentEditingChapter.title,
               chapterDescription:
                  currentEditingChapter.description ||
                  currentEditingChapter.title,
            };
            success = await updateQuiz(currentEditingChapter.id, quizData);
         }

         if (success) {
            showToast('Chương đã được cập nhật.', ToastType.Success);
            const updatedDetail = await CourseService.getChapterDetail(
               currentEditingChapter.id
            );
            const newDetails = new Map(chapterDetails);
            newDetails.set(currentEditingChapter.id, updatedDetail);
            setChapterDetails(newDetails);
         } else {
            props.setTempChapters(originalChapters);
            setChapterDetails(originalDetails);
            showToast('Không thể cập nhật chương.', ToastType.Error);
         }
      } catch (error) {
         props.setTempChapters(originalChapters);
         setChapterDetails(originalDetails);
         showToast('Lỗi khi cập nhật chương.', ToastType.Error);
      }

      setEditingChapterId(null);
      setCurrentEditingChapter(null);
   };

   const cancelEditingChapter = () => {
      setEditingChapterId(null);
      setCurrentEditingChapter(null);
   };

   const chaptersToDisplay = props.isEditingMode
      ? props.tempChapters
      : props.courseChapters;

   return (
      <Card>
         <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Danh sách chương</CardTitle>
            <div className="flex gap-2">
               {!props.isEditingMode ? (
                  <Button size="sm" onClick={props.onEdit}>
                     <Edit className="mr-2 h-4 w-4" />
                     Chỉnh sửa
                  </Button>
               ) : (
                  <>
                     <Button
                        size="sm"
                        variant="outline"
                        onClick={props.onCancel}
                     >
                        <X className="mr-2 h-4 w-4" />
                        Hủy
                     </Button>
                     <Button size="sm" onClick={props.onSave}>
                        <Save className="mr-2 h-4 w-4" />
                        Lưu
                     </Button>
                  </>
               )}
               {props.isEditingMode && !isAddingChapter && (
                  <Button size="sm" onClick={() => setIsAddingChapter(true)}>
                     <Plus className="mr-2 h-4 w-4" /> Thêm chương
                  </Button>
               )}
            </div>
         </CardHeader>
         <CardContent className="space-y-4">
            {props.isEditingMode && isAddingChapter && (
               <AddChapterForm
                  onAddChapter={addChapter}
                  onCancel={() => setIsAddingChapter(false)}
                  videoInputRef={
                     videoInputRef as React.RefObject<HTMLInputElement>
                  }
                  quizBasicInfo={quizBasicInfo}
                  onQuizBasicInfoChange={setQuizBasicInfo}
                  onResetQuizForm={resetQuizForm}
                  createQuiz={createQuiz}
                  courseId={props.courseId}
               />
            )}

            <ChapterList
               chapters={chaptersToDisplay}
               isEditingMode={props.isEditingMode}
               expandedChapters={expandedChapters}
               expandedQuestions={expandedQuestions}
               onToggleChapterExpansion={toggleChapterExpansion}
               onToggleQuestionExpansion={toggleQuestionExpansion}
               onEditChapter={startEditingChapter}
               onRemoveChapter={removeChapter}
               editingChapterId={editingChapterId}
               currentEditingChapter={currentEditingChapter}
               onSaveEditingChapter={saveEditingChapter}
               onCancelEditingChapter={cancelEditingChapter}
               onChapterChange={setCurrentEditingChapter}
               editingVideoInputRef={
                  editingVideoInputRef as React.RefObject<HTMLInputElement>
               }
               chapterDetails={chapterDetails}
               onUpdateQuestion={(questionId, questionData, chapterId) =>
                  updateQuestion(questionId, questionData, chapterId)
               }
onDeleteQuestion={(questionId, chapterId) =>
    deleteQuestion(questionId, chapterId)
  }
               onCreateQuestions={createQuizQuestions}
               onRefreshCourse={props.onRefreshCourse}
               onLoadChapterDetail={loadChapterDetail}
               loadingChapters={loadingChapters}
               chapterErrors={chapterErrors}
            />
         </CardContent>
      </Card>
   );
}
