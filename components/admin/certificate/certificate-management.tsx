'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Search, Filter, Eye, Clock, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { CertificateStatus } from '@/utils/enum';
import { Certification } from '@/types/certification';
import { getAllCertifications } from '@/services/certificationService';
import { useRouter } from 'next/navigation';
import { useErrorLoadingWithUI } from '@/hooks/useErrorLoading';

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

export default function CertificatesPage() {
   const [certificates, setCertificates] = useState<Certification[]>([]);
   const [searchTerm, setSearchTerm] = useState('');
   const [selectedCategory, setSelectedCategory] = useState('all');
   const {
      loading,
      error,
      startLoading,
      stopLoading,
      setErrorMessage,
      renderStatus,
   } = useErrorLoadingWithUI();
   const router = useRouter();

   const fetchData = async () => {
      try {
         startLoading();
         const data = await getAllCertifications();
         setCertificates(data);
      } catch (err: any) {
         setErrorMessage(err.message || 'Lỗi khi tải dữ liệu');
      } finally {
         stopLoading();
      }
   };

   useEffect(() => {
      fetchData();
   }, []);

   const allCategories = useMemo(() => {
      const categories = new Set<string>();
      certificates.forEach((cert) => {
         cert.categories.forEach((cat) => categories.add(cat.categoryName));
      });
      return Array.from(categories);
   }, [certificates]);

   const filteredCertificates = useMemo(() => {
      let result = certificates.filter((cert) => {
         const matchesSearch =
            cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert.description.toLowerCase().includes(searchTerm.toLowerCase());

         const matchesCategory =
            selectedCategory === 'all' ||
            cert.categories.some(
               (cat) => cat.categoryName === selectedCategory
            );

         return matchesSearch && matchesCategory;
      });

      // ✅ Sort by time (mới nhất lên đầu)
      return result.sort(
         (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
      );
   }, [certificates, searchTerm, selectedCategory]);

   const statusUI = renderStatus({
      onRetry: fetchData,
   });

   if (statusUI) return <div className="py-10">{statusUI}</div>;

   return (
      <>
         <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
               Quản lý Chứng chỉ
            </h1>
            <p className="text-gray-600">Danh sách các chứng chỉ chờ duyệt</p>
         </div>

         {/* Tìm kiếm & Bộ lọc */}
         <div className="mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
            <div className="relative flex-1">
               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
               <Input
                  placeholder="Tìm kiếm chứng chỉ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
               />
            </div>

            <div className="flex items-center gap-2">
               <Filter className="h-4 w-4 text-muted-foreground" />
               <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
               >
                  <SelectTrigger className="w-[200px]">
                     <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="all">Tất cả danh mục</SelectItem>
                     {allCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                           {category}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>
         </div>

         <div className="mb-6">
            <p className="text-sm text-muted-foreground">
               Hiển thị {filteredCertificates.length} trong tổng số{' '}
               {certificates.length} chứng chỉ
            </p>
         </div>

         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCertificates.map((certificate) => (
               <Card
                  key={certificate.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
               >
                  <div className="aspect-video relative">
                     <Image
                        src={certificate.image || '/placeholder.svg'}
                        alt={certificate.name}
                        fill
                        className="object-cover"
                        crossOrigin="anonymous"
                     />
                  </div>

                  <CardHeader className="pb-3">
                     <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg line-clamp-2">
                           {certificate.name}
                        </CardTitle>
                        <Badge
                           className={`${getStatusColor(certificate.status)} flex items-center gap-1`}
                        >
                           {getStatusIcon(certificate.status)}
                           {getStatusText(certificate.status)}
                        </Badge>
                     </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                     <CardDescription className="line-clamp-3 mb-4">
                        {certificate.description}
                     </CardDescription>

                     <div className="space-y-3">
                        <div>
                           <h4 className="text-sm font-medium mb-2">
                              Danh mục:
                           </h4>
                           <div className="flex flex-wrap gap-1">
                              {certificate.categories.map((category) => (
                                 <Badge
                                    key={category.categoryId}
                                    variant="secondary"
                                    className="text-xs"
                                 >
                                    {category.categoryName}
                                 </Badge>
                              ))}
                           </div>
                        </div>

                        <Separator />

                        <div className="flex justify-between items-center">
                           <Button
                              size="sm"
                              variant="outline"
                              className="flex items-center gap-2"
                              onClick={() =>
                                 router.push(
                                    `/admin/certificate-management/${certificate.id}`
                                 )
                              }
                           >
                              <Eye className="h-4 w-4" />
                              Xem chi tiết
                           </Button>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            ))}
         </div>

         {filteredCertificates.length === 0 && (
            <div className="text-center py-12">
               <div className="text-muted-foreground mb-4">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Không tìm thấy chứng chỉ nào</p>
                  <p className="text-sm">
                     Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                  </p>
               </div>
               <Button
                  variant="outline"
                  onClick={() => {
                     setSearchTerm('');
                     setSelectedCategory('all');
                  }}
               >
                  Xóa bộ lọc
               </Button>
            </div>
         )}
      </>
   );
}
