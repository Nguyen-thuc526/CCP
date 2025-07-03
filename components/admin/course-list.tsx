import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function CourseList() {
   const courses = [
      {
         id: 1,
         title: 'Giao tiếp hiệu quả trong hôn nhân',
         instructor: 'TS. Trần Văn C',
         enrollments: 342,
         status: 'Đã xuất bản',
      },
      {
         id: 2,
         title: 'Chiến lược giải quyết xung đột',
         instructor: 'TS. Phạm Văn F',
         enrollments: 289,
         status: 'Đã xuất bản',
      },
      {
         id: 3,
         title: 'Xây dựng lòng tin và sự thân mật',
         instructor: 'TS. Ngô Thị I',
         enrollments: 256,
         status: 'Đã xuất bản',
      },
      {
         id: 4,
         title: 'Lập kế hoạch tài chính cho cặp đôi',
         instructor: 'TS. Vũ Văn L',
         enrollments: 198,
         status: 'Đã xuất bản',
      },
      {
         id: 5,
         title: 'Nuôi dạy con cùng nhau',
         instructor: 'TS. Lê Thị M',
         enrollments: 0,
         status: 'Bản nháp',
      },
   ];

   return (
      <Card>
         <CardContent className="p-0">
            <div className="relative w-full overflow-auto">
               <table className="w-full caption-bottom text-sm">
                  <thead className="border-b">
                     <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium">
                           Tiêu đề
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                           Giảng viên
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                           Lượt đăng ký
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                           Trạng thái
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                           Thao tác
                        </th>
                     </tr>
                  </thead>
                  <tbody>
                     {courses.map((course) => (
                        <tr
                           key={course.id}
                           className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                           <td className="p-4 align-middle">{course.title}</td>
                           <td className="p-4 align-middle">
                              {course.instructor}
                           </td>
                           <td className="p-4 align-middle">
                              {course.enrollments}
                           </td>
                           <td className="p-4 align-middle">
                              <Badge
                                 variant={
                                    course.status === 'Đã xuất bản'
                                       ? 'default'
                                       : 'secondary'
                                 }
                              >
                                 {course.status}
                              </Badge>
                           </td>
                           <td className="p-4 align-middle">
                              <div className="flex gap-2">
                                 <Button variant="ghost" size="icon">
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Chỉnh sửa</span>
                                 </Button>
                                 <Button variant="ghost" size="icon">
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Xóa</span>
                                 </Button>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </CardContent>
      </Card>
   );
}
