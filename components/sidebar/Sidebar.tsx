'use client';
import { deleteCookie } from '@/utils/cookies';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
   ChevronDown,
   ChevronLeft,
   ChevronRight,
   LayoutDashboard,
   User,
   Users2,
   NotebookText,
   Folder,
   BadgeCheck,
   BookOpen,
   FileText,
   ClipboardList,
   Package,
   Calendar,
   Wallet,
   FilePlus,
   UserCircle,
   LogOut,
   Brain,
   Banknote,
   Menu,
   X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { logout } from '@/store/slices/authReducer';
import { Role } from '@/utils/enum';
import { storage } from '@/utils/storage';
import Image from 'next/image';
import { userService } from '@/services/userService';

interface SidebarLink {
   href: string;
   title: string;
   icon: React.ReactNode;
}
interface SidebarGroup {
   title: string;
   icon: React.ReactNode;
   children: SidebarLink[];
}
type SidebarItem = SidebarLink | SidebarGroup;
function isGroup(item: SidebarItem): item is SidebarGroup {
   return (item as SidebarGroup).children !== undefined;
}

export function Sidebar() {
   const pathname = usePathname();
   const dispatch = useDispatch();
   const role = useSelector((state: RootState) => state.auth.role);
   const router = useRouter();

   const [collapsed, setCollapsed] = useState(false);
   const [mobileOpen, setMobileOpen] = useState(false);
   const [counselorStatus, setCounselorStatus] = useState<number | null>(null);
   const [loadingStatus, setLoadingStatus] = useState(false);
   const [fetchError, setFetchError] = useState<string | null>(null);

   useEffect(() => {
      if (role === Role.Counselor) {
         setLoadingStatus(true);
         setFetchError(null);
         userService
            .getCounselorProfile()
            .then((res) => {
               const status = (res as any)?.data?.status ?? (res as any)?.status;
               setCounselorStatus(typeof status === 'number' ? status : null);
            })
            .catch((err) => {
               console.error('Failed to get counselor profile', err);
               setFetchError('Không thể tải trạng thái hồ sơ.');
               setCounselorStatus(null);
            })
            .finally(() => setLoadingStatus(false));
      } else {
         setCounselorStatus(null);
         setLoadingStatus(false);
         setFetchError(null);
      }
   }, [role]);

   // Redirect logic for counselor status 0 (chưa duyệt)
   useEffect(() => {
      if (
         role === Role.Counselor &&
         counselorStatus === 0 &&
         pathname?.startsWith('/counselor') &&
         pathname !== '/counselor/certificates'
      ) {
         router.replace('/counselor/certificates');
      }
   }, [role, counselorStatus, pathname, router]);

   const adminLinks: SidebarItem[] = [
      {
         href: '/admin/dashboard',
         icon: <LayoutDashboard className="h-5 w-5" />,
         title: 'Tổng quan',
      },
      {
         title: 'Quản lý nội dung',
         icon: <Folder className="h-5 w-5" />,
         children: [
            {
               href: '/admin/surveys',
               icon: <ClipboardList className="h-5 w-5" />,
               title: 'Khảo sát',
            },
            {
               href: '/admin/plans',
               icon: <Package className="h-5 w-5" />,
               title: 'Gói đăng ký',
            },
            {
               href: '/admin/managecourse',
               icon: <BookOpen className="h-5 w-5" />,
               title: 'Khóa học',
            },
            {
               href: '/admin/blog',
               icon: <FileText className="h-5 w-5" />,
               title: 'Blog & Tin tức',
            },
            {
               href: '/admin/categories',
               icon: <Folder className="h-5 w-5" />,
               title: 'Danh mục',
            },
            {
               href: '/admin/certificate-management',
               icon: <BadgeCheck className="h-5 w-5" />,
               title: 'Chứng chỉ',
            },
            {
               href: '/admin/person-type',
               icon: <Brain className="h-5 w-5" />,
               title: 'Tính cách',
            },
         ],
      },
      {
         title: 'Quản lý người dùng',
         icon: <User className="h-5 w-5" />,
         children: [
            {
               href: '/admin/users',
               icon: <User className="h-5 w-5" />,
               title: 'Người dùng',
            },
            {
               href: '/admin/counselors',
               icon: <Users2 className="h-5 w-5" />,
               title: 'Chuyên viên',
            },
            {
               href: '/admin/booking',
               icon: <NotebookText className="h-5 w-5" />,
               title: 'Booking',
            },
            {
               href: '/admin/withdraw',
               icon: <Banknote className="h-5 w-5" />,
               title: 'Rút tiền',
            },
         ],
      },
   ];

   const counselorLinksApproved: SidebarItem[] = [
      {
         href: '/counselor/dashboard',
         icon: <LayoutDashboard className="h-5 w-5" />,
         title: 'Tổng quan',
      },
      {
         title: 'Tư vấn',
         icon: <Calendar className="h-5 w-5" />,
         children: [
            {
               href: '/counselor/profile',
               icon: <UserCircle className="h-5 w-5" />,
               title: 'Hồ sơ của tôi',
            },
            {
               href: '/counselor/appointments',
               icon: <Calendar className="h-5 w-5" />,
               title: 'Lịch hẹn',
            },
            {
               href: '/counselor/certificates',
               icon: <FilePlus className="h-5 w-5" />,
               title: 'Chứng chỉ',
            },
         ],
      },
      {
         title: 'Thanh toán',
         icon: <Wallet className="h-5 w-5" />,
         children: [
            {
               href: '/counselor/wallet',
               icon: <Wallet className="h-5 w-5" />,
               title: 'Ví',
            },
         ],
      },
   ];

   const counselorLinksRestricted: SidebarItem[] = [
      {
         title: 'Tư vấn',
         icon: <Calendar className="h-5 w-5" />,
         children: [
            {
               href: '/counselor/certificates',
               icon: <FilePlus className="h-5 w-5" />,
               title: 'Chứng chỉ',
            },
         ],
      },
   ];

   const computedLinks: SidebarItem[] = useMemo(() => {
      if (role === Role.Admin) return adminLinks;
      if (counselorStatus === 1) return counselorLinksApproved;
      return counselorLinksRestricted; // status 0, null, or loading
   }, [role, counselorStatus]);

   const dashboardLink = useMemo(() => {
      if (role === Role.Admin) return '/admin/dashboard';
      return counselorStatus === 1 ? '/counselor/dashboard' : '/counselor/certificates';
   }, [role, counselorStatus]);

   const title = role === Role.Admin ? 'CCP Admin' : 'CCP Tư vấn viên';

   const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
   useEffect(() => {
      const initial = computedLinks.reduce(
         (acc, item) => {
            if (isGroup(item)) acc[item.title] = true;
            return acc;
         },
         {} as Record<string, boolean>
      );
      setOpenGroups(initial);
   }, [computedLinks]);

   const toggleGroup = (t: string) =>
      setOpenGroups((p) => ({ ...p, [t]: !p[t] }));

   const handleLogout = () => {
      storage.removeToken();
      deleteCookie('role');
      deleteCookie('counselor_status');
      dispatch(logout());
      router.push('/login');
   };

   const toggleSidebar = () => {
      setCollapsed((prev) => {
         const newState = !prev;
         if (!newState) {
            const activeGroup = computedLinks.find(
               (item) =>
                  isGroup(item) &&
                  item.children.some((child) => child.href === pathname)
            ) as SidebarGroup | undefined;
            if (activeGroup)
               setOpenGroups((pg) => ({ ...pg, [activeGroup.title]: true }));
         }
         return newState;
      });
   };

   useEffect(() => {
      setMobileOpen(false);
   }, [pathname]);

   const SidebarInner = (forceExpanded = false) => (
      <>
         <div
            className={cn(
               'flex h-14 items-center border-b px-4',
               collapsed && !forceExpanded && 'justify-center'
            )}
         >
            <Link
               href={dashboardLink}
               className="flex items-center font-semibold"
            >
               <Image
                  src="/8a04fc98-ebcd-4818-b662-748a85fb6a92.png"
                  alt="Logo"
                  width={24}
                  height={24}
                  className="h-7 w-7 object-contain mr-2"
               />
               {(!collapsed || forceExpanded) && (
                  <span className="text-base">{title}</span>
               )}
            </Link>
            {forceExpanded && (
               <button
                  className="ml-auto grid place-items-center rounded-md p-2 hover:bg-muted"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Đóng menu"
               >
                  <X className="h-5 w-5" />
               </button>
            )}
         </div>

         {/* Banner cho trạng thái chưa duyệt (status 0) */}
         {role === Role.Counselor && counselorStatus === 0 && (
            <div className="px-4 py-2 text-xs bg-amber-50 text-amber-700 border-b">
               {loadingStatus
                  ? 'Đang kiểm tra trạng thái hồ sơ của bạn...'
                  : fetchError
                    ? fetchError
                    : 'Tài khoản chưa được duyệt. Vui lòng gửi chứng chỉ để được phê duyệt.'}
            </div>
         )}

         <ScrollArea className="flex-1">
            <nav className="grid gap-1 px-2 py-4">
               {computedLinks.map((item) =>
                  isGroup(item) ? (
                     <div key={item.title}>
                        <button
                           onClick={() => toggleGroup(item.title)}
                           className={cn(
                              'flex items-center gap-3 px-3 py-2 w-full text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800',
                              collapsed && !forceExpanded
                                 ? 'justify-center'
                                 : 'justify-between'
                           )}
                        >
                           <div className="flex items-center gap-3">
                              {item.icon}
                              {(!collapsed || forceExpanded) && (
                                 <span>{item.title}</span>
                              )}
                           </div>
                           {(!collapsed || forceExpanded) && (
                              <ChevronDown
                                 className={cn(
                                    'h-4 w-4 transition',
                                    openGroups[item.title] ? 'rotate-180' : ''
                                 )}
                              />
                           )}
                        </button>
                        {(!collapsed || forceExpanded) &&
                           openGroups[item.title] && (
                              <div className="ml-6 mt-1 space-y-1">
                                 {item.children.map((link) => (
                                    <Link
                                       key={link.href}
                                       href={link.href}
                                       className={cn(
                                          'flex items-center gap-3 px-3 py-2 text-sm rounded-md',
                                          pathname === link.href
                                             ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                                             : 'text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'
                                       )}
                                    >
                                       {link.icon}
                                       <span>{link.title}</span>
                                    </Link>
                                 ))}
                              </div>
                           )}
                     </div>
                  ) : (
                     <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                           'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800',
                           collapsed && !forceExpanded ? 'justify-center' : '',
                           pathname === item.href
                              ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50'
                              : 'text-gray-500 dark:text-gray-400'
                        )}
                        title={
                           collapsed && !forceExpanded ? item.title : undefined
                        }
                     >
                        {item.icon}
                        {(!collapsed || forceExpanded) && (
                           <span>{item.title}</span>
                        )}
                     </Link>
                  )
               )}
            </nav>
         </ScrollArea>

         <div className="border-t p-4">
            <Button
               variant="outline"
               className={cn(
                  'w-full flex items-center',
                  collapsed && !forceExpanded
                     ? 'justify-center'
                     : 'justify-start'
               )}
               onClick={handleLogout}
            >
               <LogOut
                  className={cn(
                     'h-4 w-4',
                     collapsed && !forceExpanded ? '' : 'mr-2'
                  )}
               />
               {(!collapsed || forceExpanded) && <span>Đăng xuất</span>}
            </Button>
         </div>
      </>
   );

   return (
      <>
         <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed left-3 top-3 z-50 rounded-full border bg-background shadow"
            onClick={() => setMobileOpen(true)}
            aria-label="Mở menu"
         >
            <Menu className="h-5 w-5" />
         </Button>

         <div
            className={cn(
               'hidden lg:flex h-screen sticky top-0 flex-col border-r bg-white dark:bg-gray-950 transition-all duration-300',
               collapsed ? 'w-20' : 'w-64'
            )}
         >
            <Button
               variant="ghost"
               size="icon"
               className="absolute -right-3 top-20 z-10 h-6 w-6 rounded-full border bg-background"
               onClick={toggleSidebar}
               aria-label="Thu gọn/mở rộng"
            >
               {collapsed ? (
                  <ChevronRight className="h-3 w-3" />
               ) : (
                  <ChevronLeft className="h-3 w-3" />
               )}
            </Button>

            {SidebarInner()}
         </div>

         <div
            className={cn(
               'lg:hidden fixed inset-0 z-40 bg-black/30 transition-opacity',
               mobileOpen
                  ? 'opacity-100 pointer-events-auto'
                  : 'opacity-0 pointer-events-none'
            )}
            onClick={() => setMobileOpen(false)}
         />

         <aside
            className={cn(
               'lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-950 border-r shadow-xl',
               'transform transition-transform duration-300',
               mobileOpen ? 'translate-x-0' : '-translate-x-full'
            )}
            aria-hidden={!mobileOpen}
         >
            {SidebarInner(true)}
         </aside>
      </>
   );
}