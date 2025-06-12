import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ReportTable() {
  const reportData = [
    {
      id: 1,
      metric: "Đăng ký thành viên mới",
      current: 248,
      previous: 215,
      change: "+15.3%",
      trend: "up",
    },
    {
      id: 2,
      metric: "Chuyên viên tư vấn hoạt động",
      current: 42,
      previous: 39,
      change: "+7.7%",
      trend: "up",
    },
    {
      id: 3,
      metric: "Lịch hẹn đã hoàn thành",
      current: 324,
      previous: 298,
      change: "+8.7%",
      trend: "up",
    },
    {
      id: 4,
      metric: "Khảo sát đã hoàn thành",
      current: 856,
      previous: 912,
      change: "-6.1%",
      trend: "down",
    },
    {
      id: 5,
      metric: "Đăng ký khóa học",
      current: 189,
      previous: 156,
      change: "+21.2%",
      trend: "up",
    },
    {
      id: 6,
      metric: "Đánh giá buổi tư vấn trung bình",
      current: 4.8,
      previous: 4.7,
      change: "+2.1%",
      trend: "up",
    },
    {
      id: 7,
      metric: "Chuyển đổi thành viên Premium",
      current: 78,
      previous: 65,
      change: "+20.0%",
      trend: "up",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chỉ số chính</CardTitle>
        <CardDescription>So sánh với giai đoạn trước</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium">Chỉ số</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Giai đoạn hiện tại</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Giai đoạn trước</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Thay đổi</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle font-medium">{item.metric}</td>
                  <td className="p-4 align-middle">{item.current}</td>
                  <td className="p-4 align-middle">{item.previous}</td>
                  <td className="p-4 align-middle">
                    <Badge variant={item.trend === "up" ? "default" : "destructive"}>{item.change}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
