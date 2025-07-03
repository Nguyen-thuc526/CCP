'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast, ToastType } from '@/hooks/useToast';
import { createCategory } from '@/services/categoryService';
import { useState } from 'react';

interface Props {
   onCreated: () => void;
   onClose: () => void;
   categories: { name: string }[];
}

export default function CreateCategoryForm({
   onCreated,
   onClose,
   categories,
}: Props) {
   const [name, setName] = useState('');
   const [loading, setLoading] = useState(false);
   const { showToast } = useToast();

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmedName = name.trim();

      if (trimmedName.length < 2) {
         return showToast(
            'Tên danh mục phải có ít nhất 2 ký tự',
            ToastType.Error
         );
      }

      const isDuplicate = categories.some(
         (category) =>
            category.name.trim().toLowerCase() === trimmedName.toLowerCase()
      );

      if (isDuplicate) {
         return showToast('Tên danh mục đã tồn tại', ToastType.Error);
      }

      setLoading(true);
      try {
         await createCategory(trimmedName);
         showToast('Tạo danh mục thành công', ToastType.Success);
         setName('');
         onCreated();
      } catch (error) {
         showToast('Tạo danh mục thất bại', ToastType.Error);
      } finally {
         setLoading(false);
      }
   };

   return (
      <form onSubmit={handleSubmit} className="space-y-4">
         <div>
            <label className="block text-sm mb-1">Tên danh mục</label>
            <Input
               placeholder="Nhập tên danh mục..."
               value={name}
               onChange={(e) => setName(e.target.value)}
            />
         </div>
         <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>
               Hủy
            </Button>
            <Button type="submit" disabled={loading || name.trim().length < 2}>
               {loading ? 'Đang tạo...' : 'Tạo'}
            </Button>
         </div>
      </form>
   );
}
