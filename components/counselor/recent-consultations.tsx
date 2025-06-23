import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function RecentConsultations() {
  const consultations = [
    {
      id: 1,
      member: "Nguyễn Văn A & Nguyễn Thị B",
      date: "14/05/2025",
      issue: "Kỹ năng giao tiếp",
      progress: "Đang cải thiện",
    },
    {
      id: 2,
      member: "Lê Văn D & Lê Thị E",
      date: "13/05/2025",
      issue: "Giải quyết xung đột",
      progress: "Đang cải thiện",
    },
    {
      id: 3,
      member: "Hoàng Văn G & Hoàng Thị H",
      date: "09/05/2025",
      issue: "Hướng dẫn nuôi dạy con",
      progress: "Ổn định",
    },
    {
      id: 4,
      member: "Đỗ Văn J & Đỗ Thị K",
      date: "07/05/2025",
      issue: "Lập kế hoạch tài chính",
      progress: "Cần chú ý",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tư vấn gần đây</CardTitle>
        <CardDescription>Các buổi tư vấn gần đây nhất của bạn</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {consultations.map((consultation) => (
            <div key={consultation.id} className="flex items-start justify-between">
              <div>
                <p className="font-medium">{consultation.member}</p>
                <p className="text-sm text-muted-foreground">
                  {consultation.date} • {consultation.issue}
                </p>
              </div>
              <Badge
                variant={
                  consultation.progress === "Đang cải thiện"
                    ? "default"
                    : consultation.progress === "Ổn định"
                      ? "secondary"
                      : "destructive"
                }
              >
                {consultation.progress}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
