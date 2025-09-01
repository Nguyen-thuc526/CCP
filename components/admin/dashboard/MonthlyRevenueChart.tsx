import React from 'react';
import {
   AreaChart,
   Area,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   ResponsiveContainer,
} from 'recharts';

interface ChartData {
   totalMembers: number;
   newMembersThisMonth: number;
   totalCounselors: number;
   newCounselorsThisMonth: number;
   totalBookings: number;
   bookingsThisMonth: number;
   bookingRevenue: number;
   bookingRevenueThisMonth: number;
   totalCoursesPurchased: number;
   coursesPurchasedThisMonth: number;
   courseRevenue: number;
   courseRevenueThisMonth: number;
   totalMemberships: number;
   membershipsThisMonth: number;
   membershipRevenue: number;
   membershipRevenueThisMonth: number;
}

interface MonthlyRevenueChartProps {
   data: ChartData[];
}

export default function MonthlyRevenueChart({
   data,
}: MonthlyRevenueChartProps) {
   const chartData = data.map((month, index) => ({
      month: `Tháng ${index + 1}`,
      bookingRevenue: Math.round(month.bookingRevenueThisMonth),
      courseRevenue: Math.round(month.courseRevenueThisMonth),
      membershipRevenue: Math.round(month.membershipRevenueThisMonth),
      totalRevenue: Math.round(
         month.bookingRevenueThisMonth +
            month.courseRevenueThisMonth +
            month.membershipRevenueThisMonth
      ),
   }));

   const CustomTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
         return (
            <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
               <p className="font-medium text-gray-900 mb-2">{label}</p>
               <div className="space-y-1">
                  <p className="text-blue-600 text-sm">
                     Đặt lịch:{' '}
                     {payload
                        .find((p: any) => p.dataKey === 'bookingRevenue')
                        ?.value.toLocaleString()}{' '}
                     VNĐ
                  </p>
                  <p className="text-green-600 text-sm">
                     Khóa học:{' '}
                     {payload
                        .find((p: any) => p.dataKey === 'courseRevenue')
                        ?.value.toLocaleString()}{' '}
                     VNĐ
                  </p>
                  <p className="text-purple-600 text-sm">
                     Thành viên VIP:{' '}
                     {payload
                        .find((p: any) => p.dataKey === 'membershipRevenue')
                        ?.value.toLocaleString()}{' '}
                     VNĐ
                  </p>
                  <hr className="my-1" />
                  <p className="text-gray-900 text-sm font-semibold">
                     Tổng:{' '}
                     {payload
                        .find((p: any) => p.dataKey === 'totalRevenue')
                        ?.value.toLocaleString()}{' '}
                     VNĐ
                  </p>
               </div>
            </div>
         );
      }
      return null;
   };

   return (
      <div className="h-80">
         <ResponsiveContainer width="100%" height="100%">
            <AreaChart
               data={chartData}
               margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
               <defs>
                  <linearGradient id="colorBooking" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                     <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorCourse" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                     <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient
                     id="colorMembership"
                     x1="0"
                     y1="0"
                     x2="0"
                     y2="1"
                  >
                     <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                     <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                  </linearGradient>
               </defs>
               <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
               <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
               />
               <YAxis
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
               />
               <Tooltip content={<CustomTooltip />} />
               <Area
                  type="monotone"
                  dataKey="membershipRevenue"
                  stackId="1"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorMembership)"
               />
               <Area
                  type="monotone"
                  dataKey="courseRevenue"
                  stackId="1"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCourse)"
               />
               <Area
                  type="monotone"
                  dataKey="bookingRevenue"
                  stackId="1"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorBooking)"
               />
            </AreaChart>
         </ResponsiveContainer>
      </div>
   );
}
