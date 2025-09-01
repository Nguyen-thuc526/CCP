import Dashboard from '@/components/admin/dashboard/Dashboard';

export default function AdminDashboardPage() {
   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Tổng quan
               </h1>
               <p className="text-gray-600">Trang tổng quan cung cấp cái nhìn toàn diện về hiệu suất hệ thống – bao gồm doanh thu, tăng trưởng thành viên, hoạt động đặt lịch và khóa học.</p>
            </div>
         </div>
         <Dashboard />
      </div>
   );
}
