import { ApiResponse } from "@/types/booking"
import { CreatePersonTypePayload, PersonType, UpdatePersonTypePayload } from "@/types/person-type"
import axiosInstance from "./axiosInstance"

export const getPersonTypesBySurveyId = async (
  surveyId: string
): Promise<PersonType[]> => {
  const response = await axiosInstance.get<ApiResponse<PersonType[]>>(
    `/api/PersonType/by-survey/${surveyId}`
  )
  const { success, data, error } = response.data

  if (success) {
    return data
  } else {
    throw new Error(error || 'Failed to fetch person types')
  }
}

export const updatePersonType = async (
  payload: UpdatePersonTypePayload
): Promise<PersonType> => {
  const response = await axiosInstance.put<ApiResponse<PersonType>>(
    `/api/PersonType`,
    payload
  )
  const { success, data, error } = response.data

  if (success) {
    return data
  } else {
    throw new Error(error || 'Failed to update person type')
  }
}

export const createPersonType = async (
  payload: CreatePersonTypePayload
): Promise<PersonType> => {
  const response = await axiosInstance.post<ApiResponse<PersonType>>('/api/person-type', payload)
  const { success, data, error } = response.data

  if (success) {
    return data
  } else {
    throw new Error(error || 'Failed to create person type')
  }
}