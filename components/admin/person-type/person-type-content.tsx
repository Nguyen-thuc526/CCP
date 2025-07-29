'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { usePersonTypes } from '@/hooks/use-person-type';
import { Category } from '@/types/category';
import {
   CreatePersonTypePayload,
   PersonType,
   UpdatePersonTypePayload,
} from '@/types/person-type';
import { SearchFilter } from './search-filter';
import { PersonalityStats } from './person-type-stats';
import { PersonalityGrid } from './person-type-grid';
import { AddPersonalityModal } from './add-person-type-modal';
import { EditPersonalityModal } from './edit-person-type-modal';
import { EmptyState } from './empty-state';
import ViewPersonalityModal from './view-person-type-modal';
import { Router } from 'next/router';
import { useRouter } from 'next/navigation';

interface PersonalityTabContentProps {
   surveyId: string;
   surveyName: string;
   isActive: boolean;
}

export function PersonalityTabContent({
   surveyId,
   surveyName,
   isActive,
}: PersonalityTabContentProps) {
   const { personTypes, handleCreate, handleUpdate, refetch } = usePersonTypes({
      surveyId,
      enabled: isActive,
   });
   const router = useRouter();
   const [searchTerm, setSearchTerm] = useState('');
   const [selectedCategory, setSelectedCategory] = useState<string>('all');
   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
   const [selectedPersonType, setSelectedPersonType] =
      useState<PersonType | null>(null);
   const [loading, setLoading] = useState(false);

   const fetchData = async () => {
      setLoading(true);
      await refetch();
      setLoading(false);
   };

   useEffect(() => {
      if (isActive) {
         fetchData();
      }
   }, [isActive]);

   const categories: Category[] = Array.from(
      new Map(
         personTypes
            .filter((p) => p.category)
            .map((p) => [p.category.id, p.category])
      ).values()
   );

   const filteredPersonTypes = personTypes.filter((person) => {
      const matchesCategory =
         selectedCategory === 'all' || person.categoryId === selectedCategory;
      const matchesSearch =
         person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         person.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
   });

   const handleAddNew = () => {
      setIsAddModalOpen(true);
   };

   const handleEdit = (personType: PersonType) => {
      setSelectedPersonType(personType);
      setIsEditModalOpen(true);
   };

   const handleView = (personType: PersonType) => {
      setSelectedPersonType(personType);
      setIsViewModalOpen(true);
   };

   const handleCompare = (personTypeId: string) => {
      router.push(`/admin/person-type/compare/${personTypeId}`);
   };

   const handleAddSubmit = async (
      formData: Partial<PersonType>
   ): Promise<boolean> => {
      const payload: CreatePersonTypePayload = {
         name: formData.name || '',
         description: formData.description || '',
         detail: formData.detail || '',
         image: formData.image || '',
         surveyId: surveyId,
         categoryId: formData.categoryId || '',
      };

      const success = await handleCreate(payload);
      if (success) {
         setIsAddModalOpen(false);
      }
      return success;
   };

   const handleEditSubmit = async (
      formData: Partial<PersonType>
   ): Promise<boolean> => {
      if (!selectedPersonType) return false;

      const payload: UpdatePersonTypePayload = {
         id: selectedPersonType.id,
         description: formData.description || '',
         detail: formData.detail || '',
         image: formData.image || '',
         categoryId: formData.categoryId || '',
      };

      const success = await handleUpdate(payload);
      if (success) {
         setIsEditModalOpen(false);
         setSelectedPersonType(null);
      }
      return success;
   };

   const handleSearchChange = (value: string) => {
      setSearchTerm(value);
   };

   const handleCategoryChange = (value: string) => {
      setSelectedCategory(value);
   };

   if (loading) {
      return (
         <p className="text-muted-foreground text-center">
            Đang tải dữ liệu...
         </p>
      );
   }

   return (
      <div className="space-y-6">
         <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
               <h2 className="text-xl font-semibold">Danh Sách {surveyName}</h2>
               <p className="text-sm text-muted-foreground">
                  Tổng cộng: {personTypes.length} loại tính cách
               </p>
            </div>
            {/* <Button onClick={handleAddNew} className="w-fit">
          <Plus className="mr-2 h-4 w-4" />
          Thêm Loại Tính Cách
        </Button> */}
         </div>

         <SearchFilter
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            categories={categories}
            onSearchChange={handleSearchChange}
            onCategoryChange={handleCategoryChange}
         />

         {/* <PersonalityStats categories={categories} personTypes={personTypes} /> */}

         {filteredPersonTypes.length > 0 ? (
            <PersonalityGrid
               personTypes={filteredPersonTypes}
               onView={handleView}
               onEdit={handleEdit}
               onCompare={handleCompare}
            />
         ) : (
            <EmptyState
               hasFilters={searchTerm !== '' || selectedCategory !== 'all'}
               onAddNew={handleAddNew}
               emptyMessage={`Chưa có loại tính cách ${surveyName} nào`}
               emptyDescription={`Bắt đầu bằng cách thêm loại tính cách ${surveyName} đầu tiên`}
            />
         )}

         <AddPersonalityModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSubmit={handleAddSubmit}
            categories={categories}
            surveyName={surveyName}
         />

         {selectedPersonType && (
            <EditPersonalityModal
               isOpen={isEditModalOpen}
               onClose={() => {
                  setIsEditModalOpen(false);
                  setSelectedPersonType(null);
               }}
               onSubmit={handleEditSubmit}
               categories={categories}
               personType={selectedPersonType}
            />
         )}

         {selectedPersonType && (
            <ViewPersonalityModal
               isOpen={isViewModalOpen}
               onClose={() => {
                  setIsViewModalOpen(false);
                  setSelectedPersonType(null);
               }}
               personType={selectedPersonType}
            />
         )}
      </div>
   );
}
