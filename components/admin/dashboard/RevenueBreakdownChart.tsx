import React from 'react';
import {
   PieChart,
   Pie,
   Cell,
   ResponsiveContainer,
   Tooltip,
   Legend,
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

interface RevenueBreakdownChartProps {
   data: ChartData[];
}

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'];

export default function RevenueBreakdownChart({
   data,
}: RevenueBreakdownChartProps) {
   const currentMonth = data[data.length - 1];

   const pieData = [
      {
         name: 'Đặt Lịch',
         value: Math.round(currentMonth.bookingRevenueThisMonth),
         color: '#3b82f6',
      },
      {
         name: 'Khóa Học',
         value: Math.round(currentMonth.courseRevenueThisMonth),
         color: '#10b981',
      },
      {
         name: 'Thành Viên VIP',
         value: Math.round(currentMonth.membershipRevenueThisMonth),
         color: '#8b5cf6',
      },
   ].filter((item) => item.value > 0);

   const CustomTooltip = ({ active, payload }: any) => {
      if (active && payload && payload.length) {
         const data = payload[0];
         return (
            <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
               <p className="font-medium text-gray-900">{data.name}</p>
               <p style={{ color: data.payload.color }} className="text-sm">
                  Doanh thu: {data.value.toLocaleString()} VNĐ
               </p>
               <p className="text-xs text-gray-500">
                  {(
                     (data.value /
                        pieData.reduce((sum, item) => sum + item.value, 0)) *
                     100
                  ).toFixed(1)}
                  % tổng doanh thu
               </p>
            </div>
         );
      }
      return null;
   };

   const renderCustomLabel = ({
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      percent,
   }: any) => {
      if (percent < 0.05) return null; // Don't show label if less than 5%

      const RADIAN = Math.PI / 180;
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);

      return (
         <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
            className="text-sm font-medium"
         >
            {`${(percent * 100).toFixed(0)}%`}
         </text>
      );
   };

   if (pieData.length === 0) {
      return (
         <div className="h-80 flex items-center justify-center">
            <p className="text-gray-500">
               Không có dữ liệu doanh thu cho tháng này
            </p>
         </div>
      );
   }

   return (
      <div className="h-80">
         <ResponsiveContainer width="100%" height="100%">
            <PieChart>
               <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
               >
                  {pieData.map((entry, index) => (
                     <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                     />
                  ))}
               </Pie>
               <Tooltip content={<CustomTooltip />} />
               <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value, entry) => (
                     <span style={{ color: entry.color }}>{value}</span>
                  )}
               />
            </PieChart>
         </ResponsiveContainer>
      </div>
   );
}
