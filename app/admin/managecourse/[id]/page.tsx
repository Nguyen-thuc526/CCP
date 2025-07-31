import { AdminCourseDetail } from "@/components/admin/course/admin-course-detail"

interface CourseDetailPageProps {
  params: {
    id: string
  }
}

export default async function AdminCourseDetailPage({ params }: CourseDetailPageProps) {
  // Nếu params là Promise, hãy await:
  // const resolvedParams = await params;
  // return (
  //   <div className="space-y-6">
  //     <AdminCourseDetail courseId={resolvedParams.id} />
  //   </div>
  // )
  // Nhưng thông thường, Next.js truyền params trực tiếp, chỉ cần async function là đủ:
  return (
    <div className="space-y-6">
      <AdminCourseDetail courseId={params.id} />
    </div>
  );
}
