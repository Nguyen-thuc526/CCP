import { CourseForm } from '@/components/admin/course-form';

interface EditCoursePageProps {
   params: {
      id: string;
   };
}

export default function EditCoursePage({ params }: EditCoursePageProps) {
   return (
      <div className="space-y-6">
         <h1 className="text-3xl font-bold">Chỉnh sửa khóa học</h1>
         <CourseForm courseId={params.id} />
      </div>
   );
}
