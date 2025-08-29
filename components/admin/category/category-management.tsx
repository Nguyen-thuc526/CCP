'use client';

import { useEffect, useState, useMemo } from 'react';
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
   const [editingCategory, setEditingCategory] = useState<Category | null>(
      null
   );
   const [creatingSubCategoryFor, setCreatingSubCategoryFor] =
      useState<Category | null>(null);
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

   // ✅ Fetch all categories
   const fetchCategories = () => {
      startLoading();
      getCategoryData()
         .then((data) => {
            setCategories(
               (data || []).map((cat) => ({
                  ...cat,
                  subCategories: cat.subCategories || [],
               }))
            );
         })
         .catch((err) => {
            console.error(err);
            setErrorMessage('Không thể tải danh mục');
         })
         .finally(stopLoading);
   };

   useEffect(() => {
      fetchCategories();
   }, []);

   // ✅ Hàm xử lý tạo sub-category và cập nhật state ngay lập tức
   const handleCreateSubCategory = async (categoryId: string, name: string) => {
      try {
         const newSub = await createSubCategory({
            name,
            categoryId,
         });

         if (!newSub?.id) {
            // ✅ Nếu API không trả về đủ data → gọi get all
            const allCats = await getCategoryData(); // có thể trả về null
            if (!Array.isArray(allCats)) {
               showToast('Không thể tải danh mục sau khi tạo', ToastType.Error);
               return;
            }

            const updatedCat = allCats.find((c) => c.id === categoryId);
            if (!updatedCat) {
               showToast(
                  'Không tìm thấy danh mục sau khi tạo',
                  ToastType.Error
               );
               return;
            }

            setCategories((prev) =>
               prev.map((cat) => (cat.id === updatedCat.id ? updatedCat : cat))
            );
         } else {
            // ✅ Cập nhật state ngay
            setCategories((prev) =>
               prev.map((cat) =>
                  cat.id === categoryId
                     ? {
                          ...cat,
                          subCategories: [
                             ...(cat.subCategories || []),
                             { ...newSub, name, status: 1 },
                          ],
                       }
                     : cat
               )
            );
         }

         showToast('Tạo chủ đề con thành công', ToastType.Success);
         setCreatingSubCategoryFor(null);
      } catch (error) {
         console.error(error);
         showToast('Tạo chủ đề con thất bại', ToastType.Error);
      }
   };

   // ✅ Create category
   const handleCategoryCreated = (newCategory: Category) => {
      setCategories((prev) => [
         ...prev,
         { ...newCategory, subCategories: newCategory.subCategories || [] },
      ]);
      setDialogOpen(false);
   };

   // ✅ Hide category
   const handleCategoryHidden = async (categoryId: string) => {
      try {
         await updateCategory({ id: categoryId, status: 0 });
         setCategories((prev) =>
            prev.map((cat) =>
               cat.id === categoryId ? { ...cat, status: 0 } : cat
            )
         );
         showToast('Ẩn danh mục thành công', ToastType.Success);
      } catch (err) {
         console.error('Ẩn danh mục thất bại', err);
         showToast('Ẩn danh mục thất bại', ToastType.Error);
      }
   };

   // ✅ Hide sub-category
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
         setCategories((prev) =>
            prev.map((cat) =>
               cat.id === categoryId
                  ? {
                       ...cat,
                       subCategories: cat.subCategories.map((sc) =>
                          sc.id === subCategory.id ? { ...sc, status: 0 } : sc
                       ),
                    }
                  : cat
            )
         );
         showToast('Ẩn chủ đề con thành công', ToastType.Success);
      } catch (error) {
         console.error(error);
         showToast('Ẩn chủ đề con thất bại', ToastType.Error);
      }
   };

   const filteredCategories = useMemo(() => {
      return categories
         .filter((category) => {
            const matchesSearch = category.name
               .toLowerCase()
               .includes(searchTerm.toLowerCase());
            const matchesStatus =
               statusFilter === -1 || category.status === statusFilter;
            return matchesSearch && matchesStatus;
         })
         .sort((a, b) =>
            a.name.localeCompare(b.name, 'vi', { sensitivity: 'base' })
         );
   }, [categories, searchTerm, statusFilter]);

   return (
      <div className="space-y-6">
         {/* Header */}
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Quản lý các Danh mục
               </h1>
               <p className="text-gray-600">
                  Quản lý hệ thống danh mục và danh mục con dùng cho các dịch
                  vụ, bài kiểm tra và nội dung tư vấn.
               </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
               <DialogTrigger asChild>
                  <Button onClick={() => setDialogOpen(true)}>
                     Tạo danh mục
                  </Button>
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
               <CategoryStats categories={categories} />

               <CategoryFilters
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
               />

               <CategoryList
                  categories={filteredCategories}
                  onCategoryUpdated={(categoryId) => {
                     const category = categories.find(
                        (c) => c.id === categoryId
                     );
                     if (category) setEditingCategory(category);
                  }}
                  onCategoryHidden={handleCategoryHidden}
                  onSubCategoryAdded={(categoryId) => {
                     const category = categories.find(
                        (c) => c.id === categoryId
                     );
                     if (category) setCreatingSubCategoryFor(category);
                  }}
                  onSubCategoryUpdated={(categoryId, subCategory) => {
                     setEditingSubCategory({ categoryId, subCategory });
                  }}
                  onSubCategoryHidden={handleSubCategoryHidden}
               />
            </>
         )}

         {/* Edit category dialog */}
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
                           setCategories((prev) =>
                              prev.map((cat) =>
                                 cat.id === editingCategory.id
                                    ? { ...cat, ...updates }
                                    : cat
                              )
                           );
                           showToast(
                              'Cập nhật danh mục thành công',
                              ToastType.Success
                           );
                           setEditingCategory(null);
                        } catch (err) {
                           console.error(err);
                           showToast(
                              'Cập nhật danh mục thất bại',
                              ToastType.Error
                           );
                        }
                     }}
                  />
               </DialogContent>
            </Dialog>
         )}

         {/* Add sub-category dialog */}
         {creatingSubCategoryFor && (
            <Dialog open onOpenChange={() => setCreatingSubCategoryFor(null)}>
               <DialogContent>
                  <DialogHeader>
                     <DialogTitle>Thêm chủ đề con</DialogTitle>
                  </DialogHeader>
                  <AddSubCategoryForm
                     onClose={() => setCreatingSubCategoryFor(null)}
                     onSubmit={(name) => {
                        if (creatingSubCategoryFor) {
                           handleCreateSubCategory(
                              creatingSubCategoryFor.id,
                              name
                           );
                        }
                     }}
                  />
               </DialogContent>
            </Dialog>
         )}

         {/* Edit sub-category dialog */}
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
                           setCategories((prev) =>
                              prev.map((cat) =>
                                 cat.id === editingSubCategory.categoryId
                                    ? {
                                         ...cat,
                                         subCategories: cat.subCategories.map(
                                            (sc) =>
                                               sc.id ===
                                               editingSubCategory.subCategory.id
                                                  ? { ...sc, ...updates }
                                                  : sc
                                         ),
                                      }
                                    : cat
                              )
                           );
                           showToast(
                              'Cập nhật chủ đề con thành công',
                              ToastType.Success
                           );
                           setEditingSubCategory(null);
                        } catch (error) {
                           console.error(error);
                           showToast(
                              'Cập nhật chủ đề con thất bại',
                              ToastType.Error
                           );
                        }
                     }}
                  />
               </DialogContent>
            </Dialog>
         )}
      </div>
   );
}
