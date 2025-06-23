'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updateCategory } from '@/services/categoryService';
import { Category as CategoryType } from '@/types/category';
import { useToast, ToastType } from '@/hooks/useToast';
import { Label } from '@/components/ui/label';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';

interface UpdateCategoryFormProps {
   category: CategoryType;
   onUpdated: (updated: CategoryType) => void;
   onClose: () => void;
}

export default function UpdateCategoryForm({
   category,
   onUpdated,
   onClose,
}: UpdateCategoryFormProps) {
   const [name, setName] = useState(category.name);
   const [status, setStatus] = useState(category.status);
   const [loading, setLoading] = useState(false);
   const { showToast } = useToast();

   const handleSubmit = async () => {
      setLoading(true);
      try {
         const updated = { ...category, name, status };
         await updateCategory(updated);
         showToast('Cập nhật danh mục thành công', ToastType.Success);
         onUpdated(updated);
         onClose();
      } catch (error: any) {
         showToast(error.message || 'Có lỗi xảy ra', ToastType.Error);
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="space-y-4">
         <div>
            <Label htmlFor="name">Tên danh mục</Label>
            <Input
               id="name"
               value={name}
               onChange={(e) => setName(e.target.value)}
               placeholder="Tên danh mục"
            />
         </div>

         <div>
            <Label htmlFor="status-select">Trạng thái</Label>
            <Select
               value={String(status)}
               onValueChange={(value) => setStatus(Number(value))}
            >
               <SelectTrigger id="status-select" className="w-full">
                  <SelectValue placeholder="Chọn trạng thái" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="1">Hoạt động</SelectItem>
                  <SelectItem value="0">Ẩn</SelectItem>
               </SelectContent>
            </Select>
         </div>

         <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={onClose}>
               Hủy
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
               {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
         </div>
      </div>
   );
}
