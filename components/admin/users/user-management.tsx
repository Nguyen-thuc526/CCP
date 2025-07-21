'use client';

import { useState, useEffect, useMemo } from 'react';
import { Member } from '@/types/member';
import { getMembers, updateMemberStatus } from '@/services/adminService';
import MemberStats from './member-stats';
import MemberFilters from './member-filters';
import MemberTabs from './member-tabs';
import { useErrorLoadingWithUI } from '@/hooks/useErrorLoading';
import { useToast, ToastType } from '@/hooks/useToast';

export function MemberManagement() {
   const [rawMembers, setRawMembers] = useState<Member[]>([]);
   const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
   const [searchTerm, setSearchTerm] = useState('');
   const [statusFilter, setStatusFilter] = useState('all');
   const [selectedMember, setSelectedMember] = useState<Member | null>(null);
   const [showMemberDetail, setShowMemberDetail] = useState(false);
   const { showToast } = useToast();

   // Backend paging
   const [backendPage] = useState(1); // chỉ lấy 1 trang lớn
   const [backendPageSize] = useState(1000); // gọi hết 1 lần

   // Frontend paging
   const [page, setPage] = useState(1);
   const frontendPageSize = 10;

   const [totalCount, setTotalCount] = useState(0);

   const {
      loading,
      error,
      startLoading,
      stopLoading,
      setErrorMessage,
      renderStatus,
   } = useErrorLoadingWithUI();

   const fetchMembers = async () => {
      startLoading();
      try {
         const response = await getMembers({
            PageNumber: backendPage,
            PageSize: backendPageSize,
         });

         setRawMembers(response.items);
         setTotalCount(response.totalCount || response.items.length);
      } catch (err) {
         console.error(err);
         setErrorMessage('Không thể tải danh sách thành viên. Vui lòng thử lại.');
      } finally {
         stopLoading();
      }
   };

   useEffect(() => {
      fetchMembers();
   }, []);

   useEffect(() => {
      let filtered = rawMembers;

      if (statusFilter !== 'all') {
         filtered = filtered.filter(
            (m) => m.status.toString() === statusFilter
         );
      }

      if (searchTerm) {
         const lower = searchTerm.toLowerCase();
         filtered = filtered.filter(
            (m) =>
               m.fullname.toLowerCase().includes(lower) ||
               m.phone?.toLowerCase().includes(lower)
         );
      }

      setFilteredMembers(filtered);
      setPage(1); // reset về trang đầu khi filter/search thay đổi
   }, [rawMembers, searchTerm, statusFilter]);

   const handleStatusChange = async (memberId: string, newStatus: number) => {
      try {
         await updateMemberStatus({ memberId, status: newStatus });

         setRawMembers((prev) =>
            prev.map((member) =>
               member.id === memberId
                  ? { ...member, status: newStatus }
                  : member
            )
         );

         showToast('Đã cập nhật trạng thái member thành công', ToastType.Success);
      } catch (error) {
         console.error('Lỗi cập nhật trạng thái:', error);
         setErrorMessage('Không thể cập nhật trạng thái. Vui lòng thử lại.');
         showToast('Lỗi cập nhật trạng thái thành viên.', ToastType.Error);
      }
   };

   const openMemberDetail = (member: Member) => {
      setSelectedMember(member);
      setShowMemberDetail(true);
   };

   // Phân trang client: cắt 10 người/page từ filteredMembers
   const paginatedMembers = useMemo(() => {
      const startIndex = (page - 1) * frontendPageSize;
      return filteredMembers.slice(startIndex, startIndex + frontendPageSize);
   }, [filteredMembers, page]);

   return (
      <>
         {renderStatus({ onRetry: fetchMembers })}
         {!loading && !error && (
            <>
               <MemberStats members={rawMembers} />
               <MemberFilters
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
               />
               <MemberTabs
                  members={paginatedMembers}
                  searchTerm={searchTerm}
                  statusFilter={statusFilter}
                  handleStatusChange={handleStatusChange}
                  openMemberDetail={openMemberDetail}
                  page={page}
                  pageSize={frontendPageSize}
                  totalCount={filteredMembers.length}
                  onPageChange={setPage}
               />
            </>
         )}
      </>
   );
}
