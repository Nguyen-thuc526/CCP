"use client"

import type React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { FileText, Search, Lightbulb, Edit3, Save, X, Calendar, Clock, User } from "lucide-react"
import type { Appointment } from "@/types/appointment"
import { BookingStatus } from "@/utils/enum"

interface NoteForm {
  problemSummary: string
  problemAnalysis: string
  guides: string
}

interface FormErrors {
  problemSummary: string
  guides: string
}

interface AppointmentNoteDialogProps {
  isOpen: boolean
  onClose: () => void
  appointment: Appointment | null
  noteForm: NoteForm
  setNoteForm: React.Dispatch<React.SetStateAction<NoteForm>>
  formErrors: FormErrors
  onSave: () => void
  isEditing: boolean
  setIsEditing: (editing: boolean) => void
}

export function AppointmentNoteDialog({
  isOpen,
  onClose,
  appointment,
  noteForm,
  setNoteForm,
  formErrors,
  onSave,
  isEditing,
  setIsEditing,
}: AppointmentNoteDialogProps) {
  if (!appointment) return null

  const isEditable = appointment.status === BookingStatus.Finish
  const hasNotes =
    appointment.notes &&
    (appointment.notes.problemSummary || appointment.notes.problemAnalysis || appointment.notes.guides)

  const handleEdit = () => {
    if (isEditable) {
      setIsEditing(true)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setNoteForm({
      problemSummary: appointment.notes?.problemSummary || "",
      problemAnalysis: appointment.notes?.problemAnalysis || "",
      guides: appointment.notes?.guides || "",
    })
  }

  const handleSave = () => {
    if (isEditable) {
      onSave()
      setIsEditing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600" />
              Ghi chú tư vấn
            </DialogTitle>
            {hasNotes && !isEditing && isEditable && (
              <Button onClick={handleEdit} size="sm" className="gap-2">
                <Edit3 className="h-4 w-4" />
                Chỉnh sửa
              </Button>
            )}
          </div>
        </DialogHeader>

        {/* Appointment Info */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-gray-600" />
              Thông tin buổi tư vấn
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Khách hàng</p>
                  <p className="font-medium">{appointment.member}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Ngày tư vấn</p>
                  <p className="font-medium">{appointment.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Thời gian</p>
                  <p className="font-medium">{appointment.time}</p>
                </div>
              </div>
            </div>
            <Separator className="my-4" />
            <div>
              <p className="text-sm text-gray-500 mb-1">Vấn đề tư vấn</p>
              <p className="text-gray-900 leading-relaxed">{appointment.issue}</p>
            </div>
          </CardContent>
        </Card>

        {/* Notes Content */}
        {hasNotes && !isEditing ? (
          // View Mode
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary" className="gap-2">
                <FileText className="h-4 w-4" />
                Tóm tắt
              </TabsTrigger>
              <TabsTrigger value="analysis" className="gap-2">
                <Search className="h-4 w-4" />
                Phân tích
              </TabsTrigger>
              <TabsTrigger value="guides" className="gap-2">
                <Lightbulb className="h-4 w-4" />
                Hướng dẫn
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Tóm tắt vấn đề
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {noteForm.problemSummary || "Chưa có tóm tắt vấn đề"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Search className="h-5 w-5 text-green-600" />
                    Phân tích vấn đề
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {noteForm.problemAnalysis || "Chưa có phân tích chi tiết"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="guides" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-600" />
                    Hướng dẫn & Khuyến nghị
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {noteForm.guides || "Chưa có hướng dẫn"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : isEditable ? (
          // Edit Mode (only for Finish status)
          <div className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Tóm tắt vấn đề
                    <Badge variant="destructive" className="ml-2">
                      Bắt buộc
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={noteForm.problemSummary}
                    onChange={(e) => setNoteForm({ ...noteForm, problemSummary: e.target.value })}
                    placeholder="Tóm tắt ngắn gọn vấn đề chính được thảo luận trong buổi tư vấn..."
                    rows={4}
                    className={`resize-none ${formErrors.problemSummary ? "border-red-500" : ""}`}
                  />
                  {formErrors.problemSummary && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <X className="h-4 w-4" />
                      {formErrors.problemSummary}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Search className="h-5 w-5 text-green-600" />
                    Phân tích vấn đề
                    <Badge variant="outline" className="ml-2">
                      Tùy chọn
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={noteForm.problemAnalysis}
                    onChange={(e) => setNoteForm({ ...noteForm, problemAnalysis: e.target.value })}
                    placeholder="Phân tích chi tiết về nguyên nhân, bối cảnh và các yếu tố ảnh hưởng đến vấn đề..."
                    rows={4}
                    className="resize-none"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-600" />
                    Hướng dẫn & Khuyến nghị
                    <Badge variant="destructive" className="ml-2">
                      Bắt buộc
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={noteForm.guides}
                    onChange={(e) => setNoteForm({ ...noteForm, guides: e.target.value })}
                    placeholder="Các bước tiếp theo, lời khuyên và hướng dẫn cụ thể cho khách hàng..."
                    rows={4}
                    className={`resize-none ${formErrors.guides ? "border-red-500" : ""}`}
                  />
                  {formErrors.guides && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <X className="h-4 w-4" />
                      {formErrors.guides}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          // No Notes for Complete Status
          <Card>
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-gray-100 rounded-full">
                  <FileText className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <p className="text-gray-900 font-medium">Không có ghi chú</p>
                  <p className="text-gray-500 text-sm">Buổi tư vấn này không có ghi chú nào.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end pt-6 border-t">
          <Button variant="outline" onClick={isEditing ? handleCancel : onClose}>
            {isEditing ? "Hủy" : "Đóng"}
          </Button>
          {isEditing && isEditable && (
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Lưu ghi chú
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}