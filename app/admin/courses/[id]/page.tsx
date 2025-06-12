import { AdminCourseDetail } from "@/components/admin/admin-course-detail"



interface CourseDetailPageProps {
  params: {
    id: string
  }
}

export default function AdminCourseDetailPage({ params }: CourseDetailPageProps) {
  return (
    <div className="space-y-6">
      <AdminCourseDetail courseId={params.id} />
    </div>
  )
}
