"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function LoginForm() {
  const router = useRouter()
  const [role, setRole] = useState<"admin" | "counselor">("admin")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // Trong ứng dụng thực tế, đây sẽ là xác thực thực sự
    // Hiện tại chỉ chuyển hướng dựa trên vai trò đã chọn
    if (role === "admin") {
      router.push("/admin/dashboard")
    } else {
      router.push("/counselor/dashboard")
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-2 text-center">
        <div className="flex justify-center">
          <Heart className="h-12 w-12 text-rose-500" />
        </div>
        <CardTitle className="text-2xl">CCP Platform</CardTitle>
        <CardDescription>Nền tảng dịch vụ tư vấn hôn nhân</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="admin" onValueChange={(value) => setRole(value as "admin" | "counselor")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="admin">Quản trị viên</TabsTrigger>
            <TabsTrigger value="counselor">Chuyên viên tư vấn</TabsTrigger>
          </TabsList>
          <TabsContent value="admin">
            <form onSubmit={handleLogin} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input id="admin-email" type="email" placeholder="admin@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Mật khẩu</Label>
                <Input id="admin-password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Đăng nhập
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="counselor">
            <form onSubmit={handleLogin} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="counselor-email">Email</Label>
                <Input id="counselor-email" type="email" placeholder="counselor@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="counselor-password">Mật khẩu</Label>
                <Input id="counselor-password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Đăng nhập
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        <a href="#" className="hover:underline">
          Quên mật khẩu?
        </a>
      </CardFooter>
    </Card>
  )
}
