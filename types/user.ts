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
   export interface MyDashboardResponse {
   success: boolean;
   data: MyDashboardData;
   error: string | null;
   }

   export interface MyDashboardData {
   totalIncome: number;
   appointmentsThisWeek: number;
   completedSessions: number;
   averageRating: number;
   monthlyIncome: MonthlyIncomeItem[];
   weeklyAppointments: WeeklyAppointmentItem[];
   }

   export interface MonthlyIncomeItem {
   month: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
   income: number;
   }

   export interface WeeklyAppointmentItem {
   // 1 = Monday, ... 7 = Sunday (theo payload của bạn)
   dayOfWeek: 1 | 2 | 3 | 4 | 5 | 6 | 7;
   count: number;
   }