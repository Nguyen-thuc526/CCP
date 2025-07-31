import { useState } from 'react';

interface UploadOptions {
    file: File;
    onSuccess?: (videoUrl: string, duration: number) => void; 
    onError?: (error: string) => void;
}

export const useUploadVideo = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string>('');
    const [duration, setDuration] = useState<number>(0); 

    const uploadVideo = async ({ file, onSuccess, onError }: UploadOptions) => {
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'nguyen');
            formData.append('resource_type', 'video');

            const response = await fetch(
                'https://api.cloudinary.com/v1_1/drzrib7ut/video/upload',
                {
                    method: 'POST',
                    body: formData,
                }
            );

            const data = await response.json();

            if (!data.secure_url) throw new Error('Tải video lên thất bại');

            setVideoUrl(data.secure_url);

            const videoDuration = data.duration ?? 0;
            setDuration(videoDuration);

            onSuccess?.(data.secure_url, videoDuration);
        } catch (err: any) {
            const message = err.message || 'Lỗi không xác định';
            setError(message);
            onError?.(message);
        } finally {
            setLoading(false);
        }
    };

    return { uploadVideo, videoUrl, duration, loading, error };
