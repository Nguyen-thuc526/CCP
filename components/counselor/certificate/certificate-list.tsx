'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Award, Calendar, Download, Eye, ChevronRight } from 'lucide-react';
import CertificateDetailModal from './certificate-detail-modal';
import type {
   CertificateListProps,
   Certification,
} from '@/types/certification';

export default function CertificateList({
   certifications,
}: CertificateListProps) {
   const [selectedCertificate, setSelectedCertificate] =
      useState<Certification | null>(null);
   const [showDetailModal, setShowDetailModal] = useState(false);

   const handleViewDetail = (cert: Certification) => {
      setSelectedCertificate(cert);
      setShowDetailModal(true);
   };

   const handleUpdateCertificate = (updatedCert: Certification) => {
      console.log('Updated certificate:', updatedCert);
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
                  Chứng chỉ đã được duyệt
               </h2>
               <p className="text-sm text-muted-foreground">
                  Danh sách các chứng chỉ đã được xác minh và phê duyệt
               </p>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
               <Award className="w-3 h-3" />
               {certifications.length} chứng chỉ
            </Badge>
         </div>

         {certifications.length === 0 ? (
            <Card>
               <CardContent className="pt-6">
                  <div className="text-center py-8">
                     <Award className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                     <h3 className="text-lg font-medium mb-2">
                        Chưa có chứng chỉ nào được duyệt
                     </h3>
                     <p className="text-sm text-muted-foreground">
                        Các chứng chỉ đã được phê duyệt sẽ hiển thị tại đây
                     </p>
                  </div>
               </CardContent>
            </Card>
         ) : (
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
                           <Badge className="bg-green-500 hover:bg-green-600">
                              <Award className="w-3 h-3 mr-1" />
                              Đã duyệt
                           </Badge>
                        </div>
                     </div>

                     <CardHeader className="pb-3">
                        <CardTitle className="text-lg leading-tight">
                           {cert.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                           <Calendar className="w-4 h-4" />
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
                           <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                           >
                              <Download className="w-3 h-3 mr-1" />
                              Tải về
                           </Button>
                        </div>
                     </CardContent>
                  </Card>
               ))}
            </div>
         )}
         <CertificateDetailModal
            open={showDetailModal}
            onClose={() => setShowDetailModal(false)}
            certificate={selectedCertificate}
            onUpdate={handleUpdateCertificate}
         />
      </div>
   );
}
