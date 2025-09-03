'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
   Eye,
   MoreHorizontal,
   ToggleLeft,
   ToggleRight,
   PlusCircle,
} from 'lucide-react';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from '@/components/ui/dialog';
import { ToastType, useToast } from '@/hooks/useToast';
import { CreateCourseForm } from './course-form';
import { CourseService } from '@/services/courseService';
import type { CourseItem } from '@/types/course';

interface Course {
   id: string;
   title: string;
   description: string;
   price: number;
   isFree: boolean;
   membershipRequired: string[];
   status: 'public' | 'hidden';
   createdAt: string;
   chapters: number;
   enrollments: number;
   thumbnail: string;
   subCategories: string[];
}

export function AdminCourseList() {
   const [courses, setCourses] = useState<Course[]>([]);
   const [isCreateCourseDialogOpen, setIsCreateCourseDialogOpen] =
      useState(false);
   const { showToast } = useToast();

   console.log(courses);

   const fetchCourses = async () => {
      try {
         const response: CourseItem[] = await CourseService.getCourses();
         const transformed = response.map((item) => ({
            id: item.id,
            title: item.name,
            description: item.description ?? 'Chưa có mô tả',
            price: item.price ?? 0,
            isFree: !item.price || item.price === 0,
            membershipRequired: [],
            status: item.status === 1 ? 'public' : 'hidden',
            createdAt: new Date().toISOString().split('T')[0],
            chapters: item.chapterCount,
            enrollments: 0,
            thumbnail: item.thumble ?? '/placeholder.svg?height=200&width=300',
            subCategories: item.subCategories?.map((sc) => sc.name) ?? [],
         }));
         setCourses(transformed);
      } catch (error) {
         showToast('Không thể tải danh sách khóa học.', ToastType.Error);
      }
   };

   useEffect(() => {
      fetchCourses();
   }, []);

   const handleToggleStatus = async (
      courseId: string,
      currentStatus: 'public' | 'hidden'
   ) => {
      try {
         if (currentStatus === 'hidden') {
            const course = courses.find((c) => c.id === courseId);
            if (course && course.chapters === 0) {
               showToast(
                  'Không thể công khai khóa học chưa có chương nào.',
                  ToastType.Error
               );
               return;
            }
         }

         const newStatus = currentStatus === 'public' ? 0 : 1; // 0 for private, 1 for public
         await CourseService.changeCourseStatus({ courseId, newStatus });
         setCourses((prevCourses) =>
            prevCourses.map((course) =>
               course.id === courseId
                  ? { ...course, status: newStatus === 1 ? 'public' : 'hidden' }
                  : course
            )
         );
         showToast(
            `Khóa học ${courseId} đã được ${newStatus === 1 ? 'công khai' : 'ẩn'}.`,
            ToastType.Success
         );
      } catch (error) {
         showToast('Lỗi khi cập nhật trạng thái.', ToastType.Error);
      }
   };

   const handleCourseCreated = async () => {
      await fetchCourses();
      setIsCreateCourseDialogOpen(false);
   };

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <Dialog
               open={isCreateCourseDialogOpen}
               onOpenChange={setIsCreateCourseDialogOpen}
            >
               <DialogTrigger asChild>
                  <Button>
                     <PlusCircle className="mr-2 h-4 w-4" />
                     Tạo khóa học mới
                  </Button>
               </DialogTrigger>
               <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                     <DialogTitle>Tạo khóa học mới</DialogTitle>
                     <DialogDescription>
                        Nhập tên khóa học để bắt đầu.
                     </DialogDescription>
                  </DialogHeader>
                  <CreateCourseForm onCourseCreated={handleCourseCreated} />
               </DialogContent>
            </Dialog>
         </div>
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
               <Card key={course.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                     <img
                        src={course.thumbnail || '/placeholder.svg'}
                        alt={course.title}
                        className="w-full h-full object-cover"
                     />
                  </div>
                  <CardHeader className="pb-3">
                     <CardTitle className="line-clamp-2 text-lg">
                        {course.title}
                     </CardTitle>
                     <p className="text-sm text-muted-foreground line-clamp-2">
                        {course.description}
                     </p>
                  </CardHeader>
                  <CardContent
                     className="space-y-4

"
                  >

                     {course.subCategories.length > 0 && (
                        <div className="flex flex-wrap gap-2 text-sm">
                           {course.subCategories.map((sub, index) => (
                              <Badge key={index} variant="default">
                                 {sub}
                              </Badge>
                           ))}
                        </div>
                     )}
                     <div className="flex items-center justify-between">
                        <div>
                           {course.isFree ? (
                              <Badge variant="outline">Miễn phí</Badge>
                           ) : (
                              <span className="font-semibold">
                                 {course.price.toLocaleString('vi-VN')} VNĐ
                              </span>
                           )}
                           <Badge
                              className="ml-2"
                              variant={
                                 course.status === 'public'
                                    ? 'default'
                                    : 'secondary'
                              }
                           >
                              {course.status === 'public' ? 'Công khai' : 'Ẩn'}
                           </Badge>
                        </div>
                        <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                 <MoreHorizontal className="h-4 w-4" />
                              </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                 <Link
                                    href={`/admin/managecourse/${course.id}`}
                                 >
                                    <Eye className="mr-2 h-4 w-4" />
                                    Xem chi tiết
                                 </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                 onClick={() =>
                                    handleToggleStatus(course.id, course.status)
                                 }
                              >
                                 {course.status === 'public' ? (
                                    <ToggleLeft className="mr-2 h-4 w-4" />
                                 ) : (
                                    <ToggleRight className="mr-2 h-4 w-4" />
                                 )}
                                 {course.status === 'public'
                                    ? 'Ẩn khóa học'
                                    : 'Công khai khóa học'}
                              </DropdownMenuItem>
                           </DropdownMenuContent>
                        </DropdownMenu>
                     </div>
                  </CardContent>
               </Card>
            ))}
         </div>
      </div>
   );
}
