'use client';

import type { Withdraw } from '@/types/withdraw';
import { WithdrawStatus } from '@/utils/enum';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import {
   Check,
   X,
   Clock,
   User,
   CreditCard,
   Calendar,
   DollarSign,
} from 'lucide-react';

interface WithdrawItemProps {
   withdraw: Withdraw;
   onUpdateStatus: (
      id: string,
      status: WithdrawStatus,
      reason?: string
   ) => void;
   isUpdating: boolean;
}

export function WithdrawItem({
   withdraw,
   onUpdateStatus,
   isUpdating,
}: WithdrawItemProps) {
   const [rejectReason, setRejectReason] = useState('');
   const [showRejectDialog, setShowRejectDialog] = useState(false);

   const getStatusBadge = (status: WithdrawStatus) => {
      switch (status) {
         case WithdrawStatus.PendingWithdrawal:
            return (
               <Badge
                  variant="outline"
                  className="text-yellow-600 border-yellow-600"
               >
                  <Clock className="w-3 h-3 mr-1" />
                  Chờ xử lý
               </Badge>
            );
         case WithdrawStatus.Approved:
            return (
               <Badge
                  variant="outline"
                  className="text-green-600 border-green-600"
               >
                  <Check className="w-3 h-3 mr-1" />
                  Đã duyệt
               </Badge>
            );
         case WithdrawStatus.Rejected:
            return (
               <Badge variant="outline" className="text-red-600 border-red-600">
                  <X className="w-3 h-3 mr-1" />
                  Đã từ chối
               </Badge>
            );
         default:
            return null;
      }
   };

   const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('vi-VN', {
         style: 'currency',
         currency: 'VND',
      }).format(amount);
   };

   const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleString('vi-VN');
   };

   const handleReject = () => {
      if (rejectReason.trim()) {
         onUpdateStatus(withdraw.id, WithdrawStatus.Rejected, rejectReason);
         setShowRejectDialog(false);
         setRejectReason('');
      }
   };

   return (
      <Card className="w-full">
         <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
               <CardTitle className="text-lg">
                  Mã đơn hàng #{withdraw.id.slice(-8)}
               </CardTitle>
               {getStatusBadge(withdraw.status)}
            </div>
         </CardHeader>
         <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                  <div className="flex items-center gap-2">
                     <DollarSign className="w-4 h-4 text-muted-foreground" />
                     <span className="text-sm text-muted-foreground">
                        Số tiền:
                     </span>
                     <span className="font-semibold text-lg">
                        {formatCurrency(withdraw.total)}
                     </span>
                  </div>
                  <div className="flex items-center gap-2">
                     <CreditCard className="w-4 h-4 text-muted-foreground" />
                     <span className="text-sm text-muted-foreground">
                        Ngân hàng:
                     </span>
                     <span className="font-medium">{withdraw.bankName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <User className="w-4 h-4 text-muted-foreground" />
                     <span className="text-sm text-muted-foreground">
                        Tên tài khoản:
                     </span>
                     <span className="font-medium">{withdraw.accountName}</span>
                  </div>
               </div>
               <div className="space-y-2">
                  <div className="flex items-center gap-2">
                     <span className="text-sm text-muted-foreground">STK:</span>
                     <span className="font-mono">{withdraw.stk}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Calendar className="w-4 h-4 text-muted-foreground" />
                     <span className="text-sm text-muted-foreground">
                        Ngày tạo:
                     </span>
                     <span>{formatDate(withdraw.createDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <User className="w-4 h-4 text-muted-foreground" />
                     <span className="text-sm text-muted-foreground">
                        Tư vấn viên:
                     </span>
                     <span>{withdraw.counselor?.fullname || 'N/A'}</span>
                  </div>
               </div>
            </div>

            {withdraw.cancelReason && (
               <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-800">
                     <strong>Lý do từ chối:</strong> {withdraw.cancelReason}
                  </p>
               </div>
            )}

            {withdraw.status === WithdrawStatus.PendingWithdrawal && (
               <div className="flex gap-2 pt-2">
                  <Button
                     onClick={() =>
                        onUpdateStatus(withdraw.id, WithdrawStatus.Approved)
                     }
                     disabled={isUpdating}
                     className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                     <Check className="w-4 h-4 mr-2" />
                     Duyệt
                  </Button>
                  <Dialog
                     open={showRejectDialog}
                     onOpenChange={setShowRejectDialog}
                  >
                     <DialogTrigger asChild>
                        <Button
                           variant="destructive"
                           disabled={isUpdating}
                           className="flex-1"
                        >
                           <X className="w-4 h-4 mr-2" />
                           Từ chối
                        </Button>
                     </DialogTrigger>
                     <DialogContent>
                        <DialogHeader>
                           <DialogTitle>Từ chối yêu cầu rút tiền</DialogTitle>
                           <DialogDescription>
                              Vui lòng nhập lý do từ chối yêu cầu rút tiền này.
                           </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2">
                           <Label htmlFor="reason">Lý do từ chối</Label>
                           <Textarea
                              id="reason"
                              placeholder="Nhập lý do từ chối..."
                              value={rejectReason}
                              onChange={(e) => setRejectReason(e.target.value)}
                           />
                        </div>
                        <DialogFooter>
                           <Button
                              variant="outline"
                              onClick={() => setShowRejectDialog(false)}
                           >
                              Hủy
                           </Button>
                           <Button
                              variant="destructive"
                              onClick={handleReject}
                              disabled={!rejectReason.trim()}
                           >
                              Từ chối
                           </Button>
                        </DialogFooter>
                     </DialogContent>
                  </Dialog>
               </div>
            )}
         </CardContent>
      </Card>
   );
}
