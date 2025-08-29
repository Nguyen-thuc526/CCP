'use client';

import { useEffect, useRef, useState } from 'react';
import { userService } from '@/services/userService';
import type { MyDashboardData } from '@/types/user';
import { CounselorStats } from '@/components/counselor/dashboard/counselor-stats';
import { MonthlyIncomeChart } from '@/components/counselor/dashboard/monthly-income-chart';
import { BookingStatsChart } from '@/components/counselor/dashboard/booking-stats-chart';
import { Skeleton } from '@/components/ui/skeleton';

function DashboardSkeleton() {
  return (
    <div className="space-y-6 md:space-y-8" role="status" aria-label="Đang tải dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-2xl" />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Skeleton className="h-[260px] sm:h-[300px] rounded-2xl" />
        <Skeleton className="h-[260px] sm:h-[300px] rounded-2xl" />
      </div>
    </div>
  );
}

export function DashboardManager() {
  const [data, setData] = useState<MyDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    (async () => {
      try {
        const res = await userService.getMyDashboard();
        if (!mountedRef.current) return;
        if (res.success) setData(res.data);
        else setErr(res.error ?? 'Không thể tải dashboard');
      } catch (e) {
        if (mountedRef.current) setErr('Có lỗi khi gọi API dashboard');
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    })();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  if (loading) return <DashboardSkeleton />;
  if (err || !data) return <p className="text-red-600 text-sm">{err ?? 'Không có dữ liệu.'}</p>;

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Stats: 1 col → 2 col (sm) → 4 col (lg) */}
      <CounselorStats
        totalIncome={data.totalIncome}
        appointmentsThisWeek={data.appointmentsThisWeek}
        completedSessions={data.completedSessions}
        averageRating={data.averageRating}
      />

      {/* Charts grid: đảm bảo các card không bị quá hẹp */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <MonthlyIncomeChart data={data.monthlyIncome} />
        <BookingStatsChart data={data.weeklyAppointments} />
      </div>
    </div>
  );
}
