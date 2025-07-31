import { AdminCourseList } from '@/components/admin/course/admin-course-list';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function ManageCoursesPage() {
   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
           <div>
               <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý khóa học</h1>
               <p className="text-gray-600">
                  Quản lý các khóa học
               </p>
            </div>
         </div>
         <AdminCourseList />
      </div>
   );
}
