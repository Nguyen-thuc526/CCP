import { Card, CardContent } from '@/components/ui/card';
import { Counselor } from '@/types/counselor';
import { AccountStatus } from '@/utils/enum';

interface CounselorStatsProps {
   counselors: Counselor[];
}

export default function CounselorStats({ counselors }: CounselorStatsProps) {
   const getStats = () => {
      const total = counselors.length;
      const active = counselors.filter(
         (c) => c.status === AccountStatus.Active
      ).length;
      const blocked = counselors.filter(
         (c) => c.status === AccountStatus.Block
      ).length;

      return { total, active, blocked };
   };

   const stats = getStats();

   return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <Card>
            <CardContent className="p-4">
               <div className="text-2xl font-bold">{stats.total}</div>
               <div className="text-sm text-muted-foreground">Tổng chuyên viên</div>
            </CardContent>
         </Card>
         <Card>
            <CardContent className="p-4">
               <div className="text-2xl font-bold text-green-600">{stats.active}</div>
               <div className="text-sm text-muted-foreground">Đang hoạt động</div>
            </CardContent>
         </Card>
         <Card>
            <CardContent className="p-4">
               <div className="text-2xl font-bold text-red-600">{stats.blocked}</div>
               <div className="text-sm text-muted-foreground">Đã khóa</div>
            </CardContent>
         </Card>
      </div>
   );
}
