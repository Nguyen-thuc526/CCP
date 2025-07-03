'use client';

import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { SurveyQuestion } from '@/types/survey';

interface DeleteQuestionDialogProps {
   isOpen: boolean;
   onClose: () => void;
   onConfirm: () => void;
   question: SurveyQuestion;
   loading?: boolean;
   error?: string | null;
}

export function DeleteQuestionDialog({
   isOpen,
   onClose,
   onConfirm,
   question,
   loading = false,
   error = null,
}: DeleteQuestionDialogProps) {
   return (
      <AlertDialog open={isOpen} onOpenChange={onClose}>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>Xác nhận xóa câu hỏi</AlertDialogTitle>
               <AlertDialogDescription className="space-y-2">
                  <div>
                     Bạn có chắc chắn muốn xóa câu hỏi này không? Hành động này
                     không thể hoàn tác.
                  </div>
                  <div className="bg-gray-50 p-3 rounded border mt-3">
                     <div className="font-medium text-sm text-gray-900">
                        Câu hỏi:
                     </div>
                     <div className="text-sm text-gray-700 mt-1">
                        {question.description}
                     </div>
                     <div className="text-xs text-gray-500 mt-2">
                        Số lượng câu trả lời: {question.answers.length}
                     </div>
                  </div>
                  {error && (
                     <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm mt-2">
                        {error}
                     </div>
                  )}
               </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel onClick={onClose} disabled={loading}>
                  Hủy bỏ
               </AlertDialogCancel>
               <AlertDialogAction
                  onClick={onConfirm}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700"
               >
                  {loading ? 'Đang xóa...' : 'Xóa câu hỏi'}
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
}
