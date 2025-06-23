export interface Appointment {
  id: string;
  member: string;
  avatar: string;
  avatar2?: string;
  date: string;
  time: string;
  duration: string;
  type: string;
  status: "Đã lên lịch" | "Đã hủy" | "Đã hoàn thành";
  issue: string;
  notes?: string;
  canCancel: boolean;
  cancellationReason?: string;
  requestedAt?: string;
  appointmentType: "couple" | "individual";
  additionalInfo?: string;
}

export interface Booking {
  id: string;
  note: string | null;
  timeStart: string;
  timeEnd: string;
  status: number;
  member: {
    id: string;
    accountId: string;
    fullname: string;
    avatar: string | null;
  };
  member2: {
    id: string;
    accountId: string;
    fullname: string;
    avatar: string | null;
  } | null;
  subCategories: { id: string; name: string; status: number }[];
}

export interface BookingResponse {
  success: boolean;
  data: Booking[];
  error?: string;
}
export interface LivekitTokenResponse {
  success: boolean
  data: {
    token: string
    serverUrl: string
  }
  error: string | null
}