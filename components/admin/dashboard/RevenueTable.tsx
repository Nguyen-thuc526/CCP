import React from 'react';
import {
   TrendingUp,
   TrendingDown,
   Calendar,
   BookOpen,
   CreditCard,
} from 'lucide-react';

interface RevenueData {
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

interface RevenueTableProps {
   data: RevenueData[];
}

export default function RevenueTable({ data }: RevenueTableProps) {
   const formatCurrency = (value: number) =>
      new Intl.NumberFormat('vi-VN', {
         style: 'currency',
         currency: 'VND',
      }).format(value);

   const generateMonthLabels = (count: number): string[] => {
      const now = new Date();
      const labels: string[] = [];

      for (let i = count - 1; i >= 0; i--) {
         const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
         const label = `Tháng ${date.getMonth() + 1}/${date.getFullYear()}`;
         labels.push(label);
      }

      return labels;
   };

   const monthLabels = generateMonthLabels(data.length);

   const calculateGrowth = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
   };

   return (
      <div className="overflow-x-auto">
         <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
               <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Tháng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Đặt Lịch
                     </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        Khóa Học
                     </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     <div className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-1" />
                        Thành Viên VIP
                     </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Tổng Doanh Thu
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Tăng Trưởng
                  </th> */}
               </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
               {data.map((month, index) => {
                  const currentTotalRevenue =
                     month.bookingRevenueThisMonth +
                     month.courseRevenueThisMonth +
                     month.membershipRevenueThisMonth;

                  const prevTotalRevenue =
                     index > 0
                        ? data[index - 1].bookingRevenueThisMonth +
                          data[index - 1].courseRevenueThisMonth +
                          data[index - 1].membershipRevenueThisMonth
                        : currentTotalRevenue;

                  const growth =
                     index > 0
                        ? calculateGrowth(currentTotalRevenue, prevTotalRevenue)
                        : 0;

                  return (
                     <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors duration-150"
                     >
                        <td className="px-6 py-4 whitespace-nowrap">
                           <div className="flex items-center">
                              <div>
                                 <div className="text-sm font-medium text-gray-900">
                                    {monthLabels[index]}
                                 </div>
                                 <div className="text-sm text-gray-500">
                                    Q
                                    {Math.floor(
                                       (new Date().getMonth() + 1) / 3 + 1
                                    )}{' '}
                                    {new Date().getFullYear()}
                                 </div>
                              </div>
                           </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                           <div>
                              <div className="text-sm font-semibold text-blue-600">
                                 {formatCurrency(month.bookingRevenueThisMonth)}
                              </div>
                              <div className="text-xs text-gray-500">
                                 {month.bookingsThisMonth} lượt đặt
                              </div>
                           </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                           <div>
                              <div className="text-sm font-semibold text-green-600">
                                 {formatCurrency(month.courseRevenueThisMonth)}
                              </div>
                              <div className="text-xs text-gray-500">
                                 {month.coursesPurchasedThisMonth} khóa học
                              </div>
                           </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                           <div>
                              <div className="text-sm font-semibold text-purple-600">
                                 {formatCurrency(
                                    month.membershipRevenueThisMonth
                                 )}
                              </div>
                              <div className="text-xs text-gray-500">
                                 {month.membershipsThisMonth} gói VIP
                              </div>
                           </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                           <div className="text-sm font-bold text-gray-900">
                              {formatCurrency(currentTotalRevenue)}
                           </div>
                        </td>

                        {/* <td className="px-6 py-4 whitespace-nowrap">
                           {index > 0 ? (
                              <div className="flex items-center">
                                 {growth >= 0 ? (
                                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                                 ) : (
                                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                                 )}
                                 <span
                                    className={`text-sm font-medium ${
                                       growth >= 0
                                          ? 'text-green-600'
                                          : 'text-red-600'
                                    }`}
                                 >
                                    {growth >= 0 ? '+' : ''}
                                    {growth.toFixed(1)}%
                                 </span>
                              </div>
                           ) : (
                              <span className="text-sm text-gray-500">-</span>
                           )}
                        </td> */}
                     </tr>
                  );
               })}
            </tbody>
         </table>
      </div>
   );
}
