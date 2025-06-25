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

interface DeleteQuestionDialogProps {
  isOpen: boolean
  onClose: () => void
  onQuestionDeleted: () => void
  question: SurveyQuestion
}

export function DeleteQuestionDialog({ isOpen, onClose, onQuestionDeleted, question }: DeleteQuestionDialogProps) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    try {
      setLoading(true)
      // Assuming question has an id field, if not, you might need to adjust this
      await deleteSurveyQuestion(question.surveyId) // You might need to adjust this based on your API
      onQuestionDeleted()
    } catch (err) {
      console.error("Error deleting question:", err)
      // You might want to show an error message here
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa câu hỏi</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa câu hỏi này không? Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={loading}>
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
