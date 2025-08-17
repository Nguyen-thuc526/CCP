"use client"
import { BookingStatsChart } from "@/components/counselor/dashboard/booking-stats-chart"
import { CounselorStats } from "@/components/counselor/dashboard/counselor-stats"
import { MonthlyIncomeChart } from "@/components/counselor/dashboard/monthly-income-chart"

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Tư vấn viên</h1>
          <p className="text-gray-600">Tổng quan hiệu suất và thu nhập của bạn</p>
        </div>

        <div className="space-y-8">
          {/* Basic stats overview */}
          <CounselorStats />

          {/* Charts section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <MonthlyIncomeChart />
            <BookingStatsChart />
          </div>
        </div>
      </div>
    </div>
  )
}
