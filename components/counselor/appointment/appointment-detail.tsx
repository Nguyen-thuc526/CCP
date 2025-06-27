'use client';

import React, { useState, useEffect, memo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar, Clock, Video, MessageSquare, X, Users, User, FileText, Search, Lightbulb, Edit3, Save } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { bookingService } from '@/services/bookingService';
import type { SubCategory } from '@/types/certification';
import { ToastType, useToast } from '@/hooks/useToast';
import { BookingStatus } from '@/utils/enum';

interface Member {
  id: string;
  accountId: string;
  fullname: string;
  avatar: string | null;
  phone: string | null;
  status: number;
}

interface BookingDetail {
  id: string;
  memberId: string;
  member2Id: string | null;
  counselorId: string;
  note: string | null;
  timeStart: string;
  timeEnd: string;
  price: number;
  cancelReason: string | null;
  createAt: string;
  rating: number | null;
  feedback: string | null;
  isCouple: boolean | null;
  problemSummary: string | null;
  problemAnalysis: string | null;
  guides: string | null;
  isReport: boolean | null;
  boolean;
  reportMessage: string | null;
  status: BookingStatus;
  member: Member;
  member2: Member | null;
  subCategories: SubCategory[];
}

interface NoteForm {
  problemSummary: string;
  problemAnalysis: string;
  guides: string;
}

interface FormErrors {
  problemSummary: string;
  guides: string;
}

