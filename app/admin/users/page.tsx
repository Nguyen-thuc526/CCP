import { MemberManagement } from "@/components/admin/users/user-management";


export default function UsersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Quản lý người dùng</h1>
      <MemberManagement />
    </div>
  )
}
