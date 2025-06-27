"use client"

import { useState, useEffect } from "react"
import { Save, X, Plus, Edit2, Check } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { updateSurveyQuestion } from "@/services/surveyService"
import type { SurveyQuestion, SurveyAnswer } from "@/types/survey"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Import the same tag constants from add dialog
const mbtiQuestionTags = [
  "I",
  "E", // Introvert vs Extrovert
  "N",
  "S", // Intuition vs Sensing
  "T",
  "F", // Thinking vs Feeling
  "J",
  "P", // Judging vs Perceiving
]

const loveLanguageQuestionTags = [
  "Words of Affirmation", // Lời nói yêu thương
  "Acts of Service", // Hành động quan tâm
  "Receiving Gifts", // Nhận quà
  "Quality Time", // Thời gian bên nhau
  "Physical Touch", // Chạm vào
]

const big5QuestionTags = [
  "Openness", // Cởi mở
  "Conscientiousness", // Tận tâm
  "Extraversion", // Hướng ngoại
  "Agreeableness", // Hòa đồng
  "Neuroticism", // Bất ổn cảm xúc
]

const discQuestionTags = [
  "Dominance", // Dominance
  "Influence", // Influence
  "Steadiness", // Steadiness
  "Conscientiousness", // Conscientiousness
]

interface EditQuestionDialogProps {
  isOpen: boolean
  onClose: () => void
  onQuestionUpdated: (updatedQuestion: SurveyQuestion) => void
  question: SurveyQuestion
  surveyName?: string
}

export function EditQuestionDialog({
  isOpen,
  onClose,
  onQuestionUpdated,
  question,
  surveyName = "",
}: EditQuestionDialogProps) {
  const [editingQuestion, setEditingQuestion] = useState<SurveyQuestion>(question)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newAnswerForm, setNewAnswerForm] = useState<SurveyAnswer>({ text: "", score: 1, tag: "" })
  const [editingAnswerIndex, setEditingAnswerIndex] = useState<number | null>(null)
  const [editingAnswerForm, setEditingAnswerForm] = useState<SurveyAnswer>({ text: "", score: 1, tag: "" })

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

  useEffect(() => {
    setEditingQuestion(question)
    setError(null)
    setEditingAnswerIndex(null)
  }, [question])

  const handleAddAnswer = (answer: SurveyAnswer) => {
    setEditingQuestion((prev) => ({
      ...prev,
      answers: [...prev.answers, answer],
    }))
  }

  const handleRemoveAnswer = (index: number) => {
    setEditingQuestion((prev) => ({
      ...prev,
      answers: prev.answers.filter((_, i) => i !== index),
    }))
    // Cancel editing if we're removing the answer being edited
    if (editingAnswerIndex === index) {
      setEditingAnswerIndex(null)
    }
  }

  const handleStartEditAnswer = (index: number) => {
    setEditingAnswerIndex(index)
    setEditingAnswerForm({ ...editingQuestion.answers[index] })
  }

  const handleSaveEditAnswer = () => {
    if (editingAnswerIndex !== null) {
      setEditingQuestion((prev) => ({
        ...prev,
        answers: prev.answers.map((answer, index) => (index === editingAnswerIndex ? editingAnswerForm : answer)),
      }))
      setEditingAnswerIndex(null)
      setEditingAnswerForm({ text: "", score: 1, tag: "" })
    }
  }

  const handleCancelEditAnswer = () => {
    setEditingAnswerIndex(null)
    setEditingAnswerForm({ text: "", score: 1, tag: "" })
  }

  const handleSubmit = async () => {
    if (!editingQuestion.description || editingQuestion.answers.length === 0) {
      setError("Vui lòng nhập nội dung câu hỏi và ít nhất một câu trả lời")
      return
    }

    try {
      setLoading(true)
      setError(null)
      await updateSurveyQuestion(editingQuestion)

      // Pass the updated question to parent for local state update
      onQuestionUpdated(editingQuestion)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi cập nhật câu hỏi")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setError(null)
    setEditingAnswerIndex(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Chỉnh Sửa Câu Hỏi</DialogTitle>
          <DialogDescription>Chỉnh sửa câu hỏi và các lựa chọn trả lời</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

          <div>
            <Label htmlFor="edit-question-desc" className="text-sm font-medium">
              Nội dung câu hỏi
            </Label>
            <Textarea
              id="edit-question-desc"
              value={editingQuestion.description}
              onChange={(e) => setEditingQuestion({ ...editingQuestion, description: e.target.value })}
              className="mt-1"
            />
          </div>

          {/* Add New Answer Form */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium mb-3">Thêm Lựa Chọn Trả Lời</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <div>
                <Label htmlFor="edit-answer-text" className="text-sm">
                  Nội dung trả lời
                </Label>
                <Input
                  id="edit-answer-text"
                  placeholder="Nhập nội dung trả lời..."
                  value={newAnswerForm.text}
                  onChange={(e) => setNewAnswerForm({ ...newAnswerForm, text: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-answer-score" className="text-sm">
                  Điểm số
                </Label>
                <Input
                  id="edit-answer-score"
                  type="number"
                  placeholder="Nhập điểm số..."
                  value={newAnswerForm.score.toString()}
                  onChange={(e) => setNewAnswerForm({ ...newAnswerForm, score: Number(e.target.value) || 0 })}
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <Label htmlFor="edit-answer-tag" className="text-sm">
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

          {/* Existing Answers List */}
          <div>
            <h4 className="font-medium mb-2">Các Lựa Chọn Trả Lời ({editingQuestion.answers.length})</h4>
            <div className="space-y-2">
              {editingQuestion.answers.map((answer, index) => (
                <div key={index} className="p-3 bg-white border border-gray-200 rounded-lg">
                  {editingAnswerIndex === index ? (
                    // Edit mode
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <Label className="text-sm">Nội dung trả lời</Label>
                          <Input
                            value={editingAnswerForm.text}
                            onChange={(e) => setEditingAnswerForm({ ...editingAnswerForm, text: e.target.value })}
                            placeholder="Nhập nội dung trả lời..."
                          />
                        </div>
                        <div>
                          <Label className="text-sm">Điểm số</Label>
                          <Input
                            type="number"
                            value={editingAnswerForm.score.toString()}
                            onChange={(e) =>
                              setEditingAnswerForm({ ...editingAnswerForm, score: Number(e.target.value) || 0 })
                            }
                            placeholder="Nhập điểm số..."
                            min="0"
                            step="1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm">Nhãn phân loại</Label>
                          <Select
                            value={editingAnswerForm.tag}
                            onValueChange={(value) => setEditingAnswerForm({ ...editingAnswerForm, tag: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn nhãn..." />
                            </SelectTrigger>
                            <SelectContent>
                              {availableTags.map((tag, index) => (
                                <SelectItem key={`edit-${tag}-${index}`} value={tag}>
                                  {tag}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleSaveEditAnswer}
                          disabled={!editingAnswerForm.text || !editingAnswerForm.tag}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Lưu
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEditAnswer}>
                          <X className="w-4 h-4 mr-1" />
                          Hủy
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">Điểm: {answer.score}</Badge>
                        <span>{answer.text}</span>
                        <Badge variant="secondary">{answer.tag}</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStartEditAnswer(index)}
                          disabled={editingAnswerIndex !== null}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveAnswer(index)}
                          className="text-red-600 hover:text-red-700"
                          disabled={editingAnswerIndex !== null}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Hủy bỏ
          </Button>
          <Button onClick={handleSubmit} disabled={loading || editingAnswerIndex !== null}>
            {loading ? (
              "Đang lưu..."
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Lưu Thay Đổi
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
