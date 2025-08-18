'use client';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface CourseHeaderProps {
   courseId: string;
   title: string;
   status: 'public' | 'hidden';
   onToggleStatus: (newStatus: 'public' | 'hidden') => void;
}

export function CourseHeader(props: CourseHeaderProps) {
   return (
      <div className="flex items-center justify-between border-b pb-4 mb-6">
         {/* Left section */}
         <div className="flex items-start gap-4 ">
         
            <div className="flex flex-col">
               <h1 className="w-[800px] text-2xl font-bold text-gray-900 leading-tight">
                  {props.title}
               </h1>
               <p className="text-sm text-muted-foreground">
                  Chi tiết khóa học
               </p>
            </div>
         </div>

         {/* Right section */}
         <div className="flex items-center gap-2">
            <Label htmlFor="course-status-toggle" className="text-sm font-medium">
               {props.status === 'public' ? 'Công khai' : 'Ẩn'}
            </Label>
            <Switch
               id="course-status-toggle"
               checked={props.status === 'public'}
               onCheckedChange={(checked) =>
                  props.onToggleStatus(checked ? 'public' : 'hidden')
               }
            />
         </div>
      </div>

   );
}
