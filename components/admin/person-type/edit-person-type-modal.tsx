'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog';
import { PersonType } from '@/types/person-type';
import { Category } from '@/types/category';
import { PersonalityForm } from './person-type-form';

interface EditPersonalityModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSubmit: (data: Partial<PersonType>) => Promise<boolean>;
   categories: Category[];
   personType: PersonType | null;
}

export function EditPersonalityModal({
   isOpen,
   onClose,
   onSubmit,
   categories,
   personType,
}: EditPersonalityModalProps) {
   const [formData, setFormData] = useState<Partial<PersonType>>({});
   const [isSubmitting, setIsSubmitting] = useState(false);
   useEffect(() => {
      if (personType) {
         setFormData(personType);
      }
   }, [personType]);

   const handleSubmit = async () => {
      // Validation
      if (!formData.description?.trim()) {
         alert('Vui lòng nhập mô tả');
         return;
      }

      setIsSubmitting(true);
      const success = await onSubmit(formData);
      setIsSubmitting(false);

      if (success) {
         setFormData({});
      }
   };

   const handleClose = () => {
      setFormData({});
      onClose();
   };

   return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
         <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
               <DialogTitle>Chỉnh Sửa Loại Tính Cách</DialogTitle>
               <DialogDescription>
                  Cập nhật thông tin chi tiết của loại tính cách này.
               </DialogDescription>
            </DialogHeader>

            <PersonalityForm
               categories={categories}
               initialData={formData}
               onDataChange={setFormData}
            />

            <div className="flex justify-end space-x-2 pt-4">
               <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
               >
                  Hủy
               </Button>
               <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? 'Đang lưu...' : 'Lưu Thay Đổi'}
               </Button>
            </div>
         </DialogContent>
      </Dialog>
   );
}
