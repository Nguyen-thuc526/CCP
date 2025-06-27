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

// Question tag constants
export const mbtiQuestionTags = [
  "I",
  "E", // Introvert vs Extrovert
  "N",
  "S", // Intuition vs Sensing
  "T",
  "F", // Thinking vs Feeling
  "J",
  "P", // Judging vs Perceiving
]

export const loveLanguageQuestionTags = [
  "Words of Affirmation", // Lời nói yêu thương
  "Acts of Service", // Hành động quan tâm
  "Receiving Gifts", // Nhận quà
  "Quality Time", // Thời gian bên nhau
  "Physical Touch", // Chạm vào
]

export const big5QuestionTags = [
  "Openness", // Cởi mở
  "Conscientiousness", // Tận tâm
  "Extraversion", // Hướng ngoại
  "Agreeableness", // Hòa đồng
  "Neuroticism", // Bất ổn cảm xúc
]

export const discQuestionTags = [
  "Dominance", // Dominance
  "Influence", // Influence
  "Steadiness", // Steadiness
  "Conscientiousness", // Conscientiousness
]

interface AddQuestionDialogProps {
  isOpen: boolean
  onClose: () => void
  onQuestionAdded: (newQuestion: SurveyQuestion) => void
  surveyId: string
  surveyName: string
}

export function AddQuestionDialog({ isOpen, onClose, onQuestionAdded, surveyId, surveyName }: AddQuestionDialogProps) {
  console.log(surveyId, "current survey")
  const [newQuestion, setNewQuestion] = useState<SurveyQuestion>({
    surveyId,
    description: "",
    answers: [],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newAnswerForm, setNewAnswerForm] = useState<SurveyAnswer>({ text: "", score: 1, tag: "" })

  // Get available tags based on survey name
  const getAvailableTags = () => {
    const surveyNameLower = surveyName.toLowerCase()

    if (surveyNameLower.includes("mbti")) {
      return mbtiQuestionTags
    } else if (surveyNameLower.includes("love") || surveyNameLower.includes("language")) {
      return loveLanguageQuestionTags
    } else if (surveyNameLower.includes("big") || surveyNameLower.includes("5")) {
      return big5QuestionTags
    } else if (surveyNameLower.includes("disc")) {
      return discQuestionTags
    }

    // Return empty array if survey type is not recognized
    return []
  }

  const availableTags = getAvailableTags()

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

  const handleSubmit = () => {
    if (!newQuestion.description || newQuestion.answers.length === 0) {
      setError("Vui lòng nhập nội dung câu hỏi và ít nhất một câu trả lời")
      return
    }

    const questionWithLatestSurveyId = {
      ...newQuestion,
      surveyId,
    }

    onQuestionAdded(questionWithLatestSurveyId)

    // Reset form
    setNewQuestion({ surveyId, description: "", answers: [] })
    setNewAnswerForm({ text: "", score: 1, tag: "" })
    setError(null)
  }

  const handleClose = () => {
    setNewQuestion({ surveyId, description: "", answers: [] })
    setNewAnswerForm({ text: "", score: 1, tag: "" })
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
                <Input
                  id="answer-score"
                  type="number"
                  placeholder="Nhập điểm số..."
                  value={newAnswerForm.score.toString()}
                  onChange={(e) => setNewAnswerForm({ ...newAnswerForm, score: Number(e.target.value) || 0 })}
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <Label htmlFor="answer-tag" className="text-sm">
                  Nhãn phân loại
                </Label>
                <Select
                  value={newAnswerForm.tag}
                  onValueChange={(value) => setNewAnswerForm({ ...newAnswerForm, tag: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn nhãn..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTags.map((tag, index) => (
                      <SelectItem key={`${tag}-${index}`} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
