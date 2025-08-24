'use client';

import type React from 'react';

import { useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { ImageIcon, Edit, Save, X, Upload, Crown } from 'lucide-react';
import type { Membership } from '@/types/membership';

interface CourseBasicInfoProps {
   isEditingMode: boolean;
   // Basic info props
   tempTitle: string;
   setTempTitle: (value: string) => void;
   tempDescription: string;
   setTempDescription: (value: string) => void;
   tempThumbnail: string;
   tempThumbnailFile: File | null;
   setTempThumbnailFile: (file: File | null) => void;
   onThumbnailUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
   // Pricing props
   tempPrice: number;
   setTempPrice: (value: number) => void;
   tempMembershipRequired: string[];
   onMembershipChange: (membershipId: string, checked: boolean) => void;
   membershipOptions: { id: string; label: string }[];
   // Rank props
   tempRank: number | null; // ✅ cho phép null
   onRankChange: (rank: number | null) => void; // ✅ trả về null khi “Không yêu cầu”
   memberships: Membership[];
   // Course data
   course: {
      title: string;
      description: string;
      thumbnail: string;
      price: number;
      membershipRequired: string[];
      rank: number | null; // ✅ hiển thị đúng khi null
   };
   // Actions
   onEdit: () => void;
   onSave: () => void;
   onCancel: () => void;
}

export function CourseBasicInfo(props: CourseBasicInfoProps) {
   const thumbnailInputRef = useRef<HTMLInputElement>(null);

   const formatPrice = (price: number) =>
      new Intl.NumberFormat('vi-VN').format(price) + ' VNĐ';

   // Validate giá: phải có và > 50.000
   const validatePrice = (price: number): string | null => {
      if (price === undefined || price === null || Number.isNaN(price)) {
         return 'Vui lòng nhập giá khóa học.';
      }
      if (price <= 50000) {
         return 'Giá khóa học phải lớn hơn 50.000 VNĐ.';
      }
      return null;
   };

   const priceError = props.isEditingMode
      ? validatePrice(props.tempPrice)
      : null;

   const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) =>
      props.setTempPrice(Number(e.target.value));

   const handleSaveClick = () => {
      const err = validatePrice(props.tempPrice);
      if (err) return; // chặn lưu nếu không hợp lệ
      props.onSave();
   };

   return (
      <div className="space-y-6">
         {/* Basic Information Card */}
         <Card className="overflow-hidden">
            <CardHeader className="bg-gray-50 border-b">
               <div className="flex flex-row items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                     <ImageIcon className="h-6 w-6 text-gray-600" />
                     Thông tin cơ bản
                  </CardTitle>
                  {!props.isEditingMode ? (
                     <Button
                        size="sm"
                        onClick={props.onEdit}
                        className="bg-rose-600 hover:bg-rose-700"
                     >
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                     </Button>
                  ) : (
                     <div className="flex gap-2">
                        <Button
                           size="sm"
                           variant="outline"
                           onClick={props.onCancel}
                           className="border-gray-300 hover:bg-gray-50 bg-transparent"
                        >
                           <X className="mr-2 h-4 w-4" />
                           Hủy
                        </Button>
                        <Button
                           size="sm"
                           onClick={handleSaveClick}
                           disabled={!!priceError}
                           className="bg-rose-600 hover:bg-rose-700 disabled:opacity-60"
                        >
                           <Save className="mr-2 h-4 w-4" />
                           Lưu
                        </Button>
                     </div>
                  )}
               </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
               {/* Thumbnail */}
               <div className="space-y-4">
                  <Label className="text-sm font-semibold text-gray-700">
                     Ảnh thumbnail
                  </Label>
                  <div className="relative group">
                     <div className="aspect-video relative rounded-xl overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50">
                        <img
                           src={
                              props.isEditingMode
                                 ? props.tempThumbnail
                                 : props.course.thumbnail || '/placeholder.svg'
                           }
                           alt={
                              props.isEditingMode
                                 ? props.tempTitle
                                 : props.course.title
                           }
                           className="w-full h-full object-cover"
                        />
                        {props.isEditingMode && (
                           <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                              <Button
                                 type="button"
                                 variant="secondary"
                                 size="sm"
                                 onClick={() =>
                                    thumbnailInputRef.current?.click()
                                 }
                                 className="bg-white bg-opacity-90 hover:bg-opacity-100"
                              >
                                 <Upload className="mr-2 h-4 w-4" />
                                 Thay đổi ảnh
                              </Button>
                           </div>
                        )}
                     </div>
                     {props.isEditingMode && (
                        <div className="mt-3">
                           <input
                              ref={thumbnailInputRef}
                              type="file"
                              accept="image/*"
                              onChange={props.onThumbnailUpload}
                              className="hidden"
                           />
                           <Button
                              type="button"
                              variant="outline"
                              onClick={() => thumbnailInputRef.current?.click()}
                              className="w-full border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                           >
                              <ImageIcon className="mr-2 h-4 w-4" />
                              {props.tempThumbnail
                                 ? 'Thay đổi ảnh khác'
                                 : 'Chọn ảnh thumbnail'}
                           </Button>
                        </div>
                     )}
                  </div>
               </div>

               {/* Title */}
               <div className="space-y-3">
                  <Label
                     htmlFor="title"
                     className="text-sm font-semibold text-gray-700"
                  >
                     Tên khóa học *
                  </Label>
                  {props.isEditingMode ? (
                     <Input
                        id="title"
                        value={props.tempTitle}
                        onChange={(e) => props.setTempTitle(e.target.value)}
                        placeholder="Nhập tên khóa học..."
                        className="text-lg font-medium border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                     />
                  ) : (
                     <div className="p-4 bg-gray-50 rounded-lg border">
                        <p className="text-xl font-bold text-gray-800">
                           {props.course.title}
                        </p>
                     </div>
                  )}
               </div>

               {/* Description */}
               <div className="space-y-3">
                  <Label
                     htmlFor="description"
                     className="text-sm font-semibold text-gray-700"
                  >
                     Mô tả khóa học
                  </Label>
                  {props.isEditingMode ? (
                     <Textarea
                        id="description"
                        value={props.tempDescription}
                        onChange={(e) =>
                           props.setTempDescription(e.target.value)
                        }
                        placeholder="Mô tả chi tiết về khóa học, nội dung, mục tiêu học tập..."
                        rows={5}
                        className="resize-none border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                     />
                  ) : (
                     <div className="p-4 bg-gray-50 rounded-lg border min-h-[120px]">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                           {props.course.description || 'Chưa có mô tả'}
                        </p>
                     </div>
                  )}
               </div>
            </CardContent>
         </Card>

         {/* Pricing & Membership */}
         <Card className="overflow-hidden">
            <CardHeader className="bg-gray-50 border-b">
               <CardTitle className="text-xl font-bold text-gray-800">
                  Thông tin giá & Yêu cầu
               </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
               {/* Price */}
               <div className="space-y-3">
                  <Label
                     htmlFor="edit-price"
                     className="text-sm font-semibold text-gray-700"
                  >
                     Giá khóa học
                  </Label>
                  {props.isEditingMode ? (
                     <div className="relative">
                        <Input
                           id="edit-price"
                           type="number"
                           value={props.tempPrice}
                           onChange={handlePriceChange}
                           placeholder="0"
                           min={0}
                           step={1000}
                           required
                           aria-invalid={!!priceError}
                           className={`pr-12 text-lg font-medium focus:border-gray-500 focus:ring-gray-500 ${
                              priceError
                                 ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                 : 'border-gray-300'
                           }`}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                           <span className="text-sm text-gray-500 font-medium">
                              VNĐ
                           </span>
                        </div>
                        {priceError && (
                           <p className="mt-2 text-sm text-red-600">
                              {priceError}
                           </p>
                        )}
                     </div>
                  ) : (
                     <div className="p-4 bg-gray-50 rounded-lg border">
                        <span className="text-2xl font-bold text-gray-800">
                           {formatPrice(props.course.price)}
                        </span>
                     </div>
                  )}
               </div>

               {/* Membership Required (rank) */}
               <div className="space-y-3">
                  <Label
                     htmlFor="rank"
                     className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                  >
                     <Crown className="h-4 w-4 text-yellow-600" />
                     Miễn phí cho membership
                  </Label>
                  {props.isEditingMode ? (
                     <Select
                        value={
                           props.tempRank === null
                              ? 'null'
                              : String(props.tempRank)
                        }
                        onValueChange={(value) =>
                           props.onRankChange(
                              value === 'null' ? null : Number(value)
                           )
                        }
                     >
                        <SelectTrigger className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500">
                           <SelectValue placeholder="Chọn yêu cầu membership" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="null">
                              <div className="flex items-center gap-2">
                                 <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                 Không yêu cầu
                              </div>
                           </SelectItem>
                           {props.memberships
                              .filter((m) => m.status === 1)
                              .map((membership) => (
                                 <SelectItem
                                    key={membership.id}
                                    value={String(membership.rank)}
                                 >
                                    <div className="flex items-center gap-2">
                                       <Crown className="h-3 w-3 text-yellow-500" />
                                       {membership.memberShipName}
                                    </div>
                                 </SelectItem>
                              ))}
                        </SelectContent>
                     </Select>
                  ) : (
                     <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        {props.course.rank !== null && props.course.rank > 0 ? (
                           <Badge
                              variant="outline"
                              className="bg-yellow-100 border-yellow-300 text-yellow-800 px-3 py-1"
                           >
                              <Crown className="h-3 w-3 mr-1" />
                              {props.memberships.find(
                                 (m) => m.rank === props.course.rank
                              )?.memberShipName || 'N/A'}
                           </Badge>
                        ) : (
                           <Badge
                              variant="secondary"
                              className="bg-gray-100 text-gray-600 px-3 py-1"
                           >
                              Không yêu cầu membership
                           </Badge>
                        )}
                     </div>
                  )}
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
