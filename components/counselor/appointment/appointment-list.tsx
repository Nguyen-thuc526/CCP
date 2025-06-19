'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
   Calendar,
   Clock,
   Video,
   X,
   Eye,
   MessageSquare,
   Users,
} from 'lucide-react';
import { AppointmentFilters } from './appointment-filters';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

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

interface AppointmentsListProps {
   appointments: Appointment[];
   isLoading: boolean;
   error: string | null;
   setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
}

export default function AppointmentsList({
   appointments,
   isLoading,
   error,
   setAppointments,
}: AppointmentsListProps) {
   const [filteredAppointments, setFilteredAppointments] = useState<
      Appointment[]
   >([]);
   const [showCancelDialog, setShowCancelDialog] = useState(false);
   const [selectedAppointment, setSelectedAppointment] =
      useState<Appointment | null>(null);
   const [cancellationReason, setCancellationReason] = useState('');
   const [appointmentNote, setAppointmentNote] = useState('');
   const [showNoteDialog, setShowNoteDialog] = useState(false);
   const [filters, setFilters] = useState({
      date: undefined as Date | undefined,
      status: 'all',
      issueType: 'all',
      searchTerm: '',
      appointmentType: 'all',
   });

   useEffect(() => {
      let result = [...appointments];

      // Filter by appointment type
      if (filters.appointmentType !== 'all') {
         result = result.filter(
            (appointment) =>
               appointment.appointmentType === filters.appointmentType
         );
      }

      // Filter by date
      if (filters.date) {
         const filterDate = format(filters.date, 'dd/MM/yyyy');
         result = result.filter(
            (appointment) => appointment.date === filterDate
         );
      }

      // Filter by status
      if (filters.status !== 'all') {
         const statusMap: Record<string, string> = {
            scheduled: 'Đã lên lịch',
            cancelled: 'Đã hủy',
            completed: 'Đã hoàn thành',
         };
         result = result.filter(
            (appointment) => appointment.status === statusMap[filters.status]
         );
      }

      // Filter by issue type
      if (filters.issueType !== 'all') {
         const issueMap: Record<string, string> = {
            communication: 'Kỹ năng giao tiếp',
            conflict: 'Giải quyết xung đột',
            parenting: 'Hướng dẫn nuôi dạy con',
            financial: 'Lập kế hoạch tài chính',
            trust: 'Xây dựng lòng tin',
            stress: 'Quản lý căng thẳng',
            confidence: 'Tự tin bản thân',
            chores: 'Việc nhà công bằng',
            finance: 'Trách nhiệm tài chính',
         };
         result = result.filter((appointment) =>
            appointment.issue.includes(issueMap[filters.issueType])
         );
      }

      // Filter by search term
      if (filters.searchTerm) {
         const searchTerm = filters.searchTerm.toLowerCase();
         result = result.filter((appointment) =>
            appointment.member.toLowerCase().includes(searchTerm)
         );
      }

      setFilteredAppointments(result);
   }, [filters, appointments]);

   const handleFilterChange = (newFilters: any) => {
      setFilters(newFilters);
   };

   const cancelAppointment = (appointmentId: number) => {
      const appointment = appointments.find((a) => a.id === appointmentId);
      if (appointment) {
         setSelectedAppointment(appointment);
         setShowCancelDialog(true);
      }
   };

   const performCancel = () => {
      if (selectedAppointment && cancellationReason) {
         setAppointments((prev) =>
            prev.map((appointment) =>
               appointment.id === selectedAppointment.id
                  ? {
                       ...appointment,
                       status: 'Đã hủy',
                       canCancel: false,
                       cancellationReason: cancellationReason,
                    }
                  : appointment
            )
         );
         setShowCancelDialog(false);
         setCancellationReason('');
         setSelectedAppointment(null);
      }
   };

   const openNoteDialog = (appointment: Appointment) => {
      setSelectedAppointment(appointment);
      setAppointmentNote(appointment.notes || '');
      setShowNoteDialog(true);
   };

   const saveNote = () => {
      if (selectedAppointment) {
         setAppointments((prev) =>
            prev.map((appointment) =>
               appointment.id === selectedAppointment.id
                  ? {
                       ...appointment,
                       notes: appointmentNote,
                       status: 'Đã hoàn thành',
                    }
                  : appointment
            )
         );
         setShowNoteDialog(false);
         setAppointmentNote('');
         setSelectedAppointment(null);
      }
   };

   // Format date function
   function format(date: Date, formatStr: string): string {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
   }

   // Check if appointment can be canceled (at least 24 hours before)
   const canCancel = (appointment: Appointment) => {
      const appointmentDateTime = new Date(
         `${appointment.date} ${appointment.time} +07:00`
      );
      const now = new Date('2025-06-18T02:13:00+07:00');
      const diffHours =
         (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
      return diffHours > 24 && appointment.canCancel;
   };

   return (
      <div className="space-y-4">
         <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Danh sách lịch hẹn</h3>
            <Badge variant="outline" className="flex items-center gap-1">
               <Clock className="w-3 h-3" />
               {filteredAppointments.length} lịch hẹn
            </Badge>
         </div>

         <AppointmentFilters onFilterChange={handleFilterChange} />

         {isLoading ? (
            <div className="text-center">Đang tải lịch hẹn...</div>
         ) : error ? (
            <div className="text-center text-destructive">{error}</div>
         ) : (
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
                           {filteredAppointments.length > 0 ? (
                              filteredAppointments.map((appointment) => (
                                 <tr
                                    key={appointment.id}
                                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                 >
                                    <td className="p-4 align-middle">
                                       <div className="flex items-center gap-3">
                                          {appointment.appointmentType ===
                                          'couple' ? (
                                             <div className="flex -space-x-2">
                                                <Avatar className="h-8 w-8 border-2 border-background">
                                                   <AvatarImage
                                                      src={
                                                         appointment.avatar ||
                                                         '/placeholder.svg'
                                                      }
                                                   />
                                                   <AvatarFallback>
                                                      {
                                                         appointment.member.split(
                                                            ' '
                                                         )[0][0]
                                                      }
                                                   </AvatarFallback>
                                                </Avatar>
                                                <Avatar className="h-8 w-8 border-2 border-background">
                                                   <AvatarImage
                                                      src={
                                                         appointment.avatar2 ||
                                                         '/placeholder.svg'
                                                      }
                                                   />
                                                   <AvatarFallback>
                                                      {appointment.member.split(
                                                         ' '
                                                      )[3]?.[0] || '?'}
                                                   </AvatarFallback>
                                                </Avatar>
                                             </div>
                                          ) : (
                                             <Avatar className="h-8 w-8">
                                                <AvatarImage
                                                   src={
                                                      appointment.avatar ||
                                                      '/placeholder.svg'
                                                   }
                                                />
                                                <AvatarFallback>
                                                   {
                                                      appointment.member.split(
                                                         ' '
                                                      )[0][0]
                                                   }
                                                </AvatarFallback>
                                             </Avatar>
                                          )}
                                          <div className="flex items-center gap-2">
                                             {appointment.appointmentType ===
                                                'couple' && (
                                                <Badge
                                                   variant="outline"
                                                   className="text-xs font-normal px-1 py-0 h-5"
                                                >
                                                   <Users className="h-3 w-3 mr-1" />
                                                   Cặp đôi
                                                </Badge>
                                             )}
                                             <span>{appointment.member}</span>
                                          </div>
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
                                       <div className="flex items-center gap-1">
                                          <Video className="h-4 w-4 text-muted-foreground" />
                                          <span>{appointment.type}</span>
                                       </div>
                                    </td>
                                    <td className="p-4 align-middle">
                                       {appointment.issue}
                                    </td>
                                    <td className="p-4 align-middle">
                                       <Badge
                                          variant={
                                             appointment.status ===
                                             'Đã lên lịch'
                                                ? 'default'
                                                : appointment.status ===
                                                    'Đã hoàn thành'
                                                  ? 'secondary'
                                                  : 'destructive'
                                          }
                                       >
                                          {appointment.status}
                                       </Badge>
                                    </td>
                                    <td className="p-4 align-middle">
                                       <div className="flex gap-2">
                                          {appointment.status ===
                                             'Đã lên lịch' && (
                                             <>
                                                <Button
                                                   size="sm"
                                                   variant="default"
                                                   asChild
                                                >
                                                   <Link
                                                      href={`/counselor/appointments/call/${appointment.id}`}
                                                   >
                                                      <Video className="mr-2 h-4 w-4" />
                                                      Tham gia
                                                   </Link>
                                                </Button>
                                                {canCancel(appointment) && (
                                                   <Button
                                                      size="sm"
                                                      variant="destructive"
                                                      onClick={() =>
                                                         cancelAppointment(
                                                            appointment.id
                                                         )
                                                      }
                                                   >
                                                      <X className="mr-2 h-4 w-4" />
                                                      Hủy
                                                   </Button>
                                                )}
                                             </>
                                          )}
                                          <Button
                                             size="sm"
                                             variant="outline"
                                             asChild
                                          >
                                             <Link
                                                href={`/counselor/appointments/${appointment.id}`}
                                             >
                                                <Eye className="mr-2 h-4 w-4" />
                                                Xem chi tiết
                                             </Link>
                                          </Button>
                                          <Button
                                             size="sm"
                                             variant="outline"
                                             onClick={() =>
                                                openNoteDialog(appointment)
                                             }
                                          >
                                             {appointment.notes ? (
                                                <>
                                                   <Eye className="mr-2 h-4 w-4" />
                                                   Xem ghi chú
                                                </>
                                             ) : (
                                                <>
                                                   <MessageSquare className="mr-2 h-4 w-4" />
                                                   Thêm ghi chú
                                                </>
                                             )}
                                          </Button>
                                       </div>
                                    </td>
                                 </tr>
                              ))
                           ) : (
                              <tr>
                                 <td
                                    colSpan={7}
                                    className="p-4 text-center text-muted-foreground"
                                 >
                                    Không tìm thấy lịch hẹn nào phù hợp với bộ
                                    lọc
                                 </td>
                              </tr>
                           )}
                        </tbody>
                     </table>
                  </div>
               </CardContent>
            </Card>
         )}

         {/* Cancel Dialog */}
         <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
            <DialogContent className="max-w-md">
               <DialogHeader>
                  <DialogTitle>
                     Hủy lịch hẹn - {selectedAppointment?.member}
                  </DialogTitle>
               </DialogHeader>
               <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                     <div className="flex items-center gap-3 mb-2">
                        {selectedAppointment?.appointmentType === 'couple' ? (
                           <div className="flex -space-x-2">
                              <Avatar className="h-8 w-8 border-2 border-background">
                                 <AvatarImage
                                    src={
                                       selectedAppointment?.avatar ||
                                       '/placeholder.svg'
                                    }
                                 />
                                 <AvatarFallback>
                                    {
                                       selectedAppointment?.member.split(
                                          ' '
                                       )[0][0]
                                    }
                                 </AvatarFallback>
                              </Avatar>
                              <Avatar className="h-8 w-8 border-2 border-background">
                                 <AvatarImage
                                    src={
                                       selectedAppointment?.avatar2 ||
                                       '/placeholder.svg'
                                    }
                                 />
                                 <AvatarFallback>
                                    {selectedAppointment?.member.split(
                                       ' '
                                    )[3]?.[0] || '?'}
                                 </AvatarFallback>
                              </Avatar>
                           </div>
                        ) : (
                           <Avatar className="h-8 w-8">
                              <AvatarImage
                                 src={
                                    selectedAppointment?.avatar ||
                                    '/placeholder.svg'
                                 }
                              />
                              <AvatarFallback>
                                 {selectedAppointment?.member.split(' ')[0][0]}
                              </AvatarFallback>
                           </Avatar>
                        )}
                        <div className="font-medium">
                           {selectedAppointment?.member}
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                           <span className="text-muted-foreground">
                              Ngày & Giờ:
                           </span>{' '}
                           <span>
                              {selectedAppointment?.date} -{' '}
                              {selectedAppointment?.time}
                           </span>
                        </div>
                        <div>
                           <span className="text-muted-foreground">
                              Vấn đề:
                           </span>{' '}
                           <span>{selectedAppointment?.issue}</span>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="cancellation-reason">
                        Lý do hủy <span className="text-destructive">*</span>
                     </Label>
                     <Textarea
                        id="cancellation-reason"
                        value={cancellationReason}
                        onChange={(e) => setCancellationReason(e.target.value)}
                        placeholder="Vui lòng nhập lý do hủy lịch hẹn này..."
                        rows={4}
                     />
                     <p className="text-xs text-muted-foreground">
                        Lý do sẽ được gửi đến{' '}
                        {selectedAppointment?.appointmentType === 'couple'
                           ? 'cặp đôi'
                           : 'thành viên'}{' '}
                        để họ hiểu rõ và có thể đặt lịch lại nếu cần.
                     </p>
                  </div>

                  <DialogFooter>
                     <Button
                        variant="outline"
                        onClick={() => setShowCancelDialog(false)}
                     >
                        Hủy
                     </Button>
                     <Button
                        variant="destructive"
                        onClick={performCancel}
                        disabled={!cancellationReason.trim()}
                     >
                        Xác nhận hủy
                     </Button>
                  </DialogFooter>
               </div>
            </DialogContent>
         </Dialog>

         {/* Note Dialog */}
         <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
            <DialogContent className="max-w-2xl">
               <DialogHeader>
                  <DialogTitle>
                     {selectedAppointment?.notes
                        ? 'Xem/Sửa ghi chú'
                        : 'Thêm ghi chú'}{' '}
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
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="note">Ghi chú buổi tư vấn</Label>
                     <Textarea
                        id="note"
                        value={appointmentNote}
                        onChange={(e) => setAppointmentNote(e.target.value)}
                        placeholder="Nhập ghi chú về buổi tư vấn, kết quả, và các bước tiếp theo..."
                        rows={6}
                     />
                  </div>

                  <div className="flex gap-2 justify-end">
                     <Button
                        variant="outline"
                        onClick={() => setShowNoteDialog(false)}
                     >
                        Hủy
                     </Button>
                     <Button onClick={saveNote}>Lưu ghi chú</Button>
                  </div>
               </div>
            </DialogContent>
         </Dialog>
      </div>
   );
}
