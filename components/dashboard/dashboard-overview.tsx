'use client';

import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import {
   LineChart,
   Line,
   CartesianGrid,
   XAxis,
   YAxis,
   Tooltip,
   Legend,
   ResponsiveContainer,
} from 'recharts';

const fakeData = [
   { week: 'Tuần 1', members: 200, appointments: 50, consultations: 40 },
   { week: 'Tuần 2', members: 250, appointments: 65, consultations: 55 },
   { week: 'Tuần 3', members: 280, appointments: 70, consultations: 60 },
   { week: 'Tuần 4', members: 310, appointments: 90, consultations: 75 },
];

export function DashboardOverview() {
   return (
      <Card>
         <CardHeader>
            <CardTitle>Tổng quan</CardTitle>
            <CardDescription>
               Hoạt động của nền tảng trong tháng hiện tại
            </CardDescription>
         </CardHeader>
         <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
               <LineChart
                  data={fakeData}
                  margin={{ top: 20, right: 20, bottom: 0, left: 0 }}
               >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                     type="monotone"
                     dataKey="members"
                     stroke="#4f46e5"
                     strokeWidth={2}
                     name="Thành viên"
                  />
                  <Line
                     type="monotone"
                     dataKey="appointments"
                     stroke="#22c55e"
                     strokeWidth={2}
                     name="Lịch hẹn"
                  />
                  <Line
                     type="monotone"
                     dataKey="consultations"
                     stroke="#f97316"
                     strokeWidth={2}
                     name="Buổi tư vấn"
                  />
               </LineChart>
            </ResponsiveContainer>
         </CardContent>
      </Card>
   );
}
