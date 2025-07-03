import { MembershipManagement } from '@/components/admin/membership/membership-management';
import React from 'react';

export default function page() {
   return (
      <div className="space-y-6">
         <h1 className="text-3xl font-bold">Quản lý Membership</h1>
         <MembershipManagement />
      </div>
   );
}
