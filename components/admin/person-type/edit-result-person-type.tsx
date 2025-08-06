'use client';

import React from 'react';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { TiptapEditor } from './tiptap-editor';
import { useUploadImage } from '@/hooks/upload-image';
import { UpdatePersonTypePayload } from '@/types/result-person-type';



interface EditResultPersonTypeModalProps {
   open: boolean;
   onClose: () => void;
   onSubmit: (data: UpdatePersonTypePayload) => void;
   isSaving: boolean;
   formValues: UpdatePersonTypePayload;
   onChange: (field: keyof UpdatePersonTypePayload, value: string | number) => void;
}

export default function EditResultPersonTypeModal({
   open,
   onClose,
   onSubmit,
   isSaving,
   formValues,
   onChange,
}: EditResultPersonTypeModalProps) {
   const { uploadImage, loading: uploading, error: uploadError } = useUploadImage();

   return (
      <Dialog open={open} onOpenChange={onClose}>
         <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
               <DialogTitle>Chỉnh sửa kết quả tính cách</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
               {/* Mô tả */}
               <div className="grid gap-2">
                  <Label>Mô tả</Label>
                  <Input
                     value={formValues.description}
                     onChange={(e) => onChange('description', e.target.value)}
                     placeholder="Nhập mô tả ngắn..."
                  />
               </div>

               {/* Chi tiết với Tiptap */}
               <div className="grid gap-2">
                  <Label>Chi tiết</Label>
                  <TiptapEditor
                     content={formValues.detail}
                     onChange={(html) => onChange('detail', html)}
                     placeholder="Nhập nội dung chi tiết..."
                  />
               </div>
               {/* Điểm mạnh */}
               <div className="grid gap-2">
                  <Label>Điểm mạnh</Label>
                  <TiptapEditor
                     content={formValues.strongPoints}
                     onChange={(html) => onChange('strongPoints', html)}
                     placeholder="Nhập điểm mạnh..."
                  />
               </div>

               {/* Điểm yếu */}
               <div className="grid gap-2">
                  <Label>Điểm yếu</Label>
                  <TiptapEditor
                     content={formValues.weaknesses}
                     onChange={(html) => onChange('weaknesses', html)}
                     placeholder="Nhập điểm yếu..."
                  />
               </div>
               {/* Hình ảnh */}
               <div className="grid gap-2">
                  <Label>Hình ảnh</Label>

                  {formValues.image && (
                     <img
                        src={formValues.image}
                        alt="preview"
                        className="w-32 h-32 object-cover rounded-md"
                     />
                  )}

                  <Input
                     type="file"
                     accept="image/*"
                     onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        await uploadImage({
                           file,
                           onSuccess: (url) => onChange('image', url),
                           onError: (err) => console.error('Upload failed:', err),
                        });
                     }}
                  />

                  {uploading && (
                     <p className="text-sm text-muted-foreground">Đang tải ảnh lên...</p>
                  )}
                  {uploadError && (
                     <p className="text-sm text-red-500">{uploadError}</p>
                  )}
               </div>

               {/* Độ tương thích */}
               <div className="grid gap-2">
                  <Label>Độ tương thích (%)</Label>
                  <Input
                     type="number"
                     min={0}
                     max={100}
                     value={formValues.compatibility}
                     onChange={(e) =>
                        onChange('compatibility', Number(e.target.value))
                     }
                  />
               </div>
            </div>

            <DialogFooter className="mt-4">
               <Button variant="outline" onClick={onClose}>
                  Hủy
               </Button>
               <Button
                  onClick={() => onSubmit(formValues)}
                  disabled={isSaving || uploading}
               >
                  {isSaving || uploading ? 'Đang lưu...' : 'Lưu thay đổi'}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
