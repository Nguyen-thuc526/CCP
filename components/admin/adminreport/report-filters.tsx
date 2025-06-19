import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { Calendar } from 'lucide-react';

export function ReportFilters() {
   return (
      <Card>
         <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
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
                  <label htmlFor="report-type" className="text-sm font-medium">
                     Loại báo cáo
                  </label>
                  <Select defaultValue="all">
                     <SelectTrigger id="report-type" className="w-[180px]">
                        <SelectValue placeholder="Chọn loại báo cáo" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="all">Tất cả báo cáo</SelectItem>
                        <SelectItem value="members">
                           Tăng trưởng thành viên
                        </SelectItem>
                        <SelectItem value="counselors">
                           Hiệu suất chuyên viên
                        </SelectItem>
                        <SelectItem value="appointments">
                           Phân tích lịch hẹn
                        </SelectItem>
                        <SelectItem value="surveys">
                           Hoàn thành khảo sát
                        </SelectItem>
                        <SelectItem value="courses">
                           Đăng ký khóa học
                        </SelectItem>
                     </SelectContent>
                  </Select>
               </div>
               <div className="grid gap-2">
                  <label htmlFor="custom-date" className="text-sm font-medium">
                     Ngày tùy chỉnh
                  </label>
                  <Button
                     variant="outline"
                     className="w-[180px]"
                     id="custom-date"
                  >
                     <Calendar className="mr-2 h-4 w-4" />
                     Chọn ngày
                  </Button>
               </div>
               <div className="ml-auto self-end">
                  <Button>Tạo báo cáo</Button>
               </div>
            </div>
         </CardContent>
      </Card>
   );
}
