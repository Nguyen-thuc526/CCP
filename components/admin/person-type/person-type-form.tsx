'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import type { PersonType } from '@/types/person-type';
import type { Category } from '@/types/category';
import { TiptapEditor } from './tiptap-editor';
import { useUploadImage } from '@/hooks/upload-image';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

interface PersonalityFormProps {
   categories: Category[];
   initialData?: Partial<PersonType>;
   onDataChange: (data: Partial<PersonType>) => void;
}

export function PersonalityForm({
   categories,
   initialData,
   onDataChange,
}: PersonalityFormProps) {
   const { uploadImage, loading: uploading } = useUploadImage();
   const [formData, setFormData] = useState<Partial<PersonType>>(
      initialData || {}
   );
   useEffect(() => {
      setFormData(initialData || {});
   }, [initialData]);

   const handleChange = (field: keyof PersonType, value: string) => {
      const newData = { ...formData, [field]: value };
      setFormData(newData);
      onDataChange(newData);
   };

   const handleDetailChange = (html: string) => {
      handleChange('detail', html);
   };

   return (
      <div className="space-y-4">
         <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
               <Label htmlFor="name">Tên Loại Tính Cách</Label>
               <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="VD: INTJ - Kiến Trúc Sư"
               />
            </div>
            <div className="space-y-2">
               <Label htmlFor="category">Danh Mục</Label>
               <Select
                  value={formData.categoryId || ''}
                  onValueChange={(value) => handleChange('categoryId', value)}
               >
                  <SelectTrigger>
                     <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                     {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                           {category.name}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>
         </div>

         <div className="space-y-2">
            <Label htmlFor="description">Mô Tả Ngắn</Label>
            <Textarea
               id="description"
               value={formData.description || ''}
               onChange={(e) => handleChange('description', e.target.value)}
               placeholder="Mô tả ngắn gọn về loại tính cách này"
               rows={3}
            />
         </div>

         <div className="space-y-2">
            <Label htmlFor="detail">Nội Dung Chi Tiết</Label>
            <TiptapEditor
               content={formData.detail || ''}
               onChange={handleDetailChange}
               placeholder="Nhập nội dung chi tiết về loại tính cách..."
            />
         </div>

         <div className="space-y-2">
            <Label htmlFor="image">Hình Ảnh</Label>

            {/* Hiển thị ảnh đã chọn nếu có */}
            {formData.image && (
               <div className="relative w-32 h-32 mb-2">
                  <Image
                     src={formData.image}
                     alt="Ảnh tính cách"
                     layout="fill"
                     objectFit="cover"
                     className="rounded-md border"
                  />
               </div>
            )}

            <Input
               type="file"
               accept="image/*"
               onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                     uploadImage({
                        file,
                        onSuccess: (url) => handleChange('image', url),
                        onError: (err) => alert('Upload thất bại: ' + err),
                     });
                  }
               }}
               disabled={uploading}
            />

            {uploading && (
               <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang tải ảnh lên...
               </div>
            )}
         </div>
      </div>
   );
}
