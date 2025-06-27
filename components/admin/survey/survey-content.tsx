"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight, FileText, AlertCircle, RefreshCw } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AddQuestionDialog } from "./add-question-dialog"
import { EditQuestionDialog } from "./edit-question-dialog"
import { DeleteQuestionDialog } from "./delete-question-dialog"
import { getSurveyQuestions } from "@/services/surveyService"
import type { Survey, SurveyQuestion, SurveyAnswer, PagingResponse } from "@/types/survey"

interface SurveyContentProps {
  surveys: Survey[]
  onRefresh: () => void
}

export function SurveyContent({ surveys, onRefresh }: SurveyContentProps) {
  const [activeTab, setActiveTab] = useState(surveys.length > 0 ? surveys[0].id : "")
  const [questions, setQuestions] = useState<SurveyQuestion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [isAddingQuestion, setIsAddingQuestion] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<SurveyQuestion | null>(null)
  const [deletingQuestion, setDeletingQuestion] = useState<SurveyQuestion | null>(null)
  const [newAnswer, setNewAnswer] = useState<SurveyAnswer>({ text: "", score: 1, tag: "" })
  const pageSize = 10

  const currentSurvey = surveys.find((s) => s.id === activeTab)

  useEffect(() => {
    if (activeTab) {
      loadQuestions(1)
    }
  }, [activeTab])

  const loadQuestions = async (page = 1) => {
    if (!activeTab) return

    try {
      setLoading(true)
      setError(null)

      const response: PagingResponse<SurveyQuestion> = await getSurveyQuestions(activeTab, page, pageSize)

      if (!response.success) {
        throw new Error(response.error || "Tải dữ liệu thất bại")
      }

      setQuestions(response.data.items)
      setTotalPages(Math.ceil(response.data.total / pageSize))
      setTotalItems(response.data.total)
      setCurrentPage(page)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi tải câu hỏi")
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    loadQuestions(page)
  }

  const handleQuestionUpdated = () => {
    loadQuestions(currentPage)
    onRefresh()
  }

  const handleQuestionAdded = () => {
    setIsAddingQuestion(false)
    loadQuestions(currentPage)
    onRefresh()
  }

  const handleAddAnswer = (
    answer: SurveyAnswer,
    targetQuestions: SurveyAnswer[],
    setTargetQuestions: (answers: SurveyAnswer[]) => void,
  ) => {
    if (answer.text && answer.tag) {
      setTargetQuestions([...targetQuestions, answer])
      setNewAnswer({ text: "", score: 1, tag: "" })
    }
  }

  const handleRemoveAnswer = (
    index: number,
    targetQuestions: SurveyAnswer[],
    setTargetQuestions: (answers: SurveyAnswer[]) => void,
  ) => {
    setTargetQuestions(targetQuestions.filter((_, i) => i !== index))
  }

  // Loading Spinner Component
  const LoadingSpinner = () => (
    <Card className="border border-gray-200">
      <CardContent className="text-center py-12">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-3 text-gray-600">Đang tải...</span>
        </div>
      </CardContent>
    </Card>
  )

  // Error Message Component
  const ErrorMessage = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
    <Card className="border border-red-200 bg-red-50">
      <CardContent className="text-center py-12">
        <div className="text-red-600">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Có lỗi xảy ra</h3>
          <p className="text-sm mb-4">{message}</p>
          <Button onClick={onRetry} variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
            <RefreshCw className="w-4 h-4 mr-2" />
            Thử lại
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  // Empty State Component
  const EmptyState = () => (
    <Card className="border border-gray-200">
      <CardContent className="text-center py-12">
        <div className="text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">Chưa có câu hỏi nào</h3>
          <p className="text-sm">Bắt đầu bằng cách thêm câu hỏi đầu tiên cho loại khảo sát này.</p>
        </div>
      </CardContent>
    </Card>
  )

  // Answer Form Component
  const AnswerForm = ({ onAddAnswer }: { onAddAnswer: (answer: SurveyAnswer) => void }) => (
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
            value={newAnswer.text}
            onChange={(e) => setNewAnswer({ ...newAnswer, text: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="answer-score" className="text-sm">
            Điểm số
          </Label>
          <Select
            value={newAnswer.score.toString()}
            onValueChange={(value) => setNewAnswer({ ...newAnswer, score: Number.parseInt(value) })}
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
            value={newAnswer.tag}
            onChange={(e) => setNewAnswer({ ...newAnswer, tag: e.target.value })}
          />
        </div>
      </div>
      <Button size="sm" onClick={() => onAddAnswer(newAnswer)} disabled={!newAnswer.text || !newAnswer.tag}>
        <Plus className="w-4 h-4 mr-1" />
        Thêm Lựa Chọn
      </Button>
    </div>
  )

  // Answers List Component
  const AnswersList = ({ answers }: { answers: SurveyAnswer[] }) => (
    <div className="space-y-3">
      <h4 className="font-medium text-sm text-gray-700">Các Lựa Chọn Trả Lời ({answers.length})</h4>
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
  )

  // Pagination Component
  const Pagination = () => {
    const startItem = (currentPage - 1) * pageSize + 1
    const endItem = Math.min(currentPage * pageSize, totalItems)

    return (
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Hiển thị {startItem} đến {endItem} trong tổng số {totalItems} câu hỏi
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="w-4 h-4" />
            Trước
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Sau
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      {/* Survey Tabs */}
      <TabsList className="grid w-full grid-cols-4 mb-6 bg-white border border-gray-200">
        {surveys.map((survey) => (
          <TabsTrigger key={survey.id} value={survey.id} className="font-medium">
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
                  <div>
                    <CardTitle className="text-2xl text-gray-900">{survey.name}</CardTitle>
                    <CardDescription className="text-base mt-1">{survey.descriptione}</CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="px-3 py-1">
                      Khảo sát {survey.status === 1 ? "Hoạt động" : "Không hoạt động"}
                    </Badge>
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
              <ErrorMessage message={error} onRetry={() => loadQuestions(currentPage)} />
            ) : questions.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-6">
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <Card key={question.surveyId + index} className="border border-gray-200">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-2">
                              Câu hỏi {(currentPage - 1) * pageSize + index + 1}
                            </CardTitle>
                            <CardDescription className="text-base">{question.description}</CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => setEditingQuestion(question)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => setDeletingQuestion(question)}
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
        surveyName={currentSurvey?.name || ""}
      />

      {editingQuestion && (
        <EditQuestionDialog
          isOpen={!!editingQuestion}
          onClose={() => setEditingQuestion(null)}
          onQuestionUpdated={handleQuestionUpdated}
          question={editingQuestion}
        />
      )}

      {deletingQuestion && (
        <DeleteQuestionDialog
          isOpen={!!deletingQuestion}
          onClose={() => setDeletingQuestion(null)}
          onQuestionDeleted={handleQuestionUpdated}
          question={deletingQuestion}
        />
      )}
    </Tabs>
  )
}
