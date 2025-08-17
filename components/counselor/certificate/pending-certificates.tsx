'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, Eye, Trash2, AlertCircle, ChevronRight } from 'lucide-react';
import CertificateDetailModal from './certificate-detail-modal';
import type { Certification } from '@/types/certification';

interface PendingCertificatesProps {
   certifications: Certification[];
   onUpdate: () => void;
}

export default function PendingCertificates({
   certifications,
   onUpdate,
}: PendingCertificatesProps) {
   const [selectedCertificate, setSelectedCertificate] =
      useState<Certification | null>(null);
   const [showDetailModal, setShowDetailModal] = useState(false);

   const handleViewDetail = (cert: Certification) => {
      setSelectedCertificate(cert);
      setShowDetailModal(true);
   };

   const handleUpdateCertificate = (updatedCert: Certification) => {
      console.log('Updated certificate:', updatedCert);
      onUpdate(); // Trigger refetch
   };

   const renderCategories = (categories: any[]) => {
      if (!categories || categories.length === 0) {
         return (
            <p className="text-sm text-muted-foreground">Không có danh mục</p>
         );
      }

      return (
         <div className="space-y-2">
            {categories.map((category, index) => (
               <div key={index} className="space-y-1">
                  <div className="flex items-center gap-1">
                     <Badge
                        variant="default"
                        className="text-xs font-medium bg-primary/10 text-primary border-primary/20"
                     >
                        {category.categoryName}
                     </Badge>
                  </div>
                  {category.subCategories &&
                     category.subCategories.length > 0 && (
                        <div className="flex flex-wrap gap-1 ml-4">
                           {category.subCategories.map(
                              (sub: any, subIndex: number) => (
                                 <div
                                    key={subIndex}
                                    className="flex items-center gap-1"
                                 >
                                    <ChevronRight className="w-3 h-3 text-muted-foreground" />
                                    <Badge
                                       variant="secondary"
                                       className="text-xs bg-muted/50 text-muted-foreground"
                                    >
                                       {sub.name}
                                    </Badge>
                                 </div>
                              )
                           )}
                        </div>
                     )}
               </div>
            ))}
         </div>
      );
   };

   return (
      <div className="space-y-4">
         <div className="flex items-center justify-between">
            <div>
               <h2 className="text-xl font-semibold">
                  Chứng chỉ đang chờ duyệt
               </h2>
               <p className="text-sm text-muted-foreground">
                  Danh sách các chứng chỉ đã nộp và đang chờ xét duyệt
               </p>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
               <Clock className="w-3 h-3" />
               {certifications.length} chứng chỉ
            </Badge>
         </div>

         {certifications.length === 0 ? (
            <Card>
               <CardContent className="pt-6">
                  <div className="text-center py-8">
                     <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                     <h3 className="text-lg font-medium mb-2">
                        Không có chứng chỉ nào đang chờ duyệt
                     </h3>
                     <p className="text-sm text-muted-foreground">
                        Các chứng chỉ đã nộp sẽ hiển thị tại đây trong quá trình
                        xét duyệt
                     </p>
                  </div>
               </CardContent>
            </Card>
         ) : (
            // <CHANGE> Changed from vertical list to grid layout like approved certificates
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
               {certifications.map((cert) => (
                  <Card key={cert.id} className="overflow-hidden">
                     <div className="aspect-video relative">
                        <img
                           src={cert.image || '/placeholder.svg'}
                           alt={cert.name}
                           className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                           <Badge className="bg-yellow-500 hover:bg-yellow-600">
                              <Clock className="w-3 h-3 mr-1" />
                              Chờ duyệt
                           </Badge>
                        </div>
                     </div>

                     <CardHeader className="pb-3">
                        <CardTitle className="text-lg leading-tight">
                           {cert.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                           <Calendar className="w-4 h-4" />
                           Nộp ngày{' '}
                           {cert.time
                              ? new Date(cert.time).toLocaleDateString('vi-VN')
                              : 'Chưa có thời gian'}
                        </div>
                     </CardHeader>

                     <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                           {cert.description}
                        </p>
                        <div className="border-t pt-3">
                           <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                              Danh mục
                           </h4>
                           {renderCategories(cert.categories)}
                        </div>
                        <div className="text-sm flex items-center gap-2 text-yellow-600 bg-yellow-50 p-2 rounded">
                           <AlertCircle className="w-4 h-4" />
                           <span>Đang chờ xử lý</span>
                        </div>
                        <div className="flex gap-2 pt-2">
                           <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => handleViewDetail(cert)}
                           >
                              <Eye className="w-3 h-3 mr-1" />
                              Xem chi tiết
                           </Button>
                        </div>
                     </CardContent>
                  </Card>
               ))}
            </div>
         )}

         <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4">
               <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                     <AlertCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="space-y-1">
                     <h4 className="text-sm font-medium text-blue-900">
                        Thông tin về quá trình duyệt
                     </h4>
                     <p className="text-sm text-blue-700">
                        • Thời gian xét duyệt thông thường: 24-48 giờ làm việc
                        <br />• Bạn sẽ nhận được thông báo qua email khi có kết
                        quả
                        <br />• Chứng chỉ được duyệt sẽ tự động chuyển sang tab
                        "Chứng chỉ đã duyệt"
                     </p>
                  </div>
               </div>
            </CardContent>
         </Card>

         <CertificateDetailModal
            open={showDetailModal}
            onClose={() => setShowDetailModal(false)}
            certificate={selectedCertificate}
            onUpdate={handleUpdateCertificate}
         />
      </div>
   );
}
