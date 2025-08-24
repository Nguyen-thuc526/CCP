'use client';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ToastType, useToast } from '@/hooks/useToast';

interface CourseHeaderProps {
   courseId: string;
   title: string;
   status: 'public' | 'hidden';
   onToggleStatus: (newStatus: 'public' | 'hidden') => void;
   chapterCount?: number;
}

export function CourseHeader(props: CourseHeaderProps) {
   const { showToast } = useToast();
   const canPublish = (props.chapterCount ?? 0) > 0;

   const handleToggleStatus = (checked: boolean) => {
      const newStatus = checked ? 'public' : 'hidden';

      if (newStatus === 'public' && !canPublish) {
         showToast(
            'Không thể công khai khóa học khi chưa có chương nào. Vui lòng thêm ít nhất một chương trước khi công khai.',
            ToastType.Error
         );
         return;
      }

      props.onToggleStatus(newStatus);
   };

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
            <Label
               htmlFor="course-status-toggle"
               className="text-sm font-medium"
            >
               {props.status === 'public' ? 'Công khai' : 'Ẩn'}
            </Label>
            <Switch
               id="course-status-toggle"
               checked={props.status === 'public'}
               onCheckedChange={handleToggleStatus}
            />
         </div>
      </div>
   );
}
