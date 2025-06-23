import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ClientOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tổng quan khách hàng</CardTitle>
        <CardDescription>Phân tích khách hàng của bạn</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p>Biểu đồ phân tích khách hàng sẽ xuất hiện ở đây</p>
          <p className="text-sm">Hiển thị phân bố độ tuổi, vấn đề phổ biến và tiến triển</p>
        </div>
      </CardContent>
    </Card>
  )
}
