import { CreateMembershipPayload, Membership, MembershipResponse, UpdateMembershipPayload } from "@/types/membership";
import axiosInstance from "./axiosInstance";

export const getAllMembership = async (): Promise<Membership[]> => {
   try {
      const response =
         await axiosInstance.get<MembershipResponse>('/api/MemberShip');

      const { success, data, error } = response.data;
      if (success) {
         return data;
      } else {
         throw new Error(error || 'Failed to fetch membership');
      }
   } catch (err: any) {
      // ✅ log lỗi từ BE nếu có
      console.error('[getAllMembership ERROR]', err?.response?.data || err);
      throw err;
   }
};

export const createMembership = async (
   payload: CreateMembershipPayload
): Promise<Membership[]> => {
   try {
      const response = await axiosInstance.post<MembershipResponse>(
         '/api/MemberShip',
         payload
      );

      const { success, data: membershipData, error } = response.data;
      if (success) {
         return membershipData;
      } else {
         throw new Error(error || 'Failed to create membership');
      }
   } catch (err: any) {
      // ✅ log chi tiết từ BE
      console.error('[createMembership ERROR]', err?.response?.data || err);
      throw err;
   }
};

export const updateMembership = async (
   payload: UpdateMembershipPayload
): Promise<Membership[]> => {
   try {
      const response = await axiosInstance.put<MembershipResponse>(
         '/api/MemberShip',
         payload
      );

      const { success, data: membershipData, error } = response.data;
      if (success) {
         return membershipData;
      } else {
         throw new Error(error || 'Failed to update membership');
      }
   } catch (err: any) {
      console.error('[updateMembership ERROR]', err?.response?.data || err);
      throw err;
   }
};
