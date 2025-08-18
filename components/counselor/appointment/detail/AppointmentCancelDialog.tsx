"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface AppointmentCancelDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  memberName: string
  isCouple: boolean
  timeStart: string
  onCancel: (reason: string) => Promise<void>
  loading?: boolean
}

const AppointmentCancelDialog: React.FC<AppointmentCancelDialogProps> = ({
  open,
  onOpenChange,
  memberName,
  isCouple,
  timeStart,
  onCancel,
  loading = false,
}) => {
  const [cancellationReason, setCancellationReason] = useState("")

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleCancel = async () => {
    if (!cancellationReason.trim()) return

    await onCancel(cancellationReason)
    setCancellationReason("")
  }

  const handleClose = () => {
    setCancellationReason("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hủy lịch hẹn</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm">
              <strong>{isCouple ? "Cặp đôi" : "Thành viên"}:</strong> {memberName}
            </p>
            <p className="text-sm">
              <strong>Thời gian:</strong> {formatDate(timeStart)} - {formatTime(timeStart)}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cancellation-reason">Lý do hủy *</Label>
            <Textarea
              id="cancellation-reason"
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="Vui lòng nhập lý do hủy lịch hẹn..."
              rows={4}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleCancel} disabled={!cancellationReason.trim() || loading}>
              Hủy lịch hẹn
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AppointmentCancelDialog
