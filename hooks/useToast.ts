// hooks/useToast.ts
import { toast } from 'react-toastify';

export enum ToastType {
   Success = 'success',
   Error = 'error',
   Info = 'info',
   Warning = 'warning',
}

export function useToast() {
   const showToast = (message: string, type: ToastType = ToastType.Info) => {
      toast(message, { type });
   };

   return { showToast };
}
