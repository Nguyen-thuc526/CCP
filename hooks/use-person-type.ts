"use client"

import { useState, useEffect } from "react"
import { getPersonTypesBySurveyId, createPersonType, updatePersonType } from "../services/personTypeService"
import { CreatePersonTypePayload, PersonType, UpdatePersonTypePayload } from "@/types/person-type"
import { useErrorLoadingWithUI } from "./useErrorLoading"
import { useToast, ToastType } from "./useToast"
import { Category } from "@/types/category"


interface UsePersonTypesProps {
  surveyId: string
  enabled?: boolean
}

export function usePersonTypes({ surveyId, enabled = true }: UsePersonTypesProps) {
  const [personTypes, setPersonTypes] = useState<PersonType[]>([])
  const { loading, startLoading, stopLoading, setErrorMessage } = useErrorLoadingWithUI()
  const { showToast } = useToast()

  const categories: Category[] = personTypes.reduce((acc: Category[], personType) => {
    const existingCategory = acc.find((cat) => cat.id === personType.category.id)
    if (!existingCategory && personType.category) {
      acc.push(personType.category)
    }
    return acc
  }, [])

  const fetchPersonTypes = async () => {
    if (!surveyId || !enabled) return

    try {
      startLoading()
      const data = await getPersonTypesBySurveyId(surveyId)
      setPersonTypes(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi xảy ra khi tải dữ liệu"
      setErrorMessage(errorMessage)
      showToast(errorMessage, ToastType.Error)
    } finally {
      stopLoading()
    }
  }

  const handleCreate = async (payload: CreatePersonTypePayload): Promise<boolean> => {
    try {
      await createPersonType(payload)
      showToast("Đã tạo loại tính cách mới", ToastType.Success)
      await fetchPersonTypes()
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi xảy ra khi tạo loại tính cách"
      showToast(errorMessage, ToastType.Error)
      return false
    }
  }
  const handleUpdate = async (payload: UpdatePersonTypePayload): Promise<boolean> => {
    try {
      await updatePersonType(payload)

      // Tìm object category tương ứng với categoryId vừa chọn
      const matchedCategory = categories.find(cat => cat.id === payload.categoryId)

      setPersonTypes((prev) =>
        prev.map((item) =>
          item.id === payload.id
            ? {
              ...item,
              ...payload,
              category: matchedCategory ?? item.category, // cập nhật object category
            }
            : item
        )
      )

      showToast("Đã cập nhật loại tính cách", ToastType.Success)
      return true
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Có lỗi xảy ra khi cập nhật loại tính cách"
      showToast(errorMessage, ToastType.Error)
      return false
    }
  }
  useEffect(() => {
    fetchPersonTypes()
  }, [surveyId, enabled])

  return {
    personTypes,
    categories,
    loading,
    handleCreate,
    handleUpdate,
    refetch: fetchPersonTypes,
  }
}
