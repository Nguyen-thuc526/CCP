import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, Video } from "lucide-react"

export function UpcomingAppointments() {
  const appointments = [
    {
      id: 1,
      member: "Nguyễn Văn A & Nguyễn Thị B",
      date: "15/05/2025",
      time: "10:00",
      duration: "60 phút",
      type: "Cuộc gọi video",
      issue: "Kỹ năng giao tiếp",
    },
    {
      id: 2,
      member: "Lê Văn D & Lê Thị E",
      date: "15/05/2025",
      time: "14:30",
      duration: "60 phút",
      type: "Cuộc gọi video",
      issue: "Giải quyết xung đột",
    },
    {
      id: 3,
      member: "Hoàng Văn G & Hoàng Thị H",
      date: "16/05/2025",
      time: "11:15",
      duration: "90 phút",
      type: "Cuộc gọi video",
      issue: "Hướng dẫn nuôi dạy con",
    },
    {
      id: 4,
      member: "Đỗ Văn J & Đỗ Thị K",
      date: "16/05/2025",
      time: "15:45",
      duration: "60 phút",
      type: "Cuộc gọi video",
      issue: "Lập kế hoạch tài chính",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Lịch hẹn sắp tới</CardTitle>
            <CardDescription>Các buổi tư vấn đã lên lịch sắp tới</CardDescription>
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
                  <div className="flex flex-col sm:flex-row sm:gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{appointment.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{appointment.time}</span>
                    </div>
                    <span>{appointment.issue}</span>
                  </div>
                </div>
              </div>
              <Button size="sm">
                <Video className="mr-2 h-4 w-4" />
                Tham gia
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
