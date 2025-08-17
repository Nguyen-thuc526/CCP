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
         uploadImage({
            file,
            onSuccess: (url) => {
               setFormData((prev) => ({ ...prev, image: url }));
            },
            onError: (err) => {
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
   };

   const handleSubCategoryToggle = (subCategoryId: string) => {
      setSelectedSubCategories((prev) => {
         if (prev.includes(subCategoryId)) {
            return prev.filter((id) => id !== subCategoryId);
         } else {
            return [...prev, subCategoryId];
         }
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
      setIsSubmitting(true);

      try {
         const submittedData = {
            name: formData.name,
            description: formData.description,
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
                  <Label htmlFor="name">Tên chứng chỉ</Label>
                  <Input
                     id="name"
                     value={formData.name}
                     onChange={handleChange}
                     required
                  />
               </div>

               <div className="space-y-3">
                  <Label>
                     Chọn danh mục (có thể chọn từ nhiều danh mục khác nhau)
                  </Label>
                  <div className="border rounded-lg p-4 bg-gray-50 max-h-60 overflow-y-auto">
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
                  <Label htmlFor="cert-image">Tải ảnh chứng chỉ</Label>
                  <Input
                     ref={fileInputRef}
                     id="cert-image"
                     type="file"
                     accept="image/*"
                     onChange={handleFileChange}
                  />
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
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                     id="description"
                     value={formData.description}
                     onChange={handleChange}
                     placeholder="Mô tả chi tiết về chứng chỉ, cơ quan cấp, nội dung học tập..."
                     rows={4}
                  />
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
