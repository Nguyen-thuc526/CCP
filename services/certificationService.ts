import { Certification, MyCertificationsResponse } from "@/types/certification";
import axiosInstance from "./axiosInstance";

export const getAllCertifications = async (): Promise<Certification[]> => {
    const response = await axiosInstance.get<MyCertificationsResponse>("/api/Certification/all");
    const { success, data, error } = response.data;
    if (success) {
        return data;
    } else {
        throw new Error(error || 'Failed to fetch certifications');
    }
};

export const approveCertificationById = async (certificationId: string): Promise<void> => {
  try {
    const response = await axiosInstance.put(`/api/Certification/approve/${certificationId}`);
    const { success, error } = response.data;

    if (!success) {
      throw new Error(error || "Failed to approve certification");
    }
  } catch (err) {
    throw new Error((err as Error).message);
  }
};

