import { PagingResponse, Survey, SurveyQuestion, SurveyResponse } from "@/types/survey";
import axiosInstance from "./axiosInstance";

export const getALlSurvey = async (): Promise<Survey[]> => {
    const response = await axiosInstance.get<SurveyResponse>(
        '/api/Survey'
    );
    const { success, data, error } = response.data;
    if (success) {
        return data;
    } else {
        throw new Error(error || 'Failed to fetch certifications');
    }
};


export const createSurveyQuestion = async (
    payload: SurveyQuestion
): Promise<Survey[]> => {
    const response = await axiosInstance.post<SurveyResponse>(
        '/api/Question',
        payload
    );

    const { success, data, error } = response.data;

    if (success) {
        return data;
    } else {
        throw new Error(error || 'Tạo câu hỏi thất bại');
    }
};

export const updateSurveyQuestion = async (
    payload: SurveyQuestion
): Promise<Survey[]> => {
    const response = await axiosInstance.put<SurveyResponse>(
        '/api/Question',
        payload
    );

    const { success, data, error } = response.data;

    if (success) {
        return data;
    } else {
        throw new Error(error || 'Cập nhật câu hỏi thất bại');
    }
};

export const getSurveyQuestions = async (
  surveyId: string,
  page: number = 1,
  pageSize: number = 10
): Promise<PagingResponse<SurveyQuestion>> => {
  const response = await axiosInstance.get<PagingResponse<SurveyQuestion>>('/api/Question/paging', {
    params: {
      SurveyId: surveyId,
      Page: page,
      PageSize: pageSize
    }
  });

  return response.data;
};

export const deleteSurveyQuestion = async (id: string): Promise<void> => {
  const response = await axiosInstance.delete(`/api/Question/${id}`);

  if (response.status !== 200 && response.status !== 204) {
    throw new Error('Xóa câu hỏi thất bại');
  }
};