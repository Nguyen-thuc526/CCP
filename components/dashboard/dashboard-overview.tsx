import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function DashboardOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tổng quan</CardTitle>
        <CardDescription>Hoạt động của nền tảng trong tháng hiện tại</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p>Biểu đồ trực quan sẽ xuất hiện ở đây</p>
          <p className="text-sm">Hiển thị tăng trưởng thành viên, lịch hẹn và buổi tư vấn</p>
        </div>
      </CardContent>
    </Card>
  )
}
