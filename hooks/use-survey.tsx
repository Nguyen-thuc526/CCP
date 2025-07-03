"use client"

import { useState, useEffect } from "react"
import { useToast, ToastType } from "@/hooks/useToast"
import { getALlSurvey } from "@/services/surveyService"
import { Survey } from "@/types/survey"

export function useSurveys() {
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { showToast } = useToast()

  const fetchSurveys = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getALlSurvey()
      const activeSurveys = data.filter((survey) => survey.status === 1)
      setSurveys(activeSurveys)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi xảy ra khi tải danh sách khảo sát"
      setError(errorMessage)
      showToast(errorMessage, ToastType.Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSurveys()
  }, [])

  return {
    surveys,
    loading,
    error,
    refetch: fetchSurveys,
  }
}
