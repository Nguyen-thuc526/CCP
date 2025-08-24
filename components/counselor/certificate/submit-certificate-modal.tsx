'use client';

import type React from 'react';
import type { Category } from '@/types/category';
import { useRef, useState, useEffect } from 'react';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
   Collapsible,
   CollapsibleContent,
   CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
   FilePlus,
   Loader2,
   X,
   ChevronDown,
   ChevronRight,
   CheckCircle,
   Clock,
   AlertCircle,
} from 'lucide-react';
import { useUploadImage } from '@/hooks/upload-image';
import { categoryService } from '@/services/categoryService';
import { certificationService } from '@/services/certificationService';
import { useToast, ToastType } from '@/hooks/useToast';

interface SubmitCertificateModalProps {
   open: boolean;
   onClose: () => void;
   onSuccess: () => void;
}

interface ValidationErrors {
   name?: string;
   description?: string;
   image?: string;
   categories?: string;
   file?: string;
}

const validateForm = (
   formData: any,
   selectedSubCategories: string[],
   hasImage: boolean
): ValidationErrors => {
   const errors: ValidationErrors = {};

   // Validate name
   if (!formData.name.trim()) {
      errors.name = 'Tên chứng chỉ là bắt buộc';
   } else if (formData.name.trim().length < 3) {
      errors.name = 'Tên chứng chỉ phải có ít nhất 3 ký tự';
   } else if (formData.name.trim().length > 100) {
      errors.name = 'Tên chứng chỉ không được vượt quá 100 ký tự';
   }

   // Validate description
   if (!formData.description.trim()) {
      errors.description = 'Mô tả là bắt buộc';
   } else if (formData.description.trim().length < 10) {
      errors.description = 'Mô tả phải có ít nhất 10 ký tự';
   } else if (formData.description.trim().length > 5000) {
      errors.description = 'Mô tả không được vượt quá 5000 ký tự';
   }

   // Validate categories
   if (selectedSubCategories.length === 0) {
      errors.categories = 'Vui lòng chọn ít nhất một danh mục';
   }

   // Validate image
   if (!hasImage) {
      errors.image = 'Vui lòng tải lên ảnh chứng chỉ';
   }

   return errors;
};

const validateFile = (file: File): string | null => {
   const maxSize = 5 * 1024 * 1024; // 5MB
   const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

   if (!allowedTypes.includes(file.type)) {
      return 'Chỉ chấp nhận file ảnh (JPEG, PNG, WebP)';
   }

   if (file.size > maxSize) {
      return 'Kích thước file không được vượt quá 5MB';
   }

   return null;
};

