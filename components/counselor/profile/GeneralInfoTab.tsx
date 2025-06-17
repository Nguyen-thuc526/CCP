"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

export function GeneralInfoTab() {
  return (
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
  );
}