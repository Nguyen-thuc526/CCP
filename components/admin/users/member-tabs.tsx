import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
   Edit,
   Trash2,
   MoreHorizontal,
   Ban,
   CheckCircle,
   Eye,
} from 'lucide-react';

import {
   Pagination,
   PaginationContent,
   PaginationItem,
   PaginationNext,
   PaginationPrevious,
} from '@/components/ui/pagination';

import { Member } from '@/types/member';
import { AccountStatus } from '@/utils/enum';

interface MemberTabsProps {
   members: Member[];
   searchTerm: string;
   statusFilter: string;
   handleStatusChange: (memberId: string, newStatus: number) => void;
   openMemberDetail: (member: Member) => void;

   // Pagination
   page: number;
   pageSize: number;
   totalCount: number;
   onPageChange: (page: number) => void;
}

export default function MemberTabs({
   members,
   searchTerm,
   statusFilter,
   handleStatusChange,
   openMemberDetail,
   page,
   pageSize,
   totalCount,
   onPageChange,
}: MemberTabsProps) {
   const totalPages = Math.ceil(totalCount / pageSize);
   console.log(members);
   const getStatusBadge = (status: number) => {
      switch (status) {
         case AccountStatus.Active:
            return <Badge className="bg-green-500">Hoạt động</Badge>;
         case AccountStatus.Block:
            return <Badge variant="destructive">Đã chặn</Badge>;
         default:
            return <Badge variant="outline">Không xác định</Badge>;
      }
   };

   const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('vi-VN');
   };

   return (
      <Tabs defaultValue="all" className="space-y-4">
         {/* <TabsList>
                <TabsTrigger value="all">Tất cả ({totalCount})</TabsTrigger>
            </TabsList> */}

         <TabsContent value="all">
            <Card>
               <CardHeader>
                  <CardTitle>Danh sách Member</CardTitle>
               </CardHeader>
               <CardContent className="p-0">
                  <div className="relative w-full overflow-auto">
                     <table className="w-full caption-bottom text-sm">
                        <thead className="border-b">
                           <tr>
                              <th className="h-12 px-4 text-left font-medium">
                                 Thành viên
                              </th>
                              <th className="h-12 px-4 text-left font-medium">
                                 SĐT
                              </th>
                              <th className="h-12 px-4 text-left font-medium">
                                 Ngày sinh
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
                           {members.map((member) => (
                              <tr
                                 key={member.id}
                                 className="border-b transition-colors hover:bg-muted/50"
                              >
                                 <td className="p-4">
                                    <div className="flex items-center gap-3">
                                       <Avatar>
                                          <AvatarImage
                                             src={
                                                member.avatar ||
                                                '/placeholder.svg'
                                             }
                                             alt={member.fullname}
                                          />
                                          <AvatarFallback>
                                             {member.fullname[0]}
                                          </AvatarFallback>
                                       </Avatar>
                                       <div>
                                          <div className="font-medium">
                                             {member.fullname}
                                          </div>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="p-4">{member.phone}</td>
                                 <td className="p-4">
                                    {formatDate(member.dob)}
                                 </td>
                                 <td className="p-4">
                                    {getStatusBadge(member.status)}
                                 </td>
                                 <td className="p-4 flex gap-2">
                                    <Button
                                       variant="ghost"
                                       size="sm"
                                       disabled={
                                          member.status === AccountStatus.Block
                                       }
                                       onClick={() =>
                                          handleStatusChange(
                                             member.id,
                                             AccountStatus.Block
                                          )
                                       }
                                    >
                                       <Ban className="h-4 w-4 text-red-600" />
                                    </Button>

                                    <Button
                                       variant="ghost"
                                       size="sm"
                                       disabled={
                                          member.status === AccountStatus.Active
                                       }
                                       onClick={() =>
                                          handleStatusChange(
                                             member.id,
                                             AccountStatus.Active
                                          )
                                       }
                                    >
                                       <CheckCircle className="h-4 w-4 text-green-600" />
                                    </Button>
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
