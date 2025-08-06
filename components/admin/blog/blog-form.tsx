"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { PostService } from "@/services/postService"

import { useToast, ToastType } from "@/hooks/useToast"
import { TiptapEditor } from "../person-type/tiptap-editor"

interface BlogFormProps {
  onSuccess?: () => void
}

export function BlogForm({ onSuccess }: BlogFormProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      showToast("Vui lòng nhập đầy đủ thông tin", ToastType.Warning)
      return
    }

    try {
      setLoading(true)
      await PostService.createPost({ title, description })
      showToast("Tạo bài viết thành công!", ToastType.Success)
      setOpen(false)
      setTitle("")
      setDescription("")
      onSuccess?.()
    } catch (error) {
      console.error(error)
      showToast("Tạo bài viết thất bại!", ToastType.Error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <PlusCircle className="mr-2 h-4 w-4" />
          Thêm bài viết mới
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm bài viết mới</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Tiêu đề</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề bài viết"
            />
          </div>
          <div>
            <Label htmlFor="description">Nội dung</Label>
            <TiptapEditor content={description} onChange={setDescription} placeholder="Nhập nội dung bài viết..." />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Đang lưu..." : "Lưu"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
