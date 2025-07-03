export interface WorkSchedule {
   workDate: string;
   startTime: string;
   endTime: string;
   description?: string;
}

export interface WorkScheduleResponse {
   success: boolean;
   data: WorkSchedule[];
   error: any;
}