export default function SubmitCertificateModal({
   open,
   onClose,
   onSuccess,
}: SubmitCertificateModalProps) {
   const { uploadImage, loading } = useUploadImage();
   const [categories, setCategories] = useState<Category[]>([]);
   const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(
      []
   );
   const [openCategories, setOpenCategories] = useState<string[]>([]);
   const [formData, setFormData] = useState({
      name: '',
      description: '',
      image: '',
   });
   const [isLoadingCategories, setIsLoadingCategories] = useState(true);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [isSubmitted, setIsSubmitted] = useState(false);
   const [errors, setErrors] = useState<ValidationErrors>({});
   const [touched, setTouched] = useState<Record<string, boolean>>({});

   const fileInputRef = useRef<HTMLInputElement>(null);
   const { showToast } = useToast();

   useEffect(() => {
      if (open) {
         fetchCategories();
      }
   }, [open]);

   const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
         const response = await categoryService.getActiveCategoriesWithSub();
         if (response.success) {
            setCategories(response.data);
         } else {
            showToast('Lỗi khi tải danh mục.', ToastType.Error);
         }
      } catch (error: any) {
         showToast(error.message || 'Không thể tải danh mục.', ToastType.Error);
      } finally {
         setIsLoadingCategories(false);
      }
   };

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         const fileError = validateFile(file);
         if (fileError) {
            setErrors((prev) => ({ ...prev, file: fileError }));
            showToast(fileError, ToastType.Error);
            return;
         }

         setErrors((prev) => ({ ...prev, file: undefined, image: undefined }));
         uploadImage({
            file,
            onSuccess: (url) => {
               setFormData((prev) => ({ ...prev, image: url }));
               setErrors((prev) => ({ ...prev, image: undefined }));
            },
            onError: (err) => {
               setErrors((prev) => ({ ...prev, image: 'Upload ảnh thất bại' }));
               showToast('Upload ảnh thất bại: ' + err, ToastType.Error);
            },
         });
      }
   };

   const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
   ) => {
      const { id, value } = e.target;
      setFormData((prev) => ({ ...prev, [id]: value }));

      // Clear error when user starts typing
      if (errors[id as keyof ValidationErrors]) {
         setErrors((prev) => ({ ...prev, [id]: undefined }));
      }
   };

   const handleBlur = (field: string) => {
      setTouched((prev) => ({ ...prev, [field]: true }));

      // Validate specific field on blur
      const fieldErrors = validateForm(
         formData,
         selectedSubCategories,
         !!formData.image
      );
      if (fieldErrors[field as keyof ValidationErrors]) {
         setErrors((prev) => ({
            ...prev,
            [field]: fieldErrors[field as keyof ValidationErrors],
         }));
      }
   };

   const handleSubCategoryToggle = (subCategoryId: string) => {
      setSelectedSubCategories((prev) => {
         const newSelection = prev.includes(subCategoryId)
            ? prev.filter((id) => id !== subCategoryId)
            : [...prev, subCategoryId];

         // Clear category error if at least one is selected
         if (newSelection.length > 0 && errors.categories) {
            setErrors((prevErrors) => ({
               ...prevErrors,
               categories: undefined,
            }));
         }

         return newSelection;
      });
   };

   const removeSubCategory = (subCategoryId: string) => {
      setSelectedSubCategories((prev) =>
         prev.filter((id) => id !== subCategoryId)
      );
   };

   const toggleCategory = (categoryId: string) => {
      setOpenCategories((prev) => {
         if (prev.includes(categoryId)) {
            return prev.filter((id) => id !== categoryId);
         } else {
            return [...prev, categoryId];
         }
      });
   };

   const getSubCategoryInfo = (subCategoryId: string) => {
      for (const category of categories) {
         const subCategory = category.subCategories.find(
            (sub) => sub.id === subCategoryId
         );
         if (subCategory) {
            return {
               name: subCategory.name,
               categoryName: category.name,
            };
         }
      }
      return { name: '', categoryName: '' };
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate all fields
      const validationErrors = validateForm(
         formData,
         selectedSubCategories,
         !!formData.image
      );

      if (Object.keys(validationErrors).length > 0) {
         setErrors(validationErrors);
         setTouched({
            name: true,
            description: true,
            categories: true,
            image: true,
         });
         showToast(
            'Vui lòng kiểm tra và sửa các lỗi trong form',
            ToastType.Error
         );
         return;
      }

      setIsSubmitting(true);

      try {
         const submittedData = {
            name: formData.name.trim(),
            description: formData.description.trim(),
            image: formData.image,
            time: new Date().toISOString(),
            subCategoryIds: selectedSubCategories,
         };

         const response =
            await certificationService.sendCertification(submittedData);
         if (response.success) {
            setIsSubmitted(true);
            showToast('Nộp chứng chỉ thành công!', ToastType.Success);
            setTimeout(() => {
               resetForm();
               onSuccess();
            }, 2000);
         } else {
            showToast(
               response.error || 'Nộp chứng chỉ thất bại.',
               ToastType.Error
            );
         }
      } catch (error: any) {
         showToast(
            error.message || 'Không thể nộp chứng chỉ.',
            ToastType.Error
         );
      } finally {
         setIsSubmitting(false);
      }
   };

   const resetForm = () => {
      setFormData({
         name: '',
         description: '',
         image: '',
      });
      setSelectedSubCategories([]);
      setOpenCategories([]);
      setIsSubmitted(false);
      setErrors({});
      setTouched({});
      if (fileInputRef.current) {
         fileInputRef.current.value = '';
      }
   };

   const handleClose = () => {
      if (!isSubmitting) {
         resetForm();
         onClose();
      }
   };

   // Success screen
   if (isSubmitted) {
      return (
         <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
               <div className="text-center space-y-4 py-4">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                     <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>

                  <div className="space-y-2">
                     <h3 className="text-lg font-semibold text-gray-900">
                        Chứng chỉ đã được gửi thành công!
                     </h3>
                     <p className="text-sm text-gray-600">
                        Chứng chỉ "{formData.name}" của bạn đã được gửi và đang
                        chờ xét duyệt.
                     </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                     <div className="flex items-center justify-center gap-2 text-blue-700">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">
                           Đang chờ xét duyệt
                        </span>
                     </div>
                     <p className="text-xs text-blue-600 mt-1">
                        Chúng tôi sẽ xem xét và phản hồi trong vòng 24-48 giờ
                     </p>
                  </div>
               </div>
            </DialogContent>
         </Dialog>
      );
   }

   return (
      <Dialog open={open} onOpenChange={handleClose}>
         <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
               <DialogTitle className="flex items-center gap-2">
                  <FilePlus className="w-5 h-5" />
                  Tạo chứng chỉ mới
               </DialogTitle>
               <DialogDescription>
                  Nhập thông tin chứng chỉ để lưu vào hồ sơ chuyên môn của bạn.
               </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="space-y-1">
                  <Label htmlFor="name">
                     Tên chứng chỉ <span className="text-red-500">*</span>
                  </Label>
                  <Input
                     id="name"
                     value={formData.name}
                     onChange={handleChange}
                     onBlur={() => handleBlur('name')}
                     className={
                        errors.name ? 'border-red-500 focus:border-red-500' : ''
                     }
                     placeholder="Nhập tên chứng chỉ (3-100 ký tự)"
                  />
                  {errors.name && (
                     <div className="flex items-center gap-1 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        {errors.name}
                     </div>
                  )}
               </div>

               <div className="space-y-3">
                  <Label>
                     Chọn danh mục <span className="text-red-500">*</span>
                     <span className="text-sm text-gray-500 font-normal">
                        {' '}
                        (có thể chọn từ nhiều danh mục khác nhau)
                     </span>
                  </Label>
                  <div
                     className={`border rounded-lg p-4 bg-gray-50 max-h-60 overflow-y-auto ${
                        errors.categories ? 'border-red-500' : ''
                     }`}
                  >
                     {isLoadingCategories ? (
                        <div className="text-center py-4">
                           <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                           <p className="text-sm text-muted-foreground">
                              Đang tải danh mục...
                           </p>
                        </div>
                     ) : categories.length > 0 ? (
                        categories.map((category) => (
                           <div key={category.id} className="mb-3 last:mb-0">
                              <Collapsible
                                 open={openCategories.includes(category.id)}
                                 onOpenChange={() =>
                                    toggleCategory(category.id)
                                 }
                              >
                                 <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-left bg-white border rounded-md hover:bg-gray-50 transition-colors">
                                    <span className="font-medium">
                                       {category.name}
                                    </span>
                                    <div className="flex items-center gap-2">
                                       {category.subCategories.length > 0 && (
                                          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                                             {category.subCategories.length} mục
                                             con
                                          </span>
                                       )}
                                       {category.subCategories.length > 0 &&
                                          (openCategories.includes(
                                             category.id
                                          ) ? (
                                             <ChevronDown className="w-4 h-4" />
                                          ) : (
                                             <ChevronRight className="w-4 h-4" />
                                          ))}
                                    </div>
                                 </CollapsibleTrigger>
                                 {category.subCategories.length > 0 && (
                                    <CollapsibleContent className="mt-2 ml-4">
                                       <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                          {category.subCategories.map(
                                             (subCategory) => (
                                                <div
                                                   key={subCategory.id}
                                                   className="flex items-center space-x-2"
                                                >
                                                   <Checkbox
                                                      id={subCategory.id}
                                                      checked={selectedSubCategories.includes(
                                                         subCategory.id
                                                      )}
                                                      onCheckedChange={() =>
                                                         handleSubCategoryToggle(
                                                            subCategory.id
                                                         )
                                                      }
                                                   />
                                                   <Label
                                                      htmlFor={subCategory.id}
                                                      className="text-sm font-normal cursor-pointer"
                                                   >
                                                      {subCategory.name}
                                                   </Label>
                                                </div>
                                             )
                                          )}
                                       </div>
                                    </CollapsibleContent>
                                 )}
                              </Collapsible>
                           </div>
                        ))
                     ) : (
                        <p className="text-center py-4 text-muted-foreground">
                           Không có danh mục nào.
                        </p>
                     )}
                  </div>

                  {errors.categories && (
                     <div className="flex items-center gap-1 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        {errors.categories}
                     </div>
                  )}

                  {selectedSubCategories.length > 0 && (
                     <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">
                           Danh mục đã chọn ({selectedSubCategories.length}):
                        </Label>
                        <div className="flex flex-wrap gap-2">
                           {selectedSubCategories.map((subCategoryId) => {
                              const info = getSubCategoryInfo(subCategoryId);
                              return (
                                 <Badge
                                    key={subCategoryId}
                                    variant="secondary"
                                    className="flex items-center gap-1"
                                 >
                                    <span className="text-xs text-gray-600">
                                       {info.categoryName}:
                                    </span>
                                    <span>{info.name}</span>
                                    <X
                                       className="w-3 h-3 cursor-pointer hover:text-red-500"
                                       onClick={() =>
                                          removeSubCategory(subCategoryId)
                                       }
                                    />
                                 </Badge>
                              );
                           })}
                        </div>
                     </div>
                  )}
               </div>

               <div className="space-y-1">
                  <Label htmlFor="cert-image">
                     Tải ảnh chứng chỉ <span className="text-red-500">*</span>
                     <span className="text-sm text-gray-500 font-normal">
                        {' '}
                        (JPEG, PNG, WebP - tối đa 5MB)
                     </span>
                  </Label>
                  <Input
                     ref={fileInputRef}
                     id="cert-image"
                     type="file"
                     accept="image/jpeg,image/jpg,image/png,image/webp"
                     onChange={handleFileChange}
                     className={
                        errors.file || errors.image ? 'border-red-500' : ''
                     }
                  />
                  {(errors.file || errors.image) && (
                     <div className="flex items-center gap-1 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        {errors.file || errors.image}
                     </div>
                  )}
               </div>

               <div className="space-y-1">
                  <Label htmlFor="image">Link ảnh chứng chỉ</Label>
                  <Input id="image" value={formData.image} readOnly />

                  {loading && (
                     <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Đang tải ảnh lên...
                     </div>
                  )}

                  {formData.image && (
                     <div className="mt-2">
                        <Label className="text-sm text-muted-foreground mb-1 block">
                           Ảnh đã tải lên:
                        </Label>
                        <img
                           src={formData.image || '/placeholder.svg'}
                           alt="Certificate Preview"
                           className="w-full max-w-xs rounded-md border"
                        />
                     </div>
                  )}
               </div>

               <div className="space-y-1">
                  <Label htmlFor="description">
                     Mô tả <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                     id="description"
                     value={formData.description}
                     onChange={handleChange}
                     onBlur={() => handleBlur('description')}
                     placeholder="Mô tả chi tiết về chứng chỉ, cơ quan cấp, nội dung học tập... (10-1000 ký tự)"
                     rows={4}
                     className={
                        errors.description
                           ? 'border-red-500 focus:border-red-500'
                           : ''
                     }
                  />
                  <div className="flex justify-between items-center">
                     {errors.description && (
                        <div className="flex items-center gap-1 text-sm text-red-600">
                           <AlertCircle className="w-4 h-4" />
                           {errors.description}
                        </div>
                     )}
                     <div className="text-xs text-gray-500 ml-auto">
                        {formData.description.length}/1000
                     </div>
                  </div>
               </div>

               <div className="flex justify-end space-x-2 pt-4">
                  <Button
                     type="button"
                     variant="outline"
                     onClick={handleClose}
                     disabled={isSubmitting}
                  >
                     Hủy
                  </Button>
                  <Button
                     type="submit"
                     disabled={loading || isLoadingCategories || isSubmitting}
                  >
                     {loading || isLoadingCategories || isSubmitting ? (
                        <>
                           <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                           Đang xử lý...
                        </>
                     ) : (
                        'Nộp chứng chỉ'
                     )}
                  </Button>
               </div>
            </form>
         </DialogContent>
      </Dialog>
   );
}
