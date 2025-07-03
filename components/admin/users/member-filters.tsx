import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { AccountStatus } from '@/utils/enum';
import { Search } from 'lucide-react';

interface MemberFiltersProps {
   searchTerm: string;
   setSearchTerm: (value: string) => void;
   statusFilter: string;
   setStatusFilter: (value: string) => void;
}

export default function MemberFilters({
   searchTerm,
   setSearchTerm,
   statusFilter,
   setStatusFilter,
}: MemberFiltersProps) {
   return (
      <Card>
         <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
               <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                     placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="pl-8"
                  />
               </div>
               <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                     <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="all">Tất cả</SelectItem>
                     <SelectItem value={String(AccountStatus.Active)}>
                        Hoạt động
                     </SelectItem>
                     <SelectItem value={String(AccountStatus.Block)}>
                        Đã chặn
                     </SelectItem>
                  </SelectContent>
               </Select>
            </div>
         </CardContent>
      </Card>
   );
}
