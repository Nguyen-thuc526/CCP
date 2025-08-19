'use client';
import { deleteCookie } from '@/utils/cookies';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
   ChevronDown,
   ChevronLeft,
   ChevronRight,
   Heart,
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
   MessageSquare,
   Wallet,
   FilePlus,
   UserCircle,
   LogOut,
   Brain,
   Banknote,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { logout } from '@/store/slices/authReducer';
import { Role } from '@/utils/enum';
import { storage } from '@/utils/storage';

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

   const counselorLinks: SidebarItem[] = [
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
            // {
            //    href: '/counselor/consultations',
            //    icon: <MessageSquare className="h-5 w-5" />,
            //    title: 'Hồ sơ tư vấn',
            // },
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

   const links = role === Role.Admin ? adminLinks : counselorLinks;
   const dashboardLink =
      role === Role.Admin ? '/admin/dashboard' : '/counselor/dashboard';
   const title = role === Role.Admin ? 'CCP Admin' : 'CCP Tư vấn viên';

   // ✅ Initialize all groups as open
   const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
      links.reduce(
         (acc, item) => {
            if (isGroup(item)) acc[item.title] = true;
            return acc;
         },
         {} as Record<string, boolean>
      )
   );

   const toggleGroup = (title: string) => {
      setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
   };

const handleLogout = () => {
  storage.removeToken();
  deleteCookie('role'); 
  dispatch(logout());
  router.push('/login');
};
   const toggleSidebar = () => {
      setCollapsed((prev) => {
         const newState = !prev;
         if (!newState) {
            const activeGroup = links.find(
               (item) =>
                  isGroup(item) &&
                  item.children.some((child) => child.href === pathname)
            );
            if (activeGroup) {
               setOpenGroups((prevGroups) => ({
                  ...prevGroups,
                  [activeGroup.title]: true,
               }));
            }
         }
         return newState;
      });
   };

   return (
      <div
         className={cn(
            'h-screen sticky top-0 flex flex-col border-r bg-white dark:bg-gray-950 transition-all duration-300',
            collapsed ? 'w-20' : 'w-64'
         )}
      >
         {/* Nút toggle */}
         <Button
            variant="ghost"
            size="icon"
            className="absolute -right-3 top-20 z-10 h-6 w-6 rounded-full border bg-background"
            onClick={toggleSidebar}
         >
            {collapsed ? (
               <ChevronRight className="h-3 w-3" />
            ) : (
               <ChevronLeft className="h-3 w-3" />
            )}
         </Button>

         {/* Logo */}
         <div
            className={cn(
               'flex h-14 items-center border-b px-4',
               collapsed && 'justify-center'
            )}
         >
            <Link
               href={dashboardLink}
               className="flex items-center gap-2 font-semibold"
            >
               <Heart className="h-6 w-6 text-rose-500" />
               {!collapsed && <span className="text-lg">{title}</span>}
            </Link>
         </div>

         {/* Menu */}
         <ScrollArea className="flex-1">
            <nav className="grid gap-1 px-2 py-4">
               {links.map((item) =>
                  isGroup(item) ? (
                     <div key={item.title}>
                        <button
                           onClick={() => toggleGroup(item.title)}
                           className={cn(
                              'flex items-center gap-3 px-3 py-2 w-full text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800',
                              collapsed ? 'justify-center' : 'justify-between'
                           )}
                        >
                           <div className="flex items-center gap-3">
                              {item.icon}
                              {!collapsed && <span>{item.title}</span>}
                           </div>
                           {!collapsed && (
                              <ChevronDown
                                 className={cn(
                                    'h-4 w-4 transition',
                                    openGroups[item.title] ? 'rotate-180' : ''
                                 )}
                              />
                           )}
                        </button>

                        {!collapsed && openGroups[item.title] && (
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
                           collapsed ? 'justify-center' : '',
                           pathname === item.href
                              ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50'
                              : 'text-gray-500 dark:text-gray-400'
                        )}
                        title={collapsed ? item.title : undefined}
                     >
                        {item.icon}
                        {!collapsed && <span>{item.title}</span>}
                     </Link>
                  )
               )}
            </nav>
         </ScrollArea>

         {/* Đăng xuất */}
         <div className="border-t p-4">
            <Button
               variant="outline"
               className={cn(
                  'w-full flex items-center',
                  collapsed ? 'justify-center' : 'justify-start'
               )}
               onClick={handleLogout}
            >
               <LogOut className={cn('h-4 w-4', collapsed ? '' : 'mr-2')} />
               {!collapsed && <span>Đăng xuất</span>}
            </Button>
         </div>
      </div>
   );
}
