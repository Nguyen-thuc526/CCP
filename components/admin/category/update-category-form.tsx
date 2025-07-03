import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { Category } from '@/types/category';
import { Label } from '@radix-ui/react-label';
import { Select } from '@radix-ui/react-select';
import { useState } from 'react';
interface UpdateCategoryFormProps {
   category: Category;
   onUpdated: (updates: { name: string; status: number }) => void;
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

   const handleSubmit = () => {
      setLoading(true);
      onUpdated({ name, status });
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
