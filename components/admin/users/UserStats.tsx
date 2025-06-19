import { Card, CardContent } from '@/components/ui/card';
import { User, Role, Status } from '@/types/user';

interface UserStatsProps {
   users: User[];
}

export default function UserStats({ users }: UserStatsProps) {
   const getStats = () => {
      const totalUsers = users.length;
      const activeUsers = users.filter(
         (u) => u.status === Status.Active
      ).length;
      const totalMembers = users.filter((u) => u.role === Role.Member).length;
      const totalCounselors = users.filter(
         (u) => u.role === Role.Counselor
      ).length;
      const pendingCounselors = users.filter(
         (u) => u.role === Role.Counselor && u.status === Status.Pending
      ).length;

      return {
         totalUsers,
         activeUsers,
         totalMembers,
         totalCounselors,
         pendingCounselors,
      };
   };

   const stats = getStats();

   return (
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
         <Card>
            <CardContent className="p-4">
               <div className="text-2xl font-bold">{stats.totalUsers}</div>
               <div className="text-sm text-muted-foreground">
                  Tổng người dùng
               </div>
            </CardContent>
         </Card>
         <Card>
            <CardContent className="p-4">
               <div className="text-2xl font-bold text-green-600">
                  {stats.activeUsers}
               </div>
               <div className="text-sm text-muted-foreground">
                  Đang hoạt động
               </div>
            </CardContent>
         </Card>
         <Card>
            <CardContent className="p-4">
               <div className="text-2xl font-bold text-blue-600">
                  {stats.totalMembers}
               </div>
               <div className="text-sm text-muted-foreground">Thành viên</div>
            </CardContent>
         </Card>
         <Card>
            <CardContent className="p-4">
               <div className="text-2xl font-bold text-purple-600">
                  {stats.totalCounselors}
               </div>
               <div className="text-sm text-muted-foreground">Tư vấn viên</div>
            </CardContent>
         </Card>
         <Card>
            <CardContent className="p-4">
               <div className="text-2xl font-bold text-orange-600">
                  {stats.pendingCounselors}
               </div>
               <div className="text-sm text-muted-foreground">Chờ duyệt</div>
            </CardContent>
         </Card>
      </div>
   );
}
