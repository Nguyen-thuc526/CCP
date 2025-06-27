'use client';

import { useState, useEffect } from 'react';
import { Counselor } from '@/types/counselor';
import { getCounselors, updateCounselorStatus } from '@/services/adminService';
import { useErrorLoadingWithUI } from '@/hooks/useErrorLoading';
import { useToast, ToastType } from '@/hooks/useToast';
import CounselorTabs from './counselors-tabs';

export function CounselorManagement() {
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const { showToast } = useToast();

  const {
    loading,
    error,
    startLoading,
    stopLoading,
    setErrorMessage,
    renderStatus,
  } = useErrorLoadingWithUI();

  const fetchCounselors = async () => {
    startLoading();
    try {
      const res = await getCounselors({ PageNumber: page, PageSize: pageSize });
      setCounselors(res.items);
      setTotalCount(res.totalCount);
    } catch (err) {
      console.error(err);
      setErrorMessage('Không thể tải danh sách chuyên viên. Vui lòng thử lại.');
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    fetchCounselors();
  }, [page]);

  const handleStatusChange = async (counselorId: string, newStatus: number) => {
    try {
      await updateCounselorStatus({ counselorId, status: newStatus });
      setCounselors((prev) =>
        prev.map((c) => (c.id === counselorId ? { ...c, status: newStatus } : c))
      );
      showToast('Đã cập nhật trạng thái chuyên viên thành công', ToastType.Success);
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái:', error);
      showToast('Không thể cập nhật trạng thái. Vui lòng thử lại.', ToastType.Error);
    }
  };

  return (
    <div className="space-y-6">
      {renderStatus({ onRetry: fetchCounselors })}
      {!loading && !error && (
        <CounselorTabs
          counselors={counselors}
          handleStatusChange={handleStatusChange}
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
