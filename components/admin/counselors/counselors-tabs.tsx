import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Ban, CheckCircle } from 'lucide-react';
import {
   Pagination,
   PaginationContent,
   PaginationItem,
   PaginationNext,
   PaginationPrevious,
} from '@/components/ui/pagination';

import { Counselor } from '@/types/counselor';
import { AccountStatus, CounselorStatus } from '@/utils/enum';

interface CounselorTabsProps {
   counselors: Counselor[];
   handleStatusChange: (counselorId: string, newStatus: number) => void;

   // Pagination
   page: number;
   pageSize: number;
   totalCount: number;
   onPageChange: (page: number) => void;
}

export default function CounselorTabs({
   counselors,
   handleStatusChange,
   page,
   pageSize,
   totalCount,
   onPageChange,
}: CounselorTabsProps) {
   const totalPages = Math.ceil(totalCount / pageSize);

   const getStatusBadge = (status: number) => {
      switch (status) {
         case CounselorStatus.Active:
            return <Badge className="bg-green-500">Hoạt động</Badge>;
         case CounselorStatus.Block:
            return <Badge variant="destructive">Đã chặn</Badge>;
         case CounselorStatus.NoFunc:
            return <Badge className="bg-yellow-500">Chưa chính thức</Badge>;
         default:
            return <Badge variant="outline">Không xác định</Badge>;
      }
   };

   return (
      <Tabs defaultValue="all" className="space-y-4">
         <TabsContent value="all">
            <Card>
               <CardHeader>
                  <CardTitle>Danh sách chuyên viên</CardTitle>
               </CardHeader>
               
               <CardContent className="p-0">
                  <div className="relative w-full overflow-auto">
                     <table className="w-full caption-bottom text-sm">
                        <thead className="border-b">
                           <tr>
                              <th className="h-12 px-4 text-left font-medium">
                                 Chuyên viên
                              </th>
                              <th className="h-12 px-4 text-left font-medium">
                                 Số điện thoại
                              </th>
                              <th className="h-12 px-4 text-left font-medium">
                                 Kinh nghiệm
                              </th>
                              <th className="h-12 px-4 text-left font-medium">
                                 Trạng thái
                              </th>
                              <th className="h-12 px-4 text-left font-medium">
                                 Thao tác
                              </th>
                           </tr>
                        </thead>
                        <tbody>
                           {counselors.map((counselor) => (
                              <tr
                                 key={counselor.id}
                                 className="border-b transition-colors hover:bg-muted/50"
                              >
                                 <td className="p-4">
                                    <div className="flex items-center gap-3">
                                       <Avatar>
                                          <AvatarImage
                                             src={
                                                counselor.avatar ||
                                                '/placeholder.svg'
                                             }
                                             alt={counselor.fullname}
                                          />
                                          <AvatarFallback>
                                             {counselor.fullname[0]}
                                          </AvatarFallback>
                                       </Avatar>
                                       <div>
                                          <div className="font-medium">
                                             {counselor.fullname}
                                          </div>
                                          {/* <div className="text-sm text-muted-foreground">
                                             ID: {counselor.id}
                                          </div> */}
                                       </div>
                                    </div>
                                 </td>
                                 <td className="p-4">{counselor.phone}</td>
                                 <td className="p-4">
                                    {counselor.yearOfJob} năm
                                 </td>
                                 <td className="p-4">
                                    {getStatusBadge(counselor.status)}
                                 </td>
                                 <td className="p-4 flex gap-2">
                                    {counselor.status !==
                                       CounselorStatus.NoFunc && (
                                          <div className="flex gap-2">
                                             <Button
                                                variant="ghost"
                                                size="sm"
                                                disabled={
                                                   counselor.status ===
                                                   CounselorStatus.Block
                                                }
                                                onClick={() =>
                                                   handleStatusChange(
                                                      counselor.id,
                                                      CounselorStatus.Block
                                                   )
                                                }
                                             >
                                                <Ban className="h-4 w-4 text-red-600" />
                                             </Button>
                                             <Button
                                                variant="ghost"
                                                size="sm"
                                                disabled={
                                                   counselor.status ===
                                                   CounselorStatus.Active
                                                }
                                                onClick={() =>
                                                   handleStatusChange(
                                                      counselor.id,
                                                      CounselorStatus.Active
                                                   )
                                                }
                                             >
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                             </Button>
                                          </div>
                                       )}
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>

                  {totalPages > 1 && (
                     <div className="p-4 flex justify-center">
                        <Pagination>
                           <PaginationContent>
                              <PaginationItem>
                                 <PaginationPrevious
                                    onClick={() =>
                                       onPageChange(Math.max(1, page - 1))
                                    }
                                    disabled={page === 1}
                                 />
                              </PaginationItem>
                              <PaginationItem>
                                 <span className="text-sm px-4 py-2">
                                    Trang {page} / {totalPages}
                                 </span>
                              </PaginationItem>
                              <PaginationItem>
                                 <PaginationNext
                                    onClick={() =>
                                       onPageChange(
                                          Math.min(totalPages, page + 1)
                                       )
                                    }
                                    disabled={page === totalPages}
                                 />
                              </PaginationItem>
                           </PaginationContent>
                        </Pagination>
                     </div>
                  )}
               </CardContent>
            </Card>
         </TabsContent>
      </Tabs>
   );
}
