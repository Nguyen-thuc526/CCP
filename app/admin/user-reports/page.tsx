import { UserReportManagement } from "@/components/admin/report/user-report-management";


export default function UserReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Báo cáo từ người dùng</h1>
      <UserReportManagement />
    </div>
  )
}
