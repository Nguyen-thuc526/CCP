import {
   CreateMembershipPayload,
   Membership,
   MembershipResponse,
   UpdateMembershipPayload,
} from '@/types/membership';
import axiosInstance from './axiosInstance';

export const getAllMembership = async (): Promise<Membership[]> => {
   const response =
      await axiosInstance.get<MembershipResponse>('/api/MemberShip');
   const { success, data, error } = response.data;
   if (success) {
      return data;
   } else {
      throw new Error(error || 'Failed to fetch membership');
   }
};

export const createMembership = async (
   payload: CreateMembershipPayload
): Promise<Membership[]> => {
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
};

export const updateMembership = async (
   payload: UpdateMembershipPayload
): Promise<Membership[]> => {
   const response = await axiosInstance.put<MembershipResponse>(
      '/api/MemberShip',
      payload
   );

   const { success, data: membershipData, error } = response.data;

   if (success) {
      return membershipData;
   } else {
      throw new Error(error || 'Failed to create membership');
   }
};
