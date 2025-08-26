'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GeneralInfoTab } from './GeneralInfoTab';
import { ScheduleTab } from './ScheduleTab';
import { PasswordTab } from './PasswordTab';


export function CounselorProfileForm() {
   return (
      <Tabs defaultValue="general">
         <TabsList className="mb-4">
            <TabsTrigger value="general">Thông tin chung</TabsTrigger>
            <TabsTrigger value="password">Đổi mật khẩu</TabsTrigger>
            <TabsTrigger value="schedule">Lịch rảnh</TabsTrigger>
         </TabsList>

         <TabsContent value="general">
            <GeneralInfoTab />
         </TabsContent>

         <TabsContent value="schedule">
            <ScheduleTab />
         </TabsContent>

         <TabsContent value="password">
            <PasswordTab />
         </TabsContent>
      </Tabs>
   );
}
