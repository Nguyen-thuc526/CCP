import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, CheckCheck } from "lucide-react"

export function NotificationList() {
  // Dữ liệu thông báo giả định
  const notifications = [
    {
      id: 1,
      title: "Đăng ký thành viên mới",
      message: "Trần Văn M & Trần Thị N đã đăng ký tài khoản mới",
      time: "5 phút trước",
      type: "member",
      unread: true,
    },
    {
      id: 2,
      title: "Đơn đăng ký chuyên viên tư vấn mới",
      message: "TS. Lê Thị M đã gửi đơn đăng ký làm chuyên viên tư vấn",
      time: "30 phút trước",
      type: "counselor",
      unread: true,
    },
    {
      id: 3,
      title: "Khảo sát mới hoàn thành",
      message: "Hoàng Văn G & Hoàng Thị H đã hoàn thành khảo sát MBTI",
      time: "2 giờ trước",
      type: "survey",
      unread: true,
    },
    {
      id: 4,
      title: "Đăng ký khóa học mới",
      message: "Đỗ Văn J & Đỗ Thị K đã đăng ký khóa học Giao tiếp hiệu quả trong hôn nhân",
      time: "3 giờ trước",
      type: "course",
      unread: false,
    },
    {
      id: 5,
      title: "Báo cáo hàng tuần đã sẵn sàng",
      message: "Báo cáo hoạt động hàng tuần đã được tạo và sẵn sàng để xem",
      time: "1 ngày trước",
      type: "report",
      unread: false,
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="default" className="rounded-full px-3">
            {notifications.filter((n) => n.unread).length} chưa đọc
          </Badge>
          <span className="text-sm text-muted-foreground">{notifications.length} thông báo</span>
        </div>
        <Button variant="outline" size="sm">
          <CheckCheck className="mr-2 h-4 w-4" />
          Đánh dấu tất cả đã đọc
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="unread">Chưa đọc</TabsTrigger>
          <TabsTrigger value="member">Thành viên</TabsTrigger>
          <TabsTrigger value="counselor">Chuyên viên</TabsTrigger>
          <TabsTrigger value="other">Khác</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Tất cả thông báo</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`relative p-4 hover:bg-muted/50 ${notification.unread ? "bg-muted/20" : ""}`}
                  >
                    <div className="flex items-start">
                      <div className="flex-1 pl-4">
                        <h4 className="font-medium">{notification.title}</h4>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{notification.time}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" title="Đánh dấu đã đọc">
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                    {notification.unread && (
                      <span className="absolute left-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-rose-500"></span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="unread" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông báo chưa đọc</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {notifications
                  .filter((n) => n.unread)
                  .map((notification) => (
                    <div key={notification.id} className="relative p-4 bg-muted/20 hover:bg-muted/50">
                      <div className="flex items-start">
                        <div className="flex-1 pl-4">
                          <h4 className="font-medium">{notification.title}</h4>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" title="Đánh dấu đã đọc">
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                      <span className="absolute left-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-rose-500"></span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Các tab khác tương tự */}
      </Tabs>
    </div>
  )
}
