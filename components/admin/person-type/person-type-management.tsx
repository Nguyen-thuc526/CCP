'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
   Card,
   CardDescription,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSurveys } from '@/hooks/use-survey';
import { PersonalityTabContent } from './person-type-content';
import { useErrorLoadingWithUI } from '@/hooks/useErrorLoading';

export function PersonalityManagementContainer() {
   const { surveys, loading: surveysLoading, refetch: refetchSurveys, error } =
      useSurveys();

   const [activeTab, setActiveTab] = useState<string>('');
   const {
      startLoading,
      stopLoading,
      setErrorMessage,
      renderStatus,
   } = useErrorLoadingWithUI();

   // Sync external hook state into our UI hook
   useEffect(() => {
      if (surveysLoading) {
         startLoading();
      } else {
         stopLoading();
      }
   }, [surveysLoading, startLoading, stopLoading]);

   useEffect(() => {
      if (error) {
         setErrorMessage(error);
      }
   }, [error, setErrorMessage]);

   // Handle setting first active tab
   useEffect(() => {
      if (surveys && surveys.length > 0 && !activeTab) {
         setActiveTab(surveys[0].id);
      }
   }, [surveys, activeTab]);

   const handleRetry = () => {
      refetchSurveys();
   };

   // Render loading / error states from the hook
   const statusUI = renderStatus({
      onRetry: handleRetry,
      retryText: 'Thử lại',
   });

   if (statusUI) {
      return <div className="p-6">{statusUI}</div>;
   }

   if (!surveys || surveys.length === 0) {
      return (
         <div className="container mx-auto p-6">
            <Card>
               <CardHeader className="text-center py-12">
                  <CardTitle>Không có khảo sát nào</CardTitle>
                  <CardDescription>
                     Hiện tại chưa có khảo sát nào được kích hoạt trong hệ thống.
                  </CardDescription>
                  <div className="mt-6">
                     <Button onClick={handleRetry}>Thử lại</Button>
                  </div>
               </CardHeader>
            </Card>
         </div>
      );
   }

   return (
      <div className="space-y-6">
         {/* Header */}
         <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
               Quản Lý Tính Cách
            </h1>
            <p className="text-gray-600">
               Quản lý các loại tính cách cho từng bài đánh giá riêng biệt
            </p>
         </div>

         {/* Tabs */}
         <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
         >
            <TabsList
               className={`grid w-full grid-cols-${Math.min(
                  surveys.length,
                  4
               )}`}
            >
               {surveys.map((survey) => (
                  <TabsTrigger
                     key={survey.id}
                     value={survey.id}
                     className="flex flex-col gap-1 relative"
                  >
                     <span className="font-medium">{survey.name}</span>
                  </TabsTrigger>
               ))}
            </TabsList>

            {surveys.map((survey) => (
               <TabsContent
                  key={survey.id}
                  value={survey.id}
                  className="space-y-6"
               >
                  <Card>
                     <CardHeader>
                        <div className="flex items-start gap-4">
                           {survey.image && (
                              <img
                                 src={survey.image || '/placeholder.svg'}
                                 alt={survey.name}
                                 className="w-16 h-16 rounded-lg object-cover"
                                 onError={(e) => {
                                    e.currentTarget.src =
                                       '/placeholder.svg?height=64&width=64';
                                 }}
                              />
                           )}
                           <div className="flex-1">
                              <CardTitle className="flex items-center gap-2">
                                 {survey.name}
                                 <Badge
                                    variant={
                                       survey.status === 1
                                          ? 'default'
                                          : 'secondary'
                                    }
                                 >
                                    {survey.status === 1
                                       ? 'Hoạt động'
                                       : 'Tạm dừng'}
                                 </Badge>
                              </CardTitle>
                              <CardDescription className="mt-2">
                                 {survey.description}
                              </CardDescription>
                           </div>
                        </div>
                     </CardHeader>
                  </Card>

                  <PersonalityTabContent
                     surveyId={survey.id}
                     surveyName={survey.name}
                     isActive={activeTab === survey.id}
                  />
               </TabsContent>
            ))}
         </Tabs>
      </div>
   );
}
