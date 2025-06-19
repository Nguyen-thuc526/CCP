'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
   ArrowLeft,
   CheckCircle,
   XCircle,
   Clock,
   Calendar,
   User,
   Tag,
   FileText,
   AlertCircle,
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
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { approveCertificationById } from '@/services/certificationService';
import { useToast, ToastType } from '@/hooks/useToast';
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
   const certificate = useSelector(
      (state: RootState) => state.certificate.selectedCertificate
   );
   const [rejectReason, setRejectReason] = useState('');
   const [isProcessing, setIsProcessing] = useState(false);
   const { showToast } = useToast();
   const router = useRouter();
   console.log(certificate);

   const handleApprove = async () => {
      if (!certificate) return;
      setIsProcessing(true);
      try {
         await approveCertificationById(certificate.id);
         showToast('Chứng chỉ đã được duyệt thành công!', ToastType.Success);
         router.refresh();
      } catch (error) {
         showToast(
            `Đã xảy ra lỗi khi duyệt chứng chỉ: ${(error as Error).message}`,
            ToastType.Error
         );
      } finally {
         setIsProcessing(false);
      }
   };
   const handleReject = async () => {
      if (!rejectReason.trim()) {
         showToast('Vui lòng nhập lý do từ chối', ToastType.Warning);

         return;
      }
      setIsProcessing(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showToast('Chứng chỉ đã bị từ chối!', ToastType.Info);

      setIsProcessing(false);
   };
   if (!certificate) {
      return (
         <div className="container mx-auto px-4 py-8">
            <p className="text-center text-muted-foreground">
               Không tìm thấy dữ liệu chứng chỉ.
            </p>
         </div>
      );
   }
   return (
      <>
         {/* Header */}
         <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
               <div>
                  <h1 className="text-3xl font-bold mb-2">
                     {certificate.name}
                  </h1>
                  <p className="text-muted-foreground">ID: {certificate.id}</p>
               </div>

               <Badge
                  className={`${getStatusColor(certificate.status)} flex items-center gap-2 w-fit`}
               >
                  {getStatusIcon(certificate.status)}
                  {getStatusText(certificate.status)}
               </Badge>
            </div>
         </div>

         <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
               {/* Certificate Image */}
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

               {/* Description */}
               <Card>
                  <CardHeader>
                     <CardTitle>Mô tả chi tiết</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {certificate.description}
                     </p>
                  </CardContent>
               </Card>

               {/* Categories */}
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
                           <div className="flex items-center gap-2">
                              <Badge variant="default">
                                 {category.categoryName}
                              </Badge>
                           </div>

                           {category.subCategories.length > 0 && (
                              <div className="ml-4 space-y-1">
                                 <div className="flex flex-wrap gap-1">
                                    {category.subCategories.map(
                                       (subCategory) => (
                                          <Badge
                                             key={subCategory.id}
                                             variant="secondary"
                                             className="text-xs"
                                          >
                                             {subCategory.name}
                                          </Badge>
                                       )
                                    )}
                                 </div>
                              </div>
                           )}
                        </div>
                     ))}
                  </CardContent>
               </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
               {/* Certificate Info */}
               <Card>
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Thông tin chứng chỉ
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                           Người nộp
                        </Label>
                        <p className="font-medium">{certificate.submittedBy}</p>
                     </div>

                     <Separator />

                     <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                           Ngày nộp
                        </Label>
                        <p className="font-medium flex items-center gap-2">
                           <Calendar className="h-4 w-4" />
                           {formatDate(certificate.submittedDate)}
                        </p>
                     </div>

                     <Separator />

                     <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                           Trạng thái
                        </Label>
                        <div className="flex items-center gap-2 mt-1">
                           {getStatusIcon(certificate.status)}
                           <span className="font-medium">
                              {getStatusText(certificate.status)}
                           </span>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               {/* Actions */}
               {[
                  CertificateStatus.NeedEdit,
                  CertificateStatus.Pending,
               ].includes(certificate.status) && (
                  <Card>
                     <CardHeader>
                        <CardTitle>Hành động</CardTitle>
                        <CardDescription>
                           Duyệt hoặc từ chối chứng chỉ này
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

                        <div className="space-y-3">
                           <Label htmlFor="reject-reason">Lý do từ chối</Label>
                           <Textarea
                              id="reject-reason"
                              placeholder="Nhập lý do từ chối chứng chỉ..."
                              value={rejectReason}
                              onChange={(e) => setRejectReason(e.target.value)}
                              rows={3}
                           />
                           <Button
                              variant="destructive"
                              onClick={handleReject}
                              disabled={isProcessing || !rejectReason.trim()}
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
               {/* Reject Reason (if rejected) */}
               {certificate.status === 3 && certificate.rejectReason && (
                  <Alert>
                     <AlertCircle className="h-4 w-4" />
                     <AlertDescription>
                        <strong>Lý do từ chối:</strong>
                        <br />
                        {certificate.rejectReason}
                     </AlertDescription>
                  </Alert>
               )}
            </div>
         </div>
      </>
   );
}
