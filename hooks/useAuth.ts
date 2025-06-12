// hooks/useAuth.ts
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import { authService } from "@/services/authService";
import { useToast, ToastType } from "@/hooks/useToast";
import { LoginFormData, RegisterFormData } from "@/lib/validationSchemas";
import { Role } from "@/types/auth";
import { login, logout } from "@/store/slices/authReducer";

export function useAuth() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { showToast } = useToast();

  const signIn = async (
    data: LoginFormData,
    role: Role,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    try {
      const response = await authService.login(data);
      const { token, user } = response; // Giả sử API trả về token và user
      localStorage.setItem("token", token);
      dispatch(login(user));
      showToast(`${role === Role.Admin ? "Admin" : "Counselor"} login successful!`, ToastType.Success);
      router.push(`/${role}/dashboard`);
    } catch (error: any) {
      showToast(error.message || "Login failed. Please try again.", ToastType.Error);
      setSubmitting(false);
    }
  };

  const signUp = async (
    data: RegisterFormData,
    setSubmitting: (isSubmitting: boolean) => void,
    onSuccess: () => void
  ) => {
    try {
      await authService.register(data);
      showToast("Registration successful! Please log in.", ToastType.Success);
      onSuccess();
    } catch (error: any) {
      showToast(error.message || "Registration failed. Please try again.", ToastType.Error);
      setSubmitting(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    showToast("Logged out successfully.", ToastType.Success);
    router.push("/login");
  };

  return { signIn, signUp, signOut };
}