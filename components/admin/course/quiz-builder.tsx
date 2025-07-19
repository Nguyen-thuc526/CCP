"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"

interface Question {
  id: string
  question: string
  answers: { id: string; text: string; isCorrect: boolean }[]
}

interface QuizBuilderProps {
  quiz: Question[]
  setQuiz: (quiz: Question[]) => void
}

export default function QuizBuilder({ quiz, setQuiz }: QuizBuilderProps) {
  const [newQuestionText, setNewQuestionText] = useState("")
  const [newAnswers, setNewAnswers] = useState([{ text: "", isCorrect: false }])

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
    setQuiz([...quiz, newQ])
    setNewQuestionText("")
    setNewAnswers([{ text: "", isCorrect: false }])
  }

  const handleRemoveQuestion = (questionId: string) => {
    setQuiz(quiz.filter((q) => q.id !== questionId))
  }

  return (
    <div className="space-y-6">
      {/* Add New Question Form */}
      <div className="p-4 border rounded-lg space-y-4">
        <h3 className="font-semibold">Thêm câu hỏi mới</h3>
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
        <Button onClick={handleAddQuestion} className="w-full">
          Thêm câu hỏi
        </Button>
      </div>

      {/* Existing Questions List */}
      {quiz.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold">Danh sách câu hỏi ({quiz.length})</h3>
          {quiz.map((q, qIndex) => (
            <Card key={q.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">
                  Câu hỏi {qIndex + 1}: {q.question}
                </h4>
                <Button variant="ghost" size="sm" onClick={() => handleRemoveQuestion(q.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <ul className="space-y-1 text-sm">
                {q.answers.map((a, aIndex) => (
                  <li
                    key={a.id}
                    className={`flex items-center gap-2 ${a.isCorrect ? "text-green-600 font-medium" : ""}`}
                  >
                    {a.isCorrect ? "✅" : "❌"} {a.text}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
