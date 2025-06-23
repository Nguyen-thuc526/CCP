import { BlogForm } from "@/components/admin/blog-form"

export default function CreateBlogPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Thêm bài viết mới</h1>
      <BlogForm />
    </div>
  )
}
