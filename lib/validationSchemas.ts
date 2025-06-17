// lib/validationSchemas.ts
import * as Yup from "yup";

// Schema cho login (đăng nhập)
export const loginSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

// Schema cho register (đăng ký)
export const registerSchema = Yup.object({
  fullName: Yup.string()
    .min(2, "Full name must be at least 2 characters")
    .required("Full name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

// Kiểu dữ liệu TypeScript tương ứng với các schema trên
export type LoginFormData = Yup.InferType<typeof loginSchema>;
export type RegisterFormData = Yup.InferType<typeof registerSchema>;
