"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { useToast, ToastType } from "@/hooks/useToast"

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  price: string
  bio: string
  avatar: string
  yearsOfExperience: string
}

export function GeneralInfoTab() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "Trần",
    lastName: "Văn C",
    email: "tranvanc@example.com",
    phone: "0987654321",
    price: "500000",
    bio: "TS. Trần Văn C là chuyên viên tư vấn hôn nhân được cấp phép với hơn 10 năm kinh nghiệm giúp các cặp đôi cải thiện giao tiếp và giải quyết xung đột. Ông chuyên về các phương pháp trị liệu mối quan hệ dựa trên bằng chứng.",
    avatar: "/placeholder.svg?height=96&width=96",
    yearsOfExperience: "10",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { showToast } = useToast()

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    setHasChanges(true)
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Kiểm tra kích thước file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast("Kích thước file không được vượt quá 5MB", ToastType.Error)
        return
      }

      // Kiểm tra định dạng file
      if (!file.type.startsWith("image/")) {
        showToast("Vui lòng chọn file hình ảnh", ToastType.Error)
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        handleInputChange("avatar", result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate form
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        showToast("Vui lòng nhập đầy đủ họ và tên", ToastType.Error)
        return
      }

      if (!formData.email.trim() || !formData.email.includes("@")) {
        showToast("Vui lòng nhập email hợp lệ", ToastType.Error)
        return
      }

      if (!formData.phone.trim()) {
        showToast("Vui lòng nhập số điện thoại", ToastType.Error)
        return
      }

      if (!formData.price.trim() || Number.parseInt(formData.price) < 0) {
        showToast("Vui lòng nhập giá hợp lệ", ToastType.Error)
        return
      }

      if (!formData.yearsOfExperience.trim() || Number.parseInt(formData.yearsOfExperience) < 0) {
        showToast("Vui lòng nhập số năm kinh nghiệm hợp lệ", ToastType.Error)
        return
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      showToast("Thông tin đã được cập nhật thành công", ToastType.Success)

      setIsEditing(false)
      setHasChanges(false)
    } catch (error) {
      showToast("Có lỗi xảy ra khi cập nhật thông tin", ToastType.Error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    // Reset form to original values
    setFormData({
      firstName: "Trần",
      lastName: "Văn C",
      email: "tranvanc@example.com",
      phone: "0987654321",
      price: "500000",
      bio: "TS. Trần Văn C là chuyên viên tư vấn hôn nhân được cấp phép với hơn 10 năm kinh nghiệm giúp các cặp đôi cải thiện giao tiếp và giải quyết xung đột. Ông chuyên về các phương pháp trị liệu mối quan hệ dựa trên bằng chứng.",
      avatar: "/placeholder.svg?height=96&width=96",
      yearsOfExperience: "10",
    })
    setHasChanges(false)
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    // Reset form to original values
    setFormData({
      firstName: "Trần",
      lastName: "Văn C",
      email: "tranvanc@example.com",
      phone: "0987654321",
      price: "500000",
      bio: "TS. Trần Văn C là chuyên viên tư vấn hôn nhân được cấp phép với hơn 10 năm kinh nghiệm giúp các cặp đôi cải thiện giao tiếp và giải quyết xung đột. Ông chuyên về các phương pháp trị liệu mối quan hệ dựa trên bằng chứng.",
      avatar: "/placeholder.svg?height=96&width=96",
      yearsOfExperience: "10",
    })
    setHasChanges(false)
    setIsEditing(false)
  }

  const formatPrice = (value: string) => {
    const number = Number.parseInt(value.replace(/\D/g, ""))
    return isNaN(number) ? "" : number.toLocaleString("vi-VN")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin chung</CardTitle>
        <CardDescription>Cập nhật thông tin cá nhân và liên hệ của bạn</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={formData.avatar || "/placeholder.svg"} alt="Hồ sơ" />
              <AvatarFallback>
                {formData.firstName.charAt(0)}
                {formData.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <div className="space-y-2">
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                  Thay đổi ảnh
                </Button>
                <p className="text-sm text-muted-foreground">JPG, PNG tối đa 5MB</p>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="first-name">Họ *</Label>
              <Input
                id="first-name"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                required
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">Tên *</Label>
              <Input
                id="last-name"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                required
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                readOnly={true}
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Điện thoại *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                required
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="years-experience">Số năm kinh nghiệm *</Label>
              <Input
                id="years-experience"
                type="number"
                value={formData.yearsOfExperience}
                onChange={(e) => handleInputChange("yearsOfExperience", e.target.value)}
                required
                readOnly={!isEditing}
                min="0"
                max="50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Giá mỗi buổi tư vấn (VND) *</Label>
              <Input
                id="price"
                type="text"
                value={formatPrice(formData.price)}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, "")
                  handleInputChange("price", numericValue)
                }}
                placeholder="500,000"
                required
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bio">Tiểu sử chuyên môn</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                rows={4}
                placeholder="Mô tả về kinh nghiệm và chuyên môn của bạn..."
                readOnly={!isEditing}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-end space-x-2">
          {!isEditing ? (
            <Button type="button" onClick={handleEdit}>
              Chỉnh sửa
            </Button>
          ) : (
            <>
              <Button type="button" variant="outline" onClick={handleCancelEdit} disabled={isLoading}>
                Hủy
              </Button>
              <Button type="submit" disabled={isLoading || !hasChanges}>
                {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </>
          )}
        </CardFooter>
      </form>
    </Card>
  )
}
