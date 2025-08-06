'use client';

import type React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
   PlayCircle,
   FileText,
   HelpCircle,
   ChevronDown,
   ChevronUp,
   Edit,
   Trash2,
} from 'lucide-react';
import { getChapterTypeLabel } from '@/utils/course-content';
import { EditChapterForm } from './EditChapterForm';
import type { Chapter, ChapterDetail } from '@/types/course';
import QuizBuilder from '../../quiz-builder';
import HTMLViewer from '@/components/common/HTMLViewer';

interface ChapterListProps {
   chapters: Chapter[];
   isEditingMode: boolean;
   expandedChapters: Set<string>;
   expandedQuestions: Set<string>;
   onToggleChapterExpansion: (chapterId: string) => void;
   onToggleQuestionExpansion: (questionId: string) => void;
   onEditChapter: (chapter: Chapter) => void;
   onRemoveChapter: (chapterId: string) => void;
   editingChapterId: string | null;
   currentEditingChapter: Chapter | null;
   onSaveEditingChapter: () => void;
   onCancelEditingChapter: () => void;
   onChapterChange: (chapter: Chapter) => void;
   editingVideoInputRef: React.RefObject<HTMLInputElement>;
   chapterDetails: Map<string, ChapterDetail>;
  onUpdateQuestion?: (
   questionId: string,
   questionData: any,
   chapterId: string
) => Promise<boolean>;
   onDeleteQuestion?: (questionId: string) => Promise<boolean>;
   onCreateQuestions?: (
      chapterId: string,
      questions: any[]
   ) => Promise<boolean>;
   onRefreshCourse?: () => void;
   onLoadChapterDetail: (chapterId: string) => void;
   loadingChapters: Set<string>;
   chapterErrors: Map<string, string>;
}

