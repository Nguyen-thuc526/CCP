import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function CounselorList() {
   const counselors = [
      {
         id: 1,
         name: 'TS. Trần Văn C',
         specialty: 'Giao tiếp',
         clients: 48,
         status: 'Hoạt động',
      },
      {
         id: 2,
         name: 'TS. Phạm Văn F',
         specialty: 'Giải quyết xung đột',
         clients: 42,
         status: 'Hoạt động',
      },
      {
         id: 3,
         name: 'TS. Ngô Thị I',
         specialty: 'Nuôi dạy con',
         clients: 36,
         status: 'Hoạt động',
      },
      {
         id: 4,
         name: 'TS. Vũ Văn L',
         specialty: 'Lập kế hoạch tài chính',
         clients: 29,
         status: 'Hoạt động',
      },
      {
         id: 5,
         name: 'TS. Lê Thị M',
         specialty: 'Sự thân mật',
         clients: 0,
         status: 'Đang chờ',
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
                           Chuyên viên tư vấn
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                           Chuyên môn
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                           Khách hàng
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
                     {counselors.map((counselor) => (
                        <tr
                           key={counselor.id}
                           className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                           <td className="p-4 align-middle">
                              <div className="flex items-center gap-3">
                                 <Avatar>
                                    <AvatarImage
                                       src={`/placeholder.svg?height=40&width=40`}
                                       alt={counselor.name}
                                    />
                                    <AvatarFallback>
                                       {counselor.name.split(' ')[1][0]}
                                       {counselor.name.split(' ')[2][0]}
                                    </AvatarFallback>
                                 </Avatar>
                                 {counselor.name}
                              </div>
                           </td>
                           <td className="p-4 align-middle">
                              {counselor.specialty}
                           </td>
                           <td className="p-4 align-middle">
                              {counselor.clients}
                           </td>
                           <td className="p-4 align-middle">
                              <Badge
                                 variant={
                                    counselor.status === 'Hoạt động'
                                       ? 'default'
                                       : 'secondary'
                                 }
                              >
                                 {counselor.status}
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
