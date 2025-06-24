import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookingAdmin } from "@/types/booking"
import { BookingStatus } from "@/utils/enum"
import { Calendar, DollarSign, TrendingUp, Users } from "lucide-react"

interface BookingStatsProps {
    bookings: BookingAdmin[]
}

export function BookingStats({ bookings }: BookingStatsProps) {
    const totalBookings = bookings.length
    const completedBookings = bookings.filter((b) => b.status === BookingStatus.Complete).length
    const totalRevenue = bookings.filter((b) => b.status === BookingStatus.Complete).reduce((sum, b) => sum + b.price, 0)
    const averageRating = bookings
        .filter((b) => b.rating !== null)
        .reduce((sum, b, _, arr) => sum + b.rating! / arr.length, 0)

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount)
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tổng booking</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalBookings}</div>
                    <p className="text-xs text-muted-foreground">{completedBookings} đã hoàn thành</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                    <p className="text-xs text-muted-foreground">Từ {completedBookings} buổi tư vấn</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tỷ lệ hoàn thành</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {totalBookings > 0 ? Math.round((completedBookings / totalBookings) * 100) : 0}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {completedBookings}/{totalBookings} booking
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Đánh giá TB</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{averageRating > 0 ? averageRating.toFixed(1) : "N/A"}</div>
                    <p className="text-xs text-muted-foreground">Trên 5 sao</p>
                </CardContent>
            </Card>
        </div>
    )
}
