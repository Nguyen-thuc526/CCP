'use client';

import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PhoneOff } from 'lucide-react';

interface FinishCallDialogProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   roomName: string;
   callStartTime: Date;
   onConfirmFinish: () => void;
   isFinishing: boolean;
}

export default function FinishCallDialog({
   open,
   onOpenChange,
   roomName,
   callStartTime,
   onConfirmFinish,
   isFinishing,
}: FinishCallDialogProps) {
   const formatCallDuration = () => {
      const now = new Date();
      const duration = Math.floor(
         (now.getTime() - callStartTime.getTime()) / 1000 / 60
      );
      return `${duration} phút`;
   };

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="sm:max-w-md">
            <DialogHeader>
               <DialogTitle className="flex items-center gap-2">
                  <PhoneOff className="h-5 w-5 text-red-600" />
                  Kết thúc cuộc gọi
               </DialogTitle>
               <DialogDescription className="text-left">
                  Bạn có chắc chắn muốn kết thúc cuộc gọi tư vấn này không?
                  <br />
                  <br />
                  <strong>Lưu ý:</strong> Sau khi kết thúc, bạn sẽ không thể
                  tiếp tục cuộc gọi này nữa.
               </DialogDescription>
            </DialogHeader>

            <div className="bg-gray-50 rounded-lg p-4 my-4">
               <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between">
                     <span>Phòng gọi:</span>
                     <span className="font-medium">{roomName}</span>
                  </div>
                  <div className="flex justify-between">
                     <span>Thời gian gọi:</span>
                     <span className="font-medium">
                        {formatCallDuration()}
                     </span>
                  </div>
               </div>
            </div>

            <DialogFooter className="flex gap-2">
               <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isFinishing}
               >
                  Hủy
               </Button>
               <Button
                  variant="destructive"
                  onClick={onConfirmFinish}
                  disabled={isFinishing}
                  className="bg-red-600 hover:bg-red-700"
               >
                  {isFinishing ? (
                     <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Đang kết thúc...
                     </>
                  ) : (
                     <>
                        <PhoneOff className="mr-2 h-4 w-4" />
                        Kết thúc cuộc gọi
                     </>
                  )}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
