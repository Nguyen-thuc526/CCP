import { AdminCourseList } from "@/components/admin/admin-course-list"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function CounselorCoursesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Khóa học của tôi</h1>
        <Button asChild>
          <Link href="/admin/managecourse/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Tạo khóa học mới
          </Link>
        </Button>
      </div>
      <AdminCourseList />
    </div>
  )
}
