'use client';

import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { userService } from '@/services/userService';
import { useErrorLoadingWithUI } from '@/hooks/useErrorLoading';
import { ToastType, useToast } from '@/hooks/useToast';
import { useUploadImage } from '@/hooks/upload-image';
import type {
   CounselorProfile,
   UpdateCounselorProfileRequest,
} from '@/types/user';

export function GeneralInfoTab() {
   const [profile, setProfile] = useState<CounselorProfile | null>(null);
   const [isEditing, setIsEditing] = useState(false);
   const [hasChanges, setHasChanges] = useState(false);
   const [validationErrors, setValidationErrors] = useState<{
      fullname?: string;
      phone?: string;
      yearOfJob?: string;
      price?: string;
      description?: string;
   }>({});
   const fileInputRef = useRef<HTMLInputElement>(null);
   const { showToast } = useToast();
   const { error, setErrorMessage, renderStatus } = useErrorLoadingWithUI();
   const [isSaving, setIsSaving] = useState(false);
   const {
      uploadImage,
      imageUrl,
      loading: uploadLoading,
      error: uploadError,
   } = useUploadImage();

   useEffect(() => {
      const fetchCounselorProfile = async () => {
         try {
            const response = await userService.getCounselorProfile();
            setProfile(response.data);
         } catch (err) {
            setErrorMessage('Không thể tải thông tin hồ sơ');
         }
      };

      fetchCounselorProfile();
   }, []);

   useEffect(() => {
      if (imageUrl && profile) {
         setProfile((prev) => (prev ? { ...prev, avatar: imageUrl } : null));
         setHasChanges(true);
      }
   }, [imageUrl]);

   const validateField = (
      field: keyof CounselorProfile,
      value: string | number
   ): string | null => {
      switch (field) {
         case 'fullname':
            const nameStr = String(value).trim();
            if (!nameStr) return 'Vui lòng nhập họ và tên';
            if (/\d/.test(nameStr)) return 'Tên không được chứa số';
            return null;

         case 'phone':
            const phoneStr = String(value).trim();
            if (!phoneStr) return 'Vui lòng nhập số điện thoại';
            if (!/^\d+$/.test(phoneStr))
               return 'Số điện thoại chỉ được chứa số';
            if (phoneStr.length > 10)
               return 'Số điện thoại không được quá 10 số';
            return null;

         case 'yearOfJob':
            const experience = Number(value);
            if (isNaN(experience) || experience <= 0)
               return 'Số năm kinh nghiệm phải lớn hơn 1';
            return null;

         case 'price':
            const price = Number(value);
            if (isNaN(price) || price < 50000)
               return 'Giá tiền phải lớn hơn 50.000 VND';
            return null;

         case 'description':
            const descStr = String(value).trim();
            if (descStr && descStr.length < 10)
               return 'Mô tả phải có ít nhất 10 ký tự';
            return null;

         default:
            return null;
      }
   };

   const handleInputChange = (
      field: keyof CounselorProfile,
      value: string | number
   ) => {
      const error = validateField(field, value);
      setValidationErrors((prev) => ({
         ...prev,
         [field]: error,
      }));

      setProfile((prev) =>
         prev
            ? {
                 ...prev,
                 [field]:
                    field === 'price' || field === 'yearOfJob'
                       ? Number(value)
                       : value,
              }
            : null
      );
      setHasChanges(true);
   };

   const handleAvatarChange = async (
      event: React.ChangeEvent<HTMLInputElement>
   ) => {
      const file = event.target.files?.[0];
      if (file) {
         if (file.size > 5 * 1024 * 1024) {
            showToast(
               'Kích thước file không được vượt quá 5MB',
               ToastType.Error
            );
            return;
         }
         if (!file.type.startsWith('image/')) {
            showToast('Vui lòng chọn file hình ảnh', ToastType.Error);
            return;
         }

         await uploadImage({
            file,
            onSuccess: (url) => {
               showToast('Tải ảnh lên thành công', ToastType.Success);
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
         const errors: typeof validationErrors = {};

         if (profile?.fullname) {
            const nameError = validateField('fullname', profile.fullname);
            if (nameError) errors.fullname = nameError;
         }

         if (profile?.phone) {
            const phoneError = validateField('phone', profile.phone);
            if (phoneError) errors.phone = phoneError;
         }

         if (profile?.yearOfJob !== undefined) {
            const experienceError = validateField(
               'yearOfJob',
               profile.yearOfJob
            );
            if (experienceError) errors.yearOfJob = experienceError;
         }

         if (profile?.price !== undefined) {
            const priceError = validateField('price', profile.price);
            if (priceError) errors.price = priceError;
         }

         if (profile?.description) {
            const descError = validateField('description', profile.description);
            if (descError) errors.description = descError;
         }

         if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            showToast('Vui lòng kiểm tra lại thông tin', ToastType.Error);
            return;
         }

         const updateData: UpdateCounselorProfileRequest = {
            fullName: profile!.fullname,
            description: profile!.description,
            price: profile!.price,
            phone: profile!.phone,
            yearOfJob: profile!.yearOfJob,
            avatar: profile!.avatar,
         };

         const response = await userService.updateCounselorProfile(updateData);
         if (response.success) {
            showToast('Thông tin đã được cập nhật', ToastType.Success);
            setIsEditing(false);
            setHasChanges(false);
            setValidationErrors({});
         } else {
            showToast(response.error || 'Cập nhật thất bại', ToastType.Error);
         }
      } catch (err) {
         showToast('Có lỗi xảy ra khi cập nhật thông tin', ToastType.Error);
      } finally {
         setIsSaving(false);
      }
   };

   const handleCancel = () => {
      setProfile((prev) => (prev ? { ...prev } : null));
      setHasChanges(false);
      setIsEditing(false);
      setValidationErrors({});
   };

   const handleEdit = () => {
      setIsEditing(true);
   };

   const formatPrice = (value: number) => {
      return value.toLocaleString('vi-VN');
   };

   if (error) {
      return renderStatus({
         onRetry: () => window.location.reload(),
         retryText: 'Thử lại',
      });
   }

   return (
      <Card>
         <CardHeader>
            <CardTitle>Thông tin chung</CardTitle>
            <CardDescription>
               Cập nhật thông tin cá nhân và liên hệ của bạn
            </CardDescription>
         </CardHeader>
         <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
               <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                     <AvatarImage
                        src={profile?.avatar || '/placeholder.svg'}
                        alt="Hồ sơ"
                     />
                     <AvatarFallback>
                        {profile?.fullname?.split(' ').pop()?.charAt(0) || 'C'}
                     </AvatarFallback>
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
                        <p className="text-sm text-muted-foreground">
                           JPG, PNG tối đa 5MB
                        </p>
                     </div>
                  )}
                  <input
                     ref={fileInputRef}
                     type="file"
                     accept="image/*"
                     onChange={handleAvatarChange}
                     className="hidden"
                  />
               </div>

               <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                     <Label htmlFor="fullname">Họ và tên *</Label>
                     <Input
                        id="fullname"
                        value={profile?.fullname || ''}
                        onChange={(e) =>
                           handleInputChange('fullname', e.target.value)
                        }
                        required
                        readOnly={!isEditing}
                        className={
                           validationErrors.fullname ? 'border-red-500' : ''
                        }
                     />
                     {validationErrors.fullname && (
                        <p className="text-sm text-red-500">
                           {validationErrors.fullname}
                        </p>
                     )}
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="phone">Điện thoại *</Label>
                     <Input
                        id="phone"
                        type="tel"
                        value={profile?.phone || ''}
                        onChange={(e) =>
                           handleInputChange('phone', e.target.value)
                        }
                        required
                        readOnly={!isEditing}
                        className={
                           validationErrors.phone ? 'border-red-500' : ''
                        }
                     />
                     {validationErrors.phone && (
                        <p className="text-sm text-red-500">
                           {validationErrors.phone}
                        </p>
                     )}
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="yearsOfExperience">
                        Số năm kinh nghiệm *
                     </Label>
                     <Input
                        id="yearsOfExperience"
                        type="number"
                        value={profile?.yearOfJob || ''}
                        onChange={(e) =>
                           handleInputChange('yearOfJob', e.target.value)
                        }
                        required
                        readOnly={!isEditing}
                        min="1"
                        max="50"
                        className={
                           validationErrors.yearOfJob ? 'border-red-500' : ''
                        }
                     />
                     {validationErrors.yearOfJob && (
                        <p className="text-sm text-red-500">
                           {validationErrors.yearOfJob}
                        </p>
                     )}
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="price">Giá mỗi buổi tư vấn (VND) *</Label>
                     <Input
                        id="price"
                        type="text"
                        value={profile?.price ? formatPrice(profile.price) : ''}
                        onChange={(e) => {
                           const numericValue = e.target.value.replace(
                              /\D/g,
                              ''
                           );
                           handleInputChange('price', numericValue);
                        }}
                        required
                        readOnly={!isEditing}
                        className={
                           validationErrors.price ? 'border-red-500' : ''
                        }
                     />
                     {validationErrors.price && (
                        <p className="text-sm text-red-500">
                           {validationErrors.price}
                        </p>
                     )}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                     <Label htmlFor="description">Tiểu sử chuyên môn</Label>
                     <Textarea
                        id="description"
                        value={profile?.description || ''}
                        onChange={(e) =>
                           handleInputChange('description', e.target.value)
                        }
                        rows={4}
                        placeholder="Mô tả về kinh nghiệm và chuyên môn của bạn..."
                        readOnly={!isEditing}
                        className={
                           validationErrors.description ? 'border-red-500' : ''
                        }
                     />
                     {validationErrors.description && (
                        <p className="text-sm text-red-500">
                           {validationErrors.description}
                        </p>
                     )}
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
                     <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isSaving}
                     >
                        Hủy
                     </Button>
                     <Button type="submit" disabled={isSaving || !hasChanges}>
                        {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                     </Button>
                  </>
               )}
            </CardFooter>
         </form>
         {error && <div className="text-center text-destructive">{error}</div>}
         {uploadError && (
            <div className="text-center text-destructive">{uploadError}</div>
         )}
      </Card>
   );
}
