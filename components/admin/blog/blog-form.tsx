"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { PlusCircle } from 'lucide-react'
import { PostService } from "@/services/postService"
import { useToast, ToastType } from "@/hooks/useToast"
import { TiptapEditor } from "../person-type/tiptap-editor"
import { useUploadImage } from "@/hooks/upload-image"


interface BlogFormProps {
onSuccess?: () => void
}

export function BlogForm({ onSuccess }: BlogFormProps) {
const [open, setOpen] = useState(false)
const [title, setTitle] = useState("")
const [description, setDescription] = useState("")
const [image, setImage] = useState<string | null>(null) 
const [loading, setLoading] = useState(false)
const { showToast } = useToast()

const { uploadImage, loading: uploadingImage, error: uploadError } = useUploadImage()

const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0]
    uploadImage({
      file,
      onSuccess: (url) => {
        setImage(url)
        showToast("Tải ảnh lên thành công!", ToastType.Success)
      },
      onError: (err) => {
        showToast(`Tải ảnh lên thất bại: ${err}`, ToastType.Error)
        setImage(null) // Clear image on error
      }
    })
  }
}

const handleSubmit = async () => {
  if (!title.trim() || !description.trim()) {
    showToast("Vui lòng nhập đầy đủ thông tin", ToastType.Warning)
    return
  }
  if (uploadingImage) {
    showToast("Vui lòng đợi ảnh tải lên hoàn tất.", ToastType.Warning)
    return
  }

  try {
    setLoading(true)
    await PostService.createPost({ title, description, image }) // Pass the image URL
    showToast("Tạo bài viết thành công!", ToastType.Success)
    setOpen(false)
    setTitle("")
    setDescription("")
    setImage(null) // Clear image state after successful submission
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
          <Label htmlFor="image">Ảnh đại diện</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={uploadingImage}
          />
          {uploadingImage && <p className="text-sm text-gray-500">Đang tải ảnh lên...</p>}
          {image && (
            <div className="mt-2">
              <img src={image || "/placeholder.svg"} alt="Preview" className="max-w-full h-auto max-h-48 object-contain rounded-md" />
            </div>
          )}
          {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}
        </div>
        <div>
          <Label htmlFor="description">Nội dung</Label>
          <TiptapEditor content={description} onChange={setDescription} placeholder="Nhập nội dung bài viết..." />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={loading || uploadingImage}>
            {loading ? "Đang lưu..." : "Lưu"}
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
)
}
