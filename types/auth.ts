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
export type ChangePasswordPayload = {
   currentPassword: string;
   newPassword: string;
   confirmPassword: string;
};
