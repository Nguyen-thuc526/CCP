export interface UserResponse {
   success: boolean;
   data: CounselorProfile;
   error: string | null;
}

// Main profile model
export interface CounselorProfile {
   id: string;
   fullname: string;
   avatar: string;
   description: string | null;
   price: number;
   yearOfJob: number;
   phone: string | null;
   status: number;
}

// Payload to update profile
export interface UpdateCounselorProfileRequest {
   fullName?: string | null;
   description?: string | null;
   price?: number;
   phone?: string | null;
   yearOfJob?: number;
   avatar?: string | null;
}
