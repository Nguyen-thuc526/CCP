'use client';

import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ScheduleSettings {
   defaultDuration: number;
   bufferTime: number;
   maxAdvanceBooking: number;
   minAdvanceBooking: number;
}

interface SettingsDialogProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   scheduleSettings: ScheduleSettings;
   setScheduleSettings: (settings: ScheduleSettings) => void;
}

export function SettingsDialog({
   open,
   onOpenChange,
   scheduleSettings,
   setScheduleSettings,
}: SettingsDialogProps) {
   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Cài đặt lịch làm việc</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
               <div className="space-y-2">
                  <Label htmlFor="default-duration">
                     Thời lượng mặc định (phút)
                  </Label>
                  <Select
                     value={scheduleSettings.defaultDuration.toString()}
                     onValueChange={(value) =>
                        setScheduleSettings({
                           ...scheduleSettings,
                           defaultDuration: Number.parseInt(value),
                        })
                     }
                  >
                     <SelectTrigger>
                        <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="30">30 phút</SelectItem>
                        <SelectItem value="45">45 phút</SelectItem>
                        <SelectItem value="60">60 phút</SelectItem>
                        <SelectItem value="90">90 phút</SelectItem>
                        <SelectItem value="120">120 phút</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
               <div className="space-y-2">
                  <Label htmlFor="buffer-time">
                     Thời gian nghỉ giữa các buổi (phút)
                  </Label>
                  <Select
                     value={scheduleSettings.bufferTime.toString()}
                     onValueChange={(value) =>
                        setScheduleSettings({
                           ...scheduleSettings,
                           bufferTime: Number.parseInt(value),
                        })
                     }
                  >
                     <SelectTrigger>
                        <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="0">Không nghỉ</SelectItem>
                        <SelectItem value="5">5 phút</SelectItem>
                        <SelectItem value="10">10 phút</SelectItem>
                        <SelectItem value="15">15 phút</SelectItem>
                        <SelectItem value="30">30 phút</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
               <div className="space-y-2">
                  <Label htmlFor="max-advance">
                     Cho phép đặt lịch trước tối đa (ngày)
                  </Label>
                  <Input
                     id="max-advance"
                     type="number"
                     value={scheduleSettings.maxAdvanceBooking}
                     onChange={(e) =>
                        setScheduleSettings({
                           ...scheduleSettings,
                           maxAdvanceBooking: Number.parseInt(e.target.value),
                        })
                     }
                  />
               </div>
               <div className="space-y-2">
                  <Label htmlFor="min-advance">
                     Yêu cầu đặt lịch trước tối thiểu (giờ)
                  </Label>
                  <Input
                     id="min-advance"
                     type="number"
                     value={scheduleSettings.minAdvanceBooking}
                     onChange={(e) =>
                        setScheduleSettings({
                           ...scheduleSettings,
                           minAdvanceBooking: Number.parseInt(e.target.value),
                        })
                     }
                  />
               </div>
               <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                     Hủy
                  </Button>
                  <Button onClick={() => onOpenChange(false)}>
                     Lưu cài đặt
                  </Button>
               </div>
            </div>
         </DialogContent>
      </Dialog>
   );
}
