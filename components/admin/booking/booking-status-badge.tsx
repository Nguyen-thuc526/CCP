import { Badge } from '@/components/ui/badge';
import { BookingStatus } from '@/utils/enum';

interface BookingStatusBadgeProps {
   status: BookingStatus;
}

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
   const getStatusConfig = (status: BookingStatus) => {
      switch (status) {
         case BookingStatus.Confirm:
            return {
               label: 'Xác nhận lịch',
               variant: 'secondary' as const,
               className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
            };
         case BookingStatus.Finish:
            return {
               label: 'Đã hoàn thành',
               variant: 'default' as const,
               className: 'bg-green-100 text-green-800 hover:bg-green-100',
            };
         case BookingStatus.MemberCancel:
            return {
               label: 'Thành viên hủy',
               variant: 'destructive' as const,
               className: 'bg-red-100 text-red-800 hover:bg-red-100',
            };
         case BookingStatus.Report:
            return {
               label: 'Báo cáo',
               variant: 'outline' as const,
               className: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
            };
         case BookingStatus.Refund:
            return {
               label: 'Hoàn tiền',
               variant: 'outline' as const,
               className: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-100',
            };
         case BookingStatus.Complete:
            return {
               label: 'Đã kết thúc',
               variant: 'default' as const,
               className: 'bg-green-50 text-green-700 hover:bg-green-50',
            };
         default:
            return {
               label: 'Không rõ',
               variant: 'outline' as const,
               className: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
            };
      }
   };

   const config = getStatusConfig(status);

   return (
      <Badge variant={config.variant} className={config.className}>
         {config.label}
      </Badge>
   );
}
