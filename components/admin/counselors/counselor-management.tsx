'use client';

import { useState, useEffect, useMemo } from 'react';
import { Counselor } from '@/types/counselor';
import { getCounselors, updateCounselorStatus } from '@/services/adminService';
import { useErrorLoadingWithUI } from '@/hooks/useErrorLoading';
import { useToast, ToastType } from '@/hooks/useToast';
import CounselorTabs from './counselors-tabs';
import CounselorStats from './counselor-stats';
import CounselorFilters from './counselor-filter';

export function CounselorManagement() {
   const [rawCounselors, setRawCounselors] = useState<Counselor[]>([]);
   const [filteredCounselors, setFilteredCounselors] = useState<Counselor[]>(
      []
   );
   const [statusFilter, setStatusFilter] = useState('all');
   const [searchTerm, setSearchTerm] = useState('');
   const [page, setPage] = useState(1);
   const backendPageSize = 1000;
   const frontendPageSize = 10;
   const { showToast } = useToast();

   const {
      loading,
      error,
      startLoading,
      stopLoading,
      setErrorMessage,
      renderStatus,
   } = useErrorLoadingWithUI();

   const fetchCounselors = async () => {
      startLoading();
      try {
         const res = await getCounselors({
            PageNumber: 1,
            PageSize: backendPageSize,
         });
         setRawCounselors(res.items);
      } catch (err) {
         console.error(err);
         setErrorMessage(
            'Không thể tải danh sách chuyên viên. Vui lòng thử lại.'
         );
      } finally {
         stopLoading();
      }
   };

   useEffect(() => {
      fetchCounselors();
   }, []);

   // Apply search + filter
   useEffect(() => {
      let filtered = rawCounselors;

      if (statusFilter !== 'all') {
         filtered = filtered.filter(
            (c) => c.status.toString() === statusFilter
         );
      }

      if (searchTerm) {
         const lower = searchTerm.toLowerCase();
         filtered = filtered.filter(
            (c) =>
               c.fullname.toLowerCase().includes(lower) ||
               c.phone?.toLowerCase().includes(lower)
         );
      }

      // ✅ Sort by fullname (A-Z, có hỗ trợ tiếng Việt)
      filtered = filtered.sort((a, b) =>
         a.fullname.localeCompare(b.fullname, 'vi', { sensitivity: 'base' })
      );

      setFilteredCounselors(filtered);
      setPage(1); // reset về trang đầu khi filter/search thay đổi
   }, [rawCounselors, searchTerm, statusFilter]);

   // Pagination trên frontend
   const paginatedCounselors = useMemo(() => {
      const startIndex = (page - 1) * frontendPageSize;
      return filteredCounselors.slice(
         startIndex,
         startIndex + frontendPageSize
      );
   }, [filteredCounselors, page]);

   const handleStatusChange = async (
      counselorId: string,
      newStatus: number
   ) => {
      try {
         await updateCounselorStatus({ counselorId, status: newStatus });
         setRawCounselors((prev) =>
            prev.map((c) =>
               c.id === counselorId ? { ...c, status: newStatus } : c
            )
         );
         showToast(
            'Đã cập nhật trạng thái chuyên viên thành công',
            ToastType.Success
         );
      } catch (error) {
         console.error('Lỗi cập nhật trạng thái:', error);
         showToast(
            'Không thể cập nhật trạng thái. Vui lòng thử lại.',
            ToastType.Error
         );
      }
   };

   return (
      <div className="space-y-6">
         {renderStatus({ onRetry: fetchCounselors })}

         {!loading && !error && (
            <>
               <CounselorStats counselors={filteredCounselors} />
               <CounselorFilters
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
               />
               <CounselorTabs
                  counselors={paginatedCounselors}
                  handleStatusChange={handleStatusChange}
                  page={page}
                  pageSize={frontendPageSize}
                  totalCount={filteredCounselors.length}
                  onPageChange={setPage}
               />
            </>
         )}
      </div>
   );
}
