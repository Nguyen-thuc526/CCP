import {
   CertificationResponse,
   MyCertificationsResponse,
} from '@/types/certification';
import axiosInstance from './axiosInstance';

export const certificationService = {
   // API gửi chứng chỉ
   async sendCertification(data: {
      name: string;
      description: string;
      imageUrl: string;
      subCategoryIds: string[];
   }): Promise<CertificationResponse> {
      const response = await axiosInstance.post(
         '/api/Certification/send',
         data
      );
      return response.data;
   },

   // API lấy danh sách chứng chỉ của tôi
   async getMyCertifications(): Promise<MyCertificationsResponse> {
      const response = await axiosInstance.get(
         '/api/Certification/my-certifications'
      );
      return response.data;
   },

   // API cập nhật chứng chỉ
   async updateCertification(data: {
      certificationId: string;
      name: string;
      description: string;
      image: string;
      subCategoryIds: string[];
   }): Promise<CertificationResponse> {
      const response = await axiosInstance.put(
         '/api/Certification/update',
         data
      );
      return response.data;
   },
};

export const getAllCertifications = async (): Promise<Certification[]> => {
   const response = await axiosInstance.get<MyCertificationsResponse>(
      '/api/Certification/all'
   );
   const { success, data, error } = response.data;
   if (success) {
      return data;
   } else {
      throw new Error(error || 'Failed to fetch certifications');
   }
};

export const approveCertificationById = async (
   certificationId: string
): Promise<void> => {
   try {
      const response = await axiosInstance.put(
         `/api/Certification/approve/${certificationId}`
      );
      const { success, error } = response.data;

      if (!success) {
         throw new Error(error || 'Failed to approve certification');
      }
   } catch (err) {
      throw new Error((err as Error).message);
   }
};
