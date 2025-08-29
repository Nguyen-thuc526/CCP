"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Search, Lightbulb, Save, X } from "lucide-react"

interface NoteForm {
  problemSummary: string
  problemAnalysis: string
  guides: string
}

interface FormErrors {
  problemSummary: string
  guides: string
}

interface CallNotesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  notes: NoteForm
  onSave: (form: NoteForm) => Promise<void>
  loading?: boolean
}

const CallNotesDialog: React.FC<CallNotesDialogProps> = ({ open, onOpenChange, notes, onSave, loading = false }) => {
  const [noteForm, setNoteForm] = useState<NoteForm>({
    problemSummary: "",
    problemAnalysis: "",
    guides: "",
  })
  const [formErrors, setFormErrors] = useState<FormErrors>({
    problemSummary: "",
    guides: "",
  })

  useEffect(() => {
    if (open) {
      setNoteForm({
        problemSummary: notes.problemSummary || "",
        problemAnalysis: notes.problemAnalysis || "",
        guides: notes.guides || "",
      })
      setFormErrors({ problemSummary: "", guides: "" })
    }
  }, [open, notes])

  const handleSave = async () => {
    const errors: FormErrors = { problemSummary: "", guides: "" }
    if (!noteForm.problemSummary.trim()) {
      errors.problemSummary = "Tóm tắt vấn đề là bắt buộc"
    }
    if (!noteForm.guides.trim()) {
      errors.guides = "Hướng dẫn là bắt buộc"
    }
    setFormErrors(errors)

    if (errors.problemSummary || errors.guides) {
      return false
    }

    await onSave(noteForm)
    return true
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            Ghi chú trong quá trình tư vấn
          </DialogTitle>
        </DialogHeader>

        {/* Notes Form */}
        <div className="space-y-6">
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
                onChange={(e) =>
                  setNoteForm({
                    ...noteForm,
                    problemSummary: e.target.value,
                  })
                }
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
                onChange={(e) =>
                  setNoteForm({
                    ...noteForm,
                    problemAnalysis: e.target.value,
                  })
                }
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
                onChange={(e) =>
                  setNoteForm({
                    ...noteForm,
                    guides: e.target.value,
                  })
                }
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

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end pt-6 border-t">
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Đóng
          </Button>
          <Button onClick={handleSave} className="gap-2" disabled={loading}>
            <Save className="h-4 w-4" />
            Lưu ghi chú
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CallNotesDialog
