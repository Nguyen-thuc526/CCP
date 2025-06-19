import { useState } from 'react';

interface UploadOptions {
   file: File;
   onSuccess?: (imageUrl: string) => void;
   onError?: (error: string) => void;
}

export const useUploadImage = () => {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [imageUrl, setImageUrl] = useState<string>('');

   const uploadImage = async ({ file, onSuccess, onError }: UploadOptions) => {
      setLoading(true);
      setError(null);

      try {
         const formData = new FormData();
         formData.append('file', file);
         formData.append('upload_preset', 'nguyen');

         const cloudinaryRes = await fetch(
            'https://api.cloudinary.com/v1_1/drzrib7ut/image/upload',
            {
               method: 'POST',
               body: formData,
            }
         );

         const data = await cloudinaryRes.json();

         if (!data.secure_url) throw new Error('Upload thất bại');

         setImageUrl(data.secure_url);
         onSuccess?.(data.secure_url);
      } catch (err: any) {
         const message = err.message || 'Lỗi không xác định';
         setError(message);
         onError?.(message);
      } finally {
         setLoading(false);
      }
   };

   return { uploadImage, imageUrl, loading, error };
};
