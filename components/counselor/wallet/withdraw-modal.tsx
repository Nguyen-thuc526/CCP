'use client';

import type React from 'react';

import { useState } from 'react';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import {
   Banknote,
   CreditCard,
   User,
   Building2,
   AlertCircle,
} from 'lucide-react';
import { useErrorLoadingWithUI } from '@/hooks/useErrorLoading';
import { WalletService } from '@/services/walletService';
import type { WithdrawRequest, WithdrawResponse } from '@/types/wallet';
import { useToast, ToastType } from '@/hooks/useToast';
// Vietnamese banks data with logos
const vietnameseBanks = [
   {
      code: 'VCB',
      name: 'Vietcombank',
      fullName: 'Ngân hàng TMCP Ngoại thương Việt Nam',
      logo: '/placeholder.svg?height=32&width=32',
   },
   {
      code: 'TCB',
      name: 'Techcombank',
      fullName: 'Ngân hàng TMCP Kỹ thương Việt Nam',
      logo: '/placeholder.svg?height=32&width=32',
   },
   {
      code: 'BIDV',
      name: 'BIDV',
      fullName: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam',
      logo: '/placeholder.svg?height=32&width=32',
   },
   {
      code: 'VTB',
      name: 'Vietinbank',
      fullName: 'Ngân hàng TMCP Công thương Việt Nam',
      logo: '/placeholder.svg?height=32&width=32',
   },
   {
      code: 'ACB',
      name: 'ACB',
      fullName: 'Ngân hàng TMCP Á Châu',
      logo: '/placeholder.svg?height=32&width=32',
   },
   {
      code: 'MB',
      name: 'MBBank',
      fullName: 'Ngân hàng TMCP Quân đội',
      logo: '/placeholder.svg?height=32&width=32',
   },
   {
      code: 'TPB',
      name: 'TPBank',
      fullName: 'Ngân hàng TMCP Tiên Phong',
      logo: '/placeholder.svg?height=32&width=32',
   },
   {
      code: 'STB',
      name: 'Sacombank',
      fullName: 'Ngân hàng TMCP Sài Gòn Thương Tín',
      logo: '/placeholder.svg?height=32&width=32',
   },
   {
      code: 'EIB',
      name: 'Eximbank',
      fullName: 'Ngân hàng TMCP Xuất Nhập khẩu Việt Nam',
      logo: '/placeholder.svg?height=32&width=32',
   },
   {
      code: 'SHB',
      name: 'SHB',
      fullName: 'Ngân hàng TMCP Sài Gòn - Hà Nội',
      logo: '/placeholder.svg?height=32&width=32',
   },
];

interface WithdrawModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSuccess: () => void;
}

