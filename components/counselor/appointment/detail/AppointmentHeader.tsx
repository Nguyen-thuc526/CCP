'use client';

import type React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, User } from 'lucide-react';
import Link from 'next/link';
import { BookingStatus } from '@/utils/enum';

interface AppointmentHeaderProps {
   appointmentId: string;
   isCouple: boolean;
   status: BookingStatus;
}

const AppointmentHeader: React.FC<AppointmentHeaderProps> = ({
   appointmentId,
   isCouple,
   status,
}) => {
   const getStatusBadge = (status: BookingStatus) => {
      switch (status) {
         case BookingStatus.Confirm:
            return <Badge variant="default">Đã xác nhận</Badge>;
         case BookingStatus.Finish:
            return (
               <Badge variant="secondary" className="bg-blue-500">
                  Đã kết thúc
               </Badge>
            );
         case BookingStatus.MemberCancel:
            return <Badge variant="destructive">Thành viên hủy</Badge>;
         case BookingStatus.Report:
            return (
               <Badge variant="destructive" className="bg-yellow-500">
                  Báo cáo
               </Badge>
            );
         case BookingStatus.Refund:
            return (
               <Badge variant="secondary" className="bg-gray-500">
                  Hoàn tiền
               </Badge>
            );
         case BookingStatus.Complete:
            return (
               <Badge variant="secondary" className="bg-green-500">
                  Hoàn thành
               </Badge>
            );
         default:
            return <Badge variant="outline">Không xác định</Badge>;
      }
   };

   return (
      <div className="flex items-center gap-4">
         <Button variant="ghost" size="sm" asChild>
            <Link href="/counselor/appointments">
               <ArrowLeft className="mr-2 h-4 w-4" />
               Quay lại
            </Link>
         </Button>
         <div className="flex items-center gap-2">
            {isCouple ? (
               <Users className="h-6 w-6 text-primary" />
            ) : (
               <User className="h-6 w-6 text-primary" />
            )}
            <h1 className="text-3xl font-bold">
               Chi tiết lịch hẹn {isCouple ? 'cặp đôi' : 'cá nhân'}
            </h1>
         </div>
         {getStatusBadge(status)}
      </div>
   );
};

export default AppointmentHeader;
