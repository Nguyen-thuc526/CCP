'use client';

import { useEffect, useState } from 'react';
import {
   createSubCategory,
   getCategoryData,
   updateCategory,
   updateSubCategory,
} from '@/services/categoryService';
import type { Category } from '@/types/category';

import CategoryStats from './category-stats';
import CategoryFilters from './category-filters';
import CategoryList from './category-list';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useErrorLoadingWithUI } from '@/hooks/useErrorLoading';
import CreateCategoryForm from './create-category-form';
import UpdateCategoryForm from './update-category-form';
import { SubCategory } from '@/types/certification';
import { useToast, ToastType } from '@/hooks/useToast';
import AddSubCategoryForm from './add-subcategory-form';
import EditSubCategoryForm from './edit-subcategory-form';

export default function CategoryManagement() {
   const [categories, setCategories] = useState<Category[]>([]);
   const [searchTerm, setSearchTerm] = useState('');
   const [statusFilter, setStatusFilter] = useState<number>(-1);
   const [dialogOpen, setDialogOpen] = useState(false);
   const [editingCategory, setEditingCategory] = useState<Category | null>(null);
   const [creatingSubCategoryFor, setCreatingSubCategoryFor] = useState<Category | null>(null);
   const [editingSubCategory, setEditingSubCategory] = useState<{
      categoryId: string;
      subCategory: SubCategory;
   } | null>(null);
   const { showToast } = useToast();
   const {
      loading,
      error,
      startLoading,
      stopLoading,
      setErrorMessage,
      renderStatus,
   } = useErrorLoadingWithUI();

   const fetchCategories = () => {
      startLoading();
      getCategoryData()
         .then(setCategories)
         .catch((err) => {
            console.error(err);
            setErrorMessage('Không thể tải danh mục');
         })
         .finally(stopLoading);
   };

   useEffect(() => {
      fetchCategories();
   }, []);

   const handleCategoryCreated = () => {
      fetchCategories();
      setDialogOpen(false);
   };

   const handleCategoryHidden = async (categoryId: string) => {
      const category = categories.find((cat) => cat.id === categoryId);
      if (!category) return;

      const updatedCategory = { ...category, status: 0 };

      try {
         await updateCategory(updatedCategory);
         fetchCategories();
         showToast('Ẩn danh mục thành công', ToastType.Success);
      } catch (err) {
         console.error('Ẩn danh mục thất bại', err);
         setErrorMessage('Ẩn danh mục thất bại');
         showToast('Ẩn danh mục thất bại', ToastType.Error);
      }
   };

   const handleSubCategoryHidden = async (
      categoryId: string,
      subCategory: SubCategory
   ) => {
      try {
         await updateSubCategory({
            ...subCategory,
            status: 0,
            categoryId,
         });
         fetchCategories();
         showToast('Ẩn chủ đề con thành công', ToastType.Success);
      } catch (error) {
         console.error(error);
         showToast('Ẩn chủ đề con thất bại', ToastType.Error);
      }
   };

   const filteredCategories = categories.filter((category) => {
      const matchesSearch = category.name
         .toLowerCase()
         .includes(searchTerm.toLowerCase());
      const matchesStatus =
         statusFilter === -1 || category.status === statusFilter;
      return matchesSearch && matchesStatus;
   });

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Quản lý Category</h1>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
               <DialogTrigger asChild>
                  <Button onClick={() => setDialogOpen(true)}>Tạo danh mục</Button>
               </DialogTrigger>
               <DialogContent>
                  <DialogHeader>
                     <DialogTitle>Tạo danh mục mới</DialogTitle>
                  </DialogHeader>
                  <CreateCategoryForm
                     categories={categories}
                     onCreated={handleCategoryCreated}
                     onClose={() => setDialogOpen(false)}
                  />
               </DialogContent>
            </Dialog>
         </div>

         {renderStatus({ onRetry: fetchCategories })}

         {!loading && !error && (
            <>
               <CategoryStats categories={filteredCategories} />

               <CategoryFilters
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
               />

               <CategoryList
                  categories={filteredCategories}
                  onCategoryUpdated={(categoryId) => {
                     const category = categories.find((c) => c.id === categoryId);
                     if (category) setEditingCategory(category);
                  }}
                  onCategoryHidden={handleCategoryHidden}
                  onSubCategoryAdded={(categoryId) => {
                     const category = categories.find((c) => c.id === categoryId);
                     if (category) setCreatingSubCategoryFor(category);
                  }}
                  onSubCategoryUpdated={(categoryId, subCategory) => {
                     setEditingSubCategory({ categoryId, subCategory });
                  }}

                  onSubCategoryHidden={handleSubCategoryHidden}
               />
            </>
         )}

         {/* ✅ Dialog chỉnh sửa danh mục */}
         {editingCategory && (
            <Dialog open onOpenChange={() => setEditingCategory(null)}>
               <DialogContent>
                  <DialogHeader>
                     <DialogTitle>Chỉnh sửa danh mục</DialogTitle>
                  </DialogHeader>
                  <UpdateCategoryForm
                     category={editingCategory}
                     onClose={() => setEditingCategory(null)}
                     onUpdated={async (updates) => {
                        try {
                           await updateCategory({
                              id: editingCategory.id,
                              ...updates,
                           });
                           fetchCategories();
                           showToast('Cập nhật danh mục thành công', ToastType.Success);
                           setEditingCategory(null);
                        } catch (err: any) {
                           console.error(err);
                           showToast('Cập nhật danh mục thất bại', ToastType.Error);
                        }
                     }}
                  />
               </DialogContent>
            </Dialog>
         )}

         {/* ✅ Dialog tạo sub-category */}
         {creatingSubCategoryFor && (
            <Dialog open onOpenChange={() => setCreatingSubCategoryFor(null)}>
               <DialogContent>
                  <DialogHeader>
                     <DialogTitle>Thêm chủ đề con</DialogTitle>
                  </DialogHeader>
                  <AddSubCategoryForm
                     onClose={() => setCreatingSubCategoryFor(null)}
                     onSubmit={async (name: string) => {
                        try {
                           await createSubCategory({
                              name,
                              categoryId: creatingSubCategoryFor.id,
                           });

                           fetchCategories();
                           showToast('Tạo chủ đề con thành công', ToastType.Success);
                           setCreatingSubCategoryFor(null);
                        } catch (error) {
                           console.error(error);
                           showToast('Tạo chủ đề con thất bại', ToastType.Error);
                        }
                     }}
                  />
               </DialogContent>
            </Dialog>

         )}
         {editingSubCategory && (
            <Dialog open onOpenChange={() => setEditingSubCategory(null)}>
               <DialogContent>
                  <DialogHeader>
                     <DialogTitle>Chỉnh sửa chủ đề con</DialogTitle>
                  </DialogHeader>
                  <EditSubCategoryForm
                     subCategory={editingSubCategory.subCategory}
                     onClose={() => setEditingSubCategory(null)}
                     onSubmit={async (updates) => {
                        try {
                           await updateSubCategory({
                              ...editingSubCategory.subCategory,
                              ...updates,
                              categoryId: editingSubCategory.categoryId,
                           });
                           showToast('Cập nhật chủ đề con thành công', ToastType.Success);
                           fetchCategories();
                           setEditingSubCategory(null);
                        } catch (error) {
                           console.error(error);
                           showToast('Cập nhật chủ đề con thất bại', ToastType.Error);
                        }
                     }}
                  />
               </DialogContent>
            </Dialog>
         )}

      </div>
   );
}
