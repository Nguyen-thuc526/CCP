'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, MessageSquare, Eye, Download } from 'lucide-react';
import { AppointmentFilters } from './appointment-filters';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

interface AppointmentHistory {
   id: number;
   member: string;
   avatar: string;
   date: string;
   time: string;
   duration: string;
   type: string;
   status: string;
   issue: string;
   notes?: string;
   cancelReason?: string;
   rejectionReason?: string;
}

export function AppointmentHistory() {
   const [showNotesDialog, setShowNotesDialog] = useState(false);
   const [selectedAppointment, setSelectedAppointment] =
      useState<AppointmentHistory | null>(null);

   const [history] = useState<AppointmentHistory[]>([
      {
         id: 1,
         member: 'Trần Văn M & Trần Thị N',
         avatar: '/placeholder.svg?height=40&width=40',
         date: '14/05/2025',
         time: '13:00',
         duration: '60 phút',
         type: 'Cuộc gọi video',
         status: 'Đã hoàn thành',
         issue: 'Xây dựng lòng tin',
         notes: 'Buổi tư vấn diễn ra tốt. Cặp đôi đã hiểu rõ hơn về vấn đề giao tiếp và cam kết thực hiện các bước cải thiện mà chúng tôi đã thảo luận. Họ sẽ thực hành các kỹ thuật lắng nghe tích cực và đặt lịch hẹn tiếp theo trong 2 tuần.',
      },
      {
         id: 2,
         member: 'Phạm Văn P & Phạm Thị Q',
         avatar: '/placeholder.svg?height=40&width=40',
         date: '12/05/2025',
         time: '15:00',
         duration: '90 phút',
         type: 'Cuộc gọi video',
         status: 'Đã hủy',
         issue: 'Giải quyết xung đột',
         cancelReason:
            'Tôi có việc đột xuất không thể tham gia buổi tư vấn. Xin lỗi vì sự bất tiện này.',
      },
      {
         id: 3,
         member: 'Vũ Văn R & Vũ Thị S',
         avatar: '/placeholder.svg?height=40&width=40',
         date: '10/05/2025',
         time: '09:00',
         duration: '60 phút',
         type: 'Cuộc gọi video',
         status: 'Đã từ chối',
         issue: 'Hướng dẫn nuôi dạy con',
         rejectionReason:
            'Tôi không có chuyên môn về vấn đề cụ thể này. Tôi đã giới thiệu họ đến chuyên gia khác phù hợp hơn.',
      },
      {
         id: 4,
         member: 'Nguyễn Văn T & Nguyễn Thị U',
         avatar: '/placeholder.svg?height=40&width=40',
         date: '08/05/2025',
         time: '14:00',
         duration: '60 phút',
         type: 'Cuộc gọi video',
         status: 'Đã hoàn thành',
         issue: 'Kỹ năng giao tiếp',
         notes: 'Cặp đôi đã tham gia đầy đủ và tích cực. Họ đã nhận ra các vấn đề trong cách giao tiếp và đã thực hành các kỹ thuật mới trong buổi tư vấn.',
      },
      {
         id: 5,
         member: 'Lê Văn V & Lê Thị X',
         avatar: '/placeholder.svg?height=40&width=40',
         date: '05/05/2025',
         time: '10:30',
         duration: '60 phút',
         type: 'Cuộc gọi video',
         status: 'Đã hoàn thành',
         issue: 'Lập kế hoạch tài chính',
         notes: 'Đã tư vấn về cách lập ngân sách gia đình và quản lý tài chính chung. Cặp đôi đã hiểu rõ và cam kết thực hiện kế hoạch.',
      },
   ]);

   const openNotesDialog = (appointment: AppointmentHistory) => {
      setSelectedAppointment(appointment);
      setShowNotesDialog(true);
   };

   const getStatusBadge = (status: string) => {
      switch (status) {
         case 'Đã hoàn thành':
            return <Badge variant="secondary">Đã hoàn thành</Badge>;
         case 'Đã hủy':
            return <Badge variant="destructive">Đã hủy</Badge>;
         case 'Đã từ chối':
            return (
               <Badge
                  variant="outline"
                  className="border-destructive text-destructive"
               >
                  Đã từ chối
               </Badge>
            );
         default:
            return <Badge variant="outline">{status}</Badge>;
      }
   };

   return (
      <div className="space-y-4">
         <div className="flex justify-between items-center">
            <AppointmentFilters />
            <Button variant="outline" size="sm">
               <Download className="mr-2 h-4 w-4" />
               Xuất báo cáo
            </Button>
         </div>

         <Card>
            <CardContent className="p-0">
               <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                     <thead className="border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                           <th className="h-12 px-4 text-left align-middle font-medium">
                              Thành viên
                           </th>
                           <th className="h-12 px-4 text-left align-middle font-medium">
                              Ngày & Giờ
                           </th>
                           <th className="h-12 px-4 text-left align-middle font-medium">
                              Thời lượng
                           </th>
                           <th className="h-12 px-4 text-left align-middle font-medium">
                              Loại
                           </th>
                           <th className="h-12 px-4 text-left align-middle font-medium">
                              Vấn đề
                           </th>
                           <th className="h-12 px-4 text-left align-middle font-medium">
                              Trạng thái
                           </th>
                           <th className="h-12 px-4 text-left align-middle font-medium">
                              Thao tác
                           </th>
                        </tr>
                     </thead>
                     <tbody>
                        {history.map((appointment) => (
                           <tr
                              key={appointment.id}
                              className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                           >
                              <td className="p-4 align-middle">
                                 <div className="flex items-center gap-3">
                                    <Avatar>
                                       <AvatarImage
                                          src={
                                             appointment.avatar ||
                                             '/placeholder.svg'
                                          }
                                          alt={appointment.member}
                                       />
                                       <AvatarFallback>
                                          {appointment.member.split(' ')[0][0]}
                                          {appointment.member.split(
                                             ' '
                                          )[3]?.[0] || ''}
                                       </AvatarFallback>
                                    </Avatar>
                                    {appointment.member}
                                 </div>
                              </td>
                              <td className="p-4 align-middle">
                                 <div className="flex flex-col">
                                    <div className="flex items-center gap-1">
                                       <Calendar className="h-4 w-4 text-muted-foreground" />
                                       <span>{appointment.date}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                       <Clock className="h-4 w-4 text-muted-foreground" />
                                       <span>{appointment.time}</span>
                                    </div>
                                 </div>
                              </td>
                              <td className="p-4 align-middle">
                                 {appointment.duration}
                              </td>
                              <td className="p-4 align-middle">
                                 {appointment.type}
                              </td>
                              <td className="p-4 align-middle">
                                 {appointment.issue}
                              </td>
                              <td className="p-4 align-middle">
                                 {getStatusBadge(appointment.status)}
                              </td>
                              <td className="p-4 align-middle">
                                 <div className="flex gap-2">
                                    {appointment.status === 'Đã hoàn thành' &&
                                       appointment.notes && (
                                          <Button
                                             size="sm"
                                             variant="outline"
                                             onClick={() =>
                                                openNotesDialog(appointment)
                                             }
                                          >
                                             <MessageSquare className="mr-2 h-4 w-4" />
                                             Xem ghi chú
                                          </Button>
                                       )}

                                    {(appointment.status === 'Đã hủy' ||
                                       appointment.status === 'Đã từ chối') && (
                                       <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() =>
                                             openNotesDialog(appointment)
                                          }
                                       >
                                          <Eye className="mr-2 h-4 w-4" />
                                          Xem lý do
                                       </Button>
                                    )}

                                    <Button size="sm" variant="outline" asChild>
                                       <Link
                                          href={`/counselor/appointments/${appointment.id}`}
                                       >
                                          <Eye className="mr-2 h-4 w-4" />
                                          Chi tiết
                                       </Link>
                                    </Button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </CardContent>
         </Card>

         {/* Notes/Reason Dialog */}
         <Dialog open={showNotesDialog} onOpenChange={setShowNotesDialog}>
            <DialogContent className="max-w-2xl">
               <DialogHeader>
                  <DialogTitle>
                     {selectedAppointment?.status === 'Đã hoàn thành'
                        ? 'Ghi chú buổi tư vấn'
                        : selectedAppointment?.status === 'Đã hủy'
                          ? 'Lý do hủy'
                          : 'Lý do từ chối'}{' '}
                     - {selectedAppointment?.member}
                  </DialogTitle>
               </DialogHeader>
               <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                     <div>
                        <Label className="text-sm font-medium">
                           Ngày & Giờ
                        </Label>
                        <p>
                           {selectedAppointment?.date} -{' '}
                           {selectedAppointment?.time}
                        </p>
                     </div>
                     <div>
                        <Label className="text-sm font-medium">Vấn đề</Label>
                        <p>{selectedAppointment?.issue}</p>
                     </div>
                     <div>
                        <Label className="text-sm font-medium">
                           Thời lượng
                        </Label>
                        <p>{selectedAppointment?.duration}</p>
                     </div>
                     <div>
                        <Label className="text-sm font-medium">
                           Trạng thái
                        </Label>
                        {selectedAppointment &&
                           getStatusBadge(selectedAppointment.status)}
                     </div>
                  </div>

                  <div className="space-y-2">
                     <Label>
                        {selectedAppointment?.status === 'Đã hoàn thành'
                           ? 'Ghi chú'
                           : selectedAppointment?.status === 'Đã hủy'
                             ? 'Lý do hủy'
                             : 'Lý do từ chối'}
                     </Label>
                     <div className="p-4 bg-muted rounded-lg whitespace-pre-line">
                        {selectedAppointment?.status === 'Đã hoàn thành'
                           ? selectedAppointment?.notes
                           : selectedAppointment?.status === 'Đã hủy'
                             ? selectedAppointment?.cancelReason
                             : selectedAppointment?.rejectionReason}
                     </div>
                  </div>

                  <div className="flex justify-end">
                     <Button
                        variant="outline"
                        onClick={() => setShowNotesDialog(false)}
                     >
                        Đóng
                     </Button>
                  </div>
               </div>
            </DialogContent>
         </Dialog>
      </div>
   );
}
