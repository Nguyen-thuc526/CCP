'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { WithdrawStatus } from '@/utils/enum';
import { Clock, Check, X, RefreshCw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WithdrawItem } from './withdraw-item';
import { Withdraw } from '@/types/withdraw';
import { useWithdrawStore } from '@/hooks/use-withdraw-store';

export default function WithdrawManagement() {
   const {
      withdraws,
      loading,
      updating,
      fetchWithdrawsByStatus,
      updateStatus,
   } = useWithdrawStore();

   const [activeTab, setActiveTab] = useState<string>(
      WithdrawStatus.PendingWithdrawal.toString()
   );
   const [searchTerm, setSearchTerm] = useState<string>("");

   const getTabInfo = (status: WithdrawStatus) => {
      switch (status) {
         case WithdrawStatus.PendingWithdrawal:
            return {
               label: 'Chờ xử lý',
               icon: Clock,
               color: 'text-yellow-600',
               count: withdraws[status].length,
            };
         case WithdrawStatus.Approved:
            return {
               label: 'Đã rút tiền',
               icon: Check,
               color: 'text-green-600',
               count: withdraws[status].length,
            };
         case WithdrawStatus.Rejected:
            return {
               label: 'Đã hủy',
               icon: X,
               color: 'text-red-600',
               count: withdraws[status].length,
            };
      }
   };

   const handleRefresh = () => {
      const currentStatus = Number.parseInt(activeTab) as WithdrawStatus;
      fetchWithdrawsByStatus(currentStatus);
   };

   const renderTabContent = (status: WithdrawStatus) => {
      const isLoading = loading[status];
      const items = withdraws[status];

      if (isLoading) {
         return (
            <div className="space-y-4">
               {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                     <CardHeader>
                        <Skeleton className="h-6 w-32" />
                     </CardHeader>
                     <CardContent>
                        <div className="space-y-2">
                           <Skeleton className="h-4 w-full" />
                           <Skeleton className="h-4 w-3/4" />
                           <Skeleton className="h-4 w-1/2" />
                        </div>
                     </CardContent>
                  </Card>
               ))}
            </div>
         );
      }

      // ✅ Lọc danh sách theo searchTerm (theo mã đơn hàng / id)
      const filteredItems = items.filter((withdraw: Withdraw) =>
         withdraw.id.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (filteredItems.length === 0) {
         return (
            <Card>
               <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="text-muted-foreground text-center">
                     <div className="text-4xl mb-4">📝</div>
                     <h3 className="text-lg font-medium mb-2">
                        Không có yêu cầu rút tiền
                     </h3>
                     <p className="text-sm">
                        {searchTerm
                           ? "Không tìm thấy mã đơn hàng phù hợp."
                           : "Chưa có yêu cầu rút tiền nào trong trạng thái này."}
                     </p>
                  </div>
               </CardContent>
            </Card>
         );
      }

      return (
         <div className="space-y-4">
            {filteredItems.map((withdraw: Withdraw) => (
               <WithdrawItem
                  key={withdraw.id}
                  withdraw={withdraw}
                  onUpdateStatus={updateStatus}
                  isUpdating={updating === withdraw.id}
               />
            ))}
         </div>
      );
   };

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Quản lý rút tiền
               </h1>
               <p className="text-gray-600">
                  Quản lý các yêu cầu rút tiền từ người dùng
               </p>
            </div>
            <Button onClick={handleRefresh} variant="outline" size="sm">
               <RefreshCw className="w-4 h-4 mr-2" />
               Làm mới
            </Button>
         </div>

         {/* ✅ Ô search */}
         <div className="relative w-full md:w-1/3">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
               type="text"
               placeholder="Tìm theo mã đơn hàng..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="pl-8"
            />
         </div>

         <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
         >
            <TabsList className="grid w-full grid-cols-3">
               {Object.values(WithdrawStatus)
                  .filter((status) => typeof status === 'number')
                  .map((status) => {
                     const tabInfo = getTabInfo(status as WithdrawStatus);
                     const Icon = tabInfo.icon;
                     return (
                        <TabsTrigger
                           key={status}
                           value={status.toString()}
                           className="flex items-center gap-2"
                        >
                           <Icon className={`w-4 h-4 ${tabInfo.color}`} />
                           {tabInfo.label}
                           <Badge
                              className={`ml-1 ${
                                 tabInfo.color === 'text-yellow-600'
                                    ? 'bg-yellow-600'
                                    : tabInfo.color === 'text-green-600'
                                    ? 'bg-green-600'
                                    : 'bg-red-600'
                              } text-white`}
                           >
                              {tabInfo.count}
                           </Badge>
                        </TabsTrigger>
                     );
                  })}
            </TabsList>

            {Object.values(WithdrawStatus)
               .filter((status) => typeof status === 'number')
               .map((status) => (
                  <TabsContent
                     key={status}
                     value={status.toString()}
                     className="mt-6"
                  >
                     {renderTabContent(status as WithdrawStatus)}
                  </TabsContent>
               ))}
         </Tabs>
      </div>
   );
}
