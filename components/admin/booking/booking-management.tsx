'use client';

import { useEffect, useState } from 'react';
import {
   Pagination,
   PaginationContent,
   PaginationItem,
   PaginationLink,
   PaginationPrevious,
   PaginationNext,
} from '@/components/ui/pagination';
import { getBookings } from '@/services/adminService';
import { updateBookingStatus } from '@/services/bookingService';
import type { BookingAdmin } from '@/types/booking';
import type { BookingStatus } from '@/utils/enum';
import { useToast, ToastType } from '@/hooks/useToast';
import { BookingFilters } from './booking-filter';
import { BookingStats } from './booking-stat';
import { BookingTable } from './booking-table';
import { BookingDetailsModal } from './booking-details-modal';
import { rawListeners } from 'process';

const PAGE_SIZE = 10;

export default function BookingManagement() {
   const [allBookings, setAllBookings] = useState<BookingAdmin[]>([]);
   const [total, setTotal] = useState(0);
   const [currentPage, setCurrentPage] = useState(1);
   const [loading, setLoading] = useState(false);

   const [searchQuery, setSearchQuery] = useState('');
   const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>(
      'all'
   );
   const [typeFilter, setTypeFilter] = useState<
      'all' | 'individual' | 'couple'
   >('all');

   // Modal states
   const [selectedBooking, setSelectedBooking] = useState<BookingAdmin | null>(
      null
   );
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isUpdating, setIsUpdating] = useState(false);

   const { showToast } = useToast();
   const totalPages = Math.ceil(total / PAGE_SIZE);

   const fetchBookings = async () => {
      setLoading(true);
      try {
         const response = await getBookings({
            PageNumber: 1,
            PageSize: 99999, // ✅ lấy hết từ BE
            Status: statusFilter === 'all' ? undefined : statusFilter,
         });

         const data = Array.isArray(response.items) ? response.items : [];
         setAllBookings(data);
         setTotal(data.length);
         setCurrentPage(1); // reset về trang đầu khi đổi filter
      } catch (error) {
         console.error('Lỗi khi tải booking:', error);
         showToast('Tải danh sách booking thất bại', ToastType.Error);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchBookings();
   }, [statusFilter]);

   const handleClearFilters = () => {
      setSearchQuery('');
      setStatusFilter('all');
      setTypeFilter('all');
   };

   const handleViewDetails = (booking: BookingAdmin) => {
      setSelectedBooking(booking);
      setIsModalOpen(true);
   };

   const updateBookingStatusLocally = (
      bookingId: string,
      newStatus: number
   ) => {
      setAllBookings((prev) =>
         prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      );

      if (selectedBooking?.id === bookingId) {
         setSelectedBooking((prev) =>
            prev ? { ...prev, status: newStatus } : null
         );
      }
   };

   const handleStatusUpdate = async (newStatus: number, actionName: string) => {
      if (!selectedBooking) return;

      setIsUpdating(true);
      try {
         await updateBookingStatus({
            bookingId: selectedBooking.id,
            status: newStatus,
         });

         updateBookingStatusLocally(selectedBooking.id, newStatus);

         showToast(`${actionName} booking thành công`, ToastType.Success);
         setIsModalOpen(false);
      } catch (error) {
         showToast(
            `Không thể ${actionName.toLowerCase()} booking. Vui lòng thử lại.`,
            ToastType.Error
         );
      } finally {
         setIsUpdating(false);
      }
   };

   const handleRefund = () => handleStatusUpdate(6, 'Hoàn tiền');
   const handleReject = () => handleStatusUpdate(7, 'Từ chối');
   const handleComplete = () => handleStatusUpdate(7, 'Hỗ trợ hoàn tất');

   // ✅ filter trên toàn bộ dữ liệu
   // ✅ filter + sort theo time mới nhất trước
   const filteredBookings = allBookings
      .filter((booking) => {
         const matchesSearch =
            searchQuery === '' ||
            booking.member.fullname
               .toLowerCase()
               .includes(searchQuery.toLowerCase()) ||
            booking.counselor.fullname
               .toLowerCase()
               .includes(searchQuery.toLowerCase()) ||
            booking.member2?.fullname
               .toLowerCase()
               .includes(searchQuery.toLowerCase());

         const matchesType =
            typeFilter === 'all' ||
            (typeFilter === 'couple' && booking.isCouple) ||
            (typeFilter === 'individual' && !booking.isCouple);

         return matchesSearch && matchesType;
      })
      .sort(
         (a, b) =>
            new Date(b.timeStart).getTime() - new Date(a.timeStart).getTime()
      );

   // ✅ phân trang ở FE
   const pagedBookings = filteredBookings.slice(
      (currentPage - 1) * PAGE_SIZE,
      currentPage * PAGE_SIZE
   );

   return (
      <div className="space-y-6">
         <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
               Quản lý Booking
            </h1>
            <p className="text-gray-600">
               Quản lý và theo dõi tất cả các lịch hẹn tư vấn
            </p>
         </div>

         <BookingStats bookings={allBookings} />

         <div className="space-y-4">
            <BookingFilters
               onSearch={setSearchQuery}
               onStatusFilter={setStatusFilter}
               onTypeFilter={setTypeFilter}
               onClearFilters={handleClearFilters}
            />

            <div className="text-sm text-muted-foreground">
               {loading
                  ? 'Đang tải dữ liệu...'
                  : `Hiển thị ${pagedBookings.length} trong tổng ${filteredBookings.length} booking (tổng tất cả: ${total})`}
            </div>

            <BookingTable
               bookings={pagedBookings}
               onViewDetails={handleViewDetails}
               currentPage={currentPage}
               pageSize={PAGE_SIZE}
            />

            {totalPages > 1 && (
               <Pagination>
                  <PaginationContent>
                     <PaginationItem>
                        <PaginationPrevious
                           className={
                              currentPage === 1
                                 ? 'pointer-events-none opacity-50'
                                 : ''
                           }
                           onClick={() =>
                              setCurrentPage((prev) => Math.max(1, prev - 1))
                           }
                        />
                     </PaginationItem>

                     {Array.from({ length: totalPages }).map((_, i) => {
                        const page = i + 1;
                        return (
                           <PaginationItem key={page}>
                              <PaginationLink
                                 isActive={currentPage === page}
                                 onClick={() => setCurrentPage(page)}
                              >
                                 {page}
                              </PaginationLink>
                           </PaginationItem>
                        );
                     })}

                     <PaginationItem>
                        <PaginationNext
                           className={
                              currentPage === totalPages
                                 ? 'pointer-events-none opacity-50'
                                 : ''
                           }
                           onClick={() =>
                              setCurrentPage((prev) =>
                                 Math.min(totalPages, prev + 1)
                              )
                           }
                        />
                     </PaginationItem>
                  </PaginationContent>
               </Pagination>
            )}
         </div>

         <BookingDetailsModal
            booking={selectedBooking}
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            onRefund={handleRefund}
            onReject={handleReject}
            onComplete={handleComplete}
            isUpdating={isUpdating}
         />
      </div>
   );
}
