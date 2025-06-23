type CounselorProfile = {
  id: string;
  fullname: string;
  avatar: string;
  description: string | null;
  price: number;
  yearOfJob: number;
  phone: string | null;
  status: number;
};

// Define the API response type
type UserResponse = {
  success: boolean;
  data: CounselorProfile;
  error: string | null;
};

interface UpdateCounselorProfileRequest {
  fullName?: string;
  description?: string;
  price?: number;
  phone?: string;
  yearOfJob?: number;
  avatar?: string;
}