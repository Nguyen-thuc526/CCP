import { ApiResponse } from '@/types/booking';
import {
   CreatePersonTypePayload,
   PersonType,
   UpdatePersonTypePayload,
} from '@/types/person-type';
import axiosInstance from './axiosInstance';
import { ResultPersonType } from '@/types/result-person-type';

export const getPersonTypesBySurveyId = async (
   surveyId: string
): Promise<PersonType[]> => {
   const response = await axiosInstance.get<ApiResponse<PersonType[]>>(
      `/api/PersonType/by-survey/${surveyId}`
   );
   const { success, data, error } = response.data;

   if (success) {
      return data;
   } else {
      throw new Error(error || 'Failed to fetch person types');
   }
};

export const updatePersonType = async (
   payload: UpdatePersonTypePayload
): Promise<PersonType> => {
   const response = await axiosInstance.put<ApiResponse<PersonType>>(
      `/api/PersonType`,
      payload
   );
   const { success, data, error } = response.data;

   if (success) {
      return data;
   } else {
      throw new Error(error || 'Failed to update person type');
   }
};

export const createPersonType = async (
   payload: CreatePersonTypePayload
): Promise<PersonType> => {
   const response = await axiosInstance.post<ApiResponse<PersonType>>(
      '/api/person-type',
      payload
   );
   const { success, data, error } = response.data;

   if (success) {
      return data;
   } else {
      throw new Error(error || 'Failed to create person type');
   }
};

export const comparePersonType = async (
   personTypeId: string
): Promise<ResultPersonType> => {

   const response = await axiosInstance.get<ApiResponse<ResultPersonType>>(
      `/api/ResultPersonType/by-persontype/${personTypeId}`
   );

   const { success, data, error } = response.data;

   if (success) {
      return data;
   } else {
      throw new Error(error || 'Failed to compare person type');
   }
};

export const updateResultPersonType = async (
   data: UpdatePersonTypePayload
): Promise<ApiResponse<null>> => {
   try {
      const response = await axiosInstance.put<ApiResponse<null>>(
         `/api/ResultPersonType/edit`,
         data
      );
      return response.data;
   } catch (error: any) {
      console.error('Error updating result person type:', error);
      throw error;
   }
};