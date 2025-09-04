'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
   Video,
   X,
   MessageSquare,
   Users,
   User,
   CheckCircle,
   Clock,
} from 'lucide-react';
import Link from 'next/link';
import { BookingStatus } from '@/utils/enum';
import { getEffectiveStatus } from '@/utils/booking-status-utils';

interface Member {
   id: string;
   accountId: string;
   fullname: string;
   avatar: string | null;
   phone: string | null;
   status: number;
}

interface AppointmentSidebarProps {
   appointmentId: string;
   member: Member;
   member2: Member | null;
   isCouple: boolean;
   status: BookingStatus;
   hasNotes: boolean;
   timeStart: string;
   timeEnd: string;

   isReport?: boolean;
   onOpenNoteDialog: () => void;
   onOpenCancelDialog: () => void;
}

const AppointmentSidebar: React.FC<AppointmentSidebarProps> = ({
   appointmentId,
   member,
   member2,
   isCouple,
   status,
   hasNotes,
   timeStart,
   timeEnd, // Added timeEnd parameter
   isReport = false,
   onOpenNoteDialog,
   onOpenCancelDialog,
}) => {
   const [timeUntilStart, setTimeUntilStart] = useState<number>(0);
   const [canJoin, setCanJoin] = useState(false);
   const [autoCompleteCountdown, setAutoCompleteCountdown] = useState<{
      hours: number;
      minutes: number;
      seconds: number;
      isExpired: boolean;
   }>({ hours: 0, minutes: 0, seconds: 0, isExpired: false });

   const effectiveStatus = getEffectiveStatus(status, timeEnd);

   const formatCountdown = (milliseconds: number) => {
      if (milliseconds <= 0) return 'Có thể tham gia';

      const totalSeconds = Math.floor(milliseconds / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      if (hours > 0) {
         return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
   };

   useEffect(() => {
      const calculateTimeUntilStart = () => {
         const now = new Date().getTime();
         const appointmentTime = new Date(timeStart).getTime();
         const timeDiff = appointmentTime - now;
         const fiveMinutesInMs = 5 * 60 * 1000; // 5 minutes in milliseconds

         setTimeUntilStart(timeDiff);
         setCanJoin(timeDiff <= fiveMinutesInMs);
      };

      const calculateAutoCompleteCountdown = () => {
         if (status === BookingStatus.Finish) {
            const now = new Date().getTime();
            const endTime = new Date(timeEnd).getTime();
            const twentyFourHoursLater = endTime + 24 * 60 * 60 * 1000;
            const remaining = twentyFourHoursLater - now;

            if (remaining > 0) {
               const totalSeconds = Math.floor(remaining / 1000);
               const hours = Math.floor(totalSeconds / 3600);
               const minutes = Math.floor((totalSeconds % 3600) / 60);
               const seconds = totalSeconds % 60;

               setAutoCompleteCountdown({
                  hours,
                  minutes,
                  seconds,
                  isExpired: false,
               });
            } else {
               setAutoCompleteCountdown({
                  hours: 0,
                  minutes: 0,
                  seconds: 0,
                  isExpired: true,
               });
            }
         }
      };

      calculateTimeUntilStart();
      calculateAutoCompleteCountdown();

      const interval = setInterval(() => {
         calculateTimeUntilStart();
         calculateAutoCompleteCountdown();
      }, 1000);

      return () => clearInterval(interval);
   }, [timeStart, timeEnd, status]);

   const memberName = member2
      ? `${member.fullname} & ${member2.fullname}`
      : member.fullname;

   return (
      <div className="space-y-6">
         <Card>
            <CardHeader>
               <CardTitle>
                  Thông tin {isCouple ? 'cặp đôi' : 'thành viên'}
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                     <AvatarImage
                        src={
                           member.avatar ||
                           '/placeholder.svg?height=40&width=40' ||
                           '/placeholder.svg'
                        }
                     />
                     <AvatarFallback>
                        {member.fullname.split(' ')[0][0]}
                     </AvatarFallback>
                  </Avatar>
                  {isCouple && member2 && (
                     <Avatar className="h-12 w-12">
                        <AvatarImage
                           src={
                              member2.avatar ||
                              '/placeholder.svg?height=40&width=40' ||
                              '/placeholder.svg'
                           }
                        />
                        <AvatarFallback>
                           {member2.fullname.split(' ')[0][0]}
                        </AvatarFallback>
                     </Avatar>
                  )}
                  <div>
                     <div className="flex items-center gap-2">
                        {isCouple ? (
                           <Users className="h-4 w-4 text-muted-foreground" />
                        ) : (
                           <User className="h-4 w-4 text-muted-foreground" />
                        )}
                        <p className="font-medium">{memberName}</p>
                     </div>
                     <p className="text-sm text-muted-foreground">
                        {member.phone || 'Không có số điện thoại'}
                     </p>
                  </div>
               </div>
            </CardContent>
         </Card>

         <Card>
            <CardHeader>
               <CardTitle>Hành động</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
               {effectiveStatus === BookingStatus.Confirm && (
                  <>
                     {/* {canJoin ? ( */}
                        <Button
                           size="sm"
                           className="bg-green-600 hover:bg-green-700 w-full"
                           asChild
                        >
                           <Link
                              href={`/counselor/appointments/call/${appointmentId}`}
                           >
                              <Video className="mr-2 h-4 w-4" />
                              Tham gia
                           </Link>
                        </Button>
                     {/* ) : (
                        <Button
                           size="sm"
                           disabled
                           className="w-full bg-gray-400 hover:bg-gray-400"
                        >
                           <Clock className="mr-2 h-4 w-4" />
                           {timeUntilStart > 0
                              ? formatCountdown(timeUntilStart)
                              : 'Chuẩn bị...'}
                        </Button>
                     )} */}

                     <Button
                        variant="destructive"
                        onClick={onOpenCancelDialog}
                        className="w-full"
                     >
                        <X className="mr-2 h-4 w-4" />
                        Hủy lịch hẹn
                     </Button>
                  </>
               )}

               {effectiveStatus === BookingStatus.MemberCancel && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                     <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">
                           Đã hoàn 50% tiền về ví của bạn
                        </span>
                     </div>
                  </div>
               )}

               {effectiveStatus === BookingStatus.Report && isReport && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                     <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">
                           Hoàn tiền về khách hàng
                        </span>
                     </div>
                  </div>
               )}

               {effectiveStatus === BookingStatus.Report && !isReport && (
                  <Button
                     variant="outline"
                     onClick={() => {
                        console.log('Xem báo cáo');
                     }}
                     className="w-full"
                  >
                     <MessageSquare className="mr-2 h-4 w-4" />
                     Xem báo cáo
                  </Button>
               )}

               {effectiveStatus === BookingStatus.Refund && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                     <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">
                           Đã hoàn tiền về ví của khách hàng
                        </span>
                     </div>
                  </div>
               )}

               {status === BookingStatus.Finish &&
                  effectiveStatus === BookingStatus.Finish && (
                     <>
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                           <div className="flex items-center gap-2 text-amber-700 mb-2">
                              <Clock className="h-5 w-5" />
                              <span className="font-medium">
                                 Tự động chuyển tiền sau:
                              </span>
                           </div>
                           {!autoCompleteCountdown.isExpired ? (
                              <div className="text-center">
                                 <div className="text-2xl font-mono font-bold text-amber-800 mb-1">
                                    {autoCompleteCountdown.hours
                                       .toString()
                                       .padStart(2, '0')}
                                    :
                                    {autoCompleteCountdown.minutes
                                       .toString()
                                       .padStart(2, '0')}
                                    :
                                    {autoCompleteCountdown.seconds
                                       .toString()
                                       .padStart(2, '0')}
                                 </div>
                                 <p className="text-xs text-amber-600">
                                    Sau thời gian này tiền sẽ chuyển về ví của
                                    bạn
                                 </p>
                              </div>
                           ) : (
                              <p className="text-sm text-amber-600 text-center">
                                 Đang xử lý chuyển tiền...
                              </p>
                           )}
                        </div>
                        <Button
                           variant="outline"
                           onClick={onOpenNoteDialog}
                           className="w-full bg-transparent"
                        >
                           <MessageSquare className="mr-2 h-4 w-4" />
                           {hasNotes ? 'Xem/Sửa ghi chú' : 'Thêm ghi chú'}
                        </Button>
                     </>
                  )}

               {effectiveStatus === BookingStatus.Complete && (
                  <>
                     <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-green-700">
                           <CheckCircle className="h-5 w-5" />
                           <span className="font-medium">
                              Đã chuyển tiền và kết thúc
                           </span>
                        </div>
                     </div>
                     <Button
                        variant="outline"
                        onClick={onOpenNoteDialog}
                        className="w-full bg-transparent"
                     >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Xem/Sửa ghi chú
                     </Button>
                  </>
               )}
            </CardContent>
         </Card>
      </div>
   );
};

export default AppointmentSidebar;
