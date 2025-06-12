import { ReportCharts } from "@/components/admin/adminreport/report-charts"
import { ReportFilters } from "@/components/admin/adminreport/report-filters"
import { ReportTable } from "@/components/admin/adminreport/report-table"

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Báo cáo & Phân tích</h1>
      {/* <ReportFilters />
      <ReportCharts /> */}
      <ReportTable />
    </div>
  )
}
