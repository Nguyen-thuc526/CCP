'use client';

import { useEffect, useState } from 'react';
import { useToast, ToastType } from '@/hooks/useToast';
import { getALlSurvey } from '@/services/surveyService';
import { Survey } from '@/types/survey';
import { useErrorLoadingWithUI } from './useErrorLoading';

export function useSurveys() {
   const [surveys, setSurveys] = useState<Survey[]>([]);
   const { 
      loading, 
      error, 
      startLoading, 
      stopLoading, 
      setErrorMessage, 
      renderStatus 
   } = useErrorLoadingWithUI();

   const { showToast } = useToast();

   const fetchSurveys = async () => {
      try {
         startLoading();
         const data = await getALlSurvey();
         const activeSurveys = data.filter((survey) => survey.status === 1);
         setSurveys(activeSurveys);
         stopLoading();
      } catch (err) {
         const errorMessage =
            err instanceof Error
               ? err.message
               : 'Có lỗi xảy ra khi tải danh sách khảo sát';
         setErrorMessage(errorMessage);
         showToast(errorMessage, ToastType.Error);
      }
   };

   useEffect(() => {
      fetchSurveys();
   }, []);

   return {
      surveys,
      loading,
      error,
      refetch: fetchSurveys,
      renderStatus, // ✅ pass UI helper to consumer
   };
}
