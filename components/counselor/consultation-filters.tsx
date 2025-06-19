import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

export function ConsultationFilters() {
   return (
      <Card>
         <CardContent className="p-4">
            <div className="flex flex-wrap items-end gap-4">
               <div className="grid gap-2">
                  <label htmlFor="progress" className="text-sm font-medium">
                     Tiến triển
                  </label>
                  <Select defaultValue="all">
                     <SelectTrigger id="progress" className="w-[180px]">
                        <SelectValue placeholder="Chọn tiến triển" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="all">Tất cả tiến triển</SelectItem>
                        <SelectItem value="improving">
                           Đang cải thiện
                        </SelectItem>
                        <SelectItem value="stable">Ổn định</SelectItem>
                        <SelectItem value="needs-attention">
                           Cần chú ý
                        </SelectItem>
                     </SelectContent>
                  </Select>
               </div>
               <div className="grid gap-2">
                  <label htmlFor="date-range" className="text-sm font-medium">
                     Khoảng thời gian
                  </label>
                  <Select defaultValue="month">
                     <SelectTrigger id="date-range" className="w-[180px]">
                        <SelectValue placeholder="Chọn khoảng thời gian" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="week">7 ngày qua</SelectItem>
                        <SelectItem value="month">30 ngày qua</SelectItem>
                        <SelectItem value="quarter">90 ngày qua</SelectItem>
                        <SelectItem value="year">12 tháng qua</SelectItem>
                        <SelectItem value="custom">Tùy chỉnh</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
               <div className="grid gap-2">
                  <label htmlFor="issue-type" className="text-sm font-medium">
                     Loại vấn đề
                  </label>
                  <Select defaultValue="all">
                     <SelectTrigger id="issue-type" className="w-[180px]">
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
                  />
               </div>
            </div>
         </CardContent>
      </Card>
   );
}
