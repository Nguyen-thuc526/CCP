
import { AdminCourseList } from "@/components/admin/admin-course-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, CheckCircle, XCircle } from "lucide-react"

export default function AdminCoursesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quản lý khóa học</h1>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Chờ duyệt
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Đã duyệt
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Từ chối
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <AdminCourseList status="pending" />
        </TabsContent>

        <TabsContent value="approved">
          <AdminCourseList status="approved" />
        </TabsContent>

        <TabsContent value="rejected">
          <AdminCourseList status="rejected" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
