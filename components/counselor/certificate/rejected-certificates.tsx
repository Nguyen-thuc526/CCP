'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
   AlertTriangle,
   Calendar,
   Edit,
   Trash2,
   RefreshCw,
   ChevronRight,
} from 'lucide-react';
import EditRejectedCertificateModal from './edit-rejected-certificate-modal';
import type { CategoryDetail, Certification } from '@/types/certification';

interface RejectedCertificatesProps {
   certifications: Certification[];
   onEditSuccess: () => void;
}

export default function RejectedCertificates({
   certifications,
   onEditSuccess,
}: RejectedCertificatesProps) {
   const [selectedCertificate, setSelectedCertificate] =
      useState<Certification | null>(null);
   const [showEditModal, setShowEditModal] = useState(false);

   const handleEdit = (cert: Certification) => {
      setSelectedCertificate(cert);
      setShowEditModal(true);
   };

   const handleEditSuccess = () => {
      setShowEditModal(false);
      onEditSuccess();
   };

   const renderCategories = (categories: CategoryDetail[]) => {
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
                           {category.subCategories.map((sub, subIndex) => (
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
                           ))}
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
                  Chứng chỉ cần chỉnh sửa
               </h2>
               <p className="text-sm text-muted-foreground">
                  Danh sách các chứng chỉ bị từ chối và cần chỉnh sửa
               </p>
            </div>
            <Badge variant="destructive" className="flex items-center gap-1">
               <AlertTriangle className="w-3 h-3" />
               {certifications.length} chứng chỉ
            </Badge>
         </div>

         {certifications.length === 0 ? (
            <Card>
               <CardContent className="pt-6">
                  <div className="text-center py-8">
                     <AlertTriangle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                     <h3 className="text-lg font-medium mb-2">
                        Không có chứng chỉ nào cần chỉnh sửa
                     </h3>
                     <p className="text-sm text-muted-foreground">
                        Các chứng chỉ bị từ chối sẽ hiển thị tại đây để bạn có
                        thể chỉnh sửa và gửi lại
                     </p>
                  </div>
               </CardContent>
            </Card>
         ) : (
            <div className="space-y-4">
               {certifications.map((cert) => (
                  <Card key={cert.id} className="border-red-200 bg-red-50/30">
                     <div className="flex flex-col md:flex-row">
                        <div className="md:w-48 aspect-video md:aspect-square relative">
                           <img
                              src={cert.image || '/placeholder.svg'}
                              alt={cert.name}
                              className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                           />
                           <div className="absolute top-2 right-2">
                              <Badge variant="destructive">
                                 <AlertTriangle className="w-3 h-3 mr-1" />
                                 Bị từ chối
                              </Badge>
                           </div>
                        </div>

                        <div className="flex-1">
                           <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                 <CardTitle className="text-lg leading-tight">
                                    {cert.name}
                                 </CardTitle>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                 <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    Nộp:{' '}
                                    {new Date(
                                       cert.submittedDate || cert.time || ''
                                    ).toLocaleDateString('vi-VN')}
                                 </div>
                                 <div className="flex items-center gap-1">
                                    <AlertTriangle className="w-4 h-4" />
                                    Từ chối:{' '}
                                    {new Date(
                                       cert.rejectedDate || ''
                                    ).toLocaleDateString('vi-VN')}
                                 </div>
                              </div>
                           </CardHeader>

                           <CardContent className="space-y-4">
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                 {cert.description}
                              </p>
                              <div className="border-t pt-3">
                                 <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                                    Danh mục
                                 </h4>
                                 {renderCategories(cert.categories)}
                              </div>
                              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                 <div className="flex items-start gap-2">
                                    <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                                    <div className="space-y-2">
                                       <h4 className="text-sm font-medium text-red-900">
                                          Lý do từ chối:
                                       </h4>
                                       <p className="text-sm text-red-700">
                                          {cert.rejectReason}
                                       </p>
                                       {cert.rejectionDetails &&
                                          cert.rejectionDetails.length > 0 && (
                                             <div className="mt-2">
                                                <p className="text-xs font-medium text-red-800 mb-1">
                                                   Chi tiết cần chỉnh sửa:
                                                </p>
                                                <ul className="text-xs text-red-700 space-y-1">
                                                   {cert.rejectionDetails.map(
                                                      (
                                                         detail: string,
                                                         index: number
                                                      ) => (
                                                         <li
                                                            key={index}
                                                            className="flex items-start gap-1"
                                                         >
                                                            <span className="text-red-500 mt-1">
                                                               •
                                                            </span>
                                                            <span>
                                                               {detail}
                                                            </span>
                                                         </li>
                                                      )
                                                   )}
                                                </ul>
                                             </div>
                                          )}
                                    </div>
                                 </div>
                              </div>
                              <div className="flex gap-2 pt-2">
                                 <Button
                                    size="sm"
                                    onClick={() => handleEdit(cert)}
                                    className="bg-blue-600 hover:bg-blue-700"
                                 >
                                    <Edit className="w-3 h-3 mr-1" />
                                    Chỉnh sửa & Gửi lại
                                 </Button>
                                 <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700"
                                 >
                                    <Trash2 className="w-3 h-3 mr-1" />
                                    Xóa
                                 </Button>
                              </div>
                           </CardContent>
                        </div>
                     </div>
                  </Card>
               ))}
            </div>
         )}

         <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4">
               <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                     <RefreshCw className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="space-y-1">
                     <h4 className="text-sm font-medium text-blue-900">
                        Hướng dẫn chỉnh sửa
                     </h4>
                     <p className="text-sm text-blue-700">
                        • Đọc kỹ lý do từ chối và các chi tiết cần chỉnh sửa
                        <br />• Cập nhật thông tin theo yêu cầu
                        <br />• Tải lên hình ảnh chất lượng cao và rõ nét
                        <br />• Sau khi chỉnh sửa, chứng chỉ sẽ được gửi lại để
                        xét duyệt
                     </p>
                  </div>
               </div>
            </CardContent>
         </Card>

         <EditRejectedCertificateModal
            open={showEditModal}
            onClose={() => setShowEditModal(false)}
            certificate={selectedCertificate}
            onSuccess={handleEditSuccess}
         />
      </div>
   );
}
