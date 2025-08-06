"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ToastType, useToast } from "@/hooks/useToast"
import { CourseService } from "@/services/courseService"

interface CreateCourseFormProps {
  onCourseCreated?: (courseTitle: string) => void
}

export function CreateCourseForm({ onCourseCreated }: CreateCourseFormProps) {
  const [title, setTitle] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { showToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      showToast("Tên khóa học không được để trống.", ToastType.Error)
      return
    }

    setIsLoading(true)

    try {
      const response = await CourseService.createCourse({ name: title })

      if (!response.success) {
        throw new Error(response.error || "Không thể tạo khóa học.")
      }

      showToast("Khóa học đã được tạo thành công!", ToastType.Success)

      if (onCourseCreated) {
        onCourseCreated(title)
      }
    } catch {
      showToast("Không thể tạo khóa học. Vui lòng thử lại.", ToastType.Error)
    } finally {
      setIsLoading(false)
      setTitle("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="course-title">Tên khóa học</Label>
        <Input
          id="course-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nhập tên khóa học"
          required
          disabled={isLoading}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Đang tạo..." : "Tạo khóa học"}
      </Button>
    </form>
  )
}
