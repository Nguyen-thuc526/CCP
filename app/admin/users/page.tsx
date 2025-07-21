import { MemberManagement } from '@/components/admin/users/user-management';

export default function UsersPage() {
   return (
      <div className="space-y-6">
         <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý người dùng</h1>
            <p className="text-gray-600">
               Quản lý danh sách người dùng và trạng thái tài khoản của họ.
            </p>
         </div>
         <MemberManagement />
      </div>
   );
}
