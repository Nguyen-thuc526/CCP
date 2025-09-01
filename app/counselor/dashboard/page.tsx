'use client';

import { DashboardManager } from '@/components/counselor/dashboard/dashboard-manager';
export default function Page() {
   return (
      <div className="min-h-screen bg-gray-50">
         {/* App shell padding that adapts to small screens */}
         <div className="mx-auto w-full max-w-screen-xl px-3 sm:px-4 md:px-6 lg:px-8 py-6 md:py-8">
            <header className="mb-6 md:mb-8">
               <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Dashboard Tư vấn viên
               </h1>
               <p className="text-sm md:text-base text-gray-600 mt-1">
                  Tổng quan hiệu suất và thu nhập của bạn
               </p>
            </header>

            <DashboardManager />
         </div>
      </div>
   );
}
