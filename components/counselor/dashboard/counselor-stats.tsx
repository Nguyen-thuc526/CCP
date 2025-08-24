'use client';

import { Calendar, Heart, MessageSquare, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
   totalIncome: number;
   appointmentsThisWeek: number;
   completedSessions: number;
   averageRating: number;
};

const formatVND = (v: number) =>
   new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
   }).format(v);

export function CounselorStats({
   totalIncome,
   appointmentsThisWeek,
   completedSessions,
   averageRating,
}: Props) {
   return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">
                  Tổng thu nhập
               </CardTitle>
               <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold text-green-600">
                  {formatVND(totalIncome)}
               </div>
            </CardContent>
         </Card>

         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">
                  Lịch hẹn tuần này
               </CardTitle>
               <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">{appointmentsThisWeek}</div>
               <p className="text-xs text-muted-foreground">
                  Trong 7 ngày gần nhất
               </p>
            </CardContent>
         </Card>

         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">
                  Buổi tư vấn đã hoàn thành
               </CardTitle>
               <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">{completedSessions}</div>
               <p className="text-xs text-muted-foreground">Tổng tích lũy</p>
            </CardContent>
         </Card>

         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">
                  Đánh giá trung bình
               </CardTitle>
               <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">
                  {averageRating.toFixed(1)}/5
               </div>
               <p className="text-xs text-muted-foreground">Trung bình cộng</p>
            </CardContent>
         </Card>
      </div>
   );
}
