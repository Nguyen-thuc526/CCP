import React from 'react';
import {
   ComposedChart,
   Bar,
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

interface GrowthChartProps {
   data: ChartData[];
}

export default function GrowthChart({ data }: GrowthChartProps) {
   const chartData = data.map((month, index) => ({
      month: `Tháng ${index + 1}`,
      newMembers: month.newMembersThisMonth,
      newCounselors: month.newCounselorsThisMonth,
      totalRevenue: Math.round(
         (month.bookingRevenueThisMonth +
            month.courseRevenueThisMonth +
            month.membershipRevenueThisMonth) /
            1000000
      ),
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
                     {entry.name}:{' '}
                     {entry.dataKey === 'totalRevenue'
                        ? `${entry.value}M VNĐ`
                        : entry.value}
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
            <ComposedChart
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
                  yAxisId="left"
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
               />
               <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
               />
               <Tooltip content={<CustomTooltip />} />
               <Bar
                  yAxisId="left"
                  dataKey="newMembers"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  name="Thành viên mới"
               />
               <Bar
                  yAxisId="left"
                  dataKey="newCounselors"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  name="Tư vấn viên mới"
               />
               <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="totalRevenue"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                  name="Tổng doanh thu (triệu VNĐ)"
               />
            </ComposedChart>
         </ResponsiveContainer>
      </div>
   );
}
