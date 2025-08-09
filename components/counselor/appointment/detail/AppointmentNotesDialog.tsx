'use client';

import React, { useState, useEffect } from 'react';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
   FileText,
   Search,
   Lightbulb,
   User,
   Calendar,
   Clock,
   Edit3,
   Save,
   X,
} from 'lucide-react';
import { BookingStatus } from '@/utils/enum';

interface Member {
   id: string;
   accountId: string;
   fullname: string;
   avatar: string | null;
   phone: string | null;
   status: number;
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

interface AppointmentNotesDialogProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   appointment: {
      id: string;
      member: Member;
      member2: Member | null;
      timeStart: string;
      subCategories: any[];
      status: BookingStatus;
      problemSummary?: string | null;
      problemAnalysis?: string | null;
      guides?: string | null;
   };
   onSave: (form: NoteForm) => Promise<void>;
   loading?: boolean;
}

const AppointmentNotesDialog: React.FC<AppointmentNotesDialogProps> = ({
   open,
   onOpenChange,
   appointment,
   onSave,
   loading = false,
}) => {
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

   const isCouple = appointment.member2 !== null;
   const memberName = appointment.member2
      ? `${appointment.member.fullname} & ${appointment.member2.fullname}`
      : appointment.member.fullname;
   const hasNotes =
      appointment.problemSummary ||
      appointment.problemAnalysis ||
      appointment.guides;

   const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('vi-VN', {
         weekday: 'long',
         year: 'numeric',
         month: 'long',
         day: 'numeric',
      });
   };

   const startDate = new Date(appointment.timeStart);

   useEffect(() => {
      if (open && appointment) {
         setNoteForm({
            problemSummary: appointment.problemSummary || '',
            problemAnalysis: appointment.problemAnalysis || '',
            guides: appointment.guides || '',
         });
         setIsEditing(appointment.status === BookingStatus.Finish);
         setFormErrors({ problemSummary: '', guides: '' });
      }
   }, [open, appointment]);

   const handleSave = async () => {
      let errors: FormErrors = { problemSummary: '', guides: '' };
      if (!noteForm.problemSummary.trim()) {
         errors.problemSummary = 'Tóm tắt vấn đề là bắt buộc';
      }
      if (!noteForm.guides.trim()) {
         errors.guides = 'Hướng dẫn là bắt buộc';
      }
      setFormErrors(errors);

      if (errors.problemSummary || errors.guides) {
         return false;
      }

      await onSave(noteForm);
      return true;
   };

   const handleClose = () => {
      if (isEditing) {
         setNoteForm({
            problemSummary: appointment.problemSummary || '',
            problemAnalysis: appointment.problemAnalysis || '',
            guides: appointment.guides || '',
         });
         setIsEditing(false);
         setFormErrors({ problemSummary: '', guides: '' });
      } else {
         onOpenChange(false);
      }
   };

   return (
      <Dialog open={open} onOpenChange={handleClose}>
         <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-4">
               <div className="flex items-center justify-between">
                  <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                     <FileText className="h-6 w-6 text-blue-600" />
                     Ghi chú tư vấn
                  </DialogTitle>
                  {hasNotes &&
                     !isEditing &&
                     appointment.status === BookingStatus.Finish && (
                        <Button
                           onClick={() => setIsEditing(true)}
                           size="sm"
                           className="gap-2"
                        >
                           <Edit3 className="h-4 w-4" />
                           Chỉnh sửa
                        </Button>
                     )}
               </div>
            </DialogHeader>

            {/* Appointment Info */}
            <Card className="mb-6">
               <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                     <User className="h-5 w-5 text-gray-600" />
                     Thông tin buổi tư vấn
                  </CardTitle>
               </CardHeader>
               <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <div>
                           <p className="text-sm text-gray-500">Khách hàng</p>
                           <p className="font-medium">{memberName}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <div>
                           <p className="text-sm text-gray-500">Ngày tư vấn</p>
                           <p className="font-medium">
                              {formatDate(appointment.timeStart)}
                           </p>
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <div>
                           <p className="text-sm text-gray-500">Thời gian</p>
                           <p className="font-medium">
                              {startDate.toLocaleTimeString('vi-VN', {
                                 hour: '2-digit',
                                 minute: '2-digit',
                              })}
                           </p>
                        </div>
                     </div>
                  </div>
                  <div className="mt-4">
                     <p className="text-sm text-gray-500 mb-1">Vấn đề tư vấn</p>
                     <p className="text-gray-900 leading-relaxed">
                        {appointment.subCategories
                           .map((sub) => sub.name)
                           .join(', ') || 'Không xác định'}
                     </p>
                  </div>
               </CardContent>
            </Card>

            {/* Notes Content */}
            {hasNotes && !isEditing ? (
               <Tabs defaultValue="summary" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                     <TabsTrigger value="summary" className="gap-2">
                        <FileText className="h-4 w-4" />
                        Tóm tắt
                     </TabsTrigger>
                     <TabsTrigger value="analysis" className="gap-2">
                        <Search className="h-4 w-4" />
                        Phân tích
                     </TabsTrigger>
                     <TabsTrigger value="guides" className="gap-2">
                        <Lightbulb className="h-4 w-4" />
                        Hướng dẫn
                     </TabsTrigger>
                  </TabsList>

                  <TabsContent value="summary" className="mt-4">
                     <Card>
                        <CardHeader>
                           <CardTitle className="text-lg flex items-center gap-2">
                              <FileText className="h-5 w-5 text-blue-600" />
                              Tóm tắt vấn đề
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                              {noteForm.problemSummary ||
                                 'Chưa có tóm tắt vấn đề'}
                           </p>
                        </CardContent>
                     </Card>
                  </TabsContent>

                  <TabsContent value="analysis" className="mt-4">
                     <Card>
                        <CardHeader>
                           <CardTitle className="text-lg flex items-center gap-2">
                              <Search className="h-5 w-5 text-green-600" />
                              Phân tích vấn đề
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                              {noteForm.problemAnalysis ||
                                 'Chưa có phân tích chi tiết'}
                           </p>
                        </CardContent>
                     </Card>
                  </TabsContent>

                  <TabsContent value="guides" className="mt-4">
                     <Card>
                        <CardHeader>
                           <CardTitle className="text-lg flex items-center gap-2">
                              <Lightbulb className="h-5 w-5 text-amber-600" />
                              Hướng dẫn & Khuyến nghị
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                              {noteForm.guides || 'Chưa có hướng dẫn'}
                           </p>
                        </CardContent>
                     </Card>
                  </TabsContent>
               </Tabs>
            ) : appointment.status === BookingStatus.Finish ? (
               <div className="space-y-6">
                  <Card>
                     <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                           <FileText className="h-5 w-5 text-blue-600" />
                           Tóm tắt vấn đề
                           <Badge variant="destructive" className="ml-2">
                              Bắt buộc
                           </Badge>
                        </CardTitle>
                     </CardHeader>
                     <CardContent>
                        <Textarea
                           value={noteForm.problemSummary}
                           onChange={(e) =>
                              setNoteForm({
                                 ...noteForm,
                                 problemSummary: e.target.value,
                              })
                           }
                           placeholder="Tóm tắt ngắn gọn vấn đề chính được thảo luận trong buổi tư vấn..."
                           rows={4}
                           className={`resize-none ${
                              formErrors.problemSummary ? 'border-red-500' : ''
                           }`}
                        />
                        {formErrors.problemSummary && (
                           <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                              <X className="h-4 w-4" />
                              {formErrors.problemSummary}
                           </p>
                        )}
                     </CardContent>
                  </Card>

                  <Card>
                     <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                           <Search className="h-5 w-5 text-green-600" />
                           Phân tích vấn đề
                           <Badge variant="outline" className="ml-2">
                              Tùy chọn
                           </Badge>
                        </CardTitle>
                     </CardHeader>
                     <CardContent>
                        <Textarea
                           value={noteForm.problemAnalysis}
                           onChange={(e) =>
                              setNoteForm({
                                 ...noteForm,
                                 problemAnalysis: e.target.value,
                              })
                           }
                           placeholder="Phân tích chi tiết về nguyên nhân, bối cảnh và các yếu tố ảnh hưởng đến vấn đề..."
                           rows={4}
                           className="resize-none"
                        />
                     </CardContent>
                  </Card>

                  <Card>
                     <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                           <Lightbulb className="h-5 w-5 text-amber-600" />
                           Hướng dẫn & Khuyến nghị
                           <Badge variant="destructive" className="ml-2">
                              Bắt buộc
                           </Badge>
                        </CardTitle>
                     </CardHeader>
                     <CardContent>
                        <Textarea
                           value={noteForm.guides}
                           onChange={(e) =>
                              setNoteForm({
                                 ...noteForm,
                                 guides: e.target.value,
                              })
                           }
                           placeholder="Các bước tiếp theo, lời khuyên và hướng dẫn cụ thể cho khách hàng..."
                           rows={4}
                           className={`resize-none ${
                              formErrors.guides ? 'border-red-500' : ''
                           }`}
                        />
                        {formErrors.guides && (
                           <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                              <X className="h-4 w-4" />
                              {formErrors.guides}
                           </p>
                        )}
                     </CardContent>
                  </Card>
               </div>
            ) : (
               <Card>
                  <CardContent className="p-8 text-center">
                     <div className="flex flex-col items-center gap-3">
                        <div className="p-3 bg-gray-100 rounded-full">
                           <FileText className="h-6 w-6 text-gray-400" />
                        </div>
                        <div>
                           <p className="text-gray-900 font-medium">
                              Không có ghi chú
                           </p>
                           <p className="text-gray-500 text-sm">
                              Buổi tư vấn này không có ghi chú nào.
                           </p>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            )}

            {/* Footer Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end pt-6 border-t">
               <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={loading}
               >
                  {isEditing ? 'Hủy' : 'Đóng'}
               </Button>
               {isEditing && appointment.status === BookingStatus.Finish && (
                  <Button
                     onClick={handleSave}
                     className="gap-2"
                     disabled={loading}
                  >
                     <Save className="h-4 w-4" />
                     Lưu ghi chú
                  </Button>
               )}
            </div>
         </DialogContent>
      </Dialog>
   );
};

export default AppointmentNotesDialog;
