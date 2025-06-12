"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScheduleCalendar } from "../ui/schedule-calendar"


export function CounselorProfileForm() {
  return (
    <Tabs defaultValue="general">
      <TabsList className="mb-4">
        <TabsTrigger value="general">Thông tin chung</TabsTrigger>
        <TabsTrigger value="expertise">Chuyên môn & Bằng cấp</TabsTrigger>
        <TabsTrigger value="schedule">Lịch rảnh</TabsTrigger>
        <TabsTrigger value="payment">Cài đặt thanh toán</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin chung</CardTitle>
            <CardDescription>Cập nhật thông tin cá nhân và liên hệ của bạn</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Hồ sơ" />
                <AvatarFallback>TV</AvatarFallback>
              </Avatar>
              <Button variant="outline">Thay đổi ảnh</Button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first-name">Họ</Label>
                <Input id="first-name" defaultValue="Trần" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Tên</Label>
                <Input id="last-name" defaultValue="Văn C" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="tranvanc@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Điện thoại</Label>
                <Input id="phone" type="tel" defaultValue="0987654321" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bio">Tiểu sử chuyên môn</Label>
                <Textarea
                  id="bio"
                  defaultValue="TS. Trần Văn C là chuyên viên tư vấn hôn nhân được cấp phép với hơn 10 năm kinh nghiệm giúp các cặp đôi cải thiện giao tiếp và giải quyết xung đột. Ông chuyên về các phương pháp trị liệu mối quan hệ dựa trên bằng chứng."
                  rows={4}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end space-x-2">
            <Button variant="outline">Hủy</Button>
            <Button>Lưu thay đổi</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="expertise">
        <Card>
          <CardHeader>
            <CardTitle>Chuyên môn & Bằng cấp</CardTitle>
            <CardDescription>Cập nhật chuyên môn và bằng cấp chuyên nghiệp của bạn</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="specialties">Chuyên môn chính</Label>
              <Select defaultValue="communication">
                <SelectTrigger id="specialties">
                  <SelectValue placeholder="Chọn chuyên môn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="communication">Giao tiếp</SelectItem>
                  <SelectItem value="conflict">Giải quyết xung đột</SelectItem>
                  <SelectItem value="parenting">Nuôi dạy con</SelectItem>
                  <SelectItem value="financial">Lập kế hoạch tài chính</SelectItem>
                  <SelectItem value="intimacy">Sự thân mật & Lòng tin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="education">Học vấn</Label>
              <Textarea
                id="education"
                defaultValue="Tiến sĩ Tâm lý học lâm sàng, Đại học Quốc gia Hà Nội, 2015
Thạc sĩ Tâm lý học tư vấn, Đại học Khoa học Xã hội và Nhân văn, 2011
Cử nhân Tâm lý học, Đại học Khoa học Xã hội và Nhân văn, 2009"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="certifications">Chứng chỉ</Label>
              <Textarea
                id="certifications"
                defaultValue="Chuyên viên tư vấn hôn nhân và gia đình được cấp phép
Chuyên viên trị liệu theo phương pháp Gottman (Cấp độ 3)
Chứng chỉ Trị liệu tập trung vào cảm xúc (EFT)"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Năm kinh nghiệm</Label>
              <Select defaultValue="10">
                <SelectTrigger id="experience">
                  <SelectValue placeholder="Chọn số năm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1-2 năm</SelectItem>
                  <SelectItem value="3">3-5 năm</SelectItem>
                  <SelectItem value="6">6-9 năm</SelectItem>
                  <SelectItem value="10">10+ năm</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="justify-end space-x-2">
            <Button variant="outline">Hủy</Button>
            <Button>Lưu thay đổi</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="schedule">
        <ScheduleCalendar />
      </TabsContent>

      <TabsContent value="payment">
        <Card>
          <CardHeader>
            <CardTitle>Cài đặt thanh toán</CardTitle>
            <CardDescription>Cấu hình mức phí và chính sách thanh toán của bạn</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="session-rate">Phí buổi tư vấn (VND)</Label>
                <Input id="session-rate" type="number" defaultValue="1500000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Tiền tệ</Label>
                <Select defaultValue="vnd">
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Chọn tiền tệ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vnd">VND (₫)</SelectItem>
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="eur">EUR (€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cancellation-policy">Chính sách hủy</Label>
              <Select defaultValue="24">
                <SelectTrigger id="cancellation-policy">
                  <SelectValue placeholder="Chọn chính sách" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">Yêu cầu thông báo trước 12 giờ</SelectItem>
                  <SelectItem value="24">Yêu cầu thông báo trước 24 giờ</SelectItem>
                  <SelectItem value="48">Yêu cầu thông báo trước 48 giờ</SelectItem>
                  <SelectItem value="flexible">Chính sách linh hoạt</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cancellation-fee">Phí hủy (%)</Label>
              <Input id="cancellation-fee" type="number" defaultValue="50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment-methods">Phương thức thanh toán chấp nhận</Label>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="rounded-full bg-primary text-primary-foreground">
                  Thẻ tín dụng
                </Button>
                <Button variant="outline" className="rounded-full bg-primary text-primary-foreground">
                  Chuyển khoản
                </Button>
                <Button variant="outline" className="rounded-full">
                  Ví điện tử
                </Button>
                <Button variant="outline" className="rounded-full">
                  Tiền mặt
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end space-x-2">
            <Button variant="outline">Hủy</Button>
            <Button>Lưu thay đổi</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