export function WithdrawModal({
   isOpen,
   onClose,
   onSuccess,
}: WithdrawModalProps) {
   const [formData, setFormData] = useState<WithdrawRequest>({
      total: 0,
      stk: '',
      bankName: '',
      accountName: '',
   });

   const [selectedBank, setSelectedBank] = useState<string>('');
   const [errors, setErrors] = useState<Record<string, string>>({});
   const { showToast } = useToast();
   const { loading, error, startLoading, stopLoading, setErrorMessage } =
      useErrorLoadingWithUI();

   const formatCurrency = (value: number) => {
      return new Intl.NumberFormat('vi-VN', {
         style: 'currency',
         currency: 'VND',
      }).format(value);
   };

   const validateForm = () => {
      const newErrors: Record<string, string> = {};

      if (!formData.total || formData.total <= 0) {
         newErrors.total = 'Vui lòng nhập số tiền hợp lệ';
      } else if (formData.total < 50000) {
         newErrors.total = 'Số tiền tối thiểu là 50,000 VND';
      } else if (formData.total > 500000000) {
         newErrors.total = 'Số tiền tối đa là 500,000,000 VND';
      }

      if (!formData.stk.trim()) {
         newErrors.stk = 'Vui lòng nhập số tài khoản';
      } else if (!/^\d{6,19}$/.test(formData.stk.trim())) {
         newErrors.stk = 'Số tài khoản phải từ 6-19 chữ số';
      }

      if (!selectedBank) {
         newErrors.bankName = 'Vui lòng chọn ngân hàng';
      }

      if (!formData.accountName.trim()) {
         newErrors.accountName = 'Vui lòng nhập tên chủ tài khoản';
      } else if (formData.accountName.trim().length < 2) {
         newErrors.accountName = 'Tên chủ tài khoản phải có ít nhất 2 ký tự';
      } else if (formData.accountName.trim().length > 50) {
         newErrors.accountName = 'Tên chủ tài khoản không được quá 50 ký tự';
      } else if (
         !/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ\s]+$/.test(
            formData.accountName.trim()
         )
      ) {
         newErrors.accountName =
            'Tên chủ tài khoản chỉ được chứa chữ cái và khoảng trắng';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      if (name === 'total') {
         const numericValue =
            Number.parseFloat(value.replace(/[^\d]/g, '')) || 0;
         setFormData((prev) => ({
            ...prev,
            [name]: numericValue,
         }));
      } else if (name === 'stk') {
         // Only allow numeric input for account number
         const numericValue = value.replace(/[^\d]/g, '');
         setFormData((prev) => ({
            ...prev,
            [name]: numericValue,
         }));
      } else if (name === 'accountName') {
         // Convert to uppercase for Vietnamese names
         const formattedValue = value.toUpperCase();
         setFormData((prev) => ({
            ...prev,
            [name]: formattedValue,
         }));
      } else {
         setFormData((prev) => ({
            ...prev,
            [name]: value,
         }));
      }

      // Clear error when user starts typing
      if (errors[name]) {
         setErrors((prev) => ({ ...prev, [name]: '' }));
      }
   };

   const handleBankSelect = (bankCode: string) => {
      const bank = vietnameseBanks.find((b) => b.code === bankCode);
      setSelectedBank(bankCode);
      setFormData((prev) => ({
         ...prev,
         bankName: bank?.name || '',
      }));

      if (errors.bankName) {
         setErrors((prev) => ({ ...prev, bankName: '' }));
      }
   };

   const handleSubmit = async () => {
      if (!validateForm()) return;

      try {
         startLoading();
         const response: WithdrawResponse =
            await WalletService.withdraw(formData);
         if (response.success) {
            onSuccess();
            onClose();
            // Reset form
            setFormData({ total: 0, stk: '', bankName: '', accountName: '' });
            setSelectedBank('');
         } else {
            setErrorMessage(
               response.error ||
                  'Không thể thực hiện rút tiền. Vui lòng thử lại.'
            );
         }
      } catch (error: any) {
         showToast(error.message || 'Đặt lịch rảnh thất bại.', ToastType.Error);
      } finally {
         stopLoading();
      }
   };

   const selectedBankInfo = vietnameseBanks.find(
      (bank) => bank.code === selectedBank
   );

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader className="space-y-3">
               <DialogTitle className="flex items-center gap-2 text-xl">
                  <Banknote className="h-5 w-5 text-green-600" />
                  Yêu cầu rút tiền
               </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
               {/* Amount Input */}
               <Card>
                  <CardContent className="pt-6">
                     <div className="space-y-2">
                        <Label
                           htmlFor="total"
                           className="flex items-center gap-2 text-sm font-medium"
                        >
                           <CreditCard className="h-4 w-4" />
                           Số tiền rút
                        </Label>
                        <div className="relative">
                           <Input
                              id="total"
                              name="total"
                              type="text"
                              value={formData.total.toLocaleString('vi-VN')}
                              onChange={handleInputChange}
                              placeholder="0"
                              disabled={loading}
                              className={`text-lg font-semibold pr-12 ${errors.total ? 'border-red-500' : ''}`}
                           />
                           <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                              VND
                           </span>
                        </div>
                        {formData.total > 0 && (
                           <p className="text-sm text-muted-foreground">
                              {formatCurrency(formData.total)}
                           </p>
                        )}
                        {errors.total && (
                           <p className="text-sm text-red-500 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.total}
                           </p>
                        )}
                     </div>
                  </CardContent>
               </Card>

               {/* Bank Selection */}
               <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                     <Building2 className="h-4 w-4" />
                     Ngân hàng
                  </Label>
                  <Select
                     value={selectedBank}
                     onValueChange={handleBankSelect}
                     disabled={loading}
                  >
                     <SelectTrigger
                        className={`h-12 ${errors.bankName ? 'border-red-500' : ''}`}
                     >
                        <SelectValue placeholder="Chọn ngân hàng">
                           {selectedBankInfo && (
                              <div className="flex items-center gap-3">
                                 <img
                                    src={
                                       selectedBankInfo.logo ||
                                       '/placeholder.svg'
                                    }
                                    alt={selectedBankInfo.name}
                                    className="h-6 w-6 rounded"
                                 />
                                 <div className="text-left">
                                    <div className="font-medium">
                                       {selectedBankInfo.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                       {selectedBankInfo.fullName}
                                    </div>
                                 </div>
                              </div>
                           )}
                        </SelectValue>
                     </SelectTrigger>
                     <SelectContent>
                        {vietnameseBanks.map((bank) => (
                           <SelectItem
                              key={bank.code}
                              value={bank.code}
                              className="h-16"
                           >
                              <div className="flex items-center gap-3">
                                 <img
                                    src={bank.logo || '/placeholder.svg'}
                                    alt={bank.name}
                                    className="h-8 w-8 rounded"
                                 />
                                 <div>
                                    <div className="font-medium">
                                       {bank.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                       {bank.fullName}
                                    </div>
                                 </div>
                              </div>
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
                  {errors.bankName && (
                     <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.bankName}
                     </p>
                  )}
               </div>

               {/* Account Number */}
               <div className="space-y-2">
                  <Label htmlFor="stk" className="text-sm font-medium">
                     Số tài khoản
                  </Label>
                  <Input
                     id="stk"
                     name="stk"
                     value={formData.stk}
                     onChange={handleInputChange}
                     placeholder="Nhập số tài khoản ngân hàng"
                     disabled={loading}
                     className={`font-mono ${errors.stk ? 'border-red-500' : ''}`}
                  />
                  {errors.stk && (
                     <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.stk}
                     </p>
                  )}
               </div>

               {/* Account Name */}
               <div className="space-y-2">
                  <Label
                     htmlFor="accountName"
                     className="flex items-center gap-2 text-sm font-medium"
                  >
                     <User className="h-4 w-4" />
                     Tên chủ tài khoản
                  </Label>
                  <Input
                     id="accountName"
                     name="accountName"
                     value={formData.accountName}
                     onChange={handleInputChange}
                     placeholder="Nhập tên chủ tài khoản"
                     disabled={loading}
                     className={`${errors.accountName ? 'border-red-500' : ''}`}
                  />
                  {errors.accountName && (
                     <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.accountName}
                     </p>
                  )}
               </div>

               {/* Summary Card */}
               {formData.total > 0 && selectedBankInfo && (
                  <Card className="bg-muted/50">
                     <CardContent className="pt-4">
                        <h4 className="font-medium mb-2">Thông tin rút tiền</h4>
                        <div className="space-y-1 text-sm">
                           <div className="flex justify-between">
                              <span>Số tiền:</span>
                              <span className="font-semibold">
                                 {formatCurrency(formData.total)}
                              </span>
                           </div>
                           <div className="flex justify-between">
                              <span>Ngân hàng:</span>
                              <span>{selectedBankInfo.name}</span>
                           </div>
                           <div className="flex justify-between">
                              <span>Số tài khoản:</span>
                              <span className="font-mono">
                                 {formData.stk || '---'}
                              </span>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               )}

               {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                     <p className="text-red-600 text-sm flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        {error}
                     </p>
                  </div>
               )}
            </div>

            <DialogFooter className="gap-2">
               <Button variant="outline" onClick={onClose} disabled={loading}>
                  Hủy bỏ
               </Button>
               <Button
                  onClick={handleSubmit}
                  disabled={loading || !formData.total || !selectedBank}
                  className="bg-green-600 hover:bg-green-700"
               >
                  {loading ? 'Đang xử lý...' : 'Xác nhận rút tiền'}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
