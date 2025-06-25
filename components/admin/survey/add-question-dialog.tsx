"use client"

import { useState } from "react"
import { X, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { SurveyQuestion, SurveyAnswer } from "@/types/survey"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createSurveyQuestion } from "@/services/surveyService"

interface AddQuestionDialogProps {
  isOpen: boolean
  onClose: () => void
  onQuestionAdded: () => void
  surveyId: string
  surveyName: string
}

export function AddQuestionDialog({ isOpen, onClose, onQuestionAdded, surveyId, surveyName }: AddQuestionDialogProps) {
  const [newQuestion, setNewQuestion] = useState<SurveyQuestion>({
    surveyId,
    description: "",
    answers: [],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newAnswerForm, setNewAnswerForm] = useState<SurveyAnswer>({ text: "", score: 1, tag: "" })

  const handleAddAnswer = (answer: SurveyAnswer) => {
    setNewQuestion((prev) => ({
      ...prev,
      answers: [...prev.answers, answer],
    }))
  }

  const handleRemoveAnswer = (index: number) => {
    setNewQuestion((prev) => ({
      ...prev,
      answers: prev.answers.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async () => {
    if (!newQuestion.description || newQuestion.answers.length === 0) {
      setError("Vui lòng nhập nội dung câu hỏi và ít nhất một câu trả lời")
      return
    }

    try {
      setLoading(true)
      setError(null)
      await createSurveyQuestion(newQuestion)
      setNewQuestion({ surveyId, description: "", answers: [] })
      onQuestionAdded()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi tạo câu hỏi")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setNewQuestion({ surveyId, description: "", answers: [] })
    setError(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Thêm Câu Hỏi Mới</DialogTitle>
          <DialogDescription>Tạo câu hỏi mới cho khảo sát {surveyName}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

          <div>
            <Label htmlFor="question-desc" className="text-sm font-medium">
              Nội dung câu hỏi
            </Label>
            <Textarea
              id="question-desc"
              placeholder="Nhập câu hỏi của bạn..."
              value={newQuestion.description}
              onChange={(e) => setNewQuestion({ ...newQuestion, description: e.target.value })}
              className="mt-1"
            />
          </div>

          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium mb-3">Thêm Lựa Chọn Trả Lời</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <div>
                <Label htmlFor="answer-text" className="text-sm">
                  Nội dung trả lời
                </Label>
                <Input
                  id="answer-text"
                  placeholder="Nhập nội dung trả lời..."
                  value={newAnswerForm.text}
                  onChange={(e) => setNewAnswerForm({ ...newAnswerForm, text: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="answer-score" className="text-sm">
                  Điểm số
                </Label>
                <Select
                  value={newAnswerForm.score.toString()}
                  onValueChange={(value) => setNewAnswerForm({ ...newAnswerForm, score: Number.parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((score) => (
                      <SelectItem key={score} value={score.toString()}>
                        {score}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="answer-tag" className="text-sm">
                  Nhãn phân loại
                </Label>
                <Input
                  id="answer-tag"
                  placeholder="Nhập nhãn..."
                  value={newAnswerForm.tag}
                  onChange={(e) => setNewAnswerForm({ ...newAnswerForm, tag: e.target.value })}
                />
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => {
                if (newAnswerForm.text && newAnswerForm.tag) {
                  handleAddAnswer(newAnswerForm)
                  setNewAnswerForm({ text: "", score: 1, tag: "" })
                }
              }}
              disabled={!newAnswerForm.text || !newAnswerForm.tag}
            >
              <Plus className="w-4 h-4 mr-1" />
              Thêm Lựa Chọn
            </Button>
          </div>

          {newQuestion.answers.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Các Lựa Chọn Trả Lời ({newQuestion.answers.length})</h4>
              <div className="space-y-2">
                {newQuestion.answers.map((answer, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">Điểm: {answer.score}</Badge>
                      <span>{answer.text}</span>
                      <Badge variant="secondary">{answer.tag}</Badge>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => handleRemoveAnswer(index)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Hủy bỏ
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !newQuestion.description || newQuestion.answers.length === 0}
          >
            {loading ? "Đang tạo..." : "Thêm Câu Hỏi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
