import { Category } from './category';

export interface GetMembersParams {
   PageNumber?: number;
   PageSize?: number;
   Status?: number;
}

export interface PaginatedMemberResponse {
   items: Member[];
   totalCount: number;
   pageNumber: number;
   pageSize: number;
   totalPages: number;
}

export interface UpdateMemberStatusPayload {
   memberId: string;
   status: number;
}

export interface Member {
   id: string;
   accountId: string;
   fullname: string;
   avatar: string;
   phone: string;
   dob: string;
   mbti: string | null;
   disc: string | null;
   loveLanguage: string | null;
   bigFive: string | null;
   gender: 'Male' | 'Female' | string;
   rec1: string | null;
   rec2: string | null;
   status: number;
}
