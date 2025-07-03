"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PersonType } from "@/types/person-type"
import { Category } from "@/types/category"
import { PersonalityForm } from "./person-type-form"

interface AddPersonalityModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<PersonType>) => Promise<boolean>
  categories: Category[]
  surveyName?: string
}

export function AddPersonalityModal({ isOpen, onClose, onSubmit, categories, surveyName }: AddPersonalityModalProps) {
  const [formData, setFormData] = useState<Partial<PersonType>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    // Validation
    if (!formData.name?.trim()) {
      alert("Vui lòng nhập tên loại tính cách")
      return
    }
    if (!formData.categoryId) {
      alert("Vui lòng chọn danh mục")
      return
    }
    if (!formData.description?.trim()) {
      alert("Vui lòng nhập mô tả")
      return
    }

    setIsSubmitting(true)
    const success = await onSubmit(formData)
    setIsSubmitting(false)

    if (success) {
      setFormData({})
    }
  }

  const handleClose = () => {
    setFormData({})
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm Loại Tính Cách Mới</DialogTitle>
          <DialogDescription>
            Tạo một loại tính cách mới cho {surveyName ? `khảo sát ${surveyName}` : "hệ thống đánh giá"}.
          </DialogDescription>
        </DialogHeader>

        <PersonalityForm categories={categories} initialData={formData} onDataChange={setFormData} />

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Đang tạo..." : "Thêm Loại Tính Cách"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
