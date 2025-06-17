"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function PaymentTab() {
  return (
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
  );
}