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
import { Slider } from '@/components/ui/slider';
import { TiptapEditor } from './tiptap-editor';
import { useUploadImage } from '@/hooks/upload-image';
import { UpdatePersonTypePayload } from '@/types/result-person-type';
import { Category } from '@/types/category';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';

interface EditResultPersonTypeModalProps {
   open: boolean;
   onClose: () => void;
   onSubmit: (data: UpdatePersonTypePayload) => void;
   isSaving: boolean;
   formValues: UpdatePersonTypePayload;
   categories: Category[]; // Assuming categories is an array of strings
   onChange: (
      field: keyof UpdatePersonTypePayload,
      value: string | number
   ) => void;
}

export default function EditResultPersonTypeModal({
   open,
   onClose,
   onSubmit,
   isSaving,
   formValues,
   categories,
   onChange,
}: EditResultPersonTypeModalProps) {
   const {
      uploadImage,
      loading: uploading,
      error: uploadError,
   } = useUploadImage();
   console.log(categories);
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

               {/* Chi tiết */}
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
               <div className="grid gap-2">
                  <Label>Danh mục</Label>
                  <Select
                     value={formValues.categoryId || ''}
                     onValueChange={(value) => onChange('categoryId', value)}
                  >
                     <SelectTrigger className="w-full">
                        <SelectValue placeholder="-- Chọn danh mục --" />
                     </SelectTrigger>
                     <SelectContent>
                        {categories.map((cat) => (
                           <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               </div>
               {/* Hình ảnh */}
               <div className="grid gap-2">
                  <Label>Hình ảnh</Label>

                  {formValues.image && (
                     <img
                        src={formValues.image}
                        alt="preview"
                        className="w-32 h-32 object-cover rounded-md border"
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
                           onError: (err) =>
                              console.error('Upload failed:', err),
                        });
                     }}
                  />

                  {uploading && (
                     <p className="text-sm text-muted-foreground">
                        Đang tải ảnh lên...
                     </p>
                  )}
                  {uploadError && (
                     <p className="text-sm text-red-500">{uploadError}</p>
                  )}
               </div>

               {/* Độ tương thích */}
               <div className="grid gap-3">
                  <Label>Độ tương thích</Label>
                  <div className="flex items-center gap-4">
                     <Slider
                        value={[formValues.compatibility]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(val) =>
                           onChange('compatibility', val[0])
                        }
                        className="flex-1"
                     />
                     <Input
                        type="number"
                        min={0}
                        max={100}
                        value={formValues.compatibility}
                        onChange={(e) => {
                           let value = Number(e.target.value);
                           if (value > 100) value = 100;
                           if (value < 0) value = 0;
                           onChange('compatibility', value);
                        }}
                        className="w-20 text-center"
                     />
                     <span className="text-lg font-semibold w-10 text-center">
                        %
                     </span>
                  </div>
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
