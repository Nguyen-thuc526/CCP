import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function BlogList() {
   const posts = [
      {
         id: 1,
         title: '10 mẹo giao tiếp cho một cuộc hôn nhân lành mạnh',
         author: 'TS. Trần Văn C',
         date: '10/05/2025',
         status: 'Đã xuất bản',
         views: 1248,
      },
      {
         id: 2,
         title: 'Cách giải quyết xung đột hiệu quả',
         author: 'TS. Phạm Văn F',
         date: '05/05/2025',
         status: 'Đã xuất bản',
         views: 986,
      },
      {
         id: 3,
         title: 'Xây dựng lòng tin sau sự phản bội',
         author: 'TS. Ngô Thị I',
         date: '28/04/2025',
         status: 'Đã xuất bản',
         views: 1542,
      },
      {
         id: 4,
         title: 'Lập kế hoạch tài chính cho người mới cưới',
         author: 'TS. Vũ Văn L',
         date: '20/04/2025',
         status: 'Đã xuất bản',
         views: 756,
      },
      {
         id: 5,
         title: 'Duy trì sự thân mật trong mối quan hệ dài hạn',
         author: 'TS. Lê Thị M',
         date: '12/05/2025',
         status: 'Bản nháp',
         views: 0,
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
                           Tác giả
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                           Ngày
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                           Lượt xem
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
                     {posts.map((post) => (
                        <tr
                           key={post.id}
                           className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                           <td className="p-4 align-middle">{post.title}</td>
                           <td className="p-4 align-middle">{post.author}</td>
                           <td className="p-4 align-middle">{post.date}</td>
                           <td className="p-4 align-middle">
                              <div className="flex items-center gap-1">
                                 <Eye className="h-4 w-4 text-muted-foreground" />
                                 {post.views}
                              </div>
                           </td>
                           <td className="p-4 align-middle">
                              <Badge
                                 variant={
                                    post.status === 'Đã xuất bản'
                                       ? 'default'
                                       : 'secondary'
                                 }
                              >
                                 {post.status}
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
