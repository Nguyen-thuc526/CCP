'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tag, Edit, Save, X, ChevronDown, ChevronRight } from 'lucide-react';
import {
   Collapsible,
   CollapsibleContent,
   CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface Category {
   id: string;
   name: string;
   subCategories: SubCategory[];
}

interface SubCategory {
   id: string;
   name: string;
   categoryId: string;
}

interface CourseCategoriesProps {
   isEditingMode: boolean;
   tempSubCategories: string[];
   onSubCategoryChange: (subCategoryId: string, checked: boolean) => void;
   categories: Category[];
   isLoadingCategories: boolean;
   course: {
      subCategories: string[];
   };
   onEdit: () => void;
   onSave: () => void;
   onCancel: () => void;
}

export function CourseCategories(props: CourseCategoriesProps) {
   const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());

   const toggleCategory = (categoryId: string) => {
      const newOpenCategories = new Set(openCategories);
      if (newOpenCategories.has(categoryId)) {
         newOpenCategories.delete(categoryId);
      } else {
         newOpenCategories.add(categoryId);
      }
      setOpenCategories(newOpenCategories);
   };

   const getSubCategoryName = (subCategoryId: string): string => {
      for (const category of props.categories) {
         const subCategory = category.subCategories.find(
            (sub) => sub.id === subCategoryId
         );
         if (subCategory) {
            return subCategory.name;
         }
      }
      return subCategoryId;
   };

   // Tự động mở categories có subcategories được chọn khi vào edit mode
   const handleEdit = () => {
      const selectedCategoryIds = new Set<string>();
      props.categories.forEach((category) => {
         const hasSelectedSub = category.subCategories.some((sub) =>
            props.tempSubCategories.includes(sub.id)
         );
         if (hasSelectedSub) {
            selectedCategoryIds.add(category.id);
         }
      });
      setOpenCategories(selectedCategoryIds);
      props.onEdit();
   };

   return (
      <Card>
         <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Thông tin danh mục</CardTitle>
            {!props.isEditingMode ? (
               <Button size="sm" onClick={handleEdit}>
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
            <div className="space-y-2">
               <p className="text-sm font-medium mb-2">Danh mục phụ:</p>
               {props.isEditingMode ? (
                  <div className="space-y-2">
                     {props.isLoadingCategories ? (
                        <div className="text-sm text-muted-foreground">
                           Đang tải danh mục...
                        </div>
                     ) : (
                        <div className="space-y-3">
                           {props.categories.map((category) => (
                              <Collapsible
                                 key={category.id}
                                 open={openCategories.has(category.id)}
                                 onOpenChange={() =>
                                    toggleCategory(category.id)
                                 }
                              >
                                 <CollapsibleTrigger asChild>
                                    <Button
                                       variant="ghost"
                                       className="w-full justify-start p-2 h-auto font-medium"
                                    >
                                       {openCategories.has(category.id) ? (
                                          <ChevronDown className="mr-2 h-4 w-4" />
                                       ) : (
                                          <ChevronRight className="mr-2 h-4 w-4" />
                                       )}
                                       {category.name}
                                       <Badge
                                          variant="secondary"
                                          className="ml-2"
                                       >
                                          {category.subCategories.length}
                                       </Badge>
                                    </Button>
                                 </CollapsibleTrigger>
                                 <CollapsibleContent className="ml-6 space-y-2 pt-2">
                                    {category.subCategories.map(
                                       (subCategory) => (
                                          <div
                                             key={subCategory.id}
                                             className="flex items-center space-x-2"
                                          >
                                             <Checkbox
                                                id={`edit-subcategory-${subCategory.id}`}
                                                checked={props.tempSubCategories.includes(
                                                   subCategory.id
                                                )}
                                                onCheckedChange={(checked) =>
                                                   props.onSubCategoryChange(
                                                      subCategory.id,
                                                      checked as boolean
                                                   )
                                                }
                                             />
                                             <Label
                                                htmlFor={`edit-subcategory-${subCategory.id}`}
                                                className="text-sm"
                                             >
                                                {subCategory.name}
                                             </Label>
                                          </div>
                                       )
                                    )}
                                 </CollapsibleContent>
                              </Collapsible>
                           ))}
                        </div>
                     )}
                  </div>
               ) : (
                  <div className="flex gap-2 flex-wrap">
                     {props.course.subCategories.length > 0 ? (
                        props.course.subCategories.map((subCategoryId) => (
                           <Badge key={subCategoryId} variant="outline">
                              <Tag className="mr-1 h-3 w-3" />
                              {getSubCategoryName(subCategoryId)}
                           </Badge>
                        ))
                     ) : (
                        <Badge variant="secondary">Không có danh mục phụ</Badge>
                     )}
                  </div>
               )}
            </div>
         </CardContent>
      </Card>
   );
}