const AppointmentDetail = memo(function AppointmentDetail({
  appointmentId,
}: {
  appointmentId: string;
}) {
  const [appointment, setAppointment] = useState<BookingDetail | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [noteForm, setNoteForm] = useState<NoteForm>({
    problemSummary: '',
    problemAnalysis: '',
    guides: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({
    problemSummary: '',
    guides: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointmentDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookingService.getBookingDetail(appointmentId);
      if (response) {
        setAppointment(response);
      } else {
        setError('Không thể tải chi tiết lịch hẹn. Vui lòng thử lại.');
      }
    } catch (err) {
      setError(
        'Đã xảy ra lỗi khi tải chi tiết lịch hẹn. Vui lòng kiểm tra kết nối mạng.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointmentDetail();
  }, [appointmentId]);

  const handleCancel = async () => {
    if (!cancellationReason.trim() || !appointment) return;

    try {
      setLoading(true);
      await bookingService.cancelByCounselor({
        bookingId: appointment.id,
        cancelReason: cancellationReason,
      });

      setAppointment({
        ...appointment,
        status: BookingStatus.Refund, // Assuming 0 is Cancelled
        cancelReason: cancellationReason,
      });

      showToast('Hủy lịch hẹn thành công.', ToastType.Success);
      setShowCancelDialog(false);
      setCancellationReason('');
    } catch (error) {
      showToast(
        'Không thể hủy lịch hẹn. Vui lòng thử lại.',
        ToastType.Error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNote = async () => {
    if (!appointment) return;

    // Validate required fields
    let errors: FormErrors = { problemSummary: '', guides: '' };
    if (!noteForm.problemSummary.trim()) {
      errors.problemSummary = 'Tóm tắt vấn đề là bắt buộc';
    }
    if (!noteForm.guides.trim()) {
      errors.guides = 'Hướng dẫn là bắt buộc';
    }
    setFormErrors(errors);

    if (errors.problemSummary || errors.guides) {
      showToast('Vui lòng điền đầy đủ các trường bắt buộc.', ToastType.Error);
      return;
    }

    try {
      setLoading(true);
      // Call API to update notes
      await bookingService.updateNote({
        bookingId: appointment.id,
        problemSummary: noteForm.problemSummary,
        problemAnalysis: noteForm.problemAnalysis,
        guides: noteForm.guides,
      });

      // Update local state
      setAppointment({
        ...appointment,
        problemSummary: noteForm.problemSummary,
        problemAnalysis: noteForm.problemAnalysis,
        guides: noteForm.guides,
        status: BookingStatus.Complete,
      });

      showToast('Lưu ghi chú thành công.', ToastType.Success);
      setShowNoteDialog(false);
      setIsEditing(false);
    } catch (error) {
      showToast('Lưu ghi chú thất bại. Vui lòng thử lại.', ToastType.Error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenNoteDialog = () => {
    if (appointment) {
      setNoteForm({
        problemSummary: appointment.problemSummary || '',
        problemAnalysis: appointment.problemAnalysis || '',
        guides: appointment.guides || '',
      });
      // Only allow editing for Finish status
      setIsEditing(appointment.status === BookingStatus.Finish);
      setFormErrors({ problemSummary: '', guides: '' });
      setShowNoteDialog(true);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.Confirm:
        return <Badge variant="default">Đã xác nhận</Badge>;
      case BookingStatus.Finish:
        return (
          <Badge variant="secondary" className="bg-blue-500">
            Đã kết thúc
          </Badge>
        );
      case BookingStatus.Reschedule:
        return <Badge variant="outline">Đề xuất lịch mới</Badge>;
      case BookingStatus.MemberCancel:
        return <Badge variant="destructive">Thành viên hủy</Badge>;
      case BookingStatus.Report:
        return (
          <Badge variant="destructive" className="bg-yellow-500">
            Báo cáo
          </Badge>
        );
      case BookingStatus.Refund:
        return (
          <Badge variant="secondary" className="bg-gray-500">
            Hoàn tiền
          </Badge>
        );
      case BookingStatus.Complete:
        return (
          <Badge variant="secondary" className="bg-green-500">
            Hoàn thành
          </Badge>
        );
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  // Custom skeleton for loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-20" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-8 w-64" />
          </div>
          <Skeleton className="h-6 w-24" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Skeleton className="h-4 w-16 mb-2" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  </div>
                  <div>
                    <Skeleton className="h-4 w-16 mb-2" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                </div>
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-4 w-56" />
                </div>
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Custom error state
  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <p className="text-red-600 font-medium text-lg">{error}</p>
            <Button onClick={fetchAppointmentDetail} variant="outline">
              Tải lại chi tiết
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!appointment) return null;

  const isCouple = appointment.member2 !== null || appointment.isCouple === true;
  const memberName = appointment.member2
    ? `${appointment.member.fullname} & ${appointment.member2.fullname}`
    : appointment.member.fullname;
  const startDate = new Date(appointment.timeStart);
  const duration = Math.floor(
    (new Date(appointment.timeEnd).getTime() - startDate.getTime()) / (1000 * 60)
  );
  const hasNotes = appointment.problemSummary || appointment.problemAnalysis || appointment.guides;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/counselor/appointments">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          {isCouple ? (
            <Users className="h-6 w-6 text-primary" />
          ) : (
            <User className="h-6 w-6 text-primary" />
          )}
          <h1 className="text-3xl font-bold">
            Chi tiết lịch hẹn {isCouple ? 'cặp đôi' : 'cá nhân'}
          </h1>
        </div>
        {getStatusBadge(appointment.status)}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin lịch hẹn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Ngày
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(appointment.timeStart)}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Giờ
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {startDate.toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      ({duration} phút)
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Loại tư vấn
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  {isCouple ? (
                    <Users className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  <span className="font-medium">
                    {isCouple ? 'Tư vấn cặp đôi' : 'Tư vấn cá nhân'}
                  </span>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Vấn đề cần tư vấn
                </Label>
                <p className="mt-1 font-medium">
                  {appointment.subCategories
                    .map((sub) => sub.name)
                    .join(', ') || 'Không xác định'}
                </p>
              </div>
              {(appointment.status === BookingStatus.Complete || appointment.status === BookingStatus.Finish) &&
                (appointment.problemSummary || appointment.problemAnalysis || appointment.guides) && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
                    <Label className="text-sm font-medium text-green-800">
                      Ghi chú sau buổi tư vấn
                    </Label>

                    {appointment.problemSummary && (
                      <div>
                        <Label className="text-xs font-medium text-green-700">
                          Tóm tắt vấn đề:
                        </Label>
                        <p className="mt-1 text-sm text-green-700">
                          {appointment.problemSummary}
                        </p>
                      </div>
                    )}

                    {appointment.problemAnalysis && (
                      <div>
                        <Label className="text-xs font-medium text-green-700">
                          Phân tích vấn đề:
                        </Label>
                        <p className="mt-1 text-sm text-green-700">
                          {appointment.problemAnalysis}
                        </p>
                      </div>
                    )}

                    {appointment.guides && (
                      <div>
                        <Label className="text-xs font-medium text-green-700">
                          Hướng dẫn:
                        </Label>
                        <p className="mt-1 text-sm text-green-700">
                          {appointment.guides}
                        </p>
                      </div>
                    )}
                  </div>
                )}

              {appointment.cancelReason && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <Label className="text-sm font-medium text-orange-800">
                    Lý do hủy
                  </Label>
                  <p className="mt-1 text-sm text-orange-700">
                    {appointment.cancelReason}
                  </p>
                </div>
              )}

              {appointment.note && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Label className="text-sm font-medium text-blue-800">
                    Ghi chú từ khách hàng
                  </Label>
                  <p className="mt-1 text-sm text-blue-700">
                    {appointment.note}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        {appointment && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  Thông tin {isCouple ? 'cặp đôi' : 'thành viên'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={
                        appointment.member.avatar ||
                        '/placeholder.svg?height=40&width=40' ||
                        '/placeholder.svg'
                      }
                    />
                    <AvatarFallback>
                      {appointment.member.fullname.split(' ')[0][0]}
                    </AvatarFallback>
                  </Avatar>
                  {isCouple && appointment.member2 && (
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={
                          appointment.member2.avatar ||
                          '/placeholder.svg?height=40&width=40' ||
                          '/placeholder.svg'
                        }
                      />
                      <AvatarFallback>
                        {appointment.member2.fullname.split(' ')[0][0]}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      {isCouple ? (
                        <Users className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <User className="h-4 w-4 text-muted-foreground" />
                      )}
                      <p className="font-medium">{memberName}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {appointment.member.email || 'Không có email'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.member.phone || 'Không có số điện thoại'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hành động</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {appointment.status === BookingStatus.Confirm && (
                  <>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 w-full"
                      asChild
                    >
                      <Link
                        href={`/counselor/appointments/call/${appointment.id}`}
                      >
                        <Video className="mr-2 h-4 w-4" />
                        Tham gia
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => setShowCancelDialog(true)}
                      className="w-full"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Hủy lịch hẹn
                    </Button>
                  </>
                )}

                {appointment.status === BookingStatus.Reschedule && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      console.log('Xử lý đề xuất lịch mới');
                    }}
                    className="w-full"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Xác nhận lịch mới
                  </Button>
                )}

                {(appointment.status === BookingStatus.Confirm ||
                  appointment.status === BookingStatus.Finish ||
                  appointment.status === BookingStatus.Complete) && (
                  <Button
                    variant="outline"
                    onClick={handleOpenNoteDialog}
                    className="w-full"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {appointment.status === BookingStatus.Complete && hasNotes
                      ? 'Xem ghi chú'
                      : hasNotes
                      ? 'Xem/Sửa ghi chú'
                      : 'Thêm ghi chú'}
                  </Button>
                )}

                {appointment.status === BookingStatus.Report && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      console.log('Xem báo cáo:', appointment.reportMessage);
                    }}
                    className="w-full"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Xem báo cáo
                  </Button>
                )}

                {appointment.status === BookingStatus.Refund && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      console.log('Xem chi tiết hoàn tiền');
                    }}
                    className="w-full"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Xem hoàn tiền
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hủy lịch hẹn</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm">
                <strong>{isCouple ? 'Cặp đôi' : 'Thành viên'}:</strong>{' '}
                {memberName}
              </p>
              <p className="text-sm">
                <strong>Thời gian:</strong>{' '}
                {formatDate(appointment.timeStart)} -{' '}
                {startDate.toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
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
              <Button
                variant="outline"
                onClick={() => setShowCancelDialog(false)}
              >
                Hủy
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancel}
                disabled={!cancellationReason.trim()}
              >
                Hủy lịch hẹn
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Note Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <FileText className="h-6 w-6 text-blue-600" />
                Ghi chú tư vấn
              </DialogTitle>
              {hasNotes && !isEditing && appointment.status === BookingStatus.Finish && (
                <Button onClick={() => setIsEditing(true)} size="sm" className="gap-2">
                  <Edit3 className="h-4 w-4" />
                  Chỉnh sửa
                </Button>
              )}
            </div>
          </DialogHeader>

          {/* Appointment Info */}
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-gray-600" />
                Thông tin buổi tư vấn
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Khách hàng</p>
                    <p className="font-medium">{memberName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Ngày tư vấn</p>
                    <p className="font-medium">{formatDate(appointment.timeStart)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Thời gian</p>
                    <p className="font-medium">
                      {startDate.toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-1">Vấn đề tư vấn</p>
                <p className="text-gray-900 leading-relaxed">
                  {appointment.subCategories.map((sub) => sub.name).join(', ') || 'Không xác định'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Notes Content */}
          {hasNotes && !isEditing ? (
            // View Mode
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="summary" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Tóm tắt
                </TabsTrigger>
                <TabsTrigger value="analysis" className="gap-2">
                  <Search className="h-4 w-4" />
                  Phân tích
                </TabsTrigger>
                <TabsTrigger value="guides" className="gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Hướng dẫn
                </TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      Tóm tắt vấn đề
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {noteForm.problemSummary || 'Chưa có tóm tắt vấn đề'}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analysis" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Search className="h-5 w-5 text-green-600" />
                      Phân tích vấn đề
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {noteForm.problemAnalysis || 'Chưa có phân tích chi tiết'}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="guides" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-amber-600" />
                      Hướng dẫn & Khuyến nghị
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {noteForm.guides || 'Chưa có hướng dẫn'}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : appointment.status === BookingStatus.Finish ? (
            // Edit Mode
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Tóm tắt vấn đề
                    <Badge variant="destructive" className="ml-2">Bắt buộc</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={noteForm.problemSummary}
                    onChange={(e) =>
                      setNoteForm({ ...noteForm, problemSummary: e.target.value })
                    }
                    placeholder="Tóm tắt ngắn gọn vấn đề chính được thảo luận trong buổi tư vấn..."
                    rows={4}
                    className={`resize-none ${formErrors.problemSummary ? 'border-red-500' : ''}`}
                  />
                  {formErrors.problemSummary && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <X className="h-4 w-4" />
                      {formErrors.problemSummary}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Search className="h-5 w-5 text-green-600" />
                    Phân tích vấn đề
                    <Badge variant="outline" className="ml-2">Tùy chọn</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={noteForm.problemAnalysis}
                    onChange={(e) =>
                      setNoteForm({ ...noteForm, problemAnalysis: e.target.value })
                    }
                    placeholder="Phân tích chi tiết về nguyên nhân, bối cảnh và các yếu tố ảnh hưởng đến vấn đề..."
                    rows={4}
                    className="resize-none"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-600" />
                    Hướng dẫn & Khuyến nghị
                    <Badge variant="destructive" className="ml-2">Bắt buộc</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={noteForm.guides}
                    onChange={(e) =>
                      setNoteForm({ ...noteForm, guides: e.target.value })
                    }
                    placeholder="Các bước tiếp theo, lời khuyên và hướng dẫn cụ thể cho khách hàng..."
                    rows={4}
                    className={`resize-none ${formErrors.guides ? 'border-red-500' : ''}`}
                  />
                  {formErrors.guides && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <X className="h-4 w-4" />
                      {formErrors.guides}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            // No Notes
            <Card>
              <CardContent className="p-8 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 bg-gray-100 rounded-full">
                    <FileText className="h-6 w-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">Không có ghi chú</p>z
                    <p className="text-gray-500 text-sm">Buổi tư vấn này không có ghi chú nào.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => {
                if (isEditing) {
                  setNoteForm({
                    problemSummary: appointment.problemSummary || '',
                    problemAnalysis: appointment.problemAnalysis || '',
                    guides: appointment.guides || '',
                  });
                  setIsEditing(false);
                  setFormErrors({ problemSummary: '', guides: '' });
                } else {
                  setShowNoteDialog(false);
                }
              }}
            >
              {isEditing ? 'Hủy' : 'Đóng'}
            </Button>
            {isEditing && appointment.status === BookingStatus.Finish && (
              <Button onClick={handleSaveNote} className="gap-2">
                <Save className="h-4 w-4" />
                Lưu ghi chú
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default AppointmentDetail;