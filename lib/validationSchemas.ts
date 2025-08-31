// lib/validationSchemas.ts
import * as Yup from 'yup';

// Schema cho login (đăng nhập)
export const loginSchema = Yup.object({
   email: Yup.string()
      .email('Sai định dạng email')
      .required('Vui lòng nhập email'),
   password: Yup.string()
      .min(6, 'Mật khẩu ít nhất 6 ký tự')
      .required('Vui lòng nhập mật khẩu'),
});

// Schema cho register (đăng ký)
export const registerSchema = Yup.object({
   fullName: Yup.string()
      .matches(/^[A-Za-zÀ-ỹ\s]+$/, 'Họ tên chỉ được chứa chữ cái và khoảng trắng')
      .min(2, 'Họ tên phải có ít nhất 2 ký tự')
      .required('Nhập họ tên'),
   email: Yup.string()
      .email('Sai định dạng email')
      .required('Vui lòng nhập email'),
   password: Yup.string()
      .min(6, 'Mật khẩu ít nhất 6 ký tự')
      .required('Vui lòng nhập mật khẩu'),
   confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords không khớp')
      .required('Vui lòng nhập lại mật khẩu'),
});

// Kiểu dữ liệu TypeScript tương ứng với các schema trên
export type LoginFormData = Yup.InferType<typeof loginSchema>;
export type RegisterFormData = Yup.InferType<typeof registerSchema>;
