'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Bell, Home, Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import {
   Breadcrumb,
   BreadcrumbItem,
   BreadcrumbLink,
   BreadcrumbList,
   BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useSelector } from 'react-redux';
import { Role } from '@/utils/enum';
import { RootState } from '@/store/store';
import { Sidebar } from '../sidebar/Sidebar';
import React from 'react';
import { NotificatiService } from '@/services/notificatiServices';

export function DashboardHeader() {
   const { setTheme, theme } = useTheme();
   const router = useRouter();
   const pathname = usePathname();

   const role = useSelector((s: RootState) => s.auth.role);
   const nameFromStore = useSelector((s: RootState) => s.auth.name);

   const userInfo = {
      [Role.Admin]: {
         name: 'Admin',
         avatar: '/placeholder.svg?height=32&width=32',
         initials: 'AD',
         role: 'Quản trị viên',
      },
      [Role.Counselor]: {
         name: nameFromStore || 'Counselor',
         avatar: '/placeholder.svg?height=32&width=32',
         initials: (nameFromStore
            ? nameFromStore
                 .split(' ')
                 .map((w) => w[0])
                 .join('')
            : 'CS'
         )
            .slice(0, 2)
            .toUpperCase(),
         role: 'Chuyên viên tư vấn',
      },
   };
   const currentUser = role ? userInfo[role] : userInfo[Role.Counselor];

   // ---- Notification summary ----
   const [unopenedCount, setUnopenedCount] = useState(0);
   const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
   const mountedRef = useRef(true);

   const fetchSummary = async () => {
      try {
         // noCache=true để chống cache mỗi lần poll
         const res = await NotificatiService.getSummary(true);
         const count = Number(
            res?.data?.unopenedCount ?? res?.unopenedCount ?? 0
         );
         if (mountedRef.current)
            setUnopenedCount(Number.isFinite(count) ? count : 0);
      } catch {
         // im lặng
      }
   };

   useEffect(() => {
      mountedRef.current = true;
      fetchSummary(); // lần đầu

      intervalRef.current = setInterval(() => {
         // có thể bỏ điều kiện visible nếu muốn luôn cập nhật
         if (document.visibilityState === 'visible') fetchSummary();
      }, 2500);

      return () => {
         mountedRef.current = false;
         if (intervalRef.current) clearInterval(intervalRef.current);
         intervalRef.current = null;
      };
   }, []);

   const handleNotificationClick = () => {
      router.push(
         `/${role === Role.Admin ? 'admin' : 'counselor'}/notifications`
      );
   };
   const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

   const pageTranslations: Record<string, string> = {
      dashboard: 'Bảng điều khiển',
      notifications: 'Thông báo',
      profile: 'Hồ sơ cá nhân',
      settings: 'Cài đặt',
      users: 'Người dùng',
      plans: 'Gói tư vấn',
      reports: 'Báo cáo',
      analytics: 'Phân tích',
      appointments: 'Cuộc hẹn',
      payments: 'Thanh toán',
      managecourse: 'Quản lý khóa học',
      surveys: 'Khảo sát',
      categories: 'Danh mục',
      'certificate-management': 'Quản lý chứng chỉ',
      'person-type': 'Quản lý tính cách',
      compare: 'So sánh tính cách',
      counselors: 'Chuyên viên tư vấn',
      booking: 'Quản lý Booking',
      withdraw: 'Rút tiền',
      blog: 'Quản lý Blog',
   };

   const segments = pathname.split('/').filter(Boolean);
   const breadcrumbItems = segments.slice(1).map((segment, index) => {
      const isDetail =
         /^\d+$/.test(segment) ||
         /^[0-9a-fA-F-]{10,}$/.test(segment) ||
         /^[A-Za-z]+_\w+$/.test(segment);
      let label = pageTranslations[segment] || segment;
      if (isDetail) label = 'Chi tiết';
      return {
         label,
         href: '/' + segments.slice(0, index + 2).join('/'),
         isDetail,
      };
   });
   const filteredBreadcrumbs = breadcrumbItems.filter(
      (item, idx, arr) => !(item.isDetail && idx > 0 && arr[idx - 1].isDetail)
   );

   return (
      <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-4 border-b bg-white px-4 dark:bg-gray-950 lg:h-[60px] lg:px-6">
         <div className="flex items-center">
            <Sheet>
               <SheetTrigger asChild>
                  <Button
                     variant="outline"
                     size="icon"
                     className="mr-2 lg:hidden"
                  >
                     <Menu className="h-5 w-5" />
                     <span className="sr-only">Mở menu</span>
                  </Button>
               </SheetTrigger>
               <SheetContent side="left" className="lg:hidden">
                  <Sidebar />
               </SheetContent>
            </Sheet>

            <Breadcrumb>
               <BreadcrumbList>
                  <BreadcrumbItem>
                     <BreadcrumbLink asChild>
                        <Link
                           href={`/${role === Role.Admin ? 'admin' : 'counselor'}/dashboard`}
                           className="flex items-center"
                        >
                           <Home className="h-4 w-4 mr-1" />
                           <span className="font-medium">Trang chủ</span>
                        </Link>
                     </BreadcrumbLink>
                  </BreadcrumbItem>

                  {filteredBreadcrumbs.map((item, idx) => (
                     <React.Fragment key={idx}>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                           <BreadcrumbLink asChild>
                              <Link href={item.href}>{item.label}</Link>
                           </BreadcrumbLink>
                        </BreadcrumbItem>
                     </React.Fragment>
                  ))}
               </BreadcrumbList>
            </Breadcrumb>
         </div>

         {/* Actions */}
         <div className="flex items-center gap-3">
            {/* Nút thông báo */}
            <Button
               variant="outline"
               size="icon"
               className="relative"
               onClick={handleNotificationClick}
            >
               <Bell className="h-5 w-5" />
               <span className="sr-only">Thông báo</span>

               {/* Badge luôn hiển thị (kể cả = 0) */}
               <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-medium text-white">
                  {unopenedCount}
               </span>
            </Button>

            {/* Toggle theme
            <Button variant="outline" size="icon" onClick={toggleTheme}>
               {theme === 'light' ? (
                  <Moon className="h-5 w-5" />
               ) : (
                  <Sun className="h-5 w-5" />
               )}
            </Button> */}

            {/* User info */}
            <div className="flex items-center gap-2 rounded-full border border-muted px-2 py-1 mr-4">
               <Avatar className="h-12 w-8 flex items-center justify-center overflow-hidden rounded-full">
                  <AvatarImage
                     src="/images.jpeg"
                     alt={currentUser.name || 'Avatar'}
                     className="h-7 w-6 object-cover"
                  />
                  <AvatarFallback>{currentUser.initials}</AvatarFallback>
               </Avatar>
               <div className="flex flex-col items-start text-left">
                  <span className="text-sm font-medium">
                     {currentUser.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                     {currentUser.role}
                  </span>
               </div>
            </div>
         </div>
      </header>
   );
}
