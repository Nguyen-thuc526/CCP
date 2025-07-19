'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
   Eye,
   MoreHorizontal,
   Trash2,
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
import { CourseItem } from '@/types/course';

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
}

export function AdminCourseList() {
   const [courses, setCourses] = useState<Course[]>([]);
   const [isCreateCourseDialogOpen, setIsCreateCourseDialogOpen] =
      useState(false);
   const { showToast } = useToast();

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
            status: 'hidden', // default, vì API chưa có trường này
            createdAt: new Date().toISOString().split('T')[0], // giả định
            chapters: item.chapterCount,
            enrollments: 0,
            thumbnail: item.thumble ?? '/placeholder.svg?height=200&width=300',
         }));
         setCourses(transformed);
      } catch (error) {
         showToast('Không thể tải danh sách khóa học.', ToastType.Error);
      }
   };

   useEffect(() => {
      fetchCourses();
   }, []);

   const handleDelete = (courseId: string) => {
      setCourses((prev) => prev.filter((course) => course.id !== courseId));
      showToast(`Khóa học ${courseId} đã được xóa.`, ToastType.Success);
   };

   const handleToggleStatus = (
      courseId: string,
      newStatus: 'public' | 'hidden'
   ) => {
      setCourses((prevCourses) =>
         prevCourses.map((course) =>
            course.id === courseId ? { ...course, status: newStatus } : course
         )
      );
      showToast(
         `Khóa học ${courseId} đã được ${newStatus === 'public' ? 'công khai' : 'ẩn'}.`,
         ToastType.Success
      );
   };

   const handleCourseCreated = async () => {
      await fetchCourses();
      setIsCreateCourseDialogOpen(false);
   };

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Quản lí khóa học</h1>
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
                        src={course.thumbnail}
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

                  <CardContent className="space-y-4">
                     <div className="flex items-center justify-between text-sm">
                        <span>{course.chapters} chương</span>
                        <span>{course.enrollments} học viên</span>
                     </div>

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
                                    handleToggleStatus(
                                       course.id,
                                       course.status === 'public'
                                          ? 'hidden'
                                          : 'public'
                                    )
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

                              <DropdownMenuItem
                                 onClick={() => handleDelete(course.id)}
                                 className="text-destructive"
                              >
                                 <Trash2 className="mr-2 h-4 w-4" />
                                 Xóa khóa học
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
