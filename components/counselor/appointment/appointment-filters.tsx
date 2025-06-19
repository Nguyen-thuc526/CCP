'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { Calendar, Search } from 'lucide-react';
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export function AppointmentFilters({
   onFilterChange,
}: {
   onFilterChange?: (filters: any) => void;
}) {
   const [date, setDate] = useState<Date | undefined>(undefined);
   const [status, setStatus] = useState('all');
   const [issueType, setIssueType] = useState('all');
   const [searchTerm, setSearchTerm] = useState('');

   const handleDateChange = (newDate: Date | undefined) => {
      setDate(newDate);
      if (onFilterChange) {
         onFilterChange({ date: newDate, status, issueType, searchTerm });
      }
   };

   const handleStatusChange = (newStatus: string) => {
      setStatus(newStatus);
      if (onFilterChange) {
         onFilterChange({ date, status: newStatus, issueType, searchTerm });
      }
   };

   const handleIssueTypeChange = (newIssueType: string) => {
      setIssueType(newIssueType);
      if (onFilterChange) {
         onFilterChange({ date, status, issueType: newIssueType, searchTerm });
      }
   };

   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      if (onFilterChange) {
         onFilterChange({
            date,
            status,
            issueType,
            searchTerm: e.target.value,
         });
      }
   };

   return (
      <Card>
         <CardContent className="p-4">
            <div className="flex flex-wrap items-end gap-4">
               <div className="grid gap-2">
                  <label htmlFor="status" className="text-sm font-medium">
                     Trạng thái
                  </label>
                  <Select defaultValue="all" onValueChange={handleStatusChange}>
                     <SelectTrigger id="status" className="w-[180px]">
                        <SelectValue placeholder="Chọn trạng thái" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="all">Tất cả lịch hẹn</SelectItem>
                        <SelectItem value="upcoming">Sắp tới</SelectItem>
                        <SelectItem value="scheduled">Đã lên lịch</SelectItem>
                        <SelectItem value="completed">Đã hoàn thành</SelectItem>
                        <SelectItem value="cancelled">Đã hủy</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
               <div className="grid gap-2">
                  <label htmlFor="date" className="text-sm font-medium">
                     Ngày
                  </label>
                  <Popover>
                     <PopoverTrigger asChild>
                        <Button
                           variant="outline"
                           className="w-[180px]"
                           id="date"
                        >
                           <Calendar className="mr-2 h-4 w-4" />
                           {date
                              ? format(date, 'dd/MM/yyyy', { locale: vi })
                              : 'Chọn ngày'}
                        </Button>
                     </PopoverTrigger>
                     <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                           mode="single"
                           selected={date}
                           onSelect={handleDateChange}
                           initialFocus
                           locale={vi}
                        />
                     </PopoverContent>
                  </Popover>
               </div>
               <div className="grid gap-2">
                  <label htmlFor="issue" className="text-sm font-medium">
                     Loại vấn đề
                  </label>
                  <Select
                     defaultValue="all"
                     onValueChange={handleIssueTypeChange}
                  >
                     <SelectTrigger id="issue" className="w-[180px]">
                        <SelectValue placeholder="Chọn vấn đề" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="all">Tất cả vấn đề</SelectItem>
                        <SelectItem value="communication">Giao tiếp</SelectItem>
                        <SelectItem value="conflict">
                           Giải quyết xung đột
                        </SelectItem>
                        <SelectItem value="parenting">Nuôi dạy con</SelectItem>
                        <SelectItem value="financial">
                           Lập kế hoạch tài chính
                        </SelectItem>
                        <SelectItem value="trust">Xây dựng lòng tin</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
               <div className="relative ml-auto">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                     type="search"
                     placeholder="Tìm kiếm thành viên..."
                     className="w-[250px] pl-8"
                     value={searchTerm}
                     onChange={handleSearchChange}
                  />
               </div>
            </div>
         </CardContent>
      </Card>
   );
}
