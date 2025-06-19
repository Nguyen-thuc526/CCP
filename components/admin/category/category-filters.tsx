import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { Category } from '@/utils/enum';
import { Search } from 'lucide-react';

interface CategoryFiltersProps {
   searchTerm: string;
   setSearchTerm: (value: string) => void;
   statusFilter: number;
   setStatusFilter: (value: number) => void;
}

export default function CategoryFilters({
   searchTerm,
   setSearchTerm,
   statusFilter,
   setStatusFilter,
}: CategoryFiltersProps) {
   return (
      <Card>
         <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
               <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                     placeholder="Tìm kiếm theo tên danh mục..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="pl-8"
                  />
               </div>
               <Select
                  value={statusFilter.toString()}
                  onValueChange={(value) => setStatusFilter(Number(value))}
               >
                  <SelectTrigger className="w-[180px]">
                     <SelectValue placeholder="Lọc theo trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="-1">Tất cả</SelectItem>
                     <SelectItem value={Category.Active.toString()}>
                        Đang hoạt động
                     </SelectItem>
                     <SelectItem value={Category.InActive.toString()}>
                        Không hoạt động
                     </SelectItem>
                  </SelectContent>
               </Select>
            </div>
         </CardContent>
      </Card>
   );
}
