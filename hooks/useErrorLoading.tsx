"use client"

import { useState, type ReactNode } from "react"
import { AlertCircle, Loader2, RefreshCcw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface StatusUIOptions {
  onRetry?: () => void
  retryText?: string
  noPadding?: boolean
  customError?: ReactNode
  customLoading?: ReactNode
}

interface SkeletonOptions {
  rows?: number
  showAvatar?: boolean
  showHeader?: boolean
  cardLayout?: boolean
  tableLayout?: boolean
  detailLayout?: boolean
}

export function useErrorLoadingWithUI() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startLoading = () => {
    setError(null)
    setLoading(true)
  }

  const stopLoading = () => {
    setLoading(false)
  }

  const setErrorMessage = (message: string) => {
    setError(message)
    setLoading(false)
  }

  const reset = () => {
    setError(null)
    setLoading(false)
  }

  const renderStatus = ({
    onRetry,
    retryText = "Thử lại",
    noPadding = false,
    customError,
    customLoading,
  }: StatusUIOptions = {}) => {
    if (loading) {
      return (
        customLoading || (
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Loader2 className="animate-spin w-5 h-5" />
              Đang tải dữ liệu...
            </div>
          </div>
        )
      )
    }

    if (error) {
      return (
        customError || (
          <div className="flex justify-center items-center">
            <Alert variant="destructive" className={`${noPadding ? "" : "my-4"} max-w-lg w-full`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 mt-1 text-destructive" />
                  <div>
                    <AlertTitle>Lỗi tải dữ liệu</AlertTitle>
                    <AlertDescription className="text-sm">{error}</AlertDescription>
                  </div>
                </div>
                {onRetry && (
                  <Button variant="outline" size="sm" onClick={onRetry}>
                    <RefreshCcw className="w-4 h-4 mr-1" />
                    {retryText}
                  </Button>
                )}
              </div>
            </Alert>
          </div>
        )
      )
    }

    return null
  }

  // Skeleton loading cho table
  const renderTableSkeleton = (rows = 5, columns = 6) => {
    if (!loading) return null

    return (
      <>
        {Array.from({ length: rows }).map((_, index) => (
          <tr key={index} className="border-b">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <td key={colIndex} className="p-4">
                {colIndex === 0 ? (
                  // First column with avatar
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ) : (
                  <Skeleton className="h-4 w-full" />
                )}
              </td>
            ))}
          </tr>
        ))}
      </>
    )
  }

  // Skeleton loading cho card layout
  const renderCardSkeleton = ({ rows = 3, showAvatar = false, showHeader = true }: SkeletonOptions = {}) => {
    if (!loading) return null

    return (
      <div className="space-y-4">
        {showHeader && <Skeleton className="h-8 w-48" />}

        <div className="space-y-6">
          {Array.from({ length: rows }).map((_, index) => (
            <div key={index} className="border rounded-lg p-6 space-y-4">
              {showAvatar && (
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>

              <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Skeleton loading cho detail layout (appointment detail)
  const renderDetailSkeleton = () => {
    if (!loading) return null

    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-20" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-8 w-64" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div className="border rounded-lg">
              <div className="p-6 border-b">
                <Skeleton className="h-6 w-40" />
              </div>
              <div className="p-6 space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border rounded-lg">
                <div className="p-6 border-b">
                  <Skeleton className="h-6 w-32" />
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    {i === 1 && (
                      <div className="space-y-2 mt-4">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Skeleton loading linh hoạt
  const renderSkeleton = (options: SkeletonOptions = {}) => {
    if (!loading) return null

    const {
      rows = 3,
      showAvatar = false,
      showHeader = true,
      cardLayout = false,
      tableLayout = false,
      detailLayout = false,
    } = options

    if (detailLayout) {
      return renderDetailSkeleton()
    }

    if (tableLayout) {
      return renderTableSkeleton(rows)
    }

    if (cardLayout) {
      return renderCardSkeleton({ rows, showAvatar, showHeader })
    }

    // Default skeleton
    return (
      <div className="space-y-4">
        {showHeader && <Skeleton className="h-8 w-48" />}
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex items-center gap-3">
            {showAvatar && <Skeleton className="h-10 w-10 rounded-full" />}
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return {
    loading,
    error,
    startLoading,
    stopLoading,
    setErrorMessage,
    reset,
    renderStatus,
    renderSkeleton,
    renderTableSkeleton,
    renderCardSkeleton,
    renderDetailSkeleton,
  }
}
