'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Edit, Save, X } from 'lucide-react';

interface CoursePricingProps {
   isEditingMode: boolean;
   tempIsFree: boolean;
   setTempIsFree: (value: boolean) => void;
   tempPrice: number;
   setTempPrice: (value: number) => void;
   tempMembershipRequired: string[];
   onMembershipChange: (membershipId: string, checked: boolean) => void;
   course: {
      isFree: boolean;
      price: number;
      membershipRequired: string[];
   };
   membershipOptions: { id: string; label: string }[];
   onEdit: () => void;
   onSave: () => void;
   onCancel: () => void;
}

export function CoursePricing(props: CoursePricingProps) {
   return (
      <Card>
         <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Thông tin giá</CardTitle>
            {!props.isEditingMode ? (
               <Button size="sm" onClick={props.onEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Chỉnh sửa
               </Button>
            ) : (
               <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={props.onCancel}>
                     <X className="mr-2 h-4 w-4" />
                     Hủy
                  </Button>
                  <Button size="sm" onClick={props.onSave}>
                     <Save className="mr-2 h-4 w-4" />
                     Lưu
                  </Button>
               </div>
            )}
         </CardHeader>
         <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
               <DollarSign className="h-4 w-4" />
               {props.isEditingMode ? (
                  <div className="flex items-center space-x-2">
                     <Switch
                        id="edit-is-free"
                        checked={props.tempIsFree}
                        onCheckedChange={props.setTempIsFree}
                     />
                     <Label htmlFor="edit-is-free">Khóa học miễn phí</Label>
                  </div>
               ) : props.course.isFree ? (
                  <span className="font-semibold text-green-600">Miễn phí</span>
               ) : (
                  <span className="font-semibold">
                     {props.course.price.toLocaleString('vi-VN')} VNĐ
                  </span>
               )}
            </div>

            {!props.tempIsFree && props.isEditingMode && (
               <div className="space-y-2">
                  <Label htmlFor="edit-price">Giá khóa học (VNĐ)</Label>
                  <Input
                     id="edit-price"
                     type="number"
                     value={props.tempPrice}
                     onChange={(e) =>
                        props.setTempPrice(Number(e.target.value))
                     }
                     placeholder="0"
                  />
               </div>
            )}

            <div className="space-y-4">
               <p className="text-sm font-medium mb-2">Yêu cầu membership:</p>
               {props.isEditingMode ? (
                  <div className="space-y-2">
                     {props.membershipOptions.map((option) => (
                        <div
                           key={option.id}
                           className="flex items-center space-x-2"
                        >
                           <Checkbox
                              id={`edit-membership-${option.id}`}
                              checked={props.tempMembershipRequired.includes(
                                 option.id
                              )}
                              onCheckedChange={(checked) =>
                                 props.onMembershipChange(
                                    option.id,
                                    checked as boolean
                                 )
                              }
                           />
                           <Label htmlFor={`edit-membership-${option.id}`}>
                              {option.label}
                           </Label>
                        </div>
                     ))}
                  </div>
               ) : (
                  <div className="flex gap-2 flex-wrap">
                     {props.course.membershipRequired.length > 0 ? (
                        props.course.membershipRequired.map((membership) => (
                           <Badge key={membership} variant="outline">
                              {props.membershipOptions.find(
                                 (opt) => opt.id === membership
                              )?.label || membership}
                           </Badge>
                        ))
                     ) : (
                        <Badge variant="secondary">Không yêu cầu</Badge>
                     )}
                  </div>
               )}
            </div>
         </CardContent>
      </Card>
   );
}
