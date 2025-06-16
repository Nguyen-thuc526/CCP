export enum Role {
  Admin = "admin",
  Counselor = "counselor",
  Member = "member",
}

export enum Status {
  Active = 0,
  Inactive = 1,
  Suspended = 2,
  Pending = 3,
}

export interface User {
  id: string;
  email: string;
  fullName?: string;
  role: Role;
  status: Status;
  createAt: string;
  lastActive?: string;
  avatar?: string;
  membershipPlan?: string;
  specialization?: string;
  experience?: string;
  totalAppointments?: number;
  rating?: number;
}

export interface ApiUserResponse {
  success: boolean;
  data: ApiUser[];
  error: string | null;
}

export interface ApiUser {
  id: string;
  email: string;
  password: string;
  createAt: string;
  role: number;
  walletId: string;
  status: number;
  counselors: any[];
  members: any[];
  wallet: any | null;
}