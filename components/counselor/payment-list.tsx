import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit } from 'lucide-react';

export function PaymentList() {
   const paymentPolicies = [
      {
         id: 1,
         name: 'Buổi tư vấn tiêu chuẩn',
         rate: '1.500.000₫',
         duration: '60 phút',
         cancellation: '24 giờ',
         cancellationFee: '50%',
         status: 'Hoạt động',
      },
      {
         id: 2,
         name: 'Buổi tư vấn kéo dài',
         rate: '2.250.000₫',
         duration: '90 phút',
         cancellation: '24 giờ',
         cancellationFee: '50%',
         status: 'Hoạt động',
      },
      {
         id: 3,
         name: 'Tư vấn ban đầu',
         rate: '1.000.000₫',
         duration: '45 phút',
         cancellation: '24 giờ',
         cancellationFee: '50%',
         status: 'Hoạt động',
      },
      {
         id: 4,
         name: 'Buổi tư vấn khẩn cấp',
         rate: '2.000.000₫',
         duration: '60 phút',
         cancellation: '12 giờ',
         cancellationFee: '75%',
         status: 'Hoạt động',
      },
      {
         id: 5,
         name: 'Buổi tư vấn nhóm',
         rate: '3.000.000₫',
         duration: '120 phút',
         cancellation: '48 giờ',
         cancellationFee: '50%',
         status: 'Không hoạt động',
      },
   ];

   return (
      <Card>
         <CardContent className="p-0">
            <div className="relative w-full overflow-auto">
               <table className="w-full caption-bottom text-sm">
                  <thead className="border-b">
                     <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium">
                           Tên chính sách
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                           Phí
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                           Thời lượng
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                           Thông báo hủy
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                           Phí hủy
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                           Trạng thái
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                           Thao tác
                        </th>
                     </tr>
                  </thead>
                  <tbody>
                     {paymentPolicies.map((policy) => (
                        <tr
                           key={policy.id}
                           className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                           <td className="p-4 align-middle font-medium">
                              {policy.name}
                           </td>
                           <td className="p-4 align-middle">{policy.rate}</td>
                           <td className="p-4 align-middle">
                              {policy.duration}
                           </td>
                           <td className="p-4 align-middle">
                              {policy.cancellation}
                           </td>
                           <td className="p-4 align-middle">
                              {policy.cancellationFee}
                           </td>
                           <td className="p-4 align-middle">
                              <Badge
                                 variant={
                                    policy.status === 'Hoạt động'
                                       ? 'default'
                                       : 'secondary'
                                 }
                              >
                                 {policy.status}
                              </Badge>
                           </td>
                           <td className="p-4 align-middle">
                              <Button size="sm" variant="outline">
                                 <Edit className="mr-2 h-4 w-4" />
                                 Sửa
                              </Button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </CardContent>
      </Card>
   );
}
