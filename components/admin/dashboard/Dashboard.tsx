'use client';
import { fetchAdminOverview } from '@/services/adminService';
import { Overview } from '@/types/dashboard';
import React, { useEffect, useState } from 'react';
import {
   Users,
   UserPlus,
   Calendar,
   TrendingUp,
   DollarSign,
   Target,
   BookOpen,
   CreditCard,
} from 'lucide-react';
import StatsCard from './StatsCard';
import MonthlyRevenueChart from './MonthlyRevenueChart';
import RevenueBreakdownChart from './RevenueBreakdownChart';
import MemberGrowthChart from './MemberGrowthChart';
import GrowthChart from './GrowthChart';
import RevenueTable from './RevenueTable';

export default function Dashboard() {
   const [dashboardData, setDashboardData] = useState<Overview[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const data = await fetchAdminOverview();
            setDashboardData(data);
         } catch (err) {
            console.error('Lỗi khi fetch dữ liệu:', err);
         } finally {
            setLoading(false);
         }
      };

      fetchData();
   }, []);

   if (loading) {
      return (
         <div className="flex justify-center items-center min-h-screen">
            <p className="text-lg text-gray-500">Đang tải dữ liệu...</p>
         </div>
      );
   }

   if (!dashboardData || dashboardData.length === 0) {
      return (
         <div className="flex justify-center items-center min-h-screen">
            <p className="text-lg text-red-500">Không có dữ liệu để hiển thị</p>
         </div>
      );
   }

   const currentMonth = dashboardData[dashboardData.length - 1] || {
      totalMembers: 0,
      newMembersThisMonth: 0,
      totalCounselors: 0,
      newCounselorsThisMonth: 0,
      bookingsThisMonth: 0,
      totalBookings: 0,
      bookingRevenue: 0,
      bookingRevenueThisMonth: 0,
      courseRevenue: 0,
      courseRevenueThisMonth: 0,
      totalCoursesPurchased: 0,
      coursesPurchasedThisMonth: 0,
      membershipRevenue: 0,
      membershipRevenueThisMonth: 0,
      totalMemberships: 0,
      membershipsThisMonth: 0,
   };

   const totalRevenue = dashboardData.reduce(
      (sum, month) =>
         sum +
         (month.bookingRevenue ?? 0) +
         (month.courseRevenue ?? 0) +
         (month.membershipRevenue ?? 0),
      0
   );

   const currentMonthRevenue =
      (currentMonth.bookingRevenueThisMonth ?? 0) +
      (currentMonth.courseRevenueThisMonth ?? 0) +
      (currentMonth.membershipRevenueThisMonth ?? 0);

   const formatCurrency = (value: number) =>
      new Intl.NumberFormat('vi-VN', {
         style: 'currency',
         currency: 'VND',
      }).format(value);

   return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
         <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
               <StatsCard
                  title="Tổng Thành Viên"
                  value={currentMonth.totalMembers}
                  change={`+${currentMonth.newMembersThisMonth} tháng này`}
                  changeType={
                     currentMonth.newMembersThisMonth > 0
                        ? 'positive'
                        : 'neutral'
                  }
                  icon={Users}
                  color="blue"
               />
               <StatsCard
                  title="Tổng Tư Vấn Viên"
                  value={currentMonth.totalCounselors}
                  change={`+${currentMonth.newCounselorsThisMonth} tháng này`}
                  changeType={
                     currentMonth.newCounselorsThisMonth > 0
                        ? 'positive'
                        : 'neutral'
                  }
                  icon={UserPlus}
                  color="green"
               />
               <StatsCard
                  title="Đặt Lịch Tháng Này"
                  value={currentMonth.bookingsThisMonth}
                  change={`${currentMonth.totalBookings} tổng cộng`}
                  changeType="neutral"
                  icon={Calendar}
                  color="purple"
               />
               <StatsCard
                  title="Doanh Thu Tháng Này"
                  value={formatCurrency(Math.round(currentMonthRevenue))}
                  // change={`${formatCurrency(Math.round(totalRevenue))} tổng`}
                  changeType="positive"
                  icon={DollarSign}
                  color="amber"
               />
            </div>

            {/* Revenue Breakdown Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="text-lg font-semibold text-gray-900">
                        Doanh Thu Đặt Lịch
                     </h3>
                     <Calendar className="h-5 w-5 text-blue-500" />
                  </div>
                  <p className="text-3xl font-bold text-blue-600 mb-2">
                     {formatCurrency(
                        Math.round(currentMonth.bookingRevenueThisMonth)
                     )}
                  </p>
                  <p className="text-sm text-gray-600">
                     {currentMonth.bookingsThisMonth} lượt đặt lịch tháng này
                  </p>
               </div>

               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="text-lg font-semibold text-gray-900">
                        Doanh Thu Khóa Học
                     </h3>
                     <BookOpen className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="text-3xl font-bold text-green-600 mb-2">
                     {formatCurrency(
                        Math.round(currentMonth.courseRevenueThisMonth)
                     )}
                  </p>
                  <p className="text-sm text-gray-600">
                     {currentMonth.coursesPurchasedThisMonth} khóa học bán ra
                  </p>
               </div>

               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="text-lg font-semibold text-gray-900">
                        Doanh Thu Thành Viên
                     </h3>
                     <CreditCard className="h-5 w-5 text-purple-500" />
                  </div>
                  <p className="text-3xl font-bold text-purple-600 mb-2">
                     {formatCurrency(
                        Math.round(currentMonth.membershipRevenueThisMonth)
                     )}
                  </p>
                  <p className="text-sm text-gray-600">
                     {currentMonth.membershipsThisMonth} gói thành viên mới
                  </p>
               </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
               {/* Monthly Revenue Chart */}
               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="text-lg font-semibold text-gray-900">
                        Doanh Thu Theo Tháng
                     </h3>
                     <DollarSign className="h-5 w-5 text-amber-500" />
                  </div>
                  <MonthlyRevenueChart data={dashboardData} />
               </div>

               {/* Revenue Breakdown Chart */}
               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="text-lg font-semibold text-gray-900">
                        Phân Tích Doanh Thu
                     </h3>
                     <Target className="h-5 w-5 text-blue-500" />
                  </div>
                  <RevenueBreakdownChart data={dashboardData} />
               </div>
            </div>

            {/* Member Growth Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="text-lg font-semibold text-gray-900">
                        Tăng Trưởng Thành Viên
                     </h3>
                     <Users className="h-5 w-5 text-blue-500" />
                  </div>
                  <MemberGrowthChart data={dashboardData} />
               </div>

               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="text-lg font-semibold text-gray-900">
                        Tổng Quan Tăng Trưởng
                     </h3>
                     <TrendingUp className="h-5 w-5 text-green-500" />
                  </div>
                  <GrowthChart data={dashboardData} />
               </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                     Chỉ Số Hiệu Suất
                  </h3>
                  <Target className="h-5 w-5 text-blue-500" />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                     <div>
                        <p className="text-sm font-medium text-blue-900">
                           Doanh Thu TB/Thành Viên
                        </p>
                        <p className="text-xl font-bold text-blue-600">
                           {formatCurrency(
                              Math.round(
                                 totalRevenue / (currentMonth.totalMembers || 1)
                              )
                           )}
                        </p>
                     </div>
                     <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                     </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                     <div>
                        <p className="text-sm font-medium text-green-900">
                           Doanh Thu TB/Đặt Lịch
                        </p>
                        <p className="text-xl font-bold text-green-600">
                           {formatCurrency(
                              Math.round(
                                 currentMonth.bookingRevenue /
                                    (currentMonth.totalBookings || 1)
                              )
                           )}
                        </p>
                     </div>
                     <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-green-600" />
                     </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                     <div>
                        <p className="text-sm font-medium text-purple-900">
                           Doanh Thu TB/Khóa Học
                        </p>
                        <p className="text-xl font-bold text-purple-600">
                           {formatCurrency(
                              Math.round(
                                 currentMonth.courseRevenue /
                                    (currentMonth.totalCoursesPurchased || 1)
                              )
                           )}
                        </p>
                     </div>
                     <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-purple-600" />
                     </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
                     <div>
                        <p className="text-sm font-medium text-amber-900">
                           Doanh Thu TB/Gói Thành Viên
                        </p>
                        <p className="text-xl font-bold text-amber-600">
                           {formatCurrency(
                              Math.round(
                                 currentMonth.membershipRevenue /
                                    (currentMonth.totalMemberships || 1)
                              )
                           )}
                        </p>
                     </div>
                     <div className="h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-amber-600" />
                     </div>
                  </div>
               </div>
            </div>

            {/* Revenue Table */}
            <RevenueTable data={dashboardData} />
         </main>
      </div>
   );
}
