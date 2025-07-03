'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Eye, MoreHorizontal, Trash2 } from 'lucide-react';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

interface Course {
   id: string;
   title: string;
   description: string;
   price: number;
   isFree: boolean;
   membershipRequired: string[];
   status: 'draft' | 'pending' | 'approved' | 'rejected';
   createdAt: string;
   chapters: number;
   enrollments: number;
   thumbnail: string;
}

export function AdminCourseList() {
   const [courses] = useState<Course[]>([
      {
         id: '1',
         title: 'Tư vấn tâm lý cơ bản',
         description: 'Khóa học cung cấp kiến thức cơ bản về tư vấn tâm lý',
         price: 500000,
         isFree: false,
         membershipRequired: ['premium'],
         status: 'pending',
         createdAt: '2024-01-15',
         chapters: 12,
         enrollments: 0,
         thumbnail: '/placeholder.svg?height=200&width=300',
      },
      {
         id: '2',
         title: 'Kỹ năng giao tiếp hiệu quả',
         description: 'Phát triển kỹ năng giao tiếp trong tư vấn',
         price: 0,
         isFree: true,
         membershipRequired: ['basic', 'premium'],
         status: 'approved',
         createdAt: '2024-01-10',
         chapters: 8,
         enrollments: 45,
         thumbnail: '/placeholder.svg?height=200&width=300',
      },
   ]);

   const handleDelete = (courseId: string) => {
      console.log('Delete course:', courseId);
   };

   return (
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
                     </div>

                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                           </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           <DropdownMenuItem asChild>
                              <Link href={`/admin/managecourse/${course.id}`}>
                                 <Eye className="mr-2 h-4 w-4" />
                                 Xem chi tiết
                              </Link>
                           </DropdownMenuItem>

                           <DropdownMenuItem asChild>
                              <Link
                                 href={`/admin/managecourse/${course.id}/edit`}
                              >
                                 <Edit className="mr-2 h-4 w-4" />
                                 Chỉnh sửa
                              </Link>
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
   );
}
