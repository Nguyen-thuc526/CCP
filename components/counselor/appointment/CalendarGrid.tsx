"use client"

import { startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths } from "date-fns"
import { cn } from "@/lib/utils"
import type { BookingAdmin } from "@/types/booking"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

interface CalendarGridProps {
  bookings: BookingAdmin[]
  selectedDate?: Date
  onSelectDate: (date: Date) => void
}

export function CalendarGrid({ bookings, selectedDate, onSelectDate }: CalendarGridProps) {
  const today = new Date()
  const [viewMonth, setViewMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1))

  const handlePrevMonth = () => {
    setViewMonth((prev) => subMonths(prev, 1))
  }

  const handleNextMonth = () => {
    setViewMonth((prev) => addMonths(prev, 1))
  }

  const handleSelectMonth = (month: number) => {
    setViewMonth(new Date(viewMonth.getFullYear(), month, 1))
  }

  const handleSelectYear = (year: number) => {
    setViewMonth(new Date(year, viewMonth.getMonth(), 1))
  }

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(viewMonth),
    end: endOfMonth(viewMonth),
  })

  const firstDayOfWeek = getDay(startOfMonth(viewMonth))
  const emptyCells = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1

  const bookingDatesStr = bookings.map((b) => new Date(b.timeStart).toDateString())

  const months = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ]

  const years = Array.from({ length: 5 }, (_, i) => today.getFullYear() - 2 + i)

  return (
    <div className="space-y-2">
      {/* Caption */}
      <div className="flex justify-between items-center">
        <button onClick={handlePrevMonth}>
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Dropdown chọn tháng và năm */}
        <div className="flex gap-2">
          <Select value={viewMonth.getMonth().toString()} onValueChange={(val) => handleSelectMonth(Number(val))}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Tháng" />
            </SelectTrigger>
            <SelectContent>
              {months.map((m, idx) => (
                <SelectItem key={idx} value={idx.toString()}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={viewMonth.getFullYear().toString()} onValueChange={(val) => handleSelectYear(Number(val))}>
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="Năm" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <button onClick={handleNextMonth}>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Header row */}
      <div className="grid grid-cols-7 text-xs font-medium text-gray-500">
        {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
          <div key={d} className="text-center">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Ô trống đầu tháng */}
        {Array.from({ length: emptyCells }).map((_, i) => (
          <div key={`empty-${i}`} className="h-8" />
        ))}

        {daysInMonth.map((date) => {
          const isSelected = selectedDate?.toDateString() === date.toDateString()
          const hasBooking = bookingDatesStr.includes(date.toDateString())
          const isToday = today.toDateString() === date.toDateString()

          return (
            <button
              key={date.toString()}
              onClick={() => onSelectDate(date)}
              className={cn(
                "h-8 w-8 rounded-md text-xs flex items-center justify-center relative transition-colors",
                // Ngày có booking - màu rose
                hasBooking && "bg-rose-500 text-white hover:bg-rose-600",
                // Ngày được select - border xanh
                isSelected && "ring-2 ring-rose-500 ring-offset-1",
                // Ngày hôm nay - border vàng đậm và font bold
                isToday && "ring-2 ring-amber-500 ring-offset-1 font-bold",
                // Ngày thường
                !hasBooking && !isSelected && !isToday && "text-gray-700 hover:bg-gray-100",
              )}
            >
              {date.getDate()}
              {/* Dấu chấm nhỏ cho ngày hôm nay */}
              {isToday && (
                <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-amber-500 rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
