'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Plus, X } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import type { WorkSchedule } from '@/types/workSchedule';
import { useToast, ToastType } from '@/hooks/useToast';

interface SlotListProps {
   selectedDate: Date;
   timeSlots: WorkSchedule[];
   deleteWorkSchedule: (scheduleId: string) => Promise<void>;
   setTimeSlots: (slots: WorkSchedule[]) => void;
   setShowSlotDialog: (show: boolean) => void;
}

export function SlotList({
   selectedDate,
   timeSlots,
   deleteWorkSchedule,
   setTimeSlots,
   setShowSlotDialog,
}: SlotListProps) {
   const { showToast } = useToast();

   const getSlotsForDate = (date: Date) => {
      const yyyyMMdd = date.toISOString().split('T')[0];
      const dayOfWeek = date.getDay();

      return timeSlots.filter((slot) => {
         const slotDate = new Date(slot.workDate).toISOString().split('T')[0];
         if (slotDate === yyyyMMdd) return true;
         if (slot.isRecurring && slot.dayOfWeek === dayOfWeek) return true;
         return false;
      });
   };

   const formatTimeDisplay = (timeString: string) => {
      const date = new Date(timeString);
      const hours = date.getHours();
      return `${hours}h`;
   };

   const handleDelete = async (scheduleId: string) => {
      try {
         await deleteWorkSchedule(scheduleId);
         setTimeSlots(timeSlots.filter((slot) => slot.id !== scheduleId));
         showToast('Xóa lịch thành công!', ToastType.Success);
      } catch (error: any) {
         console.error('Error deleting schedule:', error.message);
         showToast('Xóa lịch thất bại.', ToastType.Error);
      }
   };

   return (
      <Card>
         <CardHeader>
            <div className="flex items-center justify-between">
               <CardTitle>
                  Lịch rảnh ngày {selectedDate.getDate()}/
                  {selectedDate.getMonth() + 1}/{selectedDate.getFullYear()}
               </CardTitle>
               <Dialog open={false} onOpenChange={setShowSlotDialog}>
                  <DialogTrigger asChild>
                     <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Thêm khung giờ
                     </Button>
                  </DialogTrigger>
               </Dialog>
            </div>
         </CardHeader>
         <CardContent>
            <div className="space-y-4">
               {getSlotsForDate(selectedDate).map((slot) => (
                  <Card
                     key={slot.id}
                     className="p-4 hover:shadow-md transition-shadow"
                  >
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">
                                 {formatTimeDisplay(slot.startTime)} -{' '}
                                 {formatTimeDisplay(slot.endTime)}
                              </span>
                           </div>
                           {slot.isRecurring && (
                              <Badge variant="outline">Lặp lại hàng tuần</Badge>
                           )}
                           {slot.description && (
                              <Badge variant="secondary">
                                 {slot.description}
                              </Badge>
                           )}
                           <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-800"
                           >
                              Trống
                           </Badge>
                        </div>
                        <Button
                           size="sm"
                           variant="destructive"
                           onClick={() => handleDelete(slot.id)}
                        >
                           <X className="mr-2 h-4 w-4" />
                           Xóa
                        </Button>
                     </div>
                  </Card>
               ))}
               {getSlotsForDate(selectedDate).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                     Chưa có khung giờ nào. Nhấn 'Thêm khung giờ' để tạo lịch
                     rảnh.
                  </div>
               )}
            </div>
         </CardContent>
      </Card>
   );
}
