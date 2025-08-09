'use client';

import {
   BarChart2,
   Edit,
   Eye,
   ImageIcon,
   ListTree,
   Scale,
   ScanEye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

// Mock PersonType interface for demo
interface PersonType {
   id: string;
   name: string;
   description: string;
   image?: string;
   category: {
      name: string;
   };
}

interface PersonalityCardProps {
   personType: PersonType;
   onView: () => void;
   onEdit: () => void;
   onCompare: (id: string) => void;
}

export function PersonalityCard({
   personType,
   onView,
   onEdit,
   onCompare,
}: PersonalityCardProps) {
   return (
      <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
         <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
            {personType.image ? (
               <img
                  src={personType.image || '/placeholder.svg'}
                  alt={personType.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
               />
            ) : (
               <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <ImageIcon className="h-16 w-16 text-gray-400" />
               </div>
            )}

            {/* Overlay gradient for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

            {/* Category badge positioned on banner */}
            <div className="absolute top-4 right-4">
               <Badge
                  variant="secondary"
                  className="bg-white/90 text-gray-800 backdrop-blur-sm"
               >
                  {personType.category.name}
               </Badge>
            </div>
         </div>

         {/* Content section */}
         <CardHeader className="pb-3 relative">
            {/* Avatar positioned to overlap banner */}
            <div className="absolute -top-8 left-6">
               <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                  <AvatarImage
                     src={personType.image || '/placeholder.svg'}
                     alt={personType.name}
                  />

                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-lg font-semibold">
                     {personType.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
               </Avatar>
            </div>

            {/* Title with proper spacing for avatar */}
            <div className="pt-10">
               <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-bold text-gray-900 mb-1">
                     {personType.name}
                  </CardTitle>
                  <Button
                     variant="outline"
                     size="sm"
                     onClick={() => onCompare(personType.id)}
                     className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-colors bg-transparent"
                  >
                     <ScanEye className="mr-1 h-4 w-4" />
                     So sánh
                  </Button>
               </div>
            </div>
         </CardHeader>

         <CardContent className="space-y-4 pt-0">
            <CardDescription className="text-gray-600 line-clamp-3 leading-relaxed">
               {personType.description}
            </CardDescription>

            <Separator className="my-4" />

            {/* Action buttons */}
            <div className="flex justify-between items-center">
               <Button
                  variant="outline"
                  size="sm"
                  onClick={onView}
                  className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-colors bg-transparent"
               >
                  <Eye className="mr-2 h-4 w-4" />
                  Xem
               </Button>

               <Button
                  variant="outline"
                  size="sm"
                  onClick={onEdit}
                  className="hover:bg-gray-50 hover:text-gray-700 hover:border-gray-300 transition-colors bg-transparent"
               >
                  <Edit className="h-4 w-4" />
               </Button>
            </div>
         </CardContent>
      </Card>
   );
}
