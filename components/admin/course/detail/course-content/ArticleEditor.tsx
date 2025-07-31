"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { TiptapEditor } from "@/components/admin/person-type/tiptap-editor"


interface ArticleEditorProps {
  title: string
  description: string
  content: string
  onTitleChange: (title: string) => void
  onDescriptionChange: (description: string) => void
  onContentChange: (content: string) => void
  id?: string
}

export function ArticleEditor({
  title,
  description,
  content,
  onTitleChange,
  onDescriptionChange,
  onContentChange,
  id = "article-editor",
}: ArticleEditorProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`${id}-title`}>Tên chương</Label>
        <Input
          id={`${id}-title`}
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Nhập tên chương"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${id}-description`}>Mô tả ngắn</Label>
        <Input
          id={`${id}-description`}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Mô tả ngắn về nội dung chương"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${id}-content`}>Nội dung chi tiết</Label>
        <TiptapEditor
          content={content}
          onChange={onContentChange}
          placeholder="Nhập nội dung chi tiết của bài giảng..."
        />
      </div>
    </div>
  )
}
