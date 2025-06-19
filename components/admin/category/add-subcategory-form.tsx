"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast, ToastType } from "@/hooks/useToast"
import { createSubCategory } from "@/services/categoryService"

interface Props {
  categoryId: string
  onCreated: (subCategory: any) => void
  onClose: () => void
}

export default function AddSubCategoryForm({ categoryId, onCreated, onClose }: Props) {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  const handleSubmit = async () => {
    if (!name.trim()) return

    try {
      setLoading(true)
      const newSubCategory = await createSubCategory({ categoryId, name })
      showToast("Tạo sub-category thành công", ToastType.Success)
      onCreated(newSubCategory) 
      onClose()
    } catch (error) {
      showToast("Tạo sub-category thất bại", ToastType.Error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Input placeholder="Tên sub-category" value={name} onChange={(e) => setName(e.target.value)} />
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          Hủy
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Đang tạo..." : "Tạo"}
        </Button>
      </div>
    </div>
  )
}
