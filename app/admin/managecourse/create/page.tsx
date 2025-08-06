import { CreateCourseForm } from "@/components/admin/course/course-form";


export default function CreateCoursePage() {
   return (
      <div className="space-y-6">
         <h1 className="text-3xl font-bold">Thêm khóa học mới</h1>
         <CreateCourseForm />
      </div>
   );
}
