import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentAppointments() {
  const appointments = [
    {
      id: 1,
      member: "Nguyễn Văn A & Nguyễn Thị B",
      counselor: "TS. Trần Văn C",
      date: "15/05/2025",
      time: "10:00",
      status: "Sắp tới",
      type: "Kỹ năng giao tiếp",
    },
    {
      id: 2,
      member: "Lê Văn D & Lê Thị E",
      counselor: "TS. Phạm Văn F",
      date: "15/05/2025",
      time: "14:30",
      status: "Sắp tới",
      type: "Giải quyết xung đột",
    },
    {
      id: 3,
      member: "Hoàng Văn G & Hoàng Thị H",
      counselor: "TS. Ngô Thị I",
      date: "16/05/2025",
      time: "11:15",
      status: "Đã lên lịch",
      type: "Hướng dẫn nuôi dạy con",
    },
    {
      id: 4,
      member: "Đỗ Văn J & Đỗ Thị K",
      counselor: "TS. Vũ Văn L",
      date: "16/05/2025",
      time: "15:45",
      status: "Đã lên lịch",
      type: "Lập kế hoạch tài chính",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Lịch hẹn gần đây</CardTitle>
            <CardDescription>Các buổi tư vấn đã lên lịch gần đây</CardDescription>
          </div>
          <Button variant="outline">Xem tất cả</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={appointment.member} />
                  <AvatarFallback>
                    {appointment.member.split(" ")[0][0]}
                    {appointment.member.split(" ")[3][0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{appointment.member}</p>
                  <p className="text-sm text-muted-foreground">
                    {appointment.date} • {appointment.time} • {appointment.type}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium">{appointment.counselor}</p>
                </div>
                <Badge variant={appointment.status === "Sắp tới" ? "default" : "secondary"}>{appointment.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
