"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, ImageIcon, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

export function BlogForm() {
  const router = useRouter()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [content, setContent] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Xử lý lưu bài viết
    router.push("/admin/blog")
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="basic">
        <TabsList className="mb-4">
          <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
          <TabsTrigger value="content">Nội dung</TabsTrigger>
          <TabsTrigger value="settings">Cài đặt</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin bài viết</CardTitle>
              <CardDescription>Nhập thông tin cơ bản về bài viết</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề bài viết</Label>
                <Input id="title" placeholder="Nhập tiêu đề bài viết" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">Tóm tắt</Label>
                <Textarea id="excerpt" placeholder="Tóm tắt ngắn gọn về bài viết" rows={3} />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="author">Tác giả</Label>
                  <Select>
                    <SelectTrigger id="author">
                      <SelectValue placeholder="Chọn tác giả" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ts-tran-van-c">TS. Trần Văn C</SelectItem>
                      <SelectItem value="ts-pham-van-f">TS. Phạm Văn F</SelectItem>
                      <SelectItem value="ts-ngo-thi-i">TS. Ngô Thị I</SelectItem>
                      <SelectItem value="ts-vu-van-l">TS. Vũ Văn L</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Danh mục</Label>
                  <Select>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="communication">Giao tiếp</SelectItem>
                      <SelectItem value="conflict">Giải quyết xung đột</SelectItem>
                      <SelectItem value="parenting">Nuôi dạy con</SelectItem>
                      <SelectItem value="financial">Tài chính</SelectItem>
                      <SelectItem value="intimacy">Sự thân mật</SelectItem>
                      <SelectItem value="news">Tin tức</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Ngày đăng</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={vi} />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="featured-image">Ảnh đại diện</Label>
                <div className="flex items-center gap-4">
                  <div className="h-40 w-64 rounded-md border border-dashed flex items-center justify-center bg-muted">
                    <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
                      <ImageIcon className="h-10 w-10" />
                      <span>Tải ảnh lên</span>
                    </div>
                  </div>
                  <Button type="button" variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Chọn ảnh
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nội dung bài viết</CardTitle>
              <CardDescription>Viết nội dung chi tiết cho bài viết của bạn</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="border rounded-md p-2">
                  <div className="flex items-center gap-1 border-b pb-2 mb-2">
                    <Button type="button" variant="ghost" size="sm" className="h-8 px-2 text-xs">
                      Tiêu đề
                    </Button>
                    <Button type="button" variant="ghost" size="sm" className="h-8 px-2 text-xs">
                      Đậm
                    </Button>
                    <Button type="button" variant="ghost" size="sm" className="h-8 px-2 text-xs">
                      Nghiêng
                    </Button>
                    <Button type="button" variant="ghost" size="sm" className="h-8 px-2 text-xs">
                      Gạch chân
                    </Button>
                    <Button type="button" variant="ghost" size="sm" className="h-8 px-2 text-xs">
                      Danh sách
                    </Button>
                    <Button type="button" variant="ghost" size="sm" className="h-8 px-2 text-xs">
                      Liên kết
                    </Button>
                    <Button type="button" variant="ghost" size="sm" className="h-8 px-2 text-xs">
                      Hình ảnh
                    </Button>
                  </div>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Viết nội dung bài viết của bạn ở đây..."
                    className="min-h-[400px] border-0 focus-visible:ring-0 resize-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt bài viết</CardTitle>
              <CardDescription>Cấu hình các tùy chọn cho bài viết của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="slug">Đường dẫn (URL)</Label>
                <Input id="slug" placeholder="ten-bai-viet" />
                <p className="text-xs text-muted-foreground">Đường dẫn sẽ được tạo tự động từ tiêu đề nếu để trống</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta-description">Mô tả SEO</Label>
                <Textarea id="meta-description" placeholder="Mô tả ngắn gọn cho công cụ tìm kiếm" rows={2} />
                <p className="text-xs text-muted-foreground">
                  Tối đa 160 ký tự để hiển thị tốt trên các công cụ tìm kiếm
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Thẻ</Label>
                <Input id="tags" placeholder="Nhập các thẻ, phân cách bằng dấu phẩy" />
              </div>
              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <div className="flex items-center space-x-2">
                  <Switch id="published" defaultChecked />
                  <Label htmlFor="published">Xuất bản</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tùy chọn</Label>
                <div className="grid gap-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="featured" />
                    <Label htmlFor="featured">Đánh dấu là bài viết nổi bật</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="comments" defaultChecked />
                    <Label htmlFor="comments">Cho phép bình luận</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <div className="mt-6 flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={() => router.push("/admin/blog")}>
            Hủy
          </Button>
          <Button type="submit">Xuất bản bài viết</Button>
        </div>
      </Tabs>
    </form>
  )
}
