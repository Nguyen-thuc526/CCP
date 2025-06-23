'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Props {
  onSubmit: (name: string) => void; // ✅ truyền tên sub-category lên trên
  onClose: () => void;
}

export default function AddSubCategoryForm({ onSubmit, onClose }: Props) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!name.trim()) return;
    setLoading(true);
    onSubmit(name);
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Tên sub-category"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          Hủy
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Đang tạo...' : 'Tạo'}
        </Button>
      </div>
    </div>
  );
}
