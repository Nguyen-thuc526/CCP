import {
   GetMembersParams,
   PaginatedMemberResponse,
   UpdateMemberStatusPayload,
} from '@/types/member';
import axiosInstance from './axiosInstance';
import {
   Counselor,
   GetCounselorsParams,
   PaginatedResponse,
} from '@/types/counselor';
import {
   ApiResponse,
   BookingPagingResponse,
   BookingQuery,
} from '@/types/booking';

export const getMembers = async (
   params: GetMembersParams
): Promise<PaginatedMemberResponse> => {
   const response = await axiosInstance.get('/api/Member/paging', { params });
   const { success, data, error } = response.data;

   if (success) return data as PaginatedMemberResponse;
   throw new Error(error || 'Lấy danh sách danh member thất bại');
};

export const updateMemberStatus = async (
   payload: UpdateMemberStatusPayload
): Promise<void> => {
   const response = await axiosInstance.put('/api/Member/status', payload);
   const { success, error } = response.data;

   if (!success) {
      throw new Error(error || 'Cập nhật trạng thái thành viên thất bại');
   }
};

export const getCounselors = async (
   params: GetCounselorsParams
): Promise<PaginatedResponse<Counselor>> => {
   const response = await axiosInstance.get('/api/Counselor/paging', {
      params,
   });

   const { success, data, error } = response.data;
   if (success) return data;
   throw new Error(error || 'Không thể tải danh sách tư vấn viên.');
};

export const updateCounselorStatus = async (payload: {
   counselorId: string;
   status: number;
}) => {
   const response = await axiosInstance.put('/api/Counselor/status', payload);
   const { success, error } = response.data;

   if (!success)
      throw new Error(error || 'Cập nhật trạng thái counselor thất bại');
};

export const getBookings = async (
   params: BookingQuery
): Promise<BookingPagingResponse> => {
   const response = await axiosInstance.get<ApiResponse<BookingPagingResponse>>(
      '/api/Booking/all-paging',
      { params }
   );

   const resData = response.data;

   if (!resData.success || !resData.data) {
      throw new Error(resData.error ?? 'Unknown API error');
   }

   const paging = resData.data;

   return {
      items: Array.isArray(paging.items) ? paging.items : [],
      totalCount: paging.totalCount ?? 0,
      pageNumber: paging.pageNumber ?? params.PageNumber,
      pageSize: paging.pageSize ?? params.PageSize,
   };
};
