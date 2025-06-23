import { BlogList } from "@/components/admin/blog-list"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function BlogPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Blog & Tin tức</h1>
        <Button asChild>
          <Link href="/admin/blog/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm bài viết mới
          </Link>
        </Button>
      </div>
      <BlogList />
    </div>
  )
}
