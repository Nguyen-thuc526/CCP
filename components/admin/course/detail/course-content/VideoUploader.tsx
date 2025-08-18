'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Upload } from 'lucide-react';
import { useUploadVideo } from '@/hooks/upload-video';


interface VideoUploaderProps {
  videoUrl?: string;
  duration?: string;
  onUploadComplete: (videoUrl: string, duration: string) => void;
  id?: string;

  // Thông tin chương
  title?: string;
  description?: string;
  onTitleChange?: (title: string) => void;
  onDescriptionChange?: (desc: string) => void;
}

export function VideoUploader({
  videoUrl,
  duration,
  onUploadComplete,
  id = 'video-uploader',
  title,
  description,
  onTitleChange,
  onDescriptionChange,
}: VideoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { uploadVideo, loading, error } = useUploadVideo();
  const [percent, setPercent] = useState<number>(0);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(videoUrl);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Hiển thị preview tạm thời (object url) trong lúc upload
    const tmpUrl = URL.createObjectURL(file);
    setPreviewUrl(tmpUrl);

    setPercent(0);
    uploadVideo({
      file,
      onProgress: (p) => setPercent(p),
      onSuccess: (url, seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        const formatted = [
          hours.toString().padStart(2, '0'),
          minutes.toString().padStart(2, '0'),
          secs.toString().padStart(2, '0'),
        ].join(':');

        // Chốt 100% và cập nhật preview sang url thật
        setPercent(100);
        setPreviewUrl(url);
        onUploadComplete(url, formatted);

        // Giải phóng object url tạm
        URL.revokeObjectURL(tmpUrl);
      },
      onError: () => {
        // Lỗi thì bỏ preview tạm
        URL.revokeObjectURL(tmpUrl);
        setPreviewUrl(videoUrl);
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

      {/* Preview video khi đã có url (tạm thời hoặc url thật) */}
      {previewUrl && (
        <video
          src={previewUrl}
          controls
          className="w-full max-w-md h-48 rounded-lg border"
        />
      )}

      {/* Progress có % */}
      {loading && (
        <div className="mt-2">
          <div className="flex items-center justify-between text-sm mb-1">
            <span>{percent}%</span>
          </div>
          <Progress value={percent} className="w-full" />
        </div>
      )}

      {/* Chọn/đổi video */}
      <div className="space-y-2">
        <Label>Video</Label>
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
            disabled={loading}
          >
            <Upload className="mr-2 h-4 w-4" />
            {previewUrl ? 'Thay đổi video' : 'Chọn video'}
          </Button>
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
