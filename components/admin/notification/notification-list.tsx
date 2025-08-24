'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Calendar, User } from 'lucide-react';

import { NotificatiService } from '@/services/notificatiServices';
import type { NotificateItem } from '@/types/notificate';

export function NotificationList() {
   const [items, setItems] = useState<NotificateItem[]>([]);
   const [loading, setLoading] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      let ignore = false;

      async function load() {
         try {
            setLoading(true);
            const res = await NotificatiService.getMyNotifications();
            if (!ignore) {
               if (res.success) {
                  setItems(Array.isArray(res.data) ? res.data : []);
                  setError(null);
               } else {
                  setError(res.error ?? 'Không thể tải thông báo');
               }
            }
         } catch (e: any) {
            if (!ignore) setError(e?.message ?? 'Đã xảy ra lỗi');
         } finally {
            if (!ignore) setLoading(false);
         }
      }

      load();
      return () => {
         ignore = true;
      };
   }, []);

   return (
      <div className="space-y-4">
         <Card className="shadow-sm">
            <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/30">
                        <Bell className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                     </div>
                     <CardTitle className="text-xl">
                        Danh sách thông báo
                     </CardTitle>
                  </div>
                  <Badge variant="secondary" className="px-3 py-1">
                     {items.length} thông báo
                  </Badge>
               </div>
            </CardHeader>

            <CardContent className="p-0">
               {loading ? (
                  <div className="flex items-center justify-center p-8">
                     <div className="text-center">
                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-rose-200 border-t-rose-600"></div>
                        <p className="mt-2 text-sm text-muted-foreground">
                           Đang tải thông báo...
                        </p>
                     </div>
                  </div>
               ) : error ? (
                  <div className="flex items-center justify-center p-8">
                     <div className="text-center">
                        <div className="mx-auto h-12 w-12 rounded-full bg-red-100 p-3 dark:bg-red-900/30">
                           <Bell className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                           {error}
                        </p>
                     </div>
                  </div>
               ) : items.length === 0 ? (
                  <div className="flex items-center justify-center p-12">
                     <div className="text-center">
                        <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
                           <Bell className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                           Chưa có thông báo
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                           Các thông báo mới sẽ xuất hiện tại đây
                        </p>
                     </div>
                  </div>
               ) : (
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                     {items.map((n, index) => {
                        const created = n.createDate
                           ? new Date(n.createDate).toLocaleString('vi-VN')
                           : '';

                        return (
                           <div
                              key={n.id}
                              className="group p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                           >
                              <div className="flex items-start gap-4">
                                 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/30">
                                    <User className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                                 </div>

                                 <div className="flex-1 space-y-2">
                                    <div className="flex items-start justify-between">
                                       <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                          Thông báo #{index + 1}
                                       </h4>
                                       <Badge
                                          variant="outline"
                                          className="ml-2 shrink-0"
                                       >
                                          Mới
                                       </Badge>
                                    </div>

                                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                       {n.description}
                                    </p>

                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                       <Calendar className="h-3 w-3" />
                                       <span>{created}</span>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        );
                     })}
                  </div>
               )}
            </CardContent>
         </Card>
      </div>
   );
}
