'use client';

import { useEffect, useState } from 'react';
import { getALlSurvey } from '@/services/surveyService';
import type { Survey } from '@/types/survey';
import { useErrorLoadingWithUI } from '@/hooks/useErrorLoading';
import { useToast, ToastType } from '@/hooks/useToast';
import { SurveyContent } from './survey-content';

export default function SurveyManagement() {
   const [surveys, setSurveys] = useState<Survey[]>([]);
   const {
      loading,
      error,
      startLoading,
      stopLoading,
      setErrorMessage,
      renderStatus,
   } = useErrorLoadingWithUI();
   const { showToast } = useToast();

   useEffect(() => {
      const loadSurveys = async () => {
         try {
            startLoading();
            const data = await getALlSurvey();
            setSurveys(data);
         } catch (err) {
            setErrorMessage(
               err instanceof Error
                  ? err.message
                  : 'Có lỗi xảy ra khi tải dữ liệu'
            );
         } finally {
            stopLoading();
         }
      };

      loadSurveys();
   }, [startLoading, stopLoading, setErrorMessage]);

   const refreshSurveys = async () => {
      try {
         startLoading();
         const data = await getALlSurvey();
         setSurveys(data);
         showToast('Tải lại khảo sát thành công!', ToastType.Success);
      } catch (err) {
         setErrorMessage(
            err instanceof Error
               ? err.message
               : 'Có lỗi xảy ra khi tải lại dữ liệu'
         );
      } finally {
         stopLoading();
      }
   };

   return (
      <div className="space-y-6">
         {/* Page Title */}
         <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
               Quản Lý Khảo Sát
            </h1>
            <p className="text-gray-600">
               Quản lý câu hỏi và câu trả lời cho các bài đánh giá tính cách
            </p>
         </div>

         {renderStatus({ onRetry: refreshSurveys })}

         {!loading && !error && surveys.length === 0 && (
            <div className="text-center py-12">
               <p className="text-gray-500">
                  Không có khảo sát nào được tìm thấy.
               </p>
            </div>
         )}

         {/* Main Content */}
         {!loading && !error && surveys.length > 0 && (
            <SurveyContent surveys={surveys} onRefresh={refreshSurveys} />
         )}
      </div>
   );
}
