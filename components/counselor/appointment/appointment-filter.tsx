'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { BookingStatus } from '@/utils/enum';

interface BookingFiltersProps {
   onSearch: (query: string) => void;
   onStatusFilter: (status: BookingStatus | 'all') => void;
   onTypeFilter: (type: 'all' | 'individual' | 'couple') => void;
   onClearFilters: () => void;
}

export function BookingFilters({
   onSearch,
   onStatusFilter,
   onTypeFilter,
   onClearFilters,
}: BookingFiltersProps) {
   const [searchQuery, setSearchQuery] = useState('');

   const handleSearchChange = (value: string) => {
      setSearchQuery(value);
      onSearch(value);
   };

   return (
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
         <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
               placeholder="Tìm kiếm theo tên khách hàng, tư vấn viên..."
               value={searchQuery}
               onChange={(e) => handleSearchChange(e.target.value)}
               className="pl-10"
            />
         </div>

         <div className="flex gap-2 items-center">
            <Select
               onValueChange={(value) => {
                  if (value === 'all') {
                     onStatusFilter('all');
                  } else {
                     onStatusFilter(Number(value) as BookingStatus);
                  }
               }}
            >
               <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Trạng thái" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value={BookingStatus.Confirm.toString()}>
                     Xác nhận lịch
                  </SelectItem>
                  <SelectItem value={BookingStatus.Finish.toString()}>
                     Đã kết thúc
                  </SelectItem>
                  <SelectItem value={BookingStatus.Reschedule.toString()}>
                     Đề xuất lịch mới
                  </SelectItem>
                  <SelectItem value={BookingStatus.MemberCancel.toString()}>
                     Thành viên hủy
                  </SelectItem>
                  <SelectItem value={BookingStatus.Report.toString()}>
                     Báo cáo
                  </SelectItem>
                  <SelectItem value={BookingStatus.Refund.toString()}>
                     Hoàn tiền
                  </SelectItem>
                  <SelectItem value={BookingStatus.Complete.toString()}>
                     Hoàn thành
                  </SelectItem>
               </SelectContent>
            </Select>

            <Select
               onValueChange={(value) =>
                  onTypeFilter(value as 'all' | 'individual' | 'couple')
               }
            >
               <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Loại" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="individual">Cá nhân</SelectItem>
                  <SelectItem value="couple">Cặp đôi</SelectItem>
               </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={onClearFilters}>
               <X className="w-4 h-4 mr-1" />
               Xóa bộ lọc
            </Button>
         </div>
      </div>
   );
}
