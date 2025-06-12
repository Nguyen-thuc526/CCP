// types/auth.ts
export enum Role {
  Admin = "admin",
  Counselor = "counselor",
}

export enum FormType {
  AdminLogin = "admin",
  CounselorLogin = "counselor",
  Register = "register",
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface User {
  id: number;
  email: string;
  role: Role;
  fullName?: string;
}