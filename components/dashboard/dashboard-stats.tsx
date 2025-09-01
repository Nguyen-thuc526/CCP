'use client';

import {
   Calendar,
   Heart,
   MessageSquare,
   Users,
   BookOpen,
   Package,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchAdminOverview } from '@/services/adminService';
import { Overview } from '@/types/dashboard';

export function DashboardStats() {
   const [overview, setOverview] = useState<Overview | null>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const loadData = async () => {
         try {
            const data = await fetchAdminOverview();
            setOverview(data);
         } catch (error) {
            console.error('Lỗi khi lấy dữ liệu dashboard:', error);
         } finally {
            setLoading(false);
         }
      };

      loadData();
   }, []);

   if (loading) return <div>Đang tải dữ liệu...</div>;
   if (!overview) return <div>Không có dữ liệu để hiển thị.</div>;

   return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
         {/* Tổng thành viên */}
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Tổng thành viên</CardTitle>
               <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">{overview.totalMembers ?? 0}</div>
               <p className="text-xs text-muted-foreground">
                  +{overview.newMembersThisMonth ?? 0} trong tháng này
               </p>
            </CardContent>
         </Card>

         {/* Chuyên viên tư vấn */}
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Chuyên viên tư vấn</CardTitle>
               <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">{overview.totalCounselors ?? 0}</div>
               <p className="text-xs text-muted-foreground">
                  +{overview.newCounselorsThisMonth ?? 0} mới trong tháng này
               </p>
            </CardContent>
         </Card>

         {/* Lịch hẹn */}
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Lịch hẹn</CardTitle>
               <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">{overview.totalBookings ?? 0}</div>
               <p className="text-xs text-muted-foreground">
                  +{overview.bookingsThisMonth ?? 0} trong tháng này
               </p>
            </CardContent>
         </Card>

         {/* Buổi tư vấn */}
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Buổi tư vấn</CardTitle>
               <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">{overview.bookingsThisMonth ?? 0}</div>
               <p className="text-xs text-muted-foreground">Trong tháng này</p>
            </CardContent>
         </Card>

         {/* Khóa học */}
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Khóa học</CardTitle>
               <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">{overview.totalCoursesPurchased ?? 0}</div>
               <p className="text-xs text-muted-foreground">
                  +{overview.coursesPurchasedThisMonth ?? 0} trong tháng này
               </p>
            </CardContent>
         </Card>

         {/* Gói đã đăng ký */}
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Gói đã đăng ký</CardTitle>
               <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">{overview.totalMemberships ?? 0}</div>
               <p className="text-xs text-muted-foreground">
                  +{overview.membershipsThisMonth ?? 0} trong tháng này
               </p>
            </CardContent>
         </Card>
      </div>
   );
}
