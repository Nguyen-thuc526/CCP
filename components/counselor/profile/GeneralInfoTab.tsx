"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { userService } from "@/services/userService";
import { useErrorLoadingWithUI } from "@/hooks/useErrorLoading";
import { ToastType, useToast } from "@/hooks/useToast";
import { useUploadImage } from "@/hooks/upload-image";


type CounselorProfile = {
  id: string;
  fullname: string;
  avatar: string;
  description: string | null;
  price: number;
  yearOfJob: number;
  phone: string | null;
  status: number;
};

type UserResponse = {
  success: boolean;
  data: CounselorProfile;
  error: string | null;
};

type UpdateCounselorProfileRequest = {
  fullName?: string;
  description?: string;
  price?: number;
  phone?: string;
  yearOfJob?: number;
  avatar?: string;
};

export function GeneralInfoTab() {
  const [profile, setProfile] = useState<CounselorProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();
  const { error, setErrorMessage, renderStatus, renderSkeleton } = useErrorLoadingWithUI();
  const [isSaving, setIsSaving] = useState(false);
  const { uploadImage, imageUrl, loading: uploadLoading, error: uploadError } = useUploadImage();

  useEffect(() => {
    const fetchCounselorProfile = async () => {
      try {
        const response = await userService.getCounselorProfile();
        setProfile(response.data);
      } catch (err) {
        setErrorMessage("Không thể tải thông tin hồ sơ");
      }
    };

    fetchCounselorProfile();
  }, []);

  useEffect(() => {
    if (imageUrl && profile) {
      setProfile((prev) => (prev ? { ...prev, avatar: imageUrl } : null));
      setHasChanges(true);
    }
  }, [imageUrl]); // Removed 'profile' from dependencies

  const handleInputChange = (field: keyof CounselorProfile, value: string | number) => {
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            [field]: field === "price" || field === "yearOfJob" ? Number(value) : value,
          }
        : null
    );
    setHasChanges(true);
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("Kích thước file không được vượt quá 5MB", ToastType.Error);
        return;
      }
      if (!file.type.startsWith("image/")) {
        showToast("Vui lòng chọn file hình ảnh", ToastType.Error);
        return;
      }

      await uploadImage({
        file,
        onSuccess: (url) => {
          showToast("Tải ảnh lên thành công", ToastType.Success);
        },
        onError: (errorMsg) => {
          showToast(errorMsg, ToastType.Error);
        },
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (!profile?.fullname.trim()) {
        showToast("Vui lòng nhập họ và tên", ToastType.Error);
        return;
      }
      if (!profile.phone?.trim()) {
        showToast("Vui lòng nhập số điện thoại", ToastType.Error);
        return;
      }
      if (profile.price < 0) {
        showToast("Vui lòng nhập giá hợp lệ", ToastType.Error);
        return;
      }
      if (profile.yearOfJob < 0) {
        showToast("Vui lòng nhập số năm kinh nghiệm hợp lệ", ToastType.Error);
        return;
      }

      const updateData: UpdateCounselorProfileRequest = {
        fullName: profile.fullname,
        description: profile.description,
        price: profile.price,
        phone: profile.phone,
        yearOfJob: profile.yearOfJob,
        avatar: profile.avatar,
      };

      const response = await userService.updateCounselorProfile(updateData);
      if (response.success) {
        showToast("Thông tin đã được cập nhật", ToastType.Success);
        setIsEditing(false);
        setHasChanges(false);
      } else {
        showToast(response.error || "Cập nhật thất bại", ToastType.Error);
      }
    } catch (err) {
      showToast("Có lỗi xảy ra khi cập nhật thông tin", ToastType.Error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setProfile((prev) => (prev ? { ...prev } : null));
    setHasChanges(false);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const formatPrice = (value: number) => {
    return value.toLocaleString("vi-VN");
  };

  if (error) {
    return renderStatus({
      onRetry: () => window.location.reload(),
      retryText: "Thử lại",
    });
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
              <AvatarImage src={profile?.avatar || "/placeholder.svg"} alt="Hồ sơ" />
              <AvatarFallback>{profile?.fullname?.split(" ").pop()?.charAt(0) || "C"}</AvatarFallback>
            </Avatar>
            {isEditing && (
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadLoading}
                >
                  Thay đổi ảnh
                </Button>
                <p className="text-sm text-muted-foreground">JPG, PNG tối đa 5MB</p>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullname">Họ và tên *</Label>
              <Input
                id="fullname"
                value={profile?.fullname || ""}
                onChange={(e) => handleInputChange("fullname", e.target.value)}
                required
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Điện thoại *</Label>
              <Input
                id="phone"
                type="tel"
                value={profile?.phone || ""}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                required
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="yearsOfExperience">Số năm kinh nghiệm *</Label>
              <Input
                id="yearsOfExperience"
                type="number"
                value={profile?.yearOfJob || ""}
                onChange={(e) => handleInputChange("yearOfJob", e.target.value)}
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
                value={profile?.price ? formatPrice(profile.price) : ""}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, "");
                  handleInputChange("price", numericValue);
                }}
                required
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Tiểu sử chuyên môn</Label>
              <Textarea
                id="description"
                value={profile?.description || ""}
                onChange={(e) => handleInputChange("description", e.target.value)}
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
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isSaving}>
                Hủy
              </Button>
              <Button type="submit" disabled={isSaving || !hasChanges}>
                {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </>
          )}
        </CardFooter>
      </form>
      {error && <div className="text-center text-destructive">{error}</div>}
      {uploadError && <div className="text-center text-destructive">{uploadError}</div>}
    </Card>
  );
}