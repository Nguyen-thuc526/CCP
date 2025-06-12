import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Edit, FileText } from "lucide-react"
import Link from "next/link"

export function ConsultationList() {
  const consultations = [
    {
      id: 1,
      member: "Nguyễn Văn A & Nguyễn Thị B",
      date: "14/05/2025",
      issue: "Kỹ năng giao tiếp",
      progress: "Đang cải thiện",
      notes: true,
      followUp: "21/05/2025",
    },
    {
      id: 2,
      member: "Lê Văn D & Lê Thị E",
      date: "13/05/2025",
      issue: "Giải quyết xung đột",
      progress: "Đang cải thiện",
      notes: true,
      followUp: "20/05/2025",
    },
    {
      id: 3,
      member: "Hoàng Văn G & Hoàng Thị H",
      date: "09/05/2025",
      issue: "Hướng dẫn nuôi dạy con",
      progress: "Ổn định",
      notes: true,
      followUp: "16/05/2025",
    },
    {
      id: 4,
      member: "Đỗ Văn J & Đỗ Thị K",
      date: "07/05/2025",
      issue: "Lập kế hoạch tài chính",
      progress: "Cần chú ý",
      notes: true,
      followUp: "14/05/2025",
    },
    {
      id: 5,
      member: "Trần Văn M & Trần Thị N",
      date: "02/05/2025",
      issue: "Xây dựng lòng tin",
      progress: "Đang cải thiện",
      notes: true,
      followUp: "16/05/2025",
    },
  ]

  return (
    <Card>
      <CardContent className="p-0">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium">Thành viên</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Ngày buổi tư vấn</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Vấn đề</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Tiến triển</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Buổi tiếp theo</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {consultations.map((consultation) => (
                <tr
                  key={consultation.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={consultation.member} />
                        <AvatarFallback>
                          {consultation.member.split(" ")[0][0]}
                          {consultation.member.split(" ")[3][0]}
                        </AvatarFallback>
                      </Avatar>
                      {consultation.member}
                    </div>
                  </td>
                  <td className="p-4 align-middle">{consultation.date}</td>
                  <td className="p-4 align-middle">{consultation.issue}</td>
                  <td className="p-4 align-middle">
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
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{consultation.followUp}</span>
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex gap-2">
                      <Link href={`/counselor/consultations/${consultation.id}`}>
                        <Button size="sm" variant="outline">
                          <FileText className="mr-2 h-4 w-4" />
                          Xem
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline">
                        <Edit className="mr-2 h-4 w-4" />
                        Sửa
                      </Button>
                    </div>
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
