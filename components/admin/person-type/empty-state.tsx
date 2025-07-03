"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface EmptyStateProps {
  hasFilters: boolean
  onAddNew: () => void
  emptyMessage?: string
  emptyDescription?: string
}

export function EmptyState({
  hasFilters,
  onAddNew,
  emptyMessage = "Không tìm thấy loại tính cách nào",
  emptyDescription = "Bắt đầu bằng cách thêm loại tính cách đầu tiên của bạn.",
}: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">{emptyMessage}</h3>
          <p className="text-muted-foreground">
            {hasFilters ? "Thử điều chỉnh tiêu chí tìm kiếm của bạn." : emptyDescription}
          </p>
          {!hasFilters && (
            <Button onClick={onAddNew} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Thêm Loại Tính Cách
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
