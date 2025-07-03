'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
   CheckCircle,
   XCircle,
   Clock,
   Calendar,
   User,
   Tag,
   FileText,
   AlertCircle,
   Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CertificateStatus } from '@/utils/enum';
import { useToast, ToastType } from '@/hooks/useToast';
import {
   getCertificationById,
   approveCertificationById,
   rejectCertificationById,
} from '@/services/certificationService';
import { Certification } from '@/types/certification';

const getStatusIcon = (status: number) => {
   switch (status) {
      case CertificateStatus.Active:
         return <CheckCircle className="h-4 w-4 text-green-500" />;
      case CertificateStatus.NeedEdit:
      case CertificateStatus.Pending:
         return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
         return <Clock className="h-4 w-4 text-gray-500" />;
   }
};

const getStatusText = (status: number) => {
   switch (status) {
      case CertificateStatus.Active:
         return 'Đã duyệt';
      case CertificateStatus.NeedEdit:
         return 'Cần chỉnh sửa';
      case CertificateStatus.Pending:
         return 'Chờ duyệt';
      default:
         return 'Không xác định';
   }
};

const getStatusColor = (status: number) => {
   switch (status) {
      case CertificateStatus.Active:
         return 'bg-green-100 text-green-800';
      case CertificateStatus.NeedEdit:
         return 'bg-yellow-100 text-yellow-800';
      case CertificateStatus.Pending:
         return 'bg-blue-100 text-blue-800';
      default:
         return 'bg-gray-100 text-gray-800';
   }
};

const formatDate = (dateString: string) => {
   return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
   });
};

