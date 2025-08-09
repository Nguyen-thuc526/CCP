import { AdminCourseDetail } from '@/components/admin/course/admin-course-detail';

interface CourseDetailPageProps {
   params: {
      id: string;
   };
}

export default async function AdminCourseDetailPage({
   params,
}: CourseDetailPageProps) {
   return (
      <div className="space-y-6">
         <AdminCourseDetail courseId={params.id} />
      </div>
   );
}
