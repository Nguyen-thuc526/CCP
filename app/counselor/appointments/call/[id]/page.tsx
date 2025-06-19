'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { VideoRoom } from '@/components/video-call/video-room';
import { PreJoin } from '@/components/video-call/pre-join';

interface CallPageProps {
   params: {
      id: string;
   };
}

export default function CallPage({ params }: CallPageProps) {
   const router = useRouter();
   const appointmentId = params.id;
   const [joined, setJoined] = useState(false);
   const [videoEnabled, setVideoEnabled] = useState(true);
   const [audioEnabled, setAudioEnabled] = useState(true);
   const [isLoading, setIsLoading] = useState(true);
   const [appointmentData, setAppointmentData] = useState<any>(null);

   useEffect(() => {
      // Trong ứng dụng thực tế, bạn sẽ lấy thông tin cuộc hẹn từ API
      // Đây là mô phỏng việc lấy dữ liệu
      const fetchAppointmentData = async () => {
         try {
            // Mô phỏng gọi API
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Dữ liệu mẫu
            setAppointmentData({
               id: appointmentId,
               member: 'Nguyễn Văn A & Nguyễn Thị B',
               roomName: `appointment-${appointmentId}`,
               counselorName: 'TS. Trần Văn C',
            });
         } catch (error) {
            console.error('Error fetching appointment data:', error);
         } finally {
            setIsLoading(false);
         }
      };

      fetchAppointmentData();
   }, [appointmentId]);

   const handleJoin = (video: boolean, audio: boolean) => {
      setVideoEnabled(video);
      setAudioEnabled(audio);
      setJoined(true);
   };

   const handleCancel = () => {
      router.back();
   };

   if (isLoading) {
      return (
         <div className="flex items-center justify-center h-[80vh]">
            Đang tải thông tin cuộc hẹn...
         </div>
      );
   }

   if (!appointmentData) {
      return (
         <div className="flex items-center justify-center h-[80vh]">
            Không tìm thấy thông tin cuộc hẹn
         </div>
      );
   }

   if (!joined) {
      return (
         <PreJoin
            appointmentId={appointmentId}
            memberName={appointmentData.member}
            onJoin={handleJoin}
            onCancel={handleCancel}
         />
      );
   }

   return (
      <div className="space-y-4">
         <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Buổi tư vấn trực tuyến</h1>
            <div className="text-right">
               <h2 className="font-medium">{appointmentData.member}</h2>
               <p className="text-sm text-muted-foreground">
                  ID: {appointmentData.id}
               </p>
            </div>
         </div>

         <VideoRoom
            roomName={appointmentData.roomName}
            participantName={appointmentData.counselorName}
            // Trong ứng dụng thực tế, bạn sẽ truyền token từ API
         />
      </div>
   );
}
