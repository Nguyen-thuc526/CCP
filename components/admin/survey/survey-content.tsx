'use client';

import { useState, useEffect } from 'react';
import {
   Plus,
   Edit,
   Trash2,
   ChevronLeft,
   ChevronRight,
   FileText,
   AlertCircle,
   RefreshCw,
   MoreHorizontal,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription,
   CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AddQuestionDialog } from './add-question-dialog';
import { EditQuestionDialog } from './edit-question-dialog';
import { DeleteQuestionDialog } from './delete-question-dialog';
import {
   createSurveyQuestion,
   deleteSurveyQuestion,
   getSurveyQuestions,
} from '@/services/surveyService';
import type { Survey, SurveyQuestion, PagingResponse } from '@/types/survey';
import { useToast, ToastType } from '@/hooks/useToast';
interface SurveyContentProps {
   surveys: Survey[];
   onRefresh: () => void;
}

export function SurveyContent({ surveys, onRefresh }: SurveyContentProps) {
   const [activeTab, setActiveTab] = useState(
      surveys.length > 0 ? surveys[0].id : ''
   );
   const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(0);
   const [totalItems, setTotalItems] = useState(0);
   const [isAddingQuestion, setIsAddingQuestion] = useState(false);
   const [editingQuestion, setEditingQuestion] =
      useState<SurveyQuestion | null>(null);
   const [deletingQuestion, setDeletingQuestion] =
      useState<SurveyQuestion | null>(null);
   const [loadingDelete, setLoadingDelete] = useState(false);
   const [errorDelete, setErrorDelete] = useState<string | null>(null);
   const { showToast } = useToast();

   const pageSize = 10;
   const currentSurvey = surveys.find((s) => s.id === activeTab);

   useEffect(() => {
      if (activeTab) {
         loadQuestions(1);
      }
   }, [activeTab]);

   const loadQuestions = async (page = 1) => {
      if (!activeTab) return;

      try {
         setLoading(true);
         setError(null);

         const response: PagingResponse<SurveyQuestion> =
            await getSurveyQuestions(activeTab, page, pageSize);

         if (!response.success) {
            throw new Error(response.error || 'Tải dữ liệu thất bại');
         }

         setQuestions(response.data.items);
         setTotalPages(response.data.totalPages);
         setTotalItems(response.data.totalCount);
         setCurrentPage(response.data.pageNumber);
      } catch (err) {
         setError(
            err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải câu hỏi'
         );
      } finally {
         setLoading(false);
      }
   };

   const handlePageChange = (page: number) => {
      loadQuestions(page);
   };

   // Update question locally without refetching
   const handleQuestionUpdated = (updatedQuestion: SurveyQuestion) => {
      setQuestions((prevQuestions) =>
         prevQuestions.map((question) =>
            question.surveyId === updatedQuestion.surveyId &&
            question.description === editingQuestion?.description
               ? updatedQuestion
               : question
         )
      );
      setEditingQuestion(null);
   };

   // Add question locally without refetching
   const handleQuestionAdded = async (newQuestion: SurveyQuestion) => {
      try {
         setIsAddingQuestion(true);

         // API call
         await createSurveyQuestion(newQuestion);

         const newTotalItems = totalItems + 1;
         const newTotalPages = Math.ceil(newTotalItems / pageSize);

         setTotalItems(newTotalItems);
         setTotalPages(newTotalPages);
         setCurrentPage(1);

         // Always load the first page
         await loadQuestions(1);

         showToast('Tạo câu hỏi thành công', ToastType.Success);
      } catch (err) {
         showToast(
            err instanceof Error ? err.message : 'Không thể tạo câu hỏi',
            ToastType.Error
         );
      } finally {
         setIsAddingQuestion(false);
      }
   };

   // Delete question locally without refetching
   const handleDeleteQuestionConfirm = async () => {
      if (!deletingQuestion?.id) return;

      try {
         setLoadingDelete(true);
         setErrorDelete(null);

         // Gọi API xóa
         await deleteSurveyQuestion(deletingQuestion.id);
         showToast('Đã xoá câu hỏi thành công', ToastType.Success);

         // Cập nhật lại totalItems, totalPages
         const newTotalItems = totalItems - 1;
         const newTotalPages = Math.max(1, Math.ceil(newTotalItems / pageSize));
         const newCurrentPage = Math.min(currentPage, newTotalPages);

         setTotalItems(newTotalItems);
         setTotalPages(newTotalPages);
         setCurrentPage(newCurrentPage);

         await loadQuestions(newCurrentPage);
      } catch (err) {
         const message =
            err instanceof Error
               ? err.message
               : 'Có lỗi xảy ra khi xóa câu hỏi';
         setErrorDelete(message);
         showToast('Xóa câu hỏi thất bại', ToastType.Error);
      } finally {
         setLoadingDelete(false);
      }
   };

   const LoadingSpinner = () => (
      <Card className="border border-gray-200">
         <CardContent className="text-center py-12">
            <div className="flex items-center justify-center">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
               <span className="ml-3 text-gray-600">Đang tải...</span>
            </div>
         </CardContent>
      </Card>
   );

   const ErrorMessage = ({
      message,
      onRetry,
   }: {
      message: string;
      onRetry: () => void;
   }) => (
      <Card className="border border-red-200 bg-red-50">
         <CardContent className="text-center py-12">
            <div className="text-red-600">
               <AlertCircle className="w-12 h-12 mx-auto mb-4" />
               <h3 className="text-lg font-medium mb-2">Có lỗi xảy ra</h3>
               <p className="text-sm mb-4">{message}</p>
               <Button
                  onClick={onRetry}
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-100"
               >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Thử lại
               </Button>
            </div>
         </CardContent>
      </Card>
   );

   const EmptyState = () => (
      <Card className="border border-gray-200">
         <CardContent className="text-center py-12">
            <div className="text-gray-500">
               <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
               <h3 className="text-lg font-medium mb-2">Chưa có câu hỏi nào</h3>
               <p className="text-sm">
                  Bắt đầu bằng cách thêm câu hỏi đầu tiên cho loại khảo sát này.
               </p>
            </div>
         </CardContent>
      </Card>
   );

   const AnswersList = ({ answers }: { answers: any[] }) => (
      <div className="space-y-3">
         <h4 className="font-medium text-sm text-gray-700">
            Các Lựa Chọn Trả Lời ({answers.length})
         </h4>
         <div className="space-y-2">
            {answers.map((answer, index) => (
               <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
               >
                  <div className="flex items-center gap-3">
                     <Badge variant="outline" className="text-xs">
                        Điểm: {answer.score}
                     </Badge>
                     <span className="text-sm">{answer.text}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                     {answer.tag}
                  </Badge>
               </div>
            ))}
         </div>
      </div>
   );

   const Pagination = () => {
      const startItem = (currentPage - 1) * pageSize + 1;
      const endItem = Math.min(currentPage * pageSize, totalItems);

      const getPageNumbers = () => {
         const delta = 2;
         const range = [];
         const rangeWithDots = [];

         range.push(1);

         for (
            let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++
         ) {
            range.push(i);
         }

         if (totalPages > 1) {
            range.push(totalPages);
         }

         const uniqueRange = [...new Set(range)].sort((a, b) => a - b);

         let prev = 0;
         for (const page of uniqueRange) {
            if (page - prev > 1) {
               rangeWithDots.push('...');
            }
            rangeWithDots.push(page);
            prev = page;
         }

         return rangeWithDots;
      };

      const pageNumbers = getPageNumbers();

      return (
         <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-700 order-2 sm:order-1">
               Hiển thị {startItem} đến {endItem} trong tổng số {totalItems} câu
               hỏi
            </div>

            <div className="flex items-center gap-1 order-1 sm:order-2">
               {/* Previous Button */}
               <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="h-9 px-3"
               >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline ml-1">Trước</span>
               </Button>

               {/* Page Numbers */}
               <div className="flex items-center gap-1">
                  {pageNumbers.map((page, index) => {
                     if (page === '...') {
                        return (
                           <div
                              key={`dots-${index}`}
                              className="flex items-center justify-center h-9 px-2"
                           >
                              <MoreHorizontal className="w-4 h-4 text-gray-400" />
                           </div>
                        );
                     }

                     const pageNum = page as number;
                     return (
                        <Button
                           key={pageNum}
                           variant={
                              pageNum === currentPage ? 'default' : 'outline'
                           }
                           size="sm"
                           onClick={() => handlePageChange(pageNum)}
                           className="h-9 w-9 p-0"
                        >
                           {pageNum}
                        </Button>
                     );
                  })}
               </div>

               {/* Next Button */}
               <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="h-9 px-3"
               >
                  <span className="hidden sm:inline mr-1">Sau</span>
                  <ChevronRight className="w-4 h-4" />
               </Button>
            </div>
         </div>
      );
   };

   return (
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
         {/* Survey Tabs */}
         <TabsList className="grid w-full grid-cols-4 mb-6 bg-white border border-gray-200">
            {surveys.map((survey) => (
               <TabsTrigger
                  key={survey.id}
                  value={survey.id}
                  className="font-medium"
               >
                  {survey.name}
               </TabsTrigger>
            ))}
         </TabsList>

         {surveys.map((survey) => (
            <TabsContent key={survey.id} value={survey.id}>
               <div className="space-y-6">
                  {/* Survey Info */}
                  <Card className="border border-gray-200">
                     <CardHeader>
                        <div className="flex items-center justify-between">
                           <div className="flex flex-col gap-2">
                              {/* Title */}
                              <CardTitle className="text-2xl text-gray-900">
                                 {survey.name}
                              </CardTitle>

                              {/* Description */}
                              <CardDescription className="text-base">
                                 {survey.description}
                              </CardDescription>

                              {/* Status badge */}
                              <Badge
                                 variant="secondary"
                                 className="w-fit px-3 py-1 text-sm font-normal max-w-[250px] truncate"
                                 title={
                                    survey.status === 1
                                       ? 'Hoạt động'
                                       : 'Không hoạt động'
                                 }
                              >
                                 Khảo sát{' '}
                                 {survey.status === 1
                                    ? 'Hoạt động'
                                    : 'Không hoạt động'}
                              </Badge>
                           </div>

                           {/* Actions */}
                           <div className="flex items-center gap-4">
                              <Button onClick={() => setIsAddingQuestion(true)}>
                                 <Plus className="w-4 h-4 mr-2" />
                                 Thêm Câu Hỏi
                              </Button>
                           </div>
                        </div>
                     </CardHeader>
                  </Card>

                  {/* Questions List */}
                  {loading ? (
                     <LoadingSpinner />
                  ) : error ? (
                     <ErrorMessage
                        message={error}
                        onRetry={() => loadQuestions(currentPage)}
                     />
                  ) : questions.length === 0 ? (
                     <EmptyState />
                  ) : (
                     <div className="space-y-6">
                        <div className="space-y-4">
                           {questions.map((question, index) => (
                              <Card
                                 key={`${question.surveyId}-${index}-${currentPage}`}
                                 className="border border-gray-200"
                              >
                                 <CardHeader>
                                    <div className="flex items-start justify-between">
                                       <div className="flex-1">
                                          <CardTitle className="text-lg mb-2">
                                             Câu hỏi{' '}
                                             {((currentPage || 1) - 1) *
                                                pageSize +
                                                index +
                                                1}
                                          </CardTitle>
                                          <CardDescription className="text-base">
                                             {question.description}
                                          </CardDescription>
                                       </div>
                                       <div className="flex items-center gap-2">
                                          <Button
                                             size="sm"
                                             variant="outline"
                                             onClick={() =>
                                                setEditingQuestion(question)
                                             }
                                          >
                                             <Edit className="w-4 h-4" />
                                          </Button>
                                          <Button
                                             size="sm"
                                             variant="outline"
                                             className="text-red-600 hover:text-red-700"
                                             onClick={() =>
                                                setDeletingQuestion(question)
                                             }
                                          >
                                             <Trash2 className="w-4 h-4" />
                                          </Button>
                                       </div>
                                    </div>
                                 </CardHeader>
                                 <CardContent>
                                    <AnswersList answers={question.answers} />
                                 </CardContent>
                              </Card>
                           ))}
                        </div>

                        {totalPages > 1 && <Pagination />}
                     </div>
                  )}
               </div>
            </TabsContent>
         ))}

         {/* Modals */}
         <AddQuestionDialog
            isOpen={isAddingQuestion}
            onClose={() => setIsAddingQuestion(false)}
            onQuestionAdded={handleQuestionAdded}
            surveyId={activeTab}
            surveyName={currentSurvey?.name || ''}
         />

         {editingQuestion && (
            <EditQuestionDialog
               isOpen={!!editingQuestion}
               onClose={() => setEditingQuestion(null)}
               onQuestionUpdated={handleQuestionUpdated}
               question={editingQuestion}
               surveyName={currentSurvey?.name || ''}
            />
         )}

         {deletingQuestion && (
            <DeleteQuestionDialog
               isOpen={!!deletingQuestion}
               onClose={() => {
                  if (!loadingDelete) {
                     setDeletingQuestion(null);
                     setErrorDelete(null);
                  }
               }}
               onConfirm={handleDeleteQuestionConfirm}
               question={deletingQuestion!}
               loading={loadingDelete}
               error={errorDelete}
            />
         )}
      </Tabs>
   );
}
