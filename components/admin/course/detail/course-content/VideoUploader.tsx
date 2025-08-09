'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Upload } from 'lucide-react';
import { useUploadVideo } from '@/hooks/upload-video';

interface VideoUploaderProps {
   videoUrl?: string;
   duration?: string;
   uploadProgress?: number;
   onUploadComplete: (videoUrl: string, duration: string) => void;
   id?: string;

   // New props
   title?: string;
   description?: string;
   onTitleChange?: (title: string) => void;
   onDescriptionChange?: (desc: string) => void;
}

export function VideoUploader({
   videoUrl,
   duration,
   uploadProgress,
   onUploadComplete,
   id = 'video-uploader',
   title,
   description,
   onTitleChange,
   onDescriptionChange,
}: VideoUploaderProps) {
   const inputRef = useRef<HTMLInputElement>(null);
   const { uploadVideo, loading, error } = useUploadVideo();

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      uploadVideo({
         file,
         onSuccess: (url, seconds) => {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = Math.floor(seconds % 60);

            const formatted = [
               hours.toString().padStart(2, '0'),
               minutes.toString().padStart(2, '0'),
               secs.toString().padStart(2, '0'),
            ].join(':');

            onUploadComplete(url, formatted);
         },
      });
   };

   return (
      <div className="space-y-4">
         {/* Tên chương */}
         <div className="space-y-2">
            <Label htmlFor={`${id}-title`}>Tên chương</Label>
            <Input
               id={`${id}-title`}
               placeholder="Nhập tên chương"
               value={title || ''}
               onChange={(e) => onTitleChange?.(e.target.value)}
            />
         </div>

         {/* Mô tả chương */}
         <div className="space-y-2">
            <Label htmlFor={`${id}-description`}>Mô tả chương</Label>
            <Input
               id={`${id}-description`}
               placeholder="Nhập mô tả chương"
               value={description || ''}
               onChange={(e) => onDescriptionChange?.(e.target.value)}
            />
         </div>

         {/* Video upload */}
         <div className="space-y-2">
            <Label>Video</Label>
            <div className="space-y-4">
               {videoUrl && (
                  <div className="relative">
                     <video
                        src={videoUrl}
                        controls
                        className="w-full max-w-md h-48 rounded-lg border"
                     />
                     {loading && (
                        <div className="mt-2">
                           <div className="flex items-center justify-between text-sm mb-1">
                              <span>Đang tải lên...</span>
                           </div>
                           <Progress
                              value={uploadProgress}
                              className="w-full animate-pulse"
                           />
                        </div>
                     )}
                  </div>
               )}
               <div className="flex items-center gap-4">
                  <input
                     ref={inputRef}
                     type="file"
                     accept="video/*"
                     onChange={handleFileChange}
                     className="hidden"
                  />
                  <Button
                     type="button"
                     variant="outline"
                     onClick={() => inputRef.current?.click()}
                  >
                     <Upload className="mr-2 h-4 w-4" />
                     {videoUrl ? 'Thay đổi video' : 'Chọn video'}
                  </Button>
               </div>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
         </div>

         {/* Thời lượng */}
         <div className="space-y-2">
            <Label htmlFor={`${id}-duration`}>Thời lượng</Label>
            <Input id={`${id}-duration`} value={duration || ''} disabled />
         </div>
      </div>
   );
}
