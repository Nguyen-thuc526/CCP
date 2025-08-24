import { DashboardOverview } from '@/components/dashboard/dashboard-overview';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';

export default function AdminDashboardPage() {
   return (
      <div className="space-y-6">
         <h1 className="text-3xl font-bold">Tổng quan</h1>
         <DashboardStats />
         <DashboardOverview />
      </div>
   );
}
