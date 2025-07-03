'use client';

import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { Category } from '@/types/category';

interface SearchFilterProps {
   searchTerm: string;
   selectedCategory: string;
   categories: Category[];
   onSearchChange: (value: string) => void;
   onCategoryChange: (value: string) => void;
   hideCategory?: boolean;
}

export function SearchFilter({
   searchTerm,
   selectedCategory,
   categories,
   onSearchChange,
   onCategoryChange,
   hideCategory = false,
}: SearchFilterProps) {
   return (
      <Card>
         <CardContent className="pt-6">
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
               <div className="flex-1">
                  <div className="relative">
                     <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                     <Input
                        placeholder="Tìm kiếm loại tính cách..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10"
                     />
                  </div>
               </div>
               {!hideCategory && categories.length > 0 && (
                  <Select
                     value={selectedCategory}
                     onValueChange={onCategoryChange}
                  >
                     <SelectTrigger className="w-[200px]">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="all">Tất Cả Danh Mục</SelectItem>
                        {categories.map((category) => (
                           <SelectItem key={category.id} value={category.id}>
                              {category.name}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               )}
            </div>
         </CardContent>
      </Card>
   );
}
