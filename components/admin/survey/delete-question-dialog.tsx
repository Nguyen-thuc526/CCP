"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteSurveyQuestion } from "@/services/surveyService"
import type { SurveyQuestion } from "@/types/survey"
import { useToast, ToastType } from "@/hooks/useToast"
interface DeleteQuestionDialogProps {
  isOpen: boolean
  onClose: () => void
  onQuestionDeleted: (deletedQuestion: SurveyQuestion) => void
  question: SurveyQuestion
}

export function DeleteQuestionDialog({ isOpen, onClose, onQuestionDeleted, question }: DeleteQuestionDialogProps) {
  const { showToast } = useToast()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  console.log(question)

  const handleConfirm = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!question?.id) {
        console.warn("Question ID is null or undefined. Không thể xoá câu hỏi.")
        return
      }

      const questionId = question.id
      await deleteSurveyQuestion(questionId)

      showToast("Đã xoá câu hỏi thành công", ToastType.Success)
      onQuestionDeleted(question)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Có lỗi xảy ra khi xóa câu hỏi"
      console.error("Error deleting question:", err)
      setError(message)
      showToast("Xóa câu hỏi thất bại", ToastType.Error)
    } finally {
      setLoading(false)
    }
  }
  const handleClose = () => {
    if (!loading) {
      setError(null)
      onClose()
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa câu hỏi</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <div>Bạn có chắc chắn muốn xóa câu hỏi này không? Hành động này không thể hoàn tác.</div>
            <div className="bg-gray-50 p-3 rounded border mt-3">
              <div className="font-medium text-sm text-gray-900">Câu hỏi:</div>
              <div className="text-sm text-gray-700 mt-1">{question.description}</div>
              <div className="text-xs text-gray-500 mt-2">Số lượng câu trả lời: {question.answers.length}</div>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm mt-2">{error}</div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose} disabled={loading}>
            Hủy bỏ
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={loading} className="bg-red-600 hover:bg-red-700">
            {loading ? "Đang xóa..." : "Xóa câu hỏi"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
