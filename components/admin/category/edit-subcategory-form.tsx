'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { SubCategory } from '@/types/category';

interface Props {
  subCategory: SubCategory;
  onSubmit: (updates: { name: string; status: number }) => void;
  onClose: () => void;
}

export default function EditSubCategoryForm({
  subCategory,
  onSubmit,
  onClose,
}: Props) {
  const [name, setName] = useState(subCategory.name);
  const [status, setStatus] = useState<number>(subCategory.status);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setName(subCategory.name);
    setStatus(subCategory.status);
  }, [subCategory]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    setIsSubmitting(true);
    onSubmit({ name: name.trim(), status });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Tên chủ đề</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nhập tên chủ đề con"
        />
      </div>

      <div>
        <Label>Trạng thái</Label>
        <RadioGroup
          value={status.toString()}
          onValueChange={(val) => setStatus(parseInt(val))}
          className="flex gap-4 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1" id="active" />
            <Label htmlFor="active">Hoạt động</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="0" id="inactive" />
            <Label htmlFor="inactive">Ẩn</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Hủy
        </Button>
        <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </div>
    </div>
  );
}