export function ChapterList({
   chapters,
   isEditingMode,
   expandedChapters,
   expandedQuestions,
   onToggleChapterExpansion,
   onToggleQuestionExpansion,
   onEditChapter,
   onRemoveChapter,
   editingChapterId,
   currentEditingChapter,
   onSaveEditingChapter,
   onCancelEditingChapter,
   onChapterChange,
   editingVideoInputRef,
   chapterDetails,
   onUpdateQuestion,
   onDeleteQuestion,
   onCreateQuestions,
   onRefreshCourse,
   onLoadChapterDetail,
   loadingChapters,
   chapterErrors,
}: ChapterListProps) {
   const getChapterIcon = (type: string) => {
      switch (type.toLowerCase()) {
         case 'video':
            return <PlayCircle className="h-6 w-6 text-blue-500" />;
         case 'article':
         case 'lecture':
            return <FileText className="h-6 w-6 text-green-500" />;
         case 'quiz':
            return <HelpCircle className="h-6 w-6 text-purple-500" />;
         default:
            return <FileText className="h-6 w-6 text-gray-500" />;
      }
   };

   const handleToggleExpansion = (chapterId: string) => {
      const willExpand = !expandedChapters.has(chapterId);
      onToggleChapterExpansion(chapterId);
      if (willExpand && !chapterDetails.has(chapterId)) {
        onLoadChapterDetail(chapterId);
      }
   };

   return (
      <div className="space-y-4">
         {chapters.map((chapter, index) => {
            const detail = chapterDetails.get(chapter.id);
            const isCurrentlyEditing =
               isEditingMode && editingChapterId === chapter.id;

            if (isCurrentlyEditing && currentEditingChapter) {
               return (
                  <div
                     key={chapter.id}
                     className="border rounded-lg bg-blue-50"
                  >
                     <div className="p-3 bg-blue-100 border-b">
                        <div className="flex items-center gap-2">
                           <div className="flex-shrink-0">
                              {getChapterIcon(chapter.type)}
                           </div>
                           <h4 className="font-medium text-blue-800">
                              🔧 Đang chỉnh sửa: Chương {index + 1} -{' '}
                              {chapter.title}
                           </h4>
                        </div>
                     </div>
                     <div className="p-4">
                        <EditChapterForm
                           chapter={currentEditingChapter}
                           onSave={onSaveEditingChapter}
                           onCancel={onCancelEditingChapter}
                           onChapterChange={onChapterChange}
                           videoInputRef={editingVideoInputRef}
                           detail={detail}
                           onUpdateQuestion={onUpdateQuestion}
                           onDeleteQuestion={onDeleteQuestion}
                        />
                     </div>
                  </div>
               );
            }

            const chapterType = chapter.type.toLowerCase();
            const chapterDetailType = detail?.chapterType?.toLowerCase();
            let questions: any[] = [];

            if (detail?.quiz?.questions && Array.isArray(detail.quiz.questions)) {
               questions = detail.quiz.questions.map((q) => ({
                  id: q.id,
                  question: q.description,
                  answers: q.answers.map((a: any, index: number) => ({
                     id: `answer_${index}`,
                     text: a.text,
                     isCorrect: a.score > 0,
                  })),
               }));
            } else if (chapter.quiz) {
               questions = chapter.quiz;
            }

            return (
               <div key={chapter.id} className="border rounded-lg">
                  <div className="flex items-start gap-4 p-4">
                     <div className="flex-shrink-0 mt-1">
                        {getChapterIcon(chapter.type)}
                     </div>
                     <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                           <h4 className="font-medium">
                              Chương {index + 1}: {chapter.title}
                           </h4>
                           <div className="flex items-center gap-2">
                              {!isCurrentlyEditing && (
                                 <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                       handleToggleExpansion(chapter.id)
                                    }
                                    className="p-1"
                                 >
                                    {expandedChapters.has(chapter.id) ? (
                                       <ChevronUp className="h-4 w-4" />
                                    ) : (
                                       <ChevronDown className="h-4 w-4" />
                                    )}
                                 </Button>
                              )}
                              {isEditingMode && !isCurrentlyEditing && (
                                 <div className="flex gap-1">
                                    <Button
                                       variant="ghost"
                                       size="sm"
                                       onClick={() => onEditChapter(chapter)}
                                    >
                                       <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                       variant="ghost"
                                       size="sm"
                                       onClick={() =>
                                          onRemoveChapter(chapter.id)
                                       }
                                       className="text-destructive"
                                    >
                                       <Trash2 className="h-4 w-4" />
                                    </Button>
                                 </div>
                              )}
                           </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
             {getChapterTypeLabel({
   ...chapter,
   duration: chapter.duration || detail?.video?.timeVideo || 'Chưa có thời lượng',
})}
                        </div>
                        {expandedChapters.has(chapter.id) &&
                           !isCurrentlyEditing && (
                              <div className="mt-4 space-y-4 border-t pt-4">
                                 {loadingChapters.has(chapter.id) && (
                                    <div className="text-center text-muted-foreground">
                                       Đang tải chi tiết chương...
                                    </div>
                                 )}
                                 {chapterErrors.has(chapter.id) && (
                                    <div className="text-center text-destructive">
                                       {chapterErrors.get(chapter.id)}
                                       <Button
                                          variant="link"
                                          onClick={() => onLoadChapterDetail(chapter.id)}
                                          className="ml-2"
                                       >
                                          Thử lại
                                       </Button>
                                    </div>
                                 )}
                                 {!loadingChapters.has(chapter.id) &&
                                    !chapterErrors.has(chapter.id) && (
                                       <>
                                          {(chapterType === 'video' || chapterDetailType === 'video') &&
                                           (chapter.videoUrl || detail?.video?.videoUrl) && (
                                                <div className="space-y-2">
                                                   <Label className="text-sm font-medium">
                                                      Video preview:
                                                   </Label>
                                                   <video
                                                   src={chapter.videoUrl || detail?.video?.videoUrl}
                                                      controls
                                                      className="w-full max-w-md h-48 rounded border"
                                                   />
                                                </div>
                                             )}

                                          {(chapterType === 'article' || chapterDetailType === 'lecture') &&
                                             detail?.lecture && (
                                                <div className="space-y-4">
                                                   {/* Không có detail.lecture.description, chỉ có name */}
                                                   <div className="space-y-2">
                                                      <Label className="text-sm font-medium">
                                                         Tên bài giảng:
                                                      </Label>
                                                      <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded">
                                                         {detail.lecture.name}
                                                      </p>
                                                   </div>
                                                   <div className="space-y-2">
                                                      <Label className="text-sm font-medium">
                                                         Nội dung chi tiết:
                                                      </Label>
                                                      <div className="bg-muted/30 p-3 rounded overflow-y-auto">
                                                         <HTMLViewer htmlContent={detail.lecture.lectureMetadata || ''} />
                                                      </div>
                                                   </div>
                                                </div>
                                             )}
                                          {(chapterType === 'quiz' ||
                                             chapterDetailType === 'quiz') && (
                                             <div className="space-y-4">
                                                <Label className="text-sm font-medium">
                                                   Danh sách câu hỏi:
                                                </Label>
                                                {isEditingMode ? (
                                                   <QuizBuilder
                                                      quiz={questions}
                                                      setQuiz={(newQuiz) =>
                                                         onChapterChange({
                                                            ...chapter,
                                                            quiz: newQuiz,
                                                         })
                                                      }
                                                       onUpdateQuestion={onUpdateQuestion}
  chapterId={chapter.id}
                                                      onDeleteQuestion={onDeleteQuestion}
                                                      onCreateQuestions={async (
                                                         questions: any[]
                                                      ) => {
                                                         if (onCreateQuestions) {
                                                            return await onCreateQuestions(
                                                               chapter.id,
                                                               questions
                                                            );
                                                         }
                                                         return false;
                                                      }}
                                                      isEditMode={true}
                                                      showQuizInfo={false}
                                                      quizId={detail?.quiz?.id}
                                                      chapterId={chapter.id}
                                                      onLoadChapterDetail={onLoadChapterDetail}
                                                   />
                                                ) : (
                                                   <>
                                                      {questions.length === 0 ? (
                                                         <div className="text-center py-8 bg-muted/20 rounded-lg border-2 border-dashed border-muted">
                                                            <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                                            <h3 className="text-lg font-medium mb-2">
                                                               Chưa có câu hỏi nào
                                                            </h3>
                                                            <p className="text-muted-foreground">
                                                               Quiz này chưa có câu hỏi.
                                                               Hãy thêm câu hỏi đầu tiên.
                                                            </p>
                                                         </div>
                                                      ) : (
                                                         questions.map(
                                                            (question, qIndex) => (
                                                               <div
                                                                  key={question.id}
                                                                  className="bg-muted/30 rounded border"
                                                               >
                                                                  <div className="flex items-center justify-between p-3">
                                                                     <div
                                                                        className="flex-1 cursor-pointer hover:bg-muted/50 -m-3 p-3 rounded"
                                                                        onClick={() =>
                                                                           onToggleQuestionExpansion(
                                                                              question.id
                                                                           )
                                                                        }
                                                                     >
                                                                        <p className="text-sm font-medium">
                                                                           Câu{' '}
                                                                           {qIndex + 1}:{' '}
                                                                           {
                                                                              question.question
                                                                           }
                                                                        </p>
                                                                     </div>
                                                                     <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                           onToggleQuestionExpansion(
                                                                              question.id
                                                                           )
                                                                        }
                                                                        className="p-1"A
                                                                     >
                                                                        {expandedQuestions.has(
                                                                           question.id
                                                                        ) ? (
                                                                           <ChevronUp className="h-4 w-4" />
                                                                        ) : (
                                                                           <ChevronDown className="h-4 w-4" />
                                                                        )}
                                                                     </Button>
                                                                  </div>
                                                                  {expandedQuestions.has(
                                                                     question.id
                                                                  ) && (
                                                                     <div className="px-3 pb-3 border-t bg-muted/20">
                                                                        <div className="space-y-2 mt-3">
                                                                           <Label className="text-xs font-medium text-muted-foreground">
                                                                              Các câu trả
                                                                              lời:
                                                                           </Label>
                                                                           <div className="space-y-1 ml-2">
                                                                              {question.answers.map(
                                                                                 (answer: { id: string; text: string; isCorrect: boolean }, aIndex: number) => (
                                                                                    <div
                                                                                       key={answer.id}
                                                                                       className={`flex items-center gap-2 text-sm p-2 rounded ${
                                                                                          answer.isCorrect
                                                                                             ? 'bg-green-50 border border-green-200'
                                                                                             : 'bg-white border border-gray-200'
                                                                                       }`}
                                                                                    >
                                                                                       <span className="text-muted-foreground font-medium min-w-[20px]">
                                                                                          {String.fromCharCode(
                                                                                             65 +
                                                                                                aIndex
                                                                                          )}
                                                                                          .
                                                                                       </span>
                                                                                       <span
                                                                                          className={
                                                                                             answer.isCorrect
                                                                                                ? 'text-green-700 font-medium flex-1'
                                                                                                : 'flex-1'
                                                                                          }
                                                                                       >
                                                                                          {
                                                                                             answer.text
                                                                                          }
                                                                                       </span>
                                                                                       {answer.isCorrect && (
                                                                                          <span className="text-green-600 text-xs bg-green-100 px-2 py-1 rounded-full">
                                                                                             Đúng
                                                                                          </span>
                                                                                       )}
                                                                                    </div>
                                                                                 )
                                                                              )}
                                                                           </div>
                                                                        </div>
                                                                     </div>
                                                                  )}
                                                               </div>
                                                            )
                                                         )
                                                      )}
                                                   </>
                                                )}
                                             </div>
                                          )}
                                       </>
                                    )}
                              </div>
                           )}
                     </div>
                  </div>
               </div>
            );
         })}
      </div>
   );
}