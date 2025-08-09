'use client';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { HelpCircle } from 'lucide-react';
import type { QuizBasicInfo } from '@/types/course';

interface QuizCreatorProps {
   id?: string;
   onTitleChange: (title: string) => void;
   onDescriptionChange: (description: string) => void;
   basicInfo: QuizBasicInfo;
   onBasicInfoChange: (info: QuizBasicInfo) => void;
}

export function QuizCreator({
   id = 'quiz-creator',
   onTitleChange,
   onDescriptionChange,
   basicInfo,
   onBasicInfoChange,
}: QuizCreatorProps) {
   const handleNameChange = (name: string) => {
      onBasicInfoChange({ ...basicInfo, name });
      onTitleChange(name);
   };

   const handleDescriptionChange = (description: string) => {
      onBasicInfoChange({ ...basicInfo, description });
      onDescriptionChange(description);
   };

   return (
      <div className="space-y-4">
         <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="h-5 w-5 text-primary" />
            <h4 className="font-semibold">Thông tin Quiz</h4>
         </div>

         <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
            <div className="space-y-2">
               <Label htmlFor={`${id}-name`} className="text-sm font-medium">
                  Tên Quiz <span className="text-destructive">*</span>
               </Label>
               <Input
                  id={`${id}-name`}
                  value={basicInfo.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ví dụ: Kiểm tra kiến thức chương 1"
               />
            </div>

            <div className="space-y-2">
               <Label
                  htmlFor={`${id}-description`}
                  className="text-sm font-medium"
               >
                  Mô tả Quiz <span className="text-destructive">*</span>
               </Label>
               <textarea
                  id={`${id}-description`}
                  value={basicInfo.description}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  placeholder="Mô tả ngắn gọn về nội dung và mục đích của quiz này..."
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  rows={3}
               />
            </div>

            <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
               <p className="text-sm text-blue-700">
                  💡 <strong>Lưu ý:</strong> Sau khi tạo quiz, bạn có thể thêm
                  và chỉnh sửa câu hỏi trong phần chi tiết chương.
               </p>
            </div>
         </div>
      </div>
   );
}
