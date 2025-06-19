'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GeneralInfoTab } from './GeneralInfoTab';
import { ScheduleTab } from './ScheduleTab';
import { PaymentTab } from './PaymentTab';
import { ExpertiseTab } from './ExpertiseTab';

export function CounselorProfileForm() {
   return (
      <Tabs defaultValue="general">
         <TabsList className="mb-4">
            <TabsTrigger value="general">Thông tin chung</TabsTrigger>
            <TabsTrigger value="expertise">Chuyên môn & Bằng cấp</TabsTrigger>
            <TabsTrigger value="schedule">Lịch rảnh</TabsTrigger>
            <TabsTrigger value="payment">Cài đặt thanh toán</TabsTrigger>
         </TabsList>

         <TabsContent value="general">
            <GeneralInfoTab />
         </TabsContent>

         <TabsContent value="expertise">
            <ExpertiseTab />
         </TabsContent>

         <TabsContent value="schedule">
            <ScheduleTab />
         </TabsContent>

         <TabsContent value="payment">
            <PaymentTab />
         </TabsContent>
      </Tabs>
   );
}
