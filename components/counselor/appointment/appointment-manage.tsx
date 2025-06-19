'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, History } from 'lucide-react';
import { AppointmentHistory } from '@/components/counselor/appointment/appointment-history';
import AppointmentsList from './appointment-list';
import { bookingService } from '@/services/bookingService'; // Adjust the import path
import { parseISO, format, differenceInMinutes } from 'date-fns';

interface Appointment {
   id: number;
   member: string;
   avatar: string;
   avatar2?: string;
   date: string;
   time: string;
   duration: string;
   type: string;
   status: 'Đã lên lịch' | 'Đã hủy' | 'Đã hoàn thành';
   issue: string;
   notes?: string;
   canCancel: boolean;
   cancellationReason?: string;
   requestedAt?: string;
   appointmentType: 'couple' | 'individual';
   additionalInfo?: string;
}

interface Booking {
   id: string;
   note: string | null;
   timeStart: string;
   timeEnd: string;
   status: number;
   member: {
      id: string;
      accountId: string;
      fullname: string;
      avatar: string | null;
   };
   member2: {
      id: string;
      accountId: string;
      fullname: string;
      avatar: string | null;
   } | null;
   subCategories: { id: string; name: string; status: number }[];
}

interface BookingResponse {
   success: boolean;
   data: Booking[];
   error: string | null;
}

export default function AppointmentsManage() {
   const [appointments, setAppointments] = useState<Appointment[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      const fetchBookings = async () => {
         try {
            setIsLoading(true);
            const response: BookingResponse =
               await bookingService.getMyBookings();
            if (response.success) {
               const mappedAppointments: Appointment[] = response.data.map(
                  (booking) => {
                     const startDate = parseISO(booking.timeStart);
                     const endDate = parseISO(booking.timeEnd);
                     const duration = differenceInMinutes(endDate, startDate);

                     return {
                        id: parseInt(booking.id.replace('Booking_', ''), 16), // Convert ID to number
                        member: booking.member2
                           ? `${booking.member.fullname} & ${booking.member2.fullname}`
                           : booking.member.fullname,
                        avatar:
                           booking.member.avatar ||
                           '/placeholder.svg?height=40&width=40',
                        avatar2:
                           booking.member2?.avatar ||
                           (booking.member2
                              ? '/placeholder.svg?height=40&width=40'
                              : undefined),
                        date: format(startDate, 'dd/MM/yyyy'),
                        time: format(startDate, 'HH:mm'),
                        duration: `${duration} phút`,
                        type: 'Cuộc gọi video', // Assume video call; adjust if API provides
                        status:
                           booking.status === 1
                              ? 'Đã lên lịch'
                              : 'Đã hoàn thành', // Adjust mapping as needed
                        issue:
                           booking.subCategories
                              .map((sub) => sub.name)
                              .join(', ') || 'Không xác định',
                        notes: booking.note || undefined,
                        canCancel: booking.status === 1,
                        requestedAt: format(new Date(), 'dd/MM/yyyy'), // Placeholder
                        appointmentType: booking.member2
                           ? 'couple'
                           : 'individual',
                        additionalInfo: booking.note || undefined,
                     };
                  }
               );
               setAppointments(mappedAppointments);
            } else {
               setError('Không thể tải danh sách lịch hẹn.');
            }
         } catch (err) {
            setError('Đã xảy ra lỗi khi tải lịch hẹn. Vui lòng thử lại sau.');
         } finally {
            setIsLoading(false);
         }
      };

      fetchBookings();
   }, []);

   return (
      <Tabs defaultValue="upcoming" className="space-y-4">
         <TabsList>
            <TabsTrigger value="upcoming" className="flex items-center gap-2">
               <Clock className="h-4 w-4" />
               Lịch hẹn sắp tới
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
               <History className="h-4 w-4" />
               Lịch sử
            </TabsTrigger>
         </TabsList>

         <TabsContent value="upcoming">
            <AppointmentsList
               appointments={appointments}
               isLoading={isLoading}
               error={error}
               setAppointments={setAppointments}
            />
         </TabsContent>

         <TabsContent value="history">
            <AppointmentHistory />
         </TabsContent>
      </Tabs>
   );
}
