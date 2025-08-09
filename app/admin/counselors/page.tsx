import { CounselorManagement } from '@/components/admin/counselors/counselor-management';
import React from 'react';

export default function page() {
   return (
      <div className="space-y-6">
         <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
               Quản lý chuyên viên tư vấn
            </h1>
            <p className="text-gray-600">
               Theo dõi, tìm kiếm và thay đổi trạng thái hoạt động của các
               chuyên viên tư vấn trên hệ thống.
            </p>
         </div>
         <CounselorManagement />
      </div>
   );
}
