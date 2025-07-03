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
import type { BookingAdmin } from '@/types/booking';
import { BookingStatusBadge } from './booking-status-badge';
import { Eye, Star } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
interface BookingTableProps {
   bookings: BookingAdmin[];
   onViewDetails: (booking: BookingAdmin) => void;
   currentPage: number;
   pageSize: number;
}

export function BookingTable({
   bookings,
   onViewDetails,
   currentPage,
   pageSize,
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

   return (
      <div className="rounded-md border">
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Tư vấn viên</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Đánh giá</TableHead>
                  <TableHead>Thao tác</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {bookings.map((booking, index) => (
                  <TableRow key={booking.id}>
                     <TableCell className="text-center text-sm text-muted-foreground">
                        {(currentPage - 1) * pageSize + index + 1}
                     </TableCell>
                     <TableCell>
                        <div className="flex items-center gap-2">
                           <Avatar className="h-8 w-8">
                              <AvatarImage
                                 src={
                                    booking.member.avatar || '/placeholder.svg'
                                 }
                              />
                              <AvatarFallback>
                                 {booking.member.fullname.charAt(0)}
                              </AvatarFallback>
                           </Avatar>
                           <div>
                              <p className="font-medium text-sm">
                                 {booking.member.fullname}
                              </p>
                              {booking.member2 && (
                                 <p className="text-xs text-gray-500">
                                    + {booking.member2.fullname}
                                 </p>
                              )}
                           </div>
                        </div>
                     </TableCell>
                     <TableCell>
                        <div className="flex items-center gap-2">
                           <Avatar className="h-8 w-8">
                              <AvatarImage
                                 src={
                                    booking.counselor.avatar ||
                                    '/placeholder.svg'
                                 }
                              />
                              <AvatarFallback>
                                 {booking.counselor.fullname.charAt(0)}
                              </AvatarFallback>
                           </Avatar>
                           <div>
                              <p className="font-medium text-sm">
                                 {booking.counselor.fullname}
                              </p>
                           </div>
                        </div>
                     </TableCell>
                     <TableCell>
                        <div className="text-sm">
                           <p>{formatDateTime(booking.timeStart)}</p>
                           <p className="text-gray-500">
                              đến {format(new Date(booking.timeEnd), 'HH:mm')}
                           </p>
                        </div>
                     </TableCell>
                     <TableCell>
                        <Badge
                           variant={booking.isCouple ? 'default' : 'secondary'}
                        >
                           {booking.isCouple ? 'Cặp đôi' : 'Cá nhân'}
                        </Badge>
                     </TableCell>
                     <TableCell className="font-medium">
                        {formatCurrency(booking.price)}
                     </TableCell>
                     <TableCell>
                        <BookingStatusBadge status={booking.status} />
                     </TableCell>
                     <TableCell>
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
                     <TableCell>
                        <Button
                           variant="ghost"
                           size="sm"
                           onClick={() => onViewDetails(booking)}
                        >
                           <Eye className="w-4 h-4" />
                        </Button>
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </div>
   );
}
