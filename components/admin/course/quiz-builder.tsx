"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, Edit, Save, X, HelpCircle } from 'lucide-react'
import { Card } from "@/components/ui/card"

interface Question {
  id: string
  question: string
  answers: { id: string; text: string; isCorrect: boolean }[]
}

interface QuizBuilderProps {
  quiz: Question[]
  setQuiz: (quiz: Question[]) => void
  onUpdateQuestion?: (
    questionId: string,
    questionData: any,
    chapterId: string
  ) => Promise<boolean>;
  onDeleteQuestion?: (questionId: string) => Promise<boolean>
  onCreateQuestions?: (questions: Question[]) => Promise<boolean>
  isEditMode?: boolean
  showQuizInfo?: boolean
  quizId?: string
  chapterId?: string;
  onLoadChapterDetail?: (chapterId: string) => void;
}

export default function QuizBuilder({
  quiz,
  setQuiz,
  onUpdateQuestion,
  onDeleteQuestion,
  onCreateQuestions,
  isEditMode = false,
  showQuizInfo = true,
  quizId,
  chapterId,
  onLoadChapterDetail,
}: QuizBuilderProps) {
  const [localQuiz, setLocalQuiz] = useState(quiz);
  const [newQuestionText, setNewQuestionText] = useState("")
  const [newAnswers, setNewAnswers] = useState([{ text: "", isCorrect: false }])
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [pendingQuestions, setPendingQuestions] = useState<Question[]>([])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setLocalQuiz(quiz)
  }, [quiz])

  const handleAddAnswer = () => {
    setNewAnswers([...newAnswers, { text: "", isCorrect: false }])
  }

  const handleAnswerChange = (index: number, field: "text" | "isCorrect", value: string | boolean) => {
    const updatedAnswers = [...newAnswers]
    if (field === "text") {
      updatedAnswers[index].text = value as string
    } else {
      updatedAnswers[index].isCorrect = value as boolean
    }
    setNewAnswers(updatedAnswers)
  }

  const handleRemoveAnswer = (index: number) => {
    if (newAnswers.length <= 1) return
    const updatedAnswers = newAnswers.filter((_, i) => i !== index)
    setNewAnswers(updatedAnswers)
  }

  const handleAddQuestion = () => {
    if (newQuestionText.trim() === "" || newAnswers.some((a) => a.text.trim() === "")) {
      alert("Vui lòng điền đầy đủ câu hỏi và các lựa chọn trả lời.")
      return
    }
    if (!newAnswers.some((a) => a.isCorrect)) {
      alert("Ít nhất một lựa chọn phải là đáp án đúng.")
      return
    }

    const newQ: Question = {
      id: Date.now().toString(),
      question: newQuestionText,
      answers: newAnswers.map((a) => ({ ...a, id: Date.now().toString() + Math.random() })),
    }

    setPendingQuestions([...pendingQuestions, newQ])
    setNewQuestionText("")
    setNewAnswers([{ text: "", isCorrect: false }])
  }

  const handleCancelAddQuestion = () => {
    setNewQuestionText("")
    setNewAnswers([{ text: "", isCorrect: false }])
    setPendingQuestions([])
    setShowAddForm(false)
  }

  const handleSaveQuestions = async () => {
    if (pendingQuestions.length === 0) {
      alert("Không có câu hỏi nào để lưu.")
      return
    }

    setIsSaving(true)
    try {
      if (onCreateQuestions) {
        const success = await onCreateQuestions(pendingQuestions)
        if (success) {
          if (onLoadChapterDetail && chapterId) await onLoadChapterDetail(chapterId);
          setPendingQuestions([])
          setShowAddForm(false)
          setNewQuestionText("")
          setNewAnswers([{ text: "", isCorrect: false }])
        }
      } else {
        setLocalQuiz([...localQuiz, ...pendingQuestions]);
        setPendingQuestions([]);
        setShowAddForm(false);
        setNewQuestionText("");
        setNewAnswers([{ text: "", isCorrect: false }]);
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleRemoveQuestion = async (questionId: string) => {
    if (isEditMode && onDeleteQuestion) {
const success = await onDeleteQuestion?.(questionId, chapterId);

      if (success && onLoadChapterDetail && chapterId) await onLoadChapterDetail(chapterId);
    } else {
      setLocalQuiz(localQuiz.filter((q) => q.id !== questionId))
    }
  }

  const handleRemovePendingQuestion = (questionId: string) => {
    setPendingQuestions(pendingQuestions.filter((q) => q.id !== questionId))
  }

  const handleEditQuestion = (question: Question) => {
    setEditingQuestionId(question.id)
    setEditingQuestion({ ...question })
  }

  const handleSaveEditQuestion = async () => {
    if (!editingQuestion) return
    if (!editingQuestion.question.trim() || editingQuestion.answers.some((a) => !a.text.trim())) {
      alert("Vui lòng điền đầy đủ câu hỏi và các lựa chọn trả lời.")
      return
    }
    if (!editingQuestion.answers.some((a) => a.isCorrect)) {
      alert("Ít nhất một lựa chọn phải là đáp án đúng.")
      return
    }

    if (isEditMode && onUpdateQuestion) {
      const questionData = {
        id: editingQuestion.id,
        description: editingQuestion.question,
        answers: editingQuestion.answers.map((a) => ({
          text: a.text,
          score: a.isCorrect ? 1 : 0,
        })),
      }
      const success = await onUpdateQuestion?.(editingQuestion.id, questionData, chapterId);

      if (success && onLoadChapterDetail && chapterId) await onLoadChapterDetail(chapterId);
      setEditingQuestionId(null)
      setEditingQuestion(null)
    } else {
      setLocalQuiz(localQuiz.map((q) => (q.id === editingQuestion.id ? editingQuestion : q)))
      setEditingQuestionId(null)
      setEditingQuestion(null)
    }
  }

  const handleCancelEditQuestion = () => {
    setEditingQuestionId(null)
    setEditingQuestion(null)
  }

  const updateEditingQuestion = (updates: Partial<Question>) => {
    if (editingQuestion) {
      setEditingQuestion({ ...editingQuestion, ...updates })
    }
  }

  const updateEditingAnswer = (index: number, field: "text" | "isCorrect", value: string | boolean) => {
    if (!editingQuestion) return
    const updatedAnswers = [...editingQuestion.answers]
    if (field === "text") {
      updatedAnswers[index].text = value as string
    } else {
      updatedAnswers[index].isCorrect = value as boolean
    }
    updateEditingQuestion({ answers: updatedAnswers })
  }

  const addEditingAnswer = () => {
    if (!editingQuestion) return
    const newAnswer = {
      id: Date.now().toString(),
      text: "",
      isCorrect: false,
    }
    updateEditingQuestion({
      answers: [...editingQuestion.answers, newAnswer],
    })
  }

  const removeEditingAnswer = (index: number) => {
    if (!editingQuestion || editingQuestion.answers.length <= 1) return
    const updatedAnswers = editingQuestion.answers.filter((_, i) => i !== index)
    updateEditingQuestion({ answers: updatedAnswers })
  }

  return (
    <div className="space-y-6">
      {showAddForm && (
        <div className="p-4 border rounded-lg space-y-4 bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-green-800 flex items-center gap-2">➕ Thêm câu hỏi mới</h3>
            <Button variant="ghost" size="sm" onClick={handleCancelAddQuestion}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-question">Câu hỏi</Label>
            <Input
              id="new-question"
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder="Nhập câu hỏi"
            />
          </div>
          <div className="space-y-2">
            <Label>Các lựa chọn trả lời</Label>
            {newAnswers.map((answer, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={answer.text}
                  onChange={(e) => handleAnswerChange(index, "text", e.target.value)}
                  placeholder={`Lựa chọn ${index + 1}`}
                  className="flex-1"
                />
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`correct-answer-${index}`}
                    checked={answer.isCorrect}
                    onCheckedChange={(checked) => handleAnswerChange(index, "isCorrect", checked as boolean)}
                  />
                  <Label htmlFor={`correct-answer-${index}`}>Đúng</Label>
                </div>
                {newAnswers.length > 1 && (
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveAnswer(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={handleAddAnswer}>
              <Plus className="mr-2 h-4 w-4" /> Thêm lựa chọn
            </Button>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleCancelAddQuestion}>
              <X className="mr-2 h-4 w-4" />
              Hủy
            </Button>
            <Button onClick={handleAddQuestion}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm câu hỏi
            </Button>
          </div>

          {/* Show pending questions list */}
          {pendingQuestions.length > 0 && (
            <div className="mt-4 space-y-2 border-t pt-4">
              <div className="flex items-center justify-between">
                <Label className="font-medium">Danh sách câu hỏi đã thêm ({pendingQuestions.length})</Label>
                <Button
                  onClick={handleSaveQuestions}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "Đang lưu..." : "Lưu danh sách câu hỏi"}
                </Button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {pendingQuestions.map((q, index) => (
                  <div key={q.id} className="bg-white border rounded p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">Câu {index + 1}: {q.question}</p>
                        <div className="mt-2 space-y-1">
                          {q.answers.map((a, aIndex) => (
                            <div key={a.id} className={`text-xs p-1 rounded ${a.isCorrect ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
                              {String.fromCharCode(65 + aIndex)}. {a.text} {a.isCorrect && '✓'}
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePendingQuestion(q.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Existing Questions List */}
      {localQuiz.length > 0 ? (
        <div className="space-y-4">
          {localQuiz.map((q, qIndex) => (
            <Card key={q.id} className="p-4">
              {editingQuestionId === q.id && editingQuestion ? (
                // Edit Mode
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-blue-700">✏️ Chỉnh sửa câu hỏi {qIndex + 1}</h4>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleCancelEditQuestion}>
                        <X className="h-4 w-4" />
                      </Button>
                      <Button size="sm" onClick={handleSaveEditQuestion}>
                        <Save className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Câu hỏi</Label>
                    <Input
                      value={editingQuestion.question}
                      onChange={(e) => updateEditingQuestion({ question: e.target.value })}
                      placeholder="Nhập câu hỏi"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Các lựa chọn trả lời</Label>
                    {editingQuestion.answers.map((answer, index) => (
                      <div key={answer.id} className="flex items-center gap-2">
                        <Input
                          value={answer.text}
                          onChange={(e) => updateEditingAnswer(index, "text", e.target.value)}
                          placeholder={`Lựa chọn ${index + 1}`}
                          className="flex-1"
                        />
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={answer.isCorrect}
                            onCheckedChange={(checked) => updateEditingAnswer(index, "isCorrect", checked as boolean)}
                          />
                          <Label>Đúng</Label>
                        </div>
                        {editingQuestion.answers.length > 1 && (
                          <Button variant="ghost" size="icon" onClick={() => removeEditingAnswer(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addEditingAnswer}>
                      <Plus className="mr-2 h-4 w-4" /> Thêm lựa chọn
                    </Button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">
                      Câu hỏi {qIndex + 1}: {q.question}
                    </h4>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditQuestion(q)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveQuestion(q.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground">Các câu trả lời:</Label>
                    <div className="space-y-1 ml-2">
                      {q.answers.map((a, aIndex) => (
                        <div
                          key={a.id}
                          className={`flex items-center gap-2 text-sm p-2 rounded ${a.isCorrect ? "bg-green-50 border border-green-200" : "bg-gray-50 border border-gray-200"
                            }`}
                        >
                          <span className="text-muted-foreground font-medium min-w-[20px]">
                            {String.fromCharCode(65 + aIndex)}.
                          </span>
                          <span className={a.isCorrect ? "text-green-700 font-medium flex-1" : "flex-1"}>{a.text}</span>
                          {a.isCorrect && (
                            <span className="text-green-600 text-xs bg-green-100 px-2 py-1 rounded-full">✓ Đúng</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-muted/20 rounded-lg border-2 border-dashed border-muted">
          <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Chưa có câu hỏi nào</h3>
          <p className="text-muted-foreground mb-4">Hãy thêm câu hỏi đầu tiên cho quiz này.</p>
          {!showAddForm && (
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm câu hỏi
            </Button>
          )}
        </div>
      )}

      {/* Add Question Button - Show when not in add form and there are existing questions */}
      {!showAddForm && localQuiz.length > 0 && (
        <div className="flex justify-center">
          <Button onClick={() => setShowAddForm(true)} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Thêm câu hỏi
          </Button>
        </div>
      )}
    </div>
  )
}