// Vai trò người dùng
export enum Role {
  Admin = 1,
  Counselor = 2,
}

// Trạng thái tài khoản chung
export enum AccountStatus {
  Active = 1,
  Block = 2,
}

export enum CounselorStatus {
  NoFunc = 0,
  Active = 1,
  Block = 2,
}

// Trạng thái chứng chỉ

// Trạng thái danh mục
export enum CategoryStatus {
  Inactive = 0,
  Active = 1,
}

// Trạng thái lịch hẹn (Booking)
export enum BookingStatus {
  Confirm = 1,            // Xác nhận lịch
  Finish = 2,             // Đã kết thúc
  Reschedule = 3,         // Đề xuất lịch mới
  MemberCancel = 4,       // Thành viên hủy
  Report = 5,             // Báo cáo
  Refund = 6,             // Hoàn tiền
  Complete = 7,           // Hoàn thành
}

// Giao dịch
export enum TransactionType {
  Booking = 1,
  RefundBooking50 = 2,
  RefundBooking100 = 3,
  BuyMembership = 4,
  BuyCourse = 5,
  RefundCourse = 6,
  CounselorPayout = 7,
  Withdraw = 8,
}

// Trạng thái thành viên

export enum Category {
  InActive = 0,
  Active = 1,
}

export enum SubCategory {
  InActive = 0,
  Active = 1,
}

export enum CertificateStatus {
  Pending = 0,
  Active = 1,
  NeedEdit = 2,
}

export enum MembershipStatus {
  Inactive = 0,
  Active = 1,
}