export default function CertificateDetailPage() {
   const { id } = useParams();
   const { showToast } = useToast();
   const [certificate, setCertificate] = useState<Certification | null>(null);
   const [isLoading, setIsLoading] = useState(true);
   const [isProcessing, setIsProcessing] = useState(false);
   const [rejectReason, setRejectReason] = useState('');

   useEffect(() => {
      if (typeof id === 'string') {
         getCertificationById(id)
            .then(setCertificate)
            .catch((error) =>
               showToast(
                  error.message || 'Không thể tải chứng chỉ',
                  ToastType.Error
               )
            )
            .finally(() => setIsLoading(false));
      }
   }, [id]);

   const handleApprove = async () => {
      if (!certificate) return;
      setIsProcessing(true);
      try {
         await approveCertificationById(certificate.id);
         showToast('Chứng chỉ đã được duyệt thành công!', ToastType.Success);

         const updated = await getCertificationById(certificate.id);
         setCertificate(updated);
      } catch (error) {
         showToast(
            `Lỗi duyệt chứng chỉ: ${(error as Error).message}`,
            ToastType.Error
         );
      } finally {
         setIsProcessing(false);
      }
   };

   const handleReject = async () => {
      if (!certificate) return;

      if (!rejectReason.trim()) {
         showToast('Vui lòng nhập lý do từ chối', ToastType.Warning);
         return;
      }

      setIsProcessing(true);
      try {
         await rejectCertificationById(certificate.id, rejectReason);
         showToast('Chứng chỉ đã bị từ chối!', ToastType.Info);

         // Refresh data
         const updated = await getCertificationById(certificate.id);
         setCertificate(updated);
      } catch (error) {
         showToast(
            `Lỗi từ chối chứng chỉ: ${(error as Error).message}`,
            ToastType.Error
         );
      } finally {
         setIsProcessing(false);
      }
   };

   if (isLoading) {
      return (
         <div className="p-8 text-center text-muted-foreground">
            Đang tải...
         </div>
      );
   }

   if (!certificate) {
      return (
         <div className="p-8 text-center text-muted-foreground">
            Không tìm thấy dữ liệu chứng chỉ.
         </div>
      );
   }

   return (
      <div className="space-y-6">
         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
               <h1 className="text-3xl font-bold mb-2">{certificate.name}</h1>
               <p className="text-muted-foreground">ID: {certificate.id}</p>
            </div>
            <Badge
               className={`${getStatusColor(certificate.status)} flex items-center gap-2`}
            >
               {getStatusIcon(certificate.status)}
               {getStatusText(certificate.status)}
            </Badge>
         </div>

         <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
               <Card>
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Hình ảnh chứng chỉ
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="aspect-video relative rounded-lg overflow-hidden bg-muted">
                        <Image
                           src={certificate.image || '/placeholder.svg'}
                           alt={certificate.name}
                           fill
                           className="object-cover"
                           crossOrigin="anonymous"
                        />
                     </div>
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader>
                     <CardTitle>Mô tả chi tiết</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <p className="text-sm whitespace-pre-wrap">
                        {certificate.description}
                     </p>
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                        <Tag className="h-5 w-5" />
                        Danh mục và phân loại
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     {certificate.categories.map((category) => (
                        <div key={category.categoryId} className="space-y-2">
                           <Badge variant="default">
                              {category.categoryName}
                           </Badge>
                           {category.subCategories.length > 0 && (
                              <div className="ml-4 flex flex-wrap gap-1">
                                 {category.subCategories.map((sub) => (
                                    <Badge
                                       key={sub.id}
                                       variant="secondary"
                                       className="text-xs"
                                    >
                                       {sub.name}
                                    </Badge>
                                 ))}
                              </div>
                           )}
                        </div>
                     ))}
                  </CardContent>
               </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
               {/* Tổng quan tư vấn viên và trạng thái */}
               <Card>
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Thông tin chứng chỉ
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     {/* Người nộp và ngày nộp */}
                     <div className="space-y-1">
                        <Label className="text-sm text-muted-foreground">
                           Người nộp
                        </Label>
                        <p className="font-semibold text-base">
                           {certificate.counselor.fullname}
                        </p>
                     </div>

                     {certificate.time && (
                        <div className="space-y-1">
                           <Label className="text-sm text-muted-foreground">
                              Ngày nộp
                           </Label>
                           <div className="flex items-center gap-2 text-sm font-medium">
                              <Calendar className="h-4 w-4" />
                              {formatDate(certificate.time)}
                           </div>
                        </div>
                     )}

                     <Separator />

                     {/* Trạng thái chứng chỉ */}
                     <div className="space-y-1">
                        <Label className="text-sm text-muted-foreground">
                           Trạng thái
                        </Label>
                        <div className="flex items-center gap-2">
                           {getStatusIcon(certificate.status)}
                           <span className="text-sm font-medium">
                              {getStatusText(certificate.status)}
                           </span>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               {/* Các hành động duyệt/từ chối */}
               {[
                  CertificateStatus.Pending,
                  CertificateStatus.NeedEdit,
               ].includes(certificate.status) && (
                  <Card>
                     <CardHeader>
                        <CardTitle>Hành động</CardTitle>
                        <CardDescription>
                           Phê duyệt hoặc từ chối chứng chỉ này
                        </CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <Button
                           onClick={handleApprove}
                           disabled={isProcessing}
                           className="w-full"
                        >
                           <CheckCircle className="h-4 w-4 mr-2" />
                           {isProcessing ? 'Đang xử lý...' : 'Duyệt chứng chỉ'}
                        </Button>

                        <Separator />

                        <div className="space-y-2">
                           <Label>Lý do từ chối</Label>
                           <Textarea
                              value={rejectReason}
                              onChange={(e) => setRejectReason(e.target.value)}
                              placeholder="Nhập lý do từ chối..."
                              rows={3}
                           />
                           <Button
                              variant="destructive"
                              disabled={isProcessing || !rejectReason.trim()}
                              onClick={handleReject}
                              className="w-full"
                           >
                              <XCircle className="h-4 w-4 mr-2" />
                              {isProcessing
                                 ? 'Đang xử lý...'
                                 : 'Từ chối chứng chỉ'}
                           </Button>
                        </div>
                     </CardContent>
                  </Card>
               )}

               {/* Lý do bị từ chối */}
               {certificate.status === CertificateStatus.NeedEdit &&
                  certificate.rejectReason && (
                     <Alert className="border-destructive/50 bg-destructive/10">
                        <AlertCircle className="h-5 w-5 text-destructive" />
                        <AlertDescription className="text-sm">
                           <strong>Lý do từ chối:</strong>
                           <br />
                           {certificate.rejectReason}
                        </AlertDescription>
                     </Alert>
                  )}
            </div>
         </div>
      </div>
   );
}
