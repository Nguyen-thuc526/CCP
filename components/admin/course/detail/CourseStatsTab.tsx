import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Star, MessageSquare, Clock } from 'lucide-react';

interface CourseStatsTabProps {
   stats: {
      enrollments: number;
      rating: number;
      reviews: number;
      completionRate: number;
   };
}

export function CourseStatsTab({ stats }: CourseStatsTabProps) {
   return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Học viên</CardTitle>
               <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">{stats.enrollments}</div>
            </CardContent>
         </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Đánh giá</CardTitle>
               <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">{stats.rating}/5</div>
            </CardContent>
         </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Bình luận</CardTitle>
               <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">{stats.reviews}</div>
            </CardContent>
         </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">
                  Tỷ lệ hoàn thành
               </CardTitle>
               <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">{stats.completionRate}%</div>
            </CardContent>
         </Card>
      </div>
   );
}
