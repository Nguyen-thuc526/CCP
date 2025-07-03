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
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { workScheduleService } from '@/services/workScheduleService';
import type { WorkSchedule } from '@/types/workSchedule';
import { useToast, ToastType } from '@/hooks/useToast';

interface SlotDialogProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   selectedDate: Date;
   onSubmit: () => void;
}

const HOUR_OPTIONS = Array.from({ length: 18 }, (_, i) => {
   const hour = i + 6;
   return { value: hour.toString(), label: `${hour}h` };
});

export function SlotDialog({
   open,
   onOpenChange,
   selectedDate,
   onSubmit,
}: SlotDialogProps) {
   const { showToast } = useToast();

   const handleSubmit = async (
      values: {
         startHour: string;
         endHour: string;
         description: string;
         isRecurring: boolean;
      },
      {
         setSubmitting,
         resetForm,
      }: {
         setSubmitting: (isSubmitting: boolean) => void;
         resetForm: () => void;
      }
   ) => {
      try {
         const buildDateTime = (date: Date, hour: string): Date => {
            const d = new Date(date);
            d.setHours(Number.parseInt(hour), 0, 0, 0);
            return d;
         };

         const formatDateLocal = (date: Date): string => {
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            const hh = String(date.getHours()).padStart(2, '0');
            const mi = String(date.getMinutes()).padStart(2, '0');
            const ss = String(date.getSeconds()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}`;
         };

         const startDate = buildDateTime(selectedDate, values.startHour);
         const endDate = buildDateTime(selectedDate, values.endHour);

         const workDate =
            formatDateLocal(startDate).split('T')[0] + 'T00:00:00';

         const newSlot: WorkSchedule = {
            workDate,
            startTime: formatDateLocal(startDate),
            endTime: formatDateLocal(endDate),
            description: values.description || undefined,
         };

         await workScheduleService.setWorkSchedule(newSlot);
         showToast('Đặt lịch rảnh thành công!', ToastType.Success);
         onSubmit();
         resetForm();
         onOpenChange(false);
      } catch (error: any) {
         console.error('Work schedule error:', error.message);
         showToast(error.message || 'Đặt lịch rảnh thất bại.', ToastType.Error);
      } finally {
         setSubmitting(false);
      }
   };

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Thêm khung giờ rảnh</DialogTitle>
            </DialogHeader>
            <Formik
               initialValues={{
                  startHour: '9',
                  endHour: '17',
                  description: '',
                  isRecurring: false,
               }}
               validate={(values) => {
                  const errors: any = {};
                  if (!values.startHour) {
                     errors.startHour = 'Vui lòng chọn giờ bắt đầu';
                  }
                  if (!values.endHour) {
                     errors.endHour = 'Vui lòng chọn giờ kết thúc';
                  }
                  if (
                     values.startHour &&
                     values.endHour &&
                     Number.parseInt(values.startHour) >=
                        Number.parseInt(values.endHour)
                  ) {
                     errors.endHour = 'Giờ kết thúc phải sau giờ bắt đầu';
                  }
                  return errors;
               }}
               onSubmit={handleSubmit}
            >
               {({ isSubmitting, values, setFieldValue }) => (
                  <Form className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <Label htmlFor="start-hour">Giờ bắt đầu</Label>
                           <Select
                              value={values.startHour}
                              onValueChange={(value) =>
                                 setFieldValue('startHour', value)
                              }
                           >
                              <SelectTrigger>
                                 <SelectValue placeholder="Chọn giờ bắt đầu" />
                              </SelectTrigger>
                              <SelectContent>
                                 {HOUR_OPTIONS.map((hour) => (
                                    <SelectItem
                                       key={hour.value}
                                       value={hour.value}
                                    >
                                       {hour.label}
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                           <ErrorMessage
                              name="startHour"
                              component="p"
                              className="text-red-500 text-sm"
                           />
                        </div>
                        <div className="space-y-2">
                           <Label htmlFor="end-hour">Giờ kết thúc</Label>
                           <Select
                              value={values.endHour}
                              onValueChange={(value) =>
                                 setFieldValue('endHour', value)
                              }
                           >
                              <SelectTrigger>
                                 <SelectValue placeholder="Chọn giờ kết thúc" />
                              </SelectTrigger>
                              <SelectContent>
                                 {HOUR_OPTIONS.filter(
                                    (hour) =>
                                       Number.parseInt(hour.value) >
                                       Number.parseInt(values.startHour || '0')
                                 ).map((hour) => (
                                    <SelectItem
                                       key={hour.value}
                                       value={hour.value}
                                    >
                                       {hour.label}
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                           <ErrorMessage
                              name="endHour"
                              component="p"
                              className="text-red-500 text-sm"
                           />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="description">Mô tả</Label>
                        <Field
                           as={Input}
                           id="description"
                           name="description"
                           placeholder="Nhập mô tả (tùy chọn)"
                        />
                     </div>
                     <div className="flex justify-end gap-2">
                        <Button
                           type="button"
                           variant="outline"
                           onClick={() => onOpenChange(false)}
                        >
                           Hủy
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                           {isSubmitting ? 'Đang xử lý...' : 'Thêm'}
                        </Button>
                     </div>
                  </Form>
               )}
            </Formik>
         </DialogContent>
      </Dialog>
   );
}
