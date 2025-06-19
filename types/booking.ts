import { CategoryDetail } from "./certification";

export interface Booking {
  id: string;
  name: string; 
  date: string; 
  status: number; 
  categories?: CategoryDetail[]; 

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