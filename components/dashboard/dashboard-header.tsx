'use client';
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

export function DashboardHeader() {
  const { setTheme, theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const role = useSelector((state: RootState) => state.auth.role);
  const nameFromStore = useSelector((state: RootState) => state.auth.name);

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
      initials: (
        nameFromStore
          ? nameFromStore.split(' ').map((w) => w[0]).join('')
          : 'CS'
      )
        .slice(0, 2)
        .toUpperCase(),
      role: 'Chuyên viên tư vấn',
    },
  };

  const currentUser = role ? userInfo[role] : userInfo[Role.Counselor];

  const handleNotificationClick = () => {
    router.push(`/${role === Role.Admin ? 'admin' : 'counselor'}/notifications`);
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
      /^\d+$/.test(segment) || // số
      /^[0-9a-fA-F-]{10,}$/.test(segment) || // uuid
      /^[A-Za-z]+_\w+$/.test(segment); // Certification_63d739c642

    let label = pageTranslations[segment] || segment;

    if (isDetail) {
      label = 'Chi tiết';
    }

    return {
      label,
      href: '/' + segments.slice(0, index + 2).join('/'),
      isDetail,
    };
  });

  // Loại bỏ trường hợp "Chi tiết" bị lặp liên tiếp
  const filteredBreadcrumbs = breadcrumbItems.filter(
    (item, idx, arr) =>
      !(item.isDetail && idx > 0 && arr[idx - 1].isDetail)
  );

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-4 border-b bg-white px-4 dark:bg-gray-950 lg:h-[60px] lg:px-6">
      <div className="flex items-center">
        {/* Sidebar cho mobile */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="mr-2 lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Mở menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="lg:hidden">
            <Sidebar />
          </SheetContent>
        </Sheet>

        {/* Breadcrumb */}
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
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-medium text-white">
            3
          </span>
        </Button>

        {/* Toggle theme */}
        <Button variant="outline" size="icon" onClick={toggleTheme}>
          {theme === 'light' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>

        {/* User info */}
        <div className="flex items-center gap-2 rounded-full border border-muted px-2 py-1">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={currentUser.avatar || '/placeholder.svg'}
              alt={currentUser.name}
            />
            <AvatarFallback>{currentUser.initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start text-left">
            <span className="text-sm font-medium">{currentUser.name}</span>
            <span className="text-xs text-muted-foreground">
              {currentUser.role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
