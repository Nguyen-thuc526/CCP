'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
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
import { Eye, EyeOff, Lock, Shield, CheckCircle } from 'lucide-react';
import { ToastType, useToast } from '@/hooks/useToast';
import { authService } from '@/services/authService';

interface PasswordFormData {
   currentPassword: string;
   newPassword: string;
   confirmPassword: string;
}

interface ValidationErrors {
   currentPassword?: string;
   newPassword?: string;
   confirmPassword?: string;
}

export function PasswordTab() {
   const [formData, setFormData] = useState<PasswordFormData>({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
   });
   const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
      {}
   );
   const [showPasswords, setShowPasswords] = useState({
      current: false,
      new: false,
      confirm: false,
   });
   const [isSubmitting, setIsSubmitting] = useState(false);
   const { showToast } = useToast();

   const validatePassword = (password: string): string | null => {
      if (password.length < 6) {
         return 'Mật khẩu phải có ít nhất 6 ký tự';
      }
      return null;
   };

   useEffect(() => {
      if (formData.confirmPassword && formData.newPassword) {
         if (formData.newPassword !== formData.confirmPassword) {
            setValidationErrors((prev) => ({
               ...prev,
               confirmPassword: 'Mật khẩu xác nhận không khớp',
            }));
         } else {
            setValidationErrors((prev) => ({
               ...prev,
               confirmPassword: undefined,
            }));
         }
      }
   }, [formData.newPassword, formData.confirmPassword]);

   const handleInputChange = (field: keyof PasswordFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      if (validationErrors[field] && field !== 'confirmPassword') {
         setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
      }
   };

   const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
      setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
   };

   const validateForm = (): boolean => {
      const errors: ValidationErrors = {};

      if (!formData.currentPassword) {
         errors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
      }

      if (!formData.newPassword) {
         errors.newPassword = 'Vui lòng nhập mật khẩu mới';
      } else {
         const passwordError = validatePassword(formData.newPassword);
         if (passwordError) {
            errors.newPassword = passwordError;
         }
      }

      if (!formData.confirmPassword) {
         errors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
      }

      if (formData.currentPassword === formData.newPassword) {
         errors.newPassword = 'Mật khẩu mới phải khác mật khẩu hiện tại';
      }

      setValidationErrors(errors);
      return Object.keys(errors).length === 0;
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
         showToast('Vui lòng kiểm tra lại thông tin', ToastType.Error);
         return;
      }

      setIsSubmitting(true);

      try {
         await authService.changePassword({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
            confirmPassword: formData.confirmPassword,
         });

         showToast('Đổi mật khẩu thành công', ToastType.Success);

         // Reset form
         setFormData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
         });
         setValidationErrors({});
      } catch (error: any) {
         const serverMsg =
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            'Có lỗi xảy ra khi đổi mật khẩu';
         showToast(serverMsg, ToastType.Error);
      } finally {
         setIsSubmitting(false);
      }
   };

   const getPasswordStrength = (password: string) => {
      if (!password) return { strength: 0, label: '', color: '' };

      let strength = 0;
      if (password.length >= 6) strength++;
      if (password.length >= 8) strength++;
      if (/(?=.*[a-z])/.test(password)) strength++;
      if (/(?=.*[A-Z])/.test(password)) strength++;
      if (/(?=.*\d)/.test(password)) strength++;

      const labels = ['Rất yếu', 'Yếu', 'Trung bình', 'Mạnh', 'Rất mạnh'];
      const colors = [
         'bg-red-500',
         'bg-orange-500',
         'bg-yellow-500',
         'bg-blue-500',
         'bg-green-500',
      ];

      return {
         strength,
         label: labels[strength - 1] || '',
         color: colors[strength - 1] || '',
      };
   };

   const passwordStrength = getPasswordStrength(formData.newPassword);

   return (
      <Card>
         <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <Shield className="h-5 w-5" />
               Đổi mật khẩu
            </CardTitle>
            <CardDescription>
               Cập nhật mật khẩu để bảo mật tài khoản của bạn
            </CardDescription>
         </CardHeader>

         <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
               {/* Current Password */}
               <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mật khẩu hiện tại *</Label>
                  <div className="relative">
                     <Input
                        id="currentPassword"
                        type={showPasswords.current ? 'text' : 'password'}
                        value={formData.currentPassword}
                        onChange={(e) =>
                           handleInputChange('currentPassword', e.target.value)
                        }
                        className={
                           validationErrors.currentPassword
                              ? 'border-red-500 pr-10'
                              : 'pr-10'
                        }
                        placeholder="Nhập mật khẩu hiện tại"
                     />
                     <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => togglePasswordVisibility('current')}
                     >
                        {showPasswords.current ? (
                           <EyeOff className="h-4 w-4" />
                        ) : (
                           <Eye className="h-4 w-4" />
                        )}
                     </Button>
                  </div>
                  {validationErrors.currentPassword && (
                     <p className="text-sm text-red-500">
                        {validationErrors.currentPassword}
                     </p>
                  )}
               </div>

               {/* New Password */}
               <div className="space-y-2">
                  <Label htmlFor="newPassword">Mật khẩu mới *</Label>
                  <div className="relative">
                     <Input
                        id="newPassword"
                        type={showPasswords.new ? 'text' : 'password'}
                        value={formData.newPassword}
                        onChange={(e) =>
                           handleInputChange('newPassword', e.target.value)
                        }
                        className={
                           validationErrors.newPassword
                              ? 'border-red-500 pr-10'
                              : 'pr-10'
                        }
                        placeholder="Nhập mật khẩu mới"
                     />
                     <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => togglePasswordVisibility('new')}
                     >
                        {showPasswords.new ? (
                           <EyeOff className="h-4 w-4" />
                        ) : (
                           <Eye className="h-4 w-4" />
                        )}
                     </Button>
                  </div>

                  {/* Password Strength Indicator */}
                  {formData.newPassword && (
                     <div className="space-y-2">
                        <div className="flex items-center gap-2">
                           <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                 className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                 style={{
                                    width: `${(passwordStrength.strength / 5) * 100}%`,
                                 }}
                              />
                           </div>
                           <span className="text-sm font-medium">
                              {passwordStrength.label}
                           </span>
                        </div>
                     </div>
                  )}

                  {validationErrors.newPassword && (
                     <p className="text-sm text-red-500">
                        {validationErrors.newPassword}
                     </p>
                  )}

                  <div className="text-sm text-muted-foreground space-y-1">
                     <p className="font-medium">Yêu cầu mật khẩu:</p>
                     <div className="flex items-center gap-1">
                        <div
                           className={`flex items-center gap-1 ${
                              formData.newPassword.length >= 6
                                 ? 'text-green-600'
                                 : ''
                           }`}
                        >
                           <CheckCircle className="h-3 w-3" />
                           Ít nhất 6 ký tự
                        </div>
                     </div>
                     <p className="text-xs text-muted-foreground mt-2">
                        Khuyến nghị: Sử dụng kết hợp chữ hoa, chữ thường và số
                        để tăng độ bảo mật
                     </p>
                  </div>
               </div>

               {/* Confirm Password */}
               <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                     Xác nhận mật khẩu mới *
                  </Label>
                  <div className="relative">
                     <Input
                        id="confirmPassword"
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) =>
                           handleInputChange('confirmPassword', e.target.value)
                        }
                        className={
                           validationErrors.confirmPassword
                              ? 'border-red-500 pr-10'
                              : 'pr-10'
                        }
                        placeholder="Nhập lại mật khẩu mới"
                     />
                     <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => togglePasswordVisibility('confirm')}
                     >
                        {showPasswords.confirm ? (
                           <EyeOff className="h-4 w-4" />
                        ) : (
                           <Eye className="h-4 w-4" />
                        )}
                     </Button>
                  </div>
                  {validationErrors.confirmPassword && (
                     <p className="text-sm text-red-500">
                        {validationErrors.confirmPassword}
                     </p>
                  )}
               </div>

               {/* Security Notice */}
               <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                     <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
                     <div className="text-sm">
                        <p className="font-medium text-blue-900 mb-1">
                           Lưu ý bảo mật
                        </p>
                        <ul className="text-blue-700 space-y-1">
                           <li>• Không chia sẻ mật khẩu với bất kỳ ai</li>
                           <li>• Sử dụng mật khẩu mạnh và duy nhất</li>
                           <li>
                              • Đăng xuất khỏi tất cả thiết bị sau khi đổi mật
                              khẩu
                           </li>
                        </ul>
                     </div>
                  </div>
               </div>
            </CardContent>

            <CardFooter className="justify-end">
               <Button
                  type="submit"
                  disabled={
                     isSubmitting ||
                     !formData.currentPassword ||
                     !formData.newPassword ||
                     !formData.confirmPassword
                  }
                  className="min-w-[120px]"
               >
                  {isSubmitting ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
               </Button>
            </CardFooter>
         </form>
      </Card>
   );
}
