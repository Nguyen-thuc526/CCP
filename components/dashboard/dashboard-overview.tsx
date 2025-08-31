'use client';

import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import {
   BarChart,
   Bar,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   Legend,
   ResponsiveContainer,
} from 'recharts';
import { useEffect, useState } from 'react';
import { fetchAdminOverview } from '@/services/adminService';
import { Overview } from '@/types/dashboard';

export function DashboardOverview() {
   const [overview, setOverview] = useState<Overview | null>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const load = async () => {
         try {
            const result = await fetchAdminOverview();
            setOverview(result);
         } catch (err) {
            console.error('Lỗi khi tải dữ liệu tổng quan:', err);
         } finally {
            setLoading(false);
         }
      };

      load();
   }, []);

   // Nếu chưa có dữ liệu
   if (loading) return <div>Đang tải biểu đồ...</div>;
   if (!overview) return <div>Không có dữ liệu để hiển thị</div>;

   const chartData = [
      {
         name: 'Thành viên',
         Tổng: overview?.totalMembers ?? 0,
         'Trong tháng': overview?.newMembersThisMonth ?? 0,
      },
      {
         name: 'Tư vấn viên',
         Tổng: overview?.totalCounselors ?? 0,
         'Trong tháng': overview?.newCounselorsThisMonth ?? 0,
      },
      {
         name: 'Lịch hẹn',
         Tổng: overview?.totalBookings ?? 0,
         'Trong tháng': overview?.bookingsThisMonth ?? 0,
      },
      {
         name: 'Khóa học',
         Tổng: overview?.totalCoursesPurchased ?? 0,
         'Trong tháng': overview?.coursesPurchasedThisMonth ?? 0,
      },
      {
         name: 'Gói',
         Tổng: overview?.totalMemberships ?? 0,
         'Trong tháng': overview?.membershipsThisMonth ?? 0,
      },
   ];

   return (
      <Card>
         <CardHeader>
            <CardTitle>Tổng quan</CardTitle>
            <CardDescription>
               So sánh tổng và số lượng trong tháng hiện tại
            </CardDescription>
         </CardHeader>
         <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Tổng" fill="#6366f1" />
                  <Bar dataKey="Trong tháng" fill="#22c55e" />
               </BarChart>
            </ResponsiveContainer>
         </CardContent>
      </Card>
   );
}
