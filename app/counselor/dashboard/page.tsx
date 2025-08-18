"use client";

import { DashboardManager } from "@/components/counselor/dashboard/dashboard-manager";


export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Tư vấn viên
          </h1>
          <p className="text-gray-600">
            Tổng quan hiệu suất và thu nhập của bạn
          </p>
        </div>

        {/* Dashboard manager */}
        <DashboardManager/>
      </div>
    </div>
  );
}
