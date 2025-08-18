"use client";

import { useEffect, useState } from "react";
import { userService } from "@/services/userService";
import type { MyDashboardData } from "@/types/user";
import { CounselorStats } from "@/components/counselor/dashboard/counselor-stats";
import { MonthlyIncomeChart } from "@/components/counselor/dashboard/monthly-income-chart";
import { BookingStatsChart } from "@/components/counselor/dashboard/booking-stats-chart";

export function DashboardManager() {
  const [data, setData] = useState<MyDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await userService.getMyDashboard();
        if (mounted) {
          if (res.success) setData(res.data);
          else setErr(res.error ?? "Không thể tải dashboard");
        }
      } catch (e) {
        if (mounted) setErr("Có lỗi khi gọi API dashboard");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <div className="space-y-8">Đang tải dashboard…</div>;
  }

  if (err || !data) {
    return (
      <div className="space-y-8">
        <p className="text-red-600 text-sm">{err ?? "Không có dữ liệu."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Basic stats overview */}
      <CounselorStats
        totalIncome={data.totalIncome}
        appointmentsThisWeek={data.appointmentsThisWeek}
        completedSessions={data.completedSessions}
        averageRating={data.averageRating}
      />

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <MonthlyIncomeChart data={data.monthlyIncome} />
        <BookingStatsChart data={data.weeklyAppointments} />
      </div>
    </div>
  );
}
