'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import type { BookingAdmin } from '@/types/booking'
import {
    Calendar,
    Star,
    Users,
    AlertTriangle,
    MessageSquare,
} from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { BookingStatusBadge } from './booking-status-badge'

interface BookingDetailsModalProps {
    booking: BookingAdmin | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function BookingDetailsModal({
    booking,
    open,
    onOpenChange,
}: BookingDetailsModalProps) {
    if (!booking) return null

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount)

    const formatDateTime = (dateString: string) =>
        format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi })

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        Chi tiết booking #{booking.id.slice(-8)}
                        <BookingStatusBadge status={booking.status} />
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Lịch hẹn */}
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Thông tin lịch hẹn
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Thời gian bắt đầu:</span>
                                    <span className="font-medium">{formatDateTime(booking.timeStart)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Thời gian kết thúc:</span>
                                    <span className="font-medium">{formatDateTime(booking.timeEnd)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Thời gian tạo:</span>
                                    <span className="font-medium">{formatDateTime(booking.createAt)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Giá:</span>
                                    <span className="font-semibold text-green-600">
                                        {formatCurrency(booking.price)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Loại tư vấn:</span>
                                    <Badge variant={booking.isCouple ? 'default' : 'secondary'}>
                                        {booking.isCouple ? 'Cặp đôi' : 'Cá nhân'}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Tư vấn viên */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="font-semibold mb-3">Tư vấn viên</h3>
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={booking.counselor.avatar || '/placeholder.svg'} />
                                    <AvatarFallback>
                                        {booking.counselor.fullname.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{booking.counselor.fullname}</p>
                                    <p className="text-sm text-gray-600">{booking.counselor.phone}</p>
                                    <p className="text-sm text-blue-600">{booking.counselor.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Khách hàng */}
                    <div className="space-y-4">
                        <div className="bg-green-50 p-4 rounded-lg">
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Thông tin khách hàng
                            </h3>

                            {/* Người đặt */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={booking.member.avatar || '/placeholder.svg'} />
                                        <AvatarFallback>
                                            {booking.member.fullname.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{booking.member.fullname}</p>
                                        <p className="text-sm text-gray-600">{booking.member.phone}</p>
                                    </div>
                                </div>

                                {/* Người đi cùng (nếu có) */}
                                {booking.member2 && (
                                    <>
                                        <Separator />
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={booking.member2.avatar || '/placeholder.svg'} />
                                                <AvatarFallback>
                                                    {booking.member2.fullname.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{booking.member2.fullname}</p>
                                                <p className="text-sm text-gray-600">{booking.member2.phone}</p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Đánh giá */}
                        {typeof booking.rating === "number" && (
                            <div className="bg-yellow-50 p-4 rounded-lg">
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <Star className="w-4 h-4" />
                                    Đánh giá
                                </h3>
                                <div className="flex items-center gap-2 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < (booking.rating ?? 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                                }`}
                                        />
                                    ))}
                                    <span className="font-medium">{booking.rating}/5</span>
                                </div>
                                {booking.feedback && (
                                    <p className="text-sm text-gray-700 italic">"{booking.feedback}"</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Thông tin thêm */}
                <div className="space-y-4 mt-6">
                    {booking.note && (
                        <InfoBlock title="Ghi chú" content={booking.note} />
                    )}
                    {booking.problemSummary && (
                        <InfoBlock title="Tóm tắt vấn đề" content={booking.problemSummary} />
                    )}
                    {booking.problemAnalysis && (
                        <InfoBlock title="Phân tích vấn đề" content={booking.problemAnalysis} />
                    )}
                    {booking.guides && (
                        <InfoBlock title="Hướng dẫn" content={booking.guides} />
                    )}

                    {booking.cancelReason && (
                        <div className="bg-red-50 p-4 rounded-lg">
                            <h3 className="font-semibold mb-2 text-red-800 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" />
                                Lý do hủy
                            </h3>
                            <p className="text-sm text-red-700">{booking.cancelReason}</p>
                        </div>
                    )}

                    {booking.isReport && booking.reportMessage && (
                        <div className="bg-orange-50 p-4 rounded-lg">
                            <h3 className="font-semibold mb-2 text-orange-800 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" />
                                Báo cáo
                            </h3>
                            <p className="text-sm text-orange-700">{booking.reportMessage}</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

// Subcomponent hiển thị block text có tiêu đề
function InfoBlock({ title, content }: { title: string; content: string }) {
    return (
        <div>
            <h3 className="font-semibold mb-2">{title}</h3>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{content}</p>
        </div>
    )
}
