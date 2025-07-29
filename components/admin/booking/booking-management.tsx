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
import type { BookingAdmin, BookingPagingResponse } from '@/types/booking';
import type { BookingStatus } from '@/utils/enum';
import { useToast, ToastType } from '@/hooks/useToast';
import { BookingFilters } from './booking-filter';
import { BookingStats } from './booking-stat';
import { BookingTable } from './booking-table';
import { BookingDetailsModal } from './booking-details-modal';

const PAGE_SIZE = 10;

export default function BookingManagement() {
   const [bookings, setBookings] = useState<BookingAdmin[]>([]);
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
         const response: BookingPagingResponse = await getBookings({
            PageNumber: currentPage,
            PageSize: PAGE_SIZE,
            Status: statusFilter === 'all' ? undefined : statusFilter,
         });
         setBookings(Array.isArray(response.items) ? response.items : []);
         setTotal(response.totalCount ?? 0);
      } catch (error) {
         console.error('Lỗi khi tải booking:', error);
         showToast('Tải danh sách booking thất bại', ToastType.Error);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchBookings();
   }, [currentPage, statusFilter]);

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
      setBookings((prevBookings) =>
         prevBookings.map((booking) =>
            booking.id === bookingId
               ? { ...booking, status: newStatus }
               : booking
         )
      );

      // Also update selected booking if it's the same one
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

         // Update status locally instead of refetching
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

   const filteredBookings = bookings.filter((booking) => {
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
   });

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

         <BookingStats bookings={bookings} />

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
                  : `Hiển thị ${filteredBookings.length} trong tổng ${total} booking`}
            </div>
            <BookingTable
               bookings={filteredBookings}
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
