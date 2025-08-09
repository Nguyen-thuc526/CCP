import {
   Calendar,
   Heart,
   MessageSquare,
   Users,
   BookOpen,
   Package,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function DashboardStats() {
   return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
         {/* Tổng thành viên */}
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">
                  Tổng thành viên
               </CardTitle>
               <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">1.248</div>
               <p className="text-xs text-muted-foreground">
                  +12% so với tháng trước
               </p>
            </CardContent>
         </Card>

         {/* Chuyên viên tư vấn */}
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">
                  Chuyên viên tư vấn
               </CardTitle>
               <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">42</div>
               <p className="text-xs text-muted-foreground">
                  +3 mới trong tháng này
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
               <div className="text-2xl font-bold">324</div>
               <p className="text-xs text-muted-foreground">
                  +18% so với tuần trước
               </p>
            </CardContent>
         </Card>

         {/* Buổi tư vấn */}
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">
                  Buổi tư vấn
               </CardTitle>
               <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">289</div>
               <p className="text-xs text-muted-foreground">
                  +7% so với tuần trước
               </p>
            </CardContent>
         </Card>

         {/* Khóa học */}
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Khóa học</CardTitle>
               <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">48</div>
               <p className="text-xs text-muted-foreground">
                  +5% so với tháng trước
               </p>
            </CardContent>
         </Card>

         {/* Gói đã đăng ký */}
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">
                  Gói đã đăng ký
               </CardTitle>
               <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">28</div>
               <p className="text-xs text-muted-foreground">
                  +2% so với tháng trước
               </p>
            </CardContent>
         </Card>
      </div>
   );
}
