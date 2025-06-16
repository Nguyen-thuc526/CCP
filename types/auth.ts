import { Role } from "./user";

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

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  fullName?: string;
}
