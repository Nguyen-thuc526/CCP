'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { bookingService } from '@/services/bookingService';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useToast, ToastType } from '@/hooks/useToast';
import CallHeader from './CallHeader';
import CallInterface from './CallInterface';
import CallSidebar from './CallSidebar';
import FinishCallDialog from './FinishCallDialog';

interface VideoManageProps {
   appointmentId: string;
}

interface NoteForm {
   problemSummary: string;
   problemAnalysis: string;
   guides: string;
}

interface BookingInfo {
   type: 'individual' | 'couple';
   memberName: string;
   partnerName?: string;
   memberId: string;
   partnerId?: string;
}

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
   isCouple: boolean | null;
   member: Member;
   member2: Member | null;
   problemSummary?: string | null;
   problemAnalysis?: string | null;
   guides?: string | null;
}

export default function VideoManage({ appointmentId }: VideoManageProps) {
   const router = useRouter();
   const { showToast } = useToast();

   const [joinUrl, setJoinUrl] = useState<string | null>(null);
   const [roomName, setRoomName] = useState<string>('');
   const [userName, setUserName] = useState<string>('');
   const [showFinishDialog, setShowFinishDialog] = useState(false);
   const [showSidebar, setShowSidebar] = useState(false);
   const [isFinishing, setIsFinishing] = useState(false);
   const [isSavingNotes, setIsSavingNotes] = useState(false);
   const [callStartTime] = useState(new Date());
   const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
   const [notes, setNotes] = useState<NoteForm>({
      problemSummary: '',
      problemAnalysis: '',
      guides: '',
   });

   // Chặn gọi API nhiều lần bởi StrictMode và re-render
   const didFetchRef = useRef(false);

   useEffect(() => {
      if (didFetchRef.current) return;
      didFetchRef.current = true;

      const fetchData = async () => {
         try {
            const [roomResponse, bookingDetail] = await Promise.all([
               bookingService.getRoomUrl(appointmentId),
               bookingService.getBookingDetail(appointmentId),
            ]);

            if (roomResponse?.success) {
               const { joinUrl, roomName, userName } = roomResponse.data;
               const encodedUserName = encodeURIComponent(userName);
               setJoinUrl(`${joinUrl}?userName=${encodedUserName}`);
               setRoomName(roomName);
               setUserName(userName);
            } else {
               showToast(
                  'Không thể tải phòng gọi. Vui lòng thử lại.',
                  ToastType.Error
               );
               router.back();
               return;
            }

            if (bookingDetail) {
               const detail = bookingDetail as BookingDetail;

               // Prefill notes từ API
               setNotes({
                  problemSummary: detail.problemSummary ?? '',
                  problemAnalysis: detail.problemAnalysis ?? '',
                  guides: detail.guides ?? '',
               });

               const isCouple =
                  detail.member2 !== null || Boolean(detail.isCouple);
               setBookingInfo({
                  type: isCouple ? 'couple' : 'individual',
                  memberName: detail.member.fullname,
                  partnerName: detail.member2?.fullname ?? undefined,
                  memberId: detail.member.id,
                  partnerId: detail.member2?.id ?? undefined,
               });
            }
         } catch (error) {
            console.error('Failed to fetch data:', error);
            showToast('Đã xảy ra lỗi khi tải dữ liệu.', ToastType.Error);
            router.back();
         }
      };

      fetchData();
      // Chỉ phụ thuộc appointmentId; showToast/router cố ý không đưa vào deps.
   }, [appointmentId]); // eslint-disable-line react-hooks/exhaustive-deps

   const handleFinishClick = useCallback(() => {
      if (!notes.problemSummary.trim() || !notes.guides.trim()) {
         showToast(
            'Hãy thêm ghi chú trước khi kết thúc cuộc gọi',
            ToastType.Warning
         );
         return;
      }
      setShowFinishDialog(true);
   }, [notes.problemSummary, notes.guides, showToast]);

   const handleNotesClick = useCallback(() => {
      setShowSidebar((v) => !v);
   }, []);

   const handleConfirmFinish = useCallback(async () => {
      setIsFinishing(true);
      try {
         const response = await bookingService.finishBooking(appointmentId);
         if (response?.success) {
            showToast(
               'Cuộc gọi đã được kết thúc thành công.',
               ToastType.Success
            );
            router.push('/counselor/appointments');
         } else {
            showToast(
               response?.error ||
                  'Không thể kết thúc cuộc gọi. Vui lòng thử lại.',
               ToastType.Error
            );
         }
      } catch (error) {
         console.error('Finish failed:', error);
         showToast('Đã xảy ra lỗi khi kết thúc cuộc gọi.', ToastType.Error);
      } finally {
         setIsFinishing(false);
         setShowFinishDialog(false);
      }
   }, [appointmentId, router, showToast]);

   const handleSaveNotes = useCallback(
      async (form: NoteForm) => {
         setIsSavingNotes(true);
         try {
            await bookingService.updateNote({
               bookingId: appointmentId,
               problemSummary: form.problemSummary,
               problemAnalysis: form.problemAnalysis,
               guides: form.guides,
            });

            setNotes(form);
            showToast('Ghi chú đã được lưu thành công.', ToastType.Success);
         } catch (error) {
            console.error('Save notes failed:', error);
            showToast(
               'Không thể lưu ghi chú. Vui lòng thử lại.',
               ToastType.Error
            );
         } finally {
            setIsSavingNotes(false);
         }
      },
      [appointmentId, showToast]
   );

   if (!joinUrl) {
      return (
         <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
               <Card>
                  <CardHeader className="space-y-4">
                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-2">
                           <Skeleton className="h-6 sm:h-8 w-48 sm:w-64" />
                           <Skeleton className="h-4 sm:h-6 w-32 sm:w-48" />
                        </div>
                        <Skeleton className="h-8 sm:h-10 w-24 sm:w-32" />
                     </div>
                  </CardHeader>
                  <CardContent>
                     <Skeleton className="h-[400px] sm:h-[600px] w-full rounded-lg" />
                  </CardContent>
               </Card>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-gray-50">
         <CallHeader
            roomName={roomName}
            userName={userName}
            callStartTime={callStartTime}
            onFinishClick={handleFinishClick}
            onNotesClick={handleNotesClick}
            sidebarOpen={showSidebar}
            isNotesOpen={showSidebar}
         />

         <CallInterface
            joinUrl={joinUrl}
            callStartTime={callStartTime}
            sidebarOpen={showSidebar}
         />

         {bookingInfo && (
            <CallSidebar
               isOpen={showSidebar}
               onToggle={() => setShowSidebar((v) => !v)}
               notes={notes}
               onSaveNotes={handleSaveNotes}
               bookingInfo={bookingInfo}
               bookingId={appointmentId}
               loading={isSavingNotes}
            />
         )}

         <FinishCallDialog
            open={showFinishDialog}
            onOpenChange={setShowFinishDialog}
            roomName={roomName}
            callStartTime={callStartTime}
            onConfirmFinish={handleConfirmFinish}
            isFinishing={isFinishing}
         />
      </div>
   );
}
