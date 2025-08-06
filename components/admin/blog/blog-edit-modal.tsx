"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { PostService } from "@/services/postService"

import type { PostItem } from "@/types/post"
import { useToast, ToastType } from "@/hooks/useToast"
import { TiptapEditor } from "../person-type/tiptap-editor"

interface BlogEditModalProps {
  post: PostItem
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function BlogEditModal({ post, open, onOpenChange, onSuccess }: BlogEditModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState(1)
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    if (post) {
      setTitle(post.title)
      setDescription(post.description)
      setStatus(post.status)
    }
  }, [post])

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      showToast("Vui lòng nhập đầy đủ thông tin", ToastType.Warning)
      return
    }

    try {
      setLoading(true)
      const result = await PostService.updatePost({
        id: post.id,
        title,
        description,
        status,
      })

      if (result.success) {
        showToast("Cập nhật bài viết thành công!", ToastType.Success)
        onSuccess()
      } else {
        showToast("Cập nhật bài viết thất bại!", ToastType.Error)
      }
    } catch (error) {
      console.error(error)
      showToast("Cập nhật bài viết thất bại!", ToastType.Error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa bài viết</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-title">Tiêu đề</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề bài viết"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="edit-status" checked={status === 1} onCheckedChange={(checked) => setStatus(checked ? 1 : 0)} />
            <Label htmlFor="edit-status">{status === 1 ? "Công khai" : "Ẩn"}</Label>
          </div>

          <div>
            <Label htmlFor="edit-description">Nội dung</Label>
            <TiptapEditor content={description} onChange={setDescription} placeholder="Nhập nội dung bài viết..." />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
