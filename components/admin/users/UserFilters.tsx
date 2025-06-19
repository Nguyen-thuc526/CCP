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
import { Role, Status } from '@/types/user';

interface UserFiltersProps {
   searchTerm: string;
   setSearchTerm: (value: string) => void;
   statusFilter: string;
   setStatusFilter: (value: string) => void;
   roleFilter: string;
   setRoleFilter: (value: string) => void;
}

export default function UserFilters({
   searchTerm,
   setSearchTerm,
   statusFilter,
   setStatusFilter,
   roleFilter,
   setRoleFilter,
}: UserFiltersProps) {
   return (
      <Card>
         <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
               <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                     placeholder="Tìm kiếm theo tên hoặc email..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="pl-8"
                  />
               </div>
               <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[150px]">
                     <SelectValue placeholder="Vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="all">Tất cả</SelectItem>
                     <SelectItem value={Role.Admin}>Quản trị</SelectItem>
                     <SelectItem value={Role.Member}>Thành viên</SelectItem>
                     <SelectItem value={Role.Counselor}>Tư vấn viên</SelectItem>
                  </SelectContent>
               </Select>
               <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                     <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="all">Tất cả</SelectItem>
                     <SelectItem value={Status.Active}>Hoạt động</SelectItem>
                     <SelectItem value={Status.Inactive}>
                        Không hoạt động
                     </SelectItem>
                     <SelectItem value={Status.Suspended}>Tạm khóa</SelectItem>
                     <SelectItem value={Status.Pending}>Chờ duyệt</SelectItem>
                  </SelectContent>
               </Select>
            </div>
         </CardContent>
      </Card>
   );
}
