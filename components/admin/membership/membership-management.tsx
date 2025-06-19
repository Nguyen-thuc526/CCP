'use client';

import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Plus } from 'lucide-react';

import { Membership } from '@/types/membership';
import { createMembership, getAllMembership } from '@/services/membership';
import { ToastType, useToast } from '@/hooks/useToast';
import { membershipSchema } from '@/lib/schemas/membershipSchema';
import EditMembershipModal from './edit-membership-modal';
import { useErrorLoadingWithUI } from '@/hooks/useErrorLoading';

export function MembershipManagement() {
   const [showCreateDialog, setShowCreateDialog] = useState(false);
   const [membershipTiers, setMembershipTiers] = useState<Membership[]>([]);
   const [editing, setEditing] = useState<Membership | null>(null);
   const [modalOpen, setModalOpen] = useState(false);

   const { showToast } = useToast();
   const {
      loading,
      error,
      startLoading,
      stopLoading,
      setErrorMessage,
      renderStatus,
   } = useErrorLoadingWithUI();

   const fetchMemberships = async () => {
      startLoading();
      try {
         const data = await getAllMembership();
         setMembershipTiers(data);
      } catch (err: any) {
         setErrorMessage(err.message || 'Lỗi khi tải dữ liệu gói membership.');
      } finally {
         stopLoading();
      }
   };

   useEffect(() => {
      fetchMemberships();
   }, []);

   const formik = useFormik({
      initialValues: {
         memberShipName: '',
         rank: 0,
         discountCourse: 0,
         discountBooking: 0,
         price: 0,
         expiryDate: 0,
      },
      validationSchema: membershipSchema,
      onSubmit: async (values, { resetForm }) => {
         try {
            await createMembership(values);
            showToast('Tạo gói membership thành công!', ToastType.Success);
            setShowCreateDialog(false);
            resetForm();
            fetchMemberships();
         } catch {
            showToast('Tạo gói membership thất bại!', ToastType.Error);
         }
      },
   });

   const formatCurrency = (amount: number) =>
      new Intl.NumberFormat('vi-VN', {
         style: 'currency',
         currency: 'VND',
      }).format(amount);

   const renderInput = (
      id: keyof typeof formik.values,
      label: string,
      type = 'text',
      placeholder = ''
   ) => (
      <div className="space-y-2">
         <Label htmlFor={id}>{label}</Label>
         <Input
            id={id}
            name={id}
            type={type}
            placeholder={placeholder}
            value={formik.values[id]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
         />
         {formik.touched[id] && formik.errors[id] && (
            <p className="text-red-500 text-sm">{formik.errors[id]}</p>
         )}
      </div>
   );

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-bold">Các gói Membership</h1>
               <p className="text-muted-foreground">
                  Quản lý các gói membership theo cấp bậc
               </p>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
               <DialogTrigger asChild>
                  <Button>
                     <Plus className="mr-2 h-4 w-4" />
                     Tạo gói mới
                  </Button>
               </DialogTrigger>
               <DialogContent className="max-w-2xl">
                  <DialogHeader>
                     <DialogTitle>Tạo gói Membership mới</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={formik.handleSubmit} className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        {renderInput(
                           'memberShipName',
                           'Tên gói',
                           'text',
                           'VD: Premium Plus'
                        )}
                        {renderInput('price', 'Giá (VNĐ)', 'number', '999000')}
                        {renderInput('rank', 'Cấp bậc (Rank)', 'number', '1')}
                        {renderInput(
                           'expiryDate',
                           'Thời hạn (ngày)',
                           'number',
                           '30'
                        )}
                        {renderInput(
                           'discountCourse',
                           'Giảm giá khóa học (%)',
                           'number',
                           '10'
                        )}
                        {renderInput(
                           'discountBooking',
                           'Giảm giá đặt lịch (%)',
                           'number',
                           '5'
                        )}
                     </div>
                     <div className="flex justify-end gap-2 pt-2">
                        <Button
                           variant="outline"
                           type="button"
                           onClick={() => setShowCreateDialog(false)}
                        >
                           Hủy
                        </Button>
                        <Button type="submit">Tạo gói</Button>
                     </div>
                  </form>
               </DialogContent>
            </Dialog>
         </div>

         {renderStatus({
            onRetry: fetchMemberships,
         })}

         {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {membershipTiers
                  .sort((a, b) => a.rank - b.rank)
                  .map((membership) => (
                     <Card
                        key={membership.id}
                        className="relative overflow-hidden border"
                     >
                        <CardHeader className="pb-3">
                           <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">
                                 {membership.memberShipName}
                              </CardTitle>
                              <Badge
                                 variant={
                                    membership.status === 1
                                       ? 'default'
                                       : 'outline'
                                 }
                              >
                                 {membership.status === 1
                                    ? 'Đang hoạt động'
                                    : 'Ngưng hoạt động'}
                              </Badge>
                           </div>
                           <div className="text-2xl font-bold mt-2">
                              {formatCurrency(membership.price)}
                              <span className="text-sm font-normal text-muted-foreground">
                                 {' '}
                                 / {membership.expiryDate} ngày
                              </span>
                           </div>
                           <p className="text-sm text-muted-foreground">
                              Gói hạng {membership.rank}, giảm{' '}
                              {membership.discountCourse}% khóa học,{' '}
                              {membership.discountBooking}% booking
                           </p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <div className="space-y-2">
                              <div className="text-sm font-medium">
                                 Quyền lợi:
                              </div>
                              <ul className="space-y-1 text-sm">
                                 <li>
                                    ✔ Giảm {membership.discountCourse}% giá
                                    khóa học
                                 </li>
                                 <li>
                                    ✔ Giảm {membership.discountBooking}% khi
                                    đặt lịch
                                 </li>
                                 <li>
                                    ✔ Hiệu lực trong {membership.expiryDate}{' '}
                                    ngày
                                 </li>
                              </ul>
                           </div>
                           <div className="flex gap-2 pt-2 border-t">
                              <Button
                                 variant="outline"
                                 size="sm"
                                 className="flex-1"
                                 onClick={() => {
                                    setEditing(membership);
                                    setModalOpen(true);
                                 }}
                              >
                                 <Edit className="mr-2 h-3 w-3" />
                                 Sửa
                              </Button>
                           </div>
                        </CardContent>
                        <div className="absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-t-[30px] border-t-primary/20">
                           <span className="absolute -top-6 -right-2 text-xs font-bold text-primary">
                              {membership.rank}
                           </span>
                        </div>
                     </Card>
                  ))}
            </div>
         )}

         <Card>
            <CardHeader>
               <CardTitle>Thống kê Membership</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <Stat
                     label="Tổng số gói"
                     value={membershipTiers.length}
                     color="blue"
                  />
                  <Stat
                     label="Tổng giá trị các gói"
                     value={formatCurrency(
                        membershipTiers.reduce(
                           (sum, tier) => sum + tier.price,
                           0
                        )
                     )}
                     color="green"
                  />
                  <Stat
                     label="Gói cao cấp nhất"
                     value={
                        membershipTiers.length > 0
                           ? membershipTiers.reduce((max, current) =>
                                current.rank > max.rank ? current : max
                             ).memberShipName
                           : '—'
                     }
                     color="purple"
                  />
                  <Stat
                     label="Giảm khóa học cao nhất"
                     value={
                        membershipTiers.length > 0
                           ? `${Math.max(...membershipTiers.map((t) => t.discountCourse))}%`
                           : '—'
                     }
                     color="orange"
                  />
                  <Stat
                     label="Giảm đặt lịch cao nhất"
                     value={
                        membershipTiers.length > 0
                           ? `${Math.max(...membershipTiers.map((t) => t.discountBooking))}%`
                           : '—'
                     }
                     color="pink"
                  />
                  <Stat
                     label="Thời hạn dài nhất"
                     value={
                        membershipTiers.length > 0
                           ? `${Math.max(...membershipTiers.map((t) => t.expiryDate))} ngày`
                           : '—'
                     }
                     color="cyan"
                  />
               </div>
            </CardContent>
         </Card>

         <EditMembershipModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            membership={editing}
            onUpdated={fetchMemberships}
         />
      </div>
   );
}

function Stat({
   label,
   value,
   color,
}: {
   label: string;
   value: string | number;
   color: string;
}) {
   return (
      <div className="text-center">
         <div className={`text-2xl font-bold text-${color}-600`}>{value}</div>
         <div className="text-sm text-muted-foreground">{label}</div>
      </div>
   );
}
