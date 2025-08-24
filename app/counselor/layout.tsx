import type React from 'react';
import RoleGuard from '@/components/auth/RoleGuard';
import { Role } from '@/utils/enum';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Sidebar } from '@/components/sidebar/Sidebar';

export default function CounselorLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <RoleGuard allowed={[Role.Counselor]}>
         <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
               <DashboardHeader />
               <main className="flex-1 overflow-auto p-6">{children}</main>
            </div>
         </div>
      </RoleGuard>
   );
}
