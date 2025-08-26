"use client";

import { useEffect, useRef, useState } from "react";
import { userService } from "@/services/userService";
import type { MyDashboardData } from "@/types/user";
import { CounselorStats } from "@/components/counselor/dashboard/counselor-stats";
import { MonthlyIncomeChart } from "@/components/counselor/dashboard/monthly-income-chart";
import { BookingStatsChart } from "@/components/counselor/dashboard/booking-stats-chart";
import { Skeleton } from "@/components/ui/skeleton";

function DashboardSkeleton() {
  return (
    <div className="space-y-8" role="status" aria-label="Đang tải dashboard">
      {/* Skeleton cho phần stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>

      {/* Skeleton cho phần charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function DashboardManager() {
  const [data, setData] = useState<MyDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Dùng ref để tránh setState sau khi unmount
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    (async () => {
      try {
        const res = await userService.getMyDashboard();
        if (!mountedRef.current) return;

        if (res.success) setData(res.data);
        else setErr(res.error ?? "Không thể tải dashboard");
      } catch (e) {
        if (mountedRef.current) setErr("Có lỗi khi gọi API dashboard");
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    })();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
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
