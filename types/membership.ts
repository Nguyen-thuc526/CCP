import { MembershipStatus } from '@/utils/enum';

export interface Membership {
   id: string;
   memberShipName: string;
   rank: number;
   discountCourse: number;
   discountBooking: number;
   price: number;
   expiryDate: number;
   status: MembershipStatus;
}

export interface CreateMembershipPayload {
   memberShipName: string;
   rank: number;
   discountCourse: number;
   discountBooking: number;
   price: number;
   expiryDate: number;
}

export interface UpdateMembershipPayload {
   id: string;
   memberShipName: string;
   rank: number;
   discountCourse: number;
   discountBooking: number;
   price: number;
   expiryDate: number;
}

export interface MembershipResponse {
   success: boolean;
   data: Membership[];
   error?: string;
}
