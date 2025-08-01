'use client';

import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { BookingAdmin } from '@/types/booking';
import { Eye, Star, Users } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { BookingStatusBadge } from './booking-status-badge';
import Link from 'next/link';

interface BookingTableProps {
   bookings: BookingAdmin[];
   isLoading?: boolean;
}

export function BookingTable({
   bookings,
   isLoading = false,
}: BookingTableProps) {
   const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('vi-VN', {
         style: 'currency',
         currency: 'VND',
      }).format(amount);
   };

   const formatDateTime = (dateString: string) => {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
   };

   const SkeletonRow = () => (
      <TableRow className="animate-pulse">
         {/* Thành viên */}
         <TableCell className="align-middle">
            <div className="flex items-center gap-3">
               <Skeleton className="h-10 w-10 rounded-full" />
               <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-36 rounded-md" />
                  <Skeleton className="h-3 w-24 rounded-md" />
               </div>
            </div>
         </TableCell>

         {/* Ngày & Giờ */}
         <TableCell className="align-middle whitespace-nowrap">
            <div className="flex flex-col gap-2">
               <Skeleton className="h-4 w-32 rounded-md" />
               <Skeleton className="h-3 w-20 rounded-md" />
            </div>
         </TableCell>

         {/* Thời lượng */}
         <TableCell className="align-middle whitespace-nowrap">
            <Skeleton className="h-4 w-20 rounded-md" />
         </TableCell>

         {/* Loại */}
         <TableCell className="align-middle whitespace-nowrap">
            <Skeleton className="h-6 w-20 rounded-full" />
         </TableCell>

         {/* Vấn đề */}
         <TableCell className="align-middle whitespace-nowrap">
            <div className="flex gap-2 flex-wrap">
               <Skeleton className="h-6 w-24 rounded-full" />
               <Skeleton className="h-6 w-20 rounded-full" />
               <Skeleton className="h-6 w-16 rounded-full" />
            </div>
         </TableCell>

         {/* Trạng thái */}
         <TableCell className="align-middle whitespace-nowrap">
            <Skeleton className="h-6 w-24 rounded-full" />
         </TableCell>

         {/* Đánh giá */}
         <TableCell className="align-middle whitespace-nowrap">
            <div className="flex items-center gap-2">
               <Skeleton className="h-4 w-4 rounded" />
               <Skeleton className="h-4 w-8 rounded-md" />
            </div>
         </TableCell>

         {/* Thao tác */}
         <TableCell className="align-middle whitespace-nowrap">
            <Skeleton className="h-8 w-8 rounded-md" />
         </TableCell>
      </TableRow>
   );

   return (
      <div className="rounded-md border overflow-x-auto">
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead className="whitespace-nowrap">
                     Thành viên
                  </TableHead>
                  <TableHead className="whitespace-nowrap">
                     Ngày & Giờ
                  </TableHead>
                  <TableHead className="whitespace-nowrap">
                     Thời lượng
                  </TableHead>
                  <TableHead className="whitespace-nowrap">Loại</TableHead>
                  <TableHead className="whitespace-nowrap">Vấn đề</TableHead>
                  <TableHead className="whitespace-nowrap">
                     Trạng thái
                  </TableHead>
                  <TableHead className="whitespace-nowrap">Đánh giá</TableHead>
                  <TableHead className="whitespace-nowrap">Thao tác</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {isLoading ? (
                  // Show skeleton rows when loading
                  Array.from({ length: 8 }).map((_, index) => (
                     <SkeletonRow key={`skeleton-${index}`} />
                  ))
               ) : bookings.length === 0 ? (
                  // Show empty state when no bookings
                  <TableRow>
                     <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                           <div className="text-gray-400 text-sm">
                              Không có dữ liệu booking
                           </div>
                        </div>
                     </TableCell>
                  </TableRow>
               ) : (
                  // Show actual booking data
                  bookings.map((booking) => (
                     <TableRow key={booking.id}>
                        {/* Thành viên */}
                        <TableCell className="align-middle">
                           <div className="flex items-center gap-3">
                              {booking.isCouple && booking.member2 ? (
                                 <>
                                    <div className="flex -space-x-2">
                                       <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                                          <AvatarImage
                                             src={
                                                booking.member.avatar ||
                                                '/placeholder.svg?height=40&width=40' ||
                                                '/placeholder.svg'
                                             }
                                          />
                                          <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                                             {booking.member.fullname.charAt(0)}
                                          </AvatarFallback>
                                       </Avatar>
                                       <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                                          <AvatarImage
                                             src={
                                                booking.member2.avatar ||
                                                '/placeholder.svg?height=40&width=40' ||
                                                '/placeholder.svg'
                                             }
                                          />
                                          <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold">
                                             {booking.member2.fullname.charAt(
                                                0
                                             )}
                                          </AvatarFallback>
                                       </Avatar>
                                    </div>
                                    <div className="flex flex-col gap-1 ml-2">
                                       <div className="flex items-center gap-2">
                                          <span className="font-medium text-gray-900 text-sm">
                                             {booking.member.fullname} &{' '}
                                             {booking.member2.fullname}
                                          </span>
                                          <Badge
                                             variant="outline"
                                             className="text-xs font-medium px-2 py-0.5 bg-purple-50 border-purple-200"
                                          >
                                             <Users className="h-3 w-3 mr-1" />
                                             Cặp đôi
                                          </Badge>
                                       </div>
                                    </div>
                                 </>
                              ) : (
                                 <>
                                    <Avatar className="h-8 w-8">
                                       <AvatarImage
                                          src={
                                             booking.member.avatar ||
                                             '/placeholder.svg?height=40&width=40' ||
                                             '/placeholder.svg'
                                          }
                                       />
                                       <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                                          {booking.member.fullname.charAt(0)}
                                       </AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium text-gray-900 text-sm">
                                       {booking.member.fullname}
                                    </span>
                                 </>
                              )}
                           </div>
                        </TableCell>

                        {/* Ngày & Giờ */}
                        <TableCell className="align-middle whitespace-nowrap">
                           <div className="flex flex-col gap-1">
                              <span className="text-sm font-medium text-gray-900">
                                 {formatDateTime(booking.timeStart)}
                              </span>
                              <span className="text-xs text-gray-500">
                                 đến{' '}
                                 {format(new Date(booking.timeEnd), 'HH:mm')}
                              </span>
                           </div>
                        </TableCell>

                        {/* Thời lượng */}
                        <TableCell className="align-middle whitespace-nowrap">
                           <span className="text-gray-900 text-sm font-medium">
                              {Math.round(
                                 (new Date(booking.timeEnd).getTime() -
                                    new Date(booking.timeStart).getTime()) /
                                    (60 * 1000)
                              )}{' '}
                              phút
                           </span>
                        </TableCell>

                        {/* Loại */}
                        <TableCell className="align-middle whitespace-nowrap">
                           <Badge
                              variant={
                                 booking.isCouple ? 'default' : 'secondary'
                              }
                           >
                              {booking.isCouple ? 'Cặp đôi' : 'Cá nhân'}
                           </Badge>
                        </TableCell>

                        {/* Vấn đề */}
                        <TableCell className="align-middle">
                           <div className="max-w-48">
                              {booking.subCategories &&
                              booking.subCategories.length > 0 ? (
                                 <div className="flex flex-wrap gap-1.5">
                                    {booking.subCategories
                                       .slice(0, 2)
                                       .map((category, index) => (
                                          <Badge
                                             key={category.id}
                                             variant="outline"
                                             className={`text-xs font-medium px-2.5 py-1 border-0 shadow-sm ${
                                                index === 0
                                                   ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200'
                                                   : 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border-purple-200'
                                             }`}
                                          >
                                             {category.name}
                                          </Badge>
                                       ))}
                                    {booking.subCategories.length > 2 && (
                                       <Badge
                                          variant="outline"
                                          className="text-xs font-medium px-2.5 py-1 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 border-gray-200 shadow-sm"
                                       >
                                          +{booking.subCategories.length - 2}
                                       </Badge>
                                    )}
                                 </div>
                              ) : (
                                 <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                                    <span className="text-gray-500 text-sm italic">
                                       Chưa xác định
                                    </span>
                                 </div>
                              )}
                           </div>
                        </TableCell>

                        {/* Trạng thái */}
                        <TableCell className="align-middle whitespace-nowrap">
                           <BookingStatusBadge status={booking.status} />
                        </TableCell>

                        {/* Đánh giá */}
                        <TableCell className="align-middle whitespace-nowrap">
                           {booking.rating ? (
                              <div className="flex items-center gap-1">
                                 <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                 <span className="text-sm font-medium">
                                    {booking.rating}
                                 </span>
                              </div>
                           ) : (
                              <span className="text-gray-400 text-sm">
                                 Chưa có
                              </span>
                           )}
                        </TableCell>

                        {/* Thao tác */}
                        <TableCell className="align-middle whitespace-nowrap">
                           <Button variant="ghost" size="sm" asChild>
                              <Link
                                 href={`/counselor/appointments/${booking.id}`}
                              >
                                 <Eye className="w-4 h-4" />
                              </Link>
                           </Button>
                        </TableCell>
                     </TableRow>
                  ))
               )}
            </TableBody>
         </Table>
      </div>
   );
}
