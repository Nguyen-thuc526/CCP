'use client';

import type React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, Users, User } from 'lucide-react';
import { BookingStatus } from '@/utils/enum';
import type { SubCategory } from '@/types/certification';

interface Member {
   id: string;
   accountId: string;
   fullname: string;
   avatar: string | null;
   phone: string | null;
   status: number;
}

interface AppointmentInfoProps {
   timeStart: string;
   timeEnd: string;
   isCouple: boolean;
   subCategories: SubCategory[];
   status: BookingStatus;
   problemSummary?: string | null;
   problemAnalysis?: string | null;
   guides?: string | null;
   cancelReason?: string | null;
   feedback?: string | null;
   note?: string | null;
}

const AppointmentInfo: React.FC<AppointmentInfoProps> = ({
   timeStart,
   timeEnd,
   isCouple,
   subCategories,
   status,
   problemSummary,
   problemAnalysis,
   guides,
   cancelReason,
   feedback,
   note,
}) => {
   const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('vi-VN', {
         weekday: 'long',
         year: 'numeric',
         month: 'long',
         day: 'numeric',
      });
   };

   const startDate = new Date(timeStart);
   const duration = Math.floor(
      (new Date(timeEnd).getTime() - startDate.getTime()) / (1000 * 60)
   );

   const hasNotes = problemSummary || problemAnalysis || guides;

   return (
      <Card>
         <CardHeader>
            <CardTitle>Thông tin lịch hẹn</CardTitle>
         </CardHeader>
         <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                     Ngày
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                     <Calendar className="h-4 w-4" />
                     <span>{formatDate(timeStart)}</span>
                  </div>
               </div>
               <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                     Giờ
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                     <Clock className="h-4 w-4" />
                     <span>
                        {startDate.toLocaleTimeString('vi-VN', {
                           hour: '2-digit',
                           minute: '2-digit',
                        })}{' '}
                        ({duration} phút)
                     </span>
                  </div>
               </div>
            </div>

            <div>
               <Label className="text-sm font-medium text-muted-foreground">
                  Loại tư vấn
               </Label>
               <div className="flex items-center gap-2 mt-1">
                  {isCouple ? (
                     <Users className="h-4 w-4" />
                  ) : (
                     <User className="h-4 w-4" />
                  )}
                  <span className="font-medium">
                     {isCouple ? 'Tư vấn cặp đôi' : 'Tư vấn cá nhân'}
                  </span>
               </div>
            </div>

            <div>
               <Label className="text-sm font-medium text-muted-foreground">
                  Vấn đề cần tư vấn
               </Label>
               <p className="mt-1 font-medium">
                  {subCategories.map((sub) => sub.name).join(', ') ||
                     'Không xác định'}
               </p>
            </div>

            {(status === BookingStatus.Complete ||
               status === BookingStatus.Finish) &&
               hasNotes && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
                     <Label className="text-sm font-medium text-green-800">
                        Ghi chú sau buổi tư vấn
                     </Label>

                     {problemSummary && (
                        <div>
                           <Label className="text-xs font-medium text-green-700">
                              Tóm tắt vấn đề:
                           </Label>
                           <p className="mt-1 text-sm text-green-700">
                              {problemSummary}
                           </p>
                        </div>
                     )}

                     {problemAnalysis && (
                        <div>
                           <Label className="text-xs font-medium text-green-700">
                              Phân tích vấn đề:
                           </Label>
                           <p className="mt-1 text-sm text-green-700">
                              {problemAnalysis}
                           </p>
                        </div>
                     )}

                     {guides && (
                        <div>
                           <Label className="text-xs font-medium text-green-700">
                              Hướng dẫn:
                           </Label>
                           <p className="mt-1 text-sm text-green-700">
                              {guides}
                           </p>
                        </div>
                     )}
                  </div>
               )}

            {cancelReason && (
               <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <Label className="text-sm font-medium text-orange-800">
                     Lý do hủy
                  </Label>
                  <p className="mt-1 text-sm text-orange-700">{cancelReason}</p>
               </div>
            )}

            {status === BookingStatus.Refund && feedback && (
               <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <Label className="text-sm font-medium text-red-800">
                     Phản hồi từ khách hàng (Lý do hoàn tiền)
                  </Label>
                  <p className="mt-1 text-sm text-red-700">{feedback}</p>
               </div>
            )}

            {note && (
               <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Label className="text-sm font-medium text-blue-800">
                     Ghi chú từ khách hàng
                  </Label>
                  <p className="mt-1 text-sm text-blue-700">{note}</p>
               </div>
            )}
         </CardContent>
      </Card>
   );
};

export default AppointmentInfo;
