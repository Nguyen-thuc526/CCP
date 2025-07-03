import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { User, Role, Status } from '@/types/user';

interface UserDetailDialogProps {
   selectedUser: User | null;
   showUserDetail: boolean;
   setShowUserDetail: (value: boolean) => void;
}

export default function UserDetailDialog({
   selectedUser,
   showUserDetail,
   setShowUserDetail,
}: UserDetailDialogProps) {
   const getStatusBadge = (status: Status) => {
      switch (status) {
         case Status.Active:
            return (
               <Badge variant="default" className="bg-green-500">
                  Hoạt động
               </Badge>
            );
         case Status.Inactive:
            return <Badge variant="secondary">Không hoạt động</Badge>;
         case Status.Suspended:
            return <Badge variant="destructive">Tạm khóa</Badge>;
         case Status.Pending:
            return <Badge variant="outline">Chờ duyệt</Badge>;
         default:
            return null;
      }
   };

   const getRoleBadge = (role: Role) => {
      switch (role) {
         case Role.Admin:
            return (
               <Badge variant="default" className="bg-red-500">
                  Quản trị
               </Badge>
            );
         case Role.Member:
            return <Badge variant="outline">Thành viên</Badge>;
         case Role.Counselor:
            return <Badge variant="default">Tư vấn viên</Badge>;
         default:
            return null;
      }
   };

   const formatDateTime = (dateString: string) => {
      return new Date(dateString).toLocaleString('vi-VN');
   };

   const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('vi-VN');
   };

   return (
      <Dialog open={showUserDetail} onOpenChange={setShowUserDetail}>
         <DialogContent className="max-w-2xl">
            <DialogHeader>
               <DialogTitle>Chi tiết người dùng</DialogTitle>
            </DialogHeader>
            {selectedUser && (
               <div className="space-y-4">
                  <div className="flex items-center gap-4">
                     <Avatar className="h-16 w-16">
                        <AvatarImage
                           src={selectedUser.avatar || '/placeholder.svg'}
                           alt={selectedUser.fullName || selectedUser.email}
                        />
                        <AvatarFallback>
                           {(selectedUser.fullName || selectedUser.email)[0]}
                        </AvatarFallback>
                     </Avatar>
                     <div>
                        <h3 className="text-lg font-semibold">
                           {selectedUser.fullName || selectedUser.email}
                        </h3>
                        <p className="text-muted-foreground">
                           {selectedUser.email}
                        </p>
                        <div className="flex gap-2 mt-2">
                           {getRoleBadge(selectedUser.role)}
                           {getStatusBadge(selectedUser.status)}
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <Label className="text-sm font-medium">
                           Ngày tham gia
                        </Label>
                        <p>{formatDate(selectedUser.createAt)}</p>
                     </div>
                     <div>
                        <Label className="text-sm font-medium">
                           Hoạt động cuối
                        </Label>
                        <p>
                           {selectedUser.lastActive
                              ? formatDateTime(selectedUser.lastActive)
                              : 'Chưa có'}
                        </p>
                     </div>
                     {selectedUser.role === Role.Member && (
                        <>
                           <div>
                              <Label className="text-sm font-medium">
                                 Gói membership
                              </Label>
                              <p>{selectedUser.membershipPlan || 'Chưa có'}</p>
                           </div>
                           <div>
                              <Label className="text-sm font-medium">
                                 Tổng lịch hẹn
                              </Label>
                              <p>{selectedUser.totalAppointments || 0}</p>
                           </div>
                        </>
                     )}
                     {selectedUser.role === Role.Counselor && (
                        <>
                           <div>
                              <Label className="text-sm font-medium">
                                 Chuyên môn
                              </Label>
                              <p>{selectedUser.specialization || 'Chưa có'}</p>
                           </div>
                           <div>
                              <Label className="text-sm font-medium">
                                 Kinh nghiệm
                              </Label>
                              <p>{selectedUser.experience || 'Chưa có'}</p>
                           </div>
                           <div>
                              <Label className="text-sm font-medium">
                                 Đánh giá
                              </Label>
                              <p>
                                 {selectedUser.rating
                                    ? `${selectedUser.rating}/5 ⭐`
                                    : 'Chưa có đánh giá'}
                              </p>
                           </div>
                           <div>
                              <Label className="text-sm font-medium">
                                 Tổng lịch hẹn
                              </Label>
                              <p>{selectedUser.totalAppointments || 0}</p>
                           </div>
                        </>
                     )}
                  </div>
               </div>
            )}
         </DialogContent>
      </Dialog>
   );
}
