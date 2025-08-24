export interface NotificateItem {
   id: string;
   notitype: string;
   description: string;
   isRead: boolean;
   isOpen: boolean;
   docNo: string;
   createdBy: string;
   createDate: string;
   status: number;
}

export interface NotificateResponse {
   success: boolean;
   data: NotificateItem[];
   error: string | null;
}

export interface NotificationSummary {
   unopenedCount: number;
}

export interface NotificationSummaryResponse {
   success: boolean;
   data: NotificationSummary;
   error: string | null;
}
