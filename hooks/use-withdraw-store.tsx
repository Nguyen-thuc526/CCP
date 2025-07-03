'use client';

import { useState, useEffect } from 'react';
import type { Withdraw } from '@/types/withdraw';
import { WithdrawStatus } from '@/utils/enum';
import { useToast, ToastType } from './useToast';
import {
   getWithdrawByStatus,
   updateWithdrawStatus,
} from '@/services/withdrawService';

export function useWithdrawStore() {
   const [withdraws, setWithdraws] = useState<
      Record<WithdrawStatus, Withdraw[]>
   >({
      [WithdrawStatus.PendingWithdrawal]: [],
      [WithdrawStatus.Approved]: [],
      [WithdrawStatus.Rejected]: [],
   });

   const [loading, setLoading] = useState<Record<WithdrawStatus, boolean>>({
      [WithdrawStatus.PendingWithdrawal]: false,
      [WithdrawStatus.Approved]: false,
      [WithdrawStatus.Rejected]: false,
   });

   const [updating, setUpdating] = useState<string | null>(null);

   const { showToast } = useToast();

   const fetchWithdrawsByStatus = async (status: WithdrawStatus) => {
      setLoading((prev) => ({ ...prev, [status]: true }));
      try {
         const data = await getWithdrawByStatus(status);
         setWithdraws((prev) => ({ ...prev, [status]: data }));
      } catch (error) {
         showToast('Không thể tải danh sách rút tiền', ToastType.Error);
      } finally {
         setLoading((prev) => ({ ...prev, [status]: false }));
      }
   };

   const updateStatus = async (
      depositId: string,
      newStatus: WithdrawStatus,
      cancelReason?: string
   ) => {
      setUpdating(depositId);
      try {
         await updateWithdrawStatus({
            depositId,
            newStatus,
            cancelReason,
         });

         await Promise.all([
            fetchWithdrawsByStatus(WithdrawStatus.PendingWithdrawal),
            fetchWithdrawsByStatus(WithdrawStatus.Approved),
            fetchWithdrawsByStatus(WithdrawStatus.Rejected),
         ]);

         showToast(
            'Cập nhật trạng thái rút tiền thành công',
            ToastType.Success
         );
      } catch (error) {
         showToast('Không thể cập nhật trạng thái rút tiền', ToastType.Error);
      } finally {
         setUpdating(null);
      }
   };

   useEffect(() => {
      fetchWithdrawsByStatus(WithdrawStatus.PendingWithdrawal);
      fetchWithdrawsByStatus(WithdrawStatus.Approved);
      fetchWithdrawsByStatus(WithdrawStatus.Rejected);
   }, []);

   return {
      withdraws,
      loading,
      updating,
      fetchWithdrawsByStatus,
      updateStatus,
   };
}
