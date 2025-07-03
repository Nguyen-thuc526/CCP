'use client';

import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BookingAdmin } from '@/types/booking';
import {
   Calendar,
   Star,
   Users,
   AlertTriangle,
   MessageSquare,
   XCircle,
   RefreshCw,
   Clock,
   DollarSign,
   UserCheck,
   Phone,
   FileText,
   Target,
   BookOpen,
   Ban,
   CheckCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { BookingStatusBadge } from './booking-status-badge';

interface BookingDetailsModalProps {
   booking: BookingAdmin | null;
   open: boolean;
   onOpenChange: (open: boolean) => void;
   onRefund?: () => void;
   onReject?: () => void;
   onComplete?: () => void;
   isUpdating?: boolean;
}

export function BookingDetailsModal({
   booking,
   open,
   onOpenChange,
   onRefund,
   onReject,
   onComplete,
   isUpdating = false,
}: BookingDetailsModalProps) {
   if (!booking) return null;

   const formatCurrency = (amount: number) =>
      new Intl.NumberFormat('vi-VN', {
         style: 'currency',
         currency: 'VND',
      }).format(amount);

   const formatDateTime = (dateString: string) =>
      format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
            <DialogHeader className="pb-4">
               <DialogTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <span className="text-xl">
                        Booking #{booking.id.slice(-8)}
                     </span>
                     <BookingStatusBadge status={booking.status} />
                  </div>
                  <Badge
                     variant={booking.isCouple ? 'default' : 'secondary'}
                     className="text-sm"
                  >
                     {booking.isCouple ? 'Cặp đôi' : 'Cá nhân'}
                  </Badge>
               </DialogTitle>
            </DialogHeader>

            {/* Action buttons for Report status */}
            {booking.status === 5 && (
               <Card className="border-orange-200 bg-orange-50">
                  <CardHeader className="pb-3">
                     <CardTitle className="text-orange-800 flex items-center gap-2 text-lg">
                        <AlertTriangle className="w-5 h-5" />
                        Xử lý báo cáo
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <p className="text-orange-700 mb-4">
                        Booking này đã được báo cáo. Vui lòng chọn hành động xử
                        lý:
                     </p>
                     <div className="flex gap-3">
                        <Button
                           onClick={onRefund}
                           disabled={isUpdating}
                           className="bg-green-600 hover:bg-green-700 text-white"
                           size="lg"
                        >
                           {isUpdating ? (
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                           ) : (
                              <DollarSign className="w-4 h-4 mr-2" />
                           )}
                           Hoàn tiền
                        </Button>
                        <Button
                           onClick={onReject}
                           disabled={isUpdating}
                           variant="destructive"
                           size="lg"
                        >
                           {isUpdating ? (
                              <XCircle className="w-4 h-4 mr-2 animate-spin" />
                           ) : (
                              <Ban className="w-4 h-4 mr-2" />
                           )}
                           Từ chối
                        </Button>
                     </div>
                  </CardContent>
               </Card>
            )}

            {/* Action button for Finish status */}
            {booking.status === 2 && (
               <Card className="border-blue-200 bg-blue-50">
                  <CardHeader className="pb-3">
                     <CardTitle className="text-blue-800 flex items-center gap-2 text-lg">
                        <CheckCircle className="w-5 h-5" />
                        Hỗ trợ hoàn tất
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <p className="text-blue-700 mb-4">
                        Booking này đã kết thúc. Bạn có thể hỗ trợ hoàn tất quy
                        trình:
                     </p>
                     <Button
                        onClick={onComplete}
                        disabled={isUpdating}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        size="lg"
                     >
                        {isUpdating ? (
                           <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                           <CheckCircle className="w-4 h-4 mr-2" />
                        )}
                        Hỗ trợ hoàn tất
                     </Button>
                  </CardContent>
               </Card>
            )}

            {/* Top section: Booking Info + Rating */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               {/* Booking Information */}
               <Card
                  className={
                     booking.rating !== null ? 'lg:col-span-2' : 'lg:col-span-3'
                  }
               >
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2 text-lg">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        Thông tin lịch hẹn
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                           <Clock className="w-5 h-5 text-blue-600" />
                           <div>
                              <p className="text-sm text-gray-600">Bắt đầu</p>
                              <p className="font-semibold">
                                 {formatDateTime(booking.timeStart)}
                              </p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                           <Clock className="w-5 h-5 text-blue-600" />
                           <div>
                              <p className="text-sm text-gray-600">Kết thúc</p>
                              <p className="font-semibold">
                                 {formatDateTime(booking.timeEnd)}
                              </p>
                           </div>
                        </div>
                     </div>

                     <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2">
                           <DollarSign className="w-5 h-5 text-green-600" />
                           <span className="font-medium">Giá dịch vụ</span>
                        </div>
                        <span className="text-xl font-bold text-green-600">
                           {formatCurrency(booking.price)}
                        </span>
                     </div>

                     <div className="text-sm text-gray-600 text-center pt-2 border-t">
                        Tạo lúc: {formatDateTime(booking.createAt)}
                     </div>
                  </CardContent>
               </Card>

               {/* Rating Section - Only show if rating exists */}
               {booking.rating !== null && (
                  <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                           <Star className="w-5 h-5 text-yellow-500" />
                           Đánh giá
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="text-center">
                        <div className="flex justify-center gap-1 mb-3">
                           {[...Array(5)].map((_, i) => (
                              <Star
                                 key={i}
                                 className={`w-6 h-6 ${i < booking.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              />
                           ))}
                        </div>
                        <div className="text-2xl font-bold text-yellow-600 mb-2">
                           {booking.rating}/5
                        </div>
                        {booking.feedback && (
                           <div className="bg-yellow-50 p-3 rounded-lg">
                              <p className="text-sm text-gray-700 italic">
                                 "{booking.feedback}"
                              </p>
                           </div>
                        )}
                     </CardContent>
                  </Card>
               )}
            </div>

            {/* People Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               {/* Counselor */}
               <Card>
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2 text-lg">
                        <UserCheck className="w-5 h-5 text-blue-600" />
                        Tư vấn viên
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="flex items-start gap-4">
                        <Avatar className="w-16 h-16">
                           <AvatarImage
                              src={
                                 booking.counselor.avatar || '/placeholder.svg'
                              }
                           />
                           <AvatarFallback className="text-lg">
                              {booking.counselor.fullname.charAt(0)}
                           </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                           <h3 className="font-semibold text-lg mb-1">
                              {booking.counselor.fullname}
                           </h3>
                           <div className="flex items-center gap-2 text-gray-600 mb-2">
                              <Phone className="w-4 h-4" />
                              <span>{booking.counselor.phone}</span>
                           </div>
                           <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                              {booking.counselor.description}
                           </p>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               {/* Customer(s) */}
               <Card>
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2 text-lg">
                        <Users className="w-5 h-5 text-green-600" />
                        Khách hàng
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     {/* Main customer */}
                     <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                           <AvatarImage
                              src={booking.member.avatar || '/placeholder.svg'}
                           />
                           <AvatarFallback>
                              {booking.member.fullname.charAt(0)}
                           </AvatarFallback>
                        </Avatar>
                        <div>
                           <p className="font-semibold">
                              {booking.member.fullname}
                           </p>
                           <div className="flex items-center gap-2 text-gray-600 text-sm">
                              <Phone className="w-3 h-3" />
                              <span>{booking.member.phone}</span>
                           </div>
                        </div>
                     </div>

                     {/* Second member if exists */}
                     {booking.member2 && (
                        <>
                           <Separator />
                           <div className="flex items-center gap-4">
                              <Avatar className="w-12 h-12">
                                 <AvatarImage
                                    src={
                                       booking.member2.avatar ||
                                       '/placeholder.svg'
                                    }
                                 />
                                 <AvatarFallback>
                                    {booking.member2.fullname.charAt(0)}
                                 </AvatarFallback>
                              </Avatar>
                              <div>
                                 <p className="font-semibold">
                                    {booking.member2.fullname}
                                 </p>
                                 <div className="flex items-center gap-2 text-gray-600 text-sm">
                                    <Phone className="w-3 h-3" />
                                    <span>{booking.member2.phone}</span>
                                 </div>
                              </div>
                           </div>
                        </>
                     )}
                  </CardContent>
               </Card>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
               {booking.note && (
                  <InfoCard
                     title="Ghi chú"
                     content={booking.note}
                     icon={FileText}
                  />
               )}

               {booking.problemSummary && (
                  <InfoCard
                     title="Tóm tắt vấn đề"
                     content={booking.problemSummary}
                     icon={Target}
                  />
               )}

               {booking.problemAnalysis && (
                  <InfoCard
                     title="Phân tích vấn đề"
                     content={booking.problemAnalysis}
                     icon={Target}
                  />
               )}

               {booking.guides && (
                  <InfoCard
                     title="Hướng dẫn"
                     content={booking.guides}
                     icon={BookOpen}
                  />
               )}

               {/* Alert sections */}
               {booking.cancelReason && (
                  <Card className="border-red-200 bg-red-50">
                     <CardHeader className="pb-3">
                        <CardTitle className="text-red-800 flex items-center gap-2">
                           <AlertTriangle className="w-5 h-5" />
                           Lý do hủy
                        </CardTitle>
                     </CardHeader>
                     <CardContent>
                        <p className="text-red-700">{booking.cancelReason}</p>
                     </CardContent>
                  </Card>
               )}

               {booking.isReport && booking.reportMessage && (
                  <Card className="border-orange-200 bg-orange-50">
                     <CardHeader className="pb-3">
                        <CardTitle className="text-orange-800 flex items-center gap-2">
                           <MessageSquare className="w-5 h-5" />
                           Nội dung báo cáo
                        </CardTitle>
                     </CardHeader>
                     <CardContent>
                        <p className="text-orange-700">
                           {booking.reportMessage}
                        </p>
                     </CardContent>
                  </Card>
               )}
            </div>
         </DialogContent>
      </Dialog>
   );
}

// Enhanced InfoCard component
function InfoCard({
   title,
   content,
   icon: Icon,
}: {
   title: string;
   content: string;
   icon: any;
}) {
   return (
      <Card>
         <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
               <Icon className="w-4 h-4 text-gray-600" />
               {title}
            </CardTitle>
         </CardHeader>
         <CardContent>
            <p className="text-gray-700 leading-relaxed">{content}</p>
         </CardContent>
      </Card>
   );
}
