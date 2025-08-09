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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { BookingAdmin } from '@/types/booking';
import type { BookingStatus } from '@/utils/enum';
import { useToast, ToastType } from '@/hooks/useToast';
import { bookingService } from '@/services/bookingService';
import { BookingFilters } from './appointment-filter';
import { BookingTable } from './booking-table';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
   CalendarDays,
   Clock,
   Users,
   History,
   CalendarIcon,
} from 'lucide-react';
import { CalendarGrid } from './CalendarGrid';

const PAGE_SIZE = 10;

export default function BookingManagement() {
   const [bookings, setBookings] = useState<BookingAdmin[]>([]);
   const [allBookings, setAllBookings] = useState<BookingAdmin[]>([]);
   const [total, setTotal] = useState(0);
   const [currentPage, setCurrentPage] = useState(1);
   const [historyPage, setHistoryPage] = useState(1);
   const [loading, setLoading] = useState(false);
   const [historyLoading, setHistoryLoading] = useState(false);
   const [searchQuery, setSearchQuery] = useState('');
   const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>(
      'all'
   );
   const [typeFilter, setTypeFilter] = useState<
      'all' | 'individual' | 'couple'
   >('all');
   const [selectedDate, setSelectedDate] = useState<Date | undefined>(
      new Date()
   );
   const [activeTab, setActiveTab] = useState('calendar');

   const { showToast } = useToast();

   const totalPages = Math.ceil(total / PAGE_SIZE);
   const historyTotalPages = Math.ceil(allBookings.length / PAGE_SIZE);

   const fetchBookings = async () => {
      setLoading(true);
      try {
         const response = await bookingService.getMyBookings({
            PageNumber: currentPage,
            PageSize: PAGE_SIZE,
            Status: statusFilter === 'all' ? undefined : statusFilter,
            FromDate: selectedDate ? selectedDate.toISOString() : undefined,
            ToDate: selectedDate ? selectedDate.toISOString() : undefined,
         });

         if (
            response &&
            response.success &&
            Array.isArray(response.data.items)
         ) {
            setBookings(response.data.items);
            setTotal(response.data.totalCount ?? 0);
         } else {
            setBookings([]);
            setTotal(0);
            console.warn('Invalid data structure from API:', response);
         }
      } catch (error) {
         console.error('Lỗi khi tải booking:', error);
         showToast('Tải danh sách booking thất bại', ToastType.Error);
         setBookings([]);
         setTotal(0);
      } finally {
         setLoading(false);
      }
   };

   const fetchAllBookings = async () => {
      setHistoryLoading(true);
      try {
         const response = await bookingService.getMyBookings({
            PageNumber: 1,
            PageSize: 1000, // Get more records for history
            Status: statusFilter === 'all' ? undefined : statusFilter,
         });

         if (
            response &&
            response.success &&
            Array.isArray(response.data.items)
         ) {
            setAllBookings(response.data.items);
         } else {
            setAllBookings([]);
            console.warn('Invalid data structure from API:', response);
         }
      } catch (error) {
         console.error('Lỗi khi tải lịch sử booking:', error);
         showToast('Tải lịch sử booking thất bại', ToastType.Error);
         setAllBookings([]);
      } finally {
         setHistoryLoading(false);
      }
   };

   useEffect(() => {
      if (activeTab === 'calendar') {
         fetchBookings();
      } else if (activeTab === 'history') {
         fetchAllBookings();
      }
   }, [currentPage, statusFilter, selectedDate, activeTab]);

   const handleClearFilters = () => {
      setSearchQuery('');
      setStatusFilter('all');
      setTypeFilter('all');
      setSelectedDate(new Date());
   };

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

   const filteredHistoryBookings = allBookings.filter((booking) => {
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

   // Get bookings for selected date
   const selectedDateBookings = filteredBookings.filter((booking) => {
      if (!selectedDate) return true;
      return (
         new Date(booking.timeStart).toDateString() ===
         selectedDate.toDateString()
      );
   });

   // Get dates that have bookings for calendar highlighting
   const bookingDates = bookings.map((booking) => new Date(booking.timeStart));

   // Paginated history bookings
   const paginatedHistoryBookings = filteredHistoryBookings.slice(
      (historyPage - 1) * PAGE_SIZE,
      historyPage * PAGE_SIZE
   );

   return (
      <div className="space-y-6">
         <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
         >
            <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
               <TabsTrigger
                  value="calendar"
                  className="flex items-center gap-2"
               >
                  <CalendarIcon className="h-4 w-4" />
                  Lịch hẹn theo ngày
               </TabsTrigger>
               <TabsTrigger value="history" className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Lịch sử
               </TabsTrigger>
            </TabsList>

            <TabsContent value="calendar" className="space-y-4">
               <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Calendar Section */}
                  <div className="lg:col-span-1">
                     <Card>
                        <CardHeader>
                           <CardTitle className="flex items-center gap-2">
                              <CalendarDays className="h-5 w-5" />
                              Lịch hẹn
                           </CardTitle>
                        </CardHeader>
                        <CardContent className="p-3">
                           <CalendarGrid
                              bookings={bookings}
                              selectedDate={selectedDate}
                              onSelectDate={setSelectedDate}
                           />

                           {selectedDate && (
                              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                 <div className="flex items-center gap-2 text-sm font-medium text-blue-900">
                                    <Clock className="h-4 w-4" />
                                    {format(selectedDate, 'dd/MM/yyyy', {
                                       locale: vi,
                                    })}
                                 </div>
                                 <div className="flex items-center gap-2 mt-1">
                                    <Users className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm text-blue-700">
                                       {selectedDateBookings.length} lịch hẹn
                                    </span>
                                 </div>
                              </div>
                           )}
                        </CardContent>
                     </Card>
                  </div>

                  {/* Main Content Section */}
                  <div className="lg:col-span-3 space-y-4">
                     <BookingFilters
                        onSearch={setSearchQuery}
                        onStatusFilter={setStatusFilter}
                        onTypeFilter={setTypeFilter}
                        onClearFilters={handleClearFilters}
                     />

                     {/* Selected Date Summary */}
                     {selectedDate && (
                        <Card>
                           <CardHeader>
                              <CardTitle className="text-lg">
                                 Lịch hẹn ngày{' '}
                                 {format(selectedDate, 'dd/MM/yyyy', {
                                    locale: vi,
                                 })}
                              </CardTitle>
                           </CardHeader>
                           <CardContent>
                              <div className="flex flex-wrap gap-2">
                                 <Badge
                                    variant="outline"
                                    className="bg-blue-50"
                                 >
                                    Tổng: {selectedDateBookings.length} lịch hẹn
                                 </Badge>
                                 <Badge
                                    variant="outline"
                                    className="bg-green-50"
                                 >
                                    Cá nhân:{' '}
                                    {
                                       selectedDateBookings.filter(
                                          (b) => !b.isCouple
                                       ).length
                                    }
                                 </Badge>
                                 <Badge
                                    variant="outline"
                                    className="bg-purple-50"
                                 >
                                    Cặp đôi:{' '}
                                    {
                                       selectedDateBookings.filter(
                                          (b) => b.isCouple
                                       ).length
                                    }
                                 </Badge>
                              </div>
                           </CardContent>
                        </Card>
                     )}

                     {!loading && (
                        <div className="text-sm text-muted-foreground">
                           Hiển thị {selectedDateBookings.length} lịch hẹn
                           {selectedDate &&
                              ` cho ngày ${format(selectedDate, 'dd/MM/yyyy', { locale: vi })}`}
                        </div>
                     )}

                     <BookingTable
                        bookings={selectedDateBookings}
                        isLoading={loading}
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
                                       setCurrentPage((prev) =>
                                          Math.max(1, prev - 1)
                                       )
                                    }
                                 />
                              </PaginationItem>
                              {Array.from({ length: totalPages }).map(
                                 (_, i) => {
                                    const page = i + 1;
                                    return (
                                       <PaginationItem key={page}>
                                          <PaginationLink
                                             isActive={currentPage === page}
                                             onClick={() =>
                                                setCurrentPage(page)
                                             }
                                          >
                                             {page}
                                          </PaginationLink>
                                       </PaginationItem>
                                    );
                                 }
                              )}
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
               </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
               <div className="space-y-4">
                  <BookingFilters
                     onSearch={setSearchQuery}
                     onStatusFilter={setStatusFilter}
                     onTypeFilter={setTypeFilter}
                     onClearFilters={handleClearFilters}
                  />

                  <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <History className="h-5 w-5" />
                           Lịch sử lịch hẹn
                        </CardTitle>
                     </CardHeader>
                     <CardContent>
                        <div className="flex flex-wrap gap-2">
                           <Badge variant="outline" className="bg-blue-50">
                              Tổng: {filteredHistoryBookings.length} lịch hẹn
                           </Badge>
                           <Badge variant="outline" className="bg-green-50">
                              Cá nhân:{' '}
                              {
                                 filteredHistoryBookings.filter(
                                    (b) => !b.isCouple
                                 ).length
                              }
                           </Badge>
                           <Badge variant="outline" className="bg-purple-50">
                              Cặp đôi:{' '}
                              {
                                 filteredHistoryBookings.filter(
                                    (b) => b.isCouple
                                 ).length
                              }
                           </Badge>
                        </div>
                     </CardContent>
                  </Card>

                  {!historyLoading && (
                     <div className="text-sm text-muted-foreground">
                        Hiển thị {paginatedHistoryBookings.length} trong tổng{' '}
                        {filteredHistoryBookings.length} lịch hẹn
                     </div>
                  )}

                  <BookingTable
                     bookings={paginatedHistoryBookings}
                     isLoading={historyLoading}
                  />

                  {historyTotalPages > 1 && (
                     <Pagination>
                        <PaginationContent>
                           <PaginationItem>
                              <PaginationPrevious
                                 className={
                                    historyPage === 1
                                       ? 'pointer-events-none opacity-50'
                                       : ''
                                 }
                                 onClick={() =>
                                    setHistoryPage((prev) =>
                                       Math.max(1, prev - 1)
                                    )
                                 }
                              />
                           </PaginationItem>
                           {Array.from({
                              length: Math.min(historyTotalPages, 5),
                           }).map((_, i) => {
                              const page = i + 1;
                              return (
                                 <PaginationItem key={page}>
                                    <PaginationLink
                                       isActive={historyPage === page}
                                       onClick={() => setHistoryPage(page)}
                                    >
                                       {page}
                                    </PaginationLink>
                                 </PaginationItem>
                              );
                           })}
                           <PaginationItem>
                              <PaginationNext
                                 className={
                                    historyPage === historyTotalPages
                                       ? 'pointer-events-none opacity-50'
                                       : ''
                                 }
                                 onClick={() =>
                                    setHistoryPage((prev) =>
                                       Math.min(historyTotalPages, prev + 1)
                                    )
                                 }
                              />
                           </PaginationItem>
                        </PaginationContent>
                     </Pagination>
                  )}
               </div>
            </TabsContent>
         </Tabs>
      </div>
   );
}
