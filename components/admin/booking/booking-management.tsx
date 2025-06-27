'use client'

import React, { useEffect, useState } from 'react'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
} from '@/components/ui/pagination'
import { getBookings } from '@/services/adminService'
import { BookingAdmin, BookingPagingResponse } from '@/types/booking'
import { BookingStatus } from '@/utils/enum'
import { useToast, ToastType } from '@/hooks/useToast'
import { BookingFilters } from './booking-filter'
import { BookingStats } from './booking-stat'
import { BookingTable } from './booking-table'

const PAGE_SIZE = 10

export default function BookingManagement() {
    const [bookings, setBookings] = useState<BookingAdmin[]>([])
    const [total, setTotal] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(false)

    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all")
    const [typeFilter, setTypeFilter] = useState<"all" | "individual" | "couple">("all")

    const { showToast } = useToast()
    const totalPages = Math.ceil(total / PAGE_SIZE)

    const fetchBookings = async () => {
        setLoading(true)
        try {
            const response: BookingPagingResponse = await getBookings({
                PageNumber: currentPage,
                PageSize: PAGE_SIZE,
                Status: statusFilter === "all" ? undefined : statusFilter,
            })
            setBookings(Array.isArray(response.items) ? response.items : [])
            setTotal(response.totalCount ?? 0)
        } catch (error) {
            console.error("Lỗi khi tải booking:", error)
            showToast("Tải danh sách booking thất bại", ToastType.Error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBookings()
    }, [currentPage, statusFilter])

    const handleClearFilters = () => {
        setSearchQuery("")
        setStatusFilter("all")
        setTypeFilter("all")
    }

    const filteredBookings = bookings.filter((booking) => {
        const matchesSearch =
            searchQuery === "" ||
            booking.member.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.counselor.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.member2?.fullname.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesType =
            typeFilter === "all" ||
            (typeFilter === "couple" && booking.isCouple) ||
            (typeFilter === "individual" && !booking.isCouple)

        return matchesSearch && matchesType
    })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Quản lý Booking</h1>
                <p className="text-muted-foreground">Quản lý và theo dõi tất cả các lịch hẹn tư vấn</p>
            </div>

            <BookingStats bookings={bookings} />

            <div className="space-y-4">
                <BookingFilters
                    onSearch={setSearchQuery}
                    onStatusFilter={setStatusFilter}
                    onTypeFilter={setTypeFilter}
                    onClearFilters={handleClearFilters}
                />

                <div className="text-sm text-muted-foreground">
                    {loading
                        ? "Đang tải dữ liệu..."
                        : `Hiển thị ${filteredBookings.length} trong tổng ${total} booking`}
                </div>

                <BookingTable bookings={filteredBookings} />

                {totalPages > 1 && (
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                />
                            </PaginationItem>

                            {Array.from({ length: totalPages }).map((_, i) => {
                                const page = i + 1
                                return (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                            isActive={currentPage === page}
                                            onClick={() => setCurrentPage(page)}
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                )
                            })}

                            <PaginationItem>
                                <PaginationNext
                                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}
            </div>
        </div>
    )
}
