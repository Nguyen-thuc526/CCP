'use client';

import { useState, useEffect, memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { bookingService } from '@/services/bookingService';
import type { SubCategory } from '@/types/certification';
import { ToastType, useToast } from '@/hooks/useToast';
import { BookingStatus } from '@/utils/enum';
import { getEffectiveStatus } from '@/utils/booking-status-utils'; // Added import for auto-transition logic
import AppointmentHeader from './AppointmentHeader';
import AppointmentInfo from './AppointmentInfo';
import AppointmentSidebar from './AppointmentSidebar';
import AppointmentCancelDialog from './AppointmentCancelDialog';
import AppointmentNotesDialog from './AppointmentNotesDialog';

interface Member {
   id: string;
   accountId: string;
   fullname: string;
   avatar: string | null;
   phone: string | null;
   status: number;
}

interface BookingDetail {
   id: string;
   memberId: string;
   member2Id: string | null;
   counselorId: string;
   note: string | null;
   timeStart: string;
   timeEnd: string;
   price: number;
   cancelReason: string | null;
   createAt: string;
   rating: number | null;
   feedback: string | null;
   isCouple: boolean | null;
   problemSummary: string | null;
   problemAnalysis: string | null;
   guides: string | null;
   isReport: boolean | null;
   reportMessage: string | null;
   status: BookingStatus;
   member: Member;
   member2: Member | null;
   subCategories: SubCategory[];
}

interface NoteForm {
   problemSummary: string;
   problemAnalysis: string;
   guides: string;
}

interface FormErrors {
   problemSummary: string;
   guides: string;
}

const AppointmentDetail = memo(function AppointmentDetail({
   appointmentId,
}: {
   appointmentId: string;
}) {
   const [appointment, setAppointment] = useState<BookingDetail | null>(null);
   const [showCancelDialog, setShowCancelDialog] = useState(false);
   const [showNoteDialog, setShowNoteDialog] = useState(false);
   const [cancellationReason, setCancellationReason] = useState('');
   const [noteForm, setNoteForm] = useState<NoteForm>({
      problemSummary: '',
      problemAnalysis: '',
      guides: '',
   });
   const [formErrors, setFormErrors] = useState<FormErrors>({
      problemSummary: '',
      guides: '',
   });
   const [isEditing, setIsEditing] = useState(false);
   const { showToast } = useToast();
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   const fetchAppointmentDetail = async () => {
      try {
         setLoading(true);
         setError(null);
         const response = await bookingService.getBookingDetail(appointmentId);
         if (response) {
            setAppointment(response as BookingDetail);
         } else {
            setError('Không thể tải chi tiết lịch hẹn. Vui lòng thử lại.');
         }
      } catch (err) {
         setError(
            'Đã xảy ra lỗi khi tải chi tiết lịch hẹn. Vui lòng kiểm tra kết nối mạng.'
         );
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchAppointmentDetail();
   }, [appointmentId]);

   useEffect(() => {
      if (appointment && appointment.status === BookingStatus.Finish) {
         const effectiveStatus = getEffectiveStatus(
            appointment.status,
            appointment.timeEnd
         );

         if (
            effectiveStatus === BookingStatus.Complete &&
            appointment.status !== BookingStatus.Complete
         ) {
            // Auto-transition detected, update the appointment status
            setAppointment((prev) =>
               prev ? { ...prev, status: BookingStatus.Complete } : null
            );
            showToast(
               'Lịch hẹn đã tự động chuyển sang trạng thái kết thúc sau 24 giờ.',
               ToastType.Info
            );
         }
      }
   }, [appointment, showToast]);

   const handleCancel = async (reason: string) => {
      if (!appointment) return;

      try {
         setLoading(true);
         await bookingService.cancelByCounselor({
            bookingId: appointment.id,
            cancelReason: reason,
         });

         setAppointment({
            ...appointment,
            status: BookingStatus.Refund,
            cancelReason: reason,
         });

         showToast('Hủy lịch hẹn thành công.', ToastType.Success);
         setShowCancelDialog(false);
      } catch (error) {
         showToast(
            'Không thể hủy lịch hẹn. Vui lòng thử lại.',
            ToastType.Error
         );
      } finally {
         setLoading(false);
      }
   };

   const handleSaveNote = async (form: NoteForm) => {
      if (!appointment) return;

      try {
         setLoading(true);
         await bookingService.updateNote({
            bookingId: appointment.id,
            problemSummary: form.problemSummary,
            problemAnalysis: form.problemAnalysis,
            guides: form.guides,
         });

         const effectiveStatus = getEffectiveStatus(
            appointment.status,
            appointment.timeEnd
         );

         setAppointment({
            ...appointment,
            problemSummary: form.problemSummary,
            problemAnalysis: form.problemAnalysis,
            guides: form.guides,
            status:
               effectiveStatus === BookingStatus.Complete
                  ? BookingStatus.Complete
                  : appointment.status,
         });

         showToast('Lưu ghi chú thành công.', ToastType.Success);
         setShowNoteDialog(false);
         setIsEditing(false);
      } catch (error) {
         showToast('Lưu ghi chú thất bại. Vui lòng thử lại.', ToastType.Error);
      } finally {
         setLoading(false);
      }
   };

   const handleOpenNoteDialog = () => {
      if (appointment) {
         setNoteForm({
            problemSummary: appointment.problemSummary || '',
            problemAnalysis: appointment.problemAnalysis || '',
            guides: appointment.guides || '',
         });
         setIsEditing(appointment.status === BookingStatus.Finish);
         setFormErrors({ problemSummary: '', guides: '' });
         setShowNoteDialog(true);
      }
   };

   // Custom skeleton for loading state
   if (loading) {
      return (
         <div className="space-y-6">
            <div className="flex items-center gap-4">
               <Skeleton className="h-8 w-20" />
               <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-8 w-64" />
               </div>
               <Skeleton className="h-6 w-24" />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
               <div className="lg:col-span-2 space-y-6">
                  <Card>
                     <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <Skeleton className="h-4 w-16 mb-2" />
                              <div className="flex items-center gap-2">
                                 <Skeleton className="h-4 w-4" />
                                 <Skeleton className="h-4 w-48" />
                              </div>
                           </div>
                           <div>
                              <Skeleton className="h-4 w-16 mb-2" />
                              <div className="flex items-center gap-2">
                                 <Skeleton className="h-4 w-4" />
                                 <Skeleton className="h-4 w-32" />
                              </div>
                           </div>
                        </div>
                        <div>
                           <Skeleton className="h-4 w-24 mb-2" />
                           <div className="flex items-center gap-2">
                              <Skeleton className="h-4 w-4" />
                              <Skeleton className="h-4 w-40" />
                           </div>
                        </div>
                        <div>
                           <Skeleton className="h-4 w-24 mb-2" />
                           <Skeleton className="h-4 w-56" />
                        </div>
                        <div>
                           <Skeleton className="h-4 w-24 mb-2" />
                           <Skeleton className="h-4 w-64" />
                        </div>
                        <Skeleton className="h-16 w-full" />
                     </CardContent>
                  </Card>
               </div>
               <div className="space-y-6">
                  <Card>
                     <CardContent>
                        <div className="flex items-center gap-3">
                           <Skeleton className="h-12 w-12 rounded-full" />
                           <Skeleton className="h-12 w-12 rounded-full" />
                           <div>
                              <Skeleton className="h-4 w-32 mb-1" />
                              <Skeleton className="h-4 w-40" />
                              <Skeleton className="h-4 w-40" />
                           </div>
                        </div>
                     </CardContent>
                  </Card>
                  <Card>
                     <CardContent>
                        <div className="space-y-2">
                           <Skeleton className="h-10 w-full" />
                           <Skeleton className="h-10 w-full" />
                           <Skeleton className="h-10 w-full" />
                        </div>
                     </CardContent>
                  </Card>
                  <Card>
                     <CardContent>
                        <div className="space-y-2">
                           <Skeleton className="h-4 w-48" />
                           <Skeleton className="h-4 w-48" />
                        </div>
                     </CardContent>
                  </Card>
               </div>
            </div>
         </div>
      );
   }

   // Custom error state
   if (error) {
      return (
         <Card>
            <CardContent className="p-6 text-center">
               <div className="flex flex-col items-center gap-4">
                  <p className="text-red-600 font-medium text-lg">{error}</p>
                  <Button onClick={fetchAppointmentDetail} variant="outline">
                     Tải lại chi tiết
                  </Button>
               </div>
            </CardContent>
         </Card>
      );
   }

   if (!appointment) return null;

   const isCouple =
      appointment.member2 !== null || Boolean(appointment.isCouple);
   const memberName = appointment.member2
      ? `${appointment.member.fullname} & ${appointment.member2.fullname}`
      : appointment.member.fullname;
   const hasNotes =
      appointment.problemSummary ||
      appointment.problemAnalysis ||
      appointment.guides;

   return (
      <div className="space-y-6">
         {/* Header */}
         <AppointmentHeader
            appointmentId={appointmentId}
            isCouple={isCouple}
            status={appointment.status}
            timeEnd={appointment.timeEnd} // Added timeEnd prop
         />

         <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
               <AppointmentInfo
                  timeStart={appointment.timeStart}
                  timeEnd={appointment.timeEnd}
                  isCouple={isCouple}
                  subCategories={appointment.subCategories}
                  status={appointment.status}
                  problemSummary={appointment.problemSummary}
                  problemAnalysis={appointment.problemAnalysis}
                  guides={appointment.guides}
                  cancelReason={appointment.cancelReason}
                  feedback={appointment.feedback}
                  note={appointment.note}
               />
            </div>

            {/* Sidebar */}
            {appointment && (
               <AppointmentSidebar
                  appointmentId={appointment.id}
                  member={appointment.member}
                  member2={appointment.member2}
                  isCouple={isCouple}
                  status={appointment.status}
                  hasNotes={hasNotes}
                  timeStart={appointment.timeStart}
                  timeEnd={appointment.timeEnd} // Added timeEnd prop
                  onOpenNoteDialog={handleOpenNoteDialog}
                  onOpenCancelDialog={() => setShowCancelDialog(true)}
               />
            )}
         </div>

         {/* Cancel Dialog */}
         <AppointmentCancelDialog
            open={showCancelDialog}
            onOpenChange={setShowCancelDialog}
            memberName={memberName}
            isCouple={isCouple}
            timeStart={appointment.timeStart}
            onCancel={handleCancel}
            loading={loading}
         />

         {/* Note Dialog */}
         <AppointmentNotesDialog
            open={showNoteDialog}
            onOpenChange={setShowNoteDialog}
            appointment={appointment}
            onSave={handleSaveNote}
            loading={loading}
         />
      </div>
   );
});

export default AppointmentDetail;
