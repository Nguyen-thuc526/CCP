import React from 'react';
import {
   LineChart,
   Line,
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

interface MemberGrowthChartProps {
   data: ChartData[];
}

export default function MemberGrowthChart({ data }: MemberGrowthChartProps) {
   const chartData = data.map((month, index) => ({
      month: `Tháng ${index + 1}`,
      newMembers: month.newMembersThisMonth,
      newCounselors: month.newCounselorsThisMonth,
      bookingsThisMonth: month.bookingsThisMonth,
      coursesThisMonth: month.coursesPurchasedThisMonth,
   }));

   const CustomTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
         return (
            <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
               <p className="font-medium text-gray-900 mb-2">{label}</p>
               {payload.map((entry: any, index: number) => (
                  <p
                     key={index}
                     style={{ color: entry.color }}
                     className="text-sm"
                  >
                     {entry.name}: {entry.value}
                  </p>
               ))}
            </div>
         );
      }
      return null;
   };

   return (
      <div className="h-80">
         <ResponsiveContainer width="100%" height="100%">
            <LineChart
               data={chartData}
               margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
               <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
               <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
               />
               <YAxis
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
               />
               <Tooltip content={<CustomTooltip />} />
               <Line
                  type="monotone"
                  dataKey="newMembers"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                  name="Thành viên mới"
               />
               <Line
                  type="monotone"
                  dataKey="newCounselors"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 5 }}
                  name="Tư vấn viên mới"
               />
               <Line
                  type="monotone"
                  dataKey="bookingsThisMonth"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 5 }}
                  name="Đặt lịch trong tháng"
               />
               <Line
                  type="monotone"
                  dataKey="coursesThisMonth"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 5 }}
                  name="Khóa học bán ra"
               />
            </LineChart>
         </ResponsiveContainer>
      </div>
   );
}
