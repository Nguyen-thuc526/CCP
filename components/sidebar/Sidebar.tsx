"use client";
import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  CreditCard,
  FilePlus,
  FileText,
  Flag,
  Heart,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Package,
  Shield,
  UserCircle,
  Wallet,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Role } from "@/utils/enum";

import { storage } from "@/utils/storage";
import { RootState } from "@/store/store";
import { logout } from "@/store/slices/authReducer";

interface SidebarLink {
  href: string;
  icon: React.ReactNode;
  title: string;
}

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const role = useSelector((state: RootState) => state.auth.role);

  const adminLinks: SidebarLink[] = [
    {
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      title: "Tổng quan",
    },
    {
      href: "/admin/surveys",
      icon: <ClipboardList className="h-5 w-5" />,
      title: "Khảo sát",
    },
    {
      href: "/admin/plans",
      icon: <Package className="h-5 w-5" />,
      title: "Gói đăng ký",
    },
    {
      href: "/admin/users",
      icon: <Shield className="h-5 w-5" />,
      title: "Quản lý người dùng",
    },
    {
      href: "/admin/user-reports",
      icon: <Flag className="h-5 w-5" />,
      title: "Báo cáo người dùng",
    },
    {
      href: "/admin/managecourse",
      icon: <BookOpen className="h-5 w-5" />,
      title: "Quản lý khóa học",
    },
    {
      href: "/admin/blog",
      icon: <FileText className="h-5 w-5" />,
      title: "Blog & Tin tức",
    },
    {
      href: "/admin/reports",
      icon: <BarChart3 className="h-5 w-5" />,
      title: "Báo cáo",
    },
  ];

  const counselorLinks: SidebarLink[] = [
    {
      href: "/counselor/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      title: "Tổng quan",
    },
    {
      href: "/counselor/profile",
      icon: <UserCircle className="h-5 w-5" />,
      title: "Hồ sơ của tôi",
    },
    {
      href: "/counselor/appointments",
      icon: <Calendar className="h-5 w-5" />,
      title: "Lịch hẹn tư vấn",
    },
    {
      href: "/counselor/consultations",
      icon: <MessageSquare className="h-5 w-5" />,
      title: "Hồ sơ tư vấn",
    },
    {
      href: "/counselor/wallet",
      icon: <Wallet className="h-5 w-5" />,
      title: "Quản lý ví",
    },
    {
      href: "/counselor/payments",
      icon: <CreditCard className="h-5 w-5" />,
      title: "Chính sách thanh toán",
    },
      {
      href: "/counselor/certificates",
      icon: <FilePlus  className="h-5 w-5" />,
      title: "Nộp chứng chỉ",
    },
  ];

  const links = role === Role.Admin ? adminLinks : counselorLinks;
  const title = role === Role.Admin ? "CCP Admin" : "CCP Tư vấn viên";
  const dashboardLink =
    role === Role.Admin ? "/admin/dashboard" : "/counselor/dashboard";

  const handleLogout = () => {
    storage.removeToken(); // Xóa token khỏi localStorage
    dispatch(logout()); // Reset Redux state
  };

  return (
    <div
      className={cn(
        "h-screen sticky top-0 flex flex-col border-r bg-white dark:bg-gray-950 transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-20 z-10 h-6 w-6 rounded-full border bg-background"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>
      <div
        className={cn(
          "flex h-14 items-center border-b px-4",
          collapsed ? "justify-center" : ""
        )}
      >
        <Link
          href={dashboardLink}
          className={cn(
            "flex items-center gap-2 font-semibold",
            collapsed ? "justify-center" : ""
          )}
        >
          <Heart className="h-6 w-6 text-rose-500" />
          {!collapsed && <span className="text-lg">{title}</span>}
        </Link>
      </div>
      <ScrollArea className="flex-1">
        <nav className="grid gap-1 px-2 py-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800",
                collapsed ? "justify-center" : "",
                pathname === link.href
                  ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
                  : "text-gray-500 dark:text-gray-400"
              )}
              title={collapsed ? link.title : undefined}
            >
              {link.icon}
              {!collapsed && <span>{link.title}</span>}
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="border-t p-4">
        <Button
          variant="outline"
          className={cn(
            "w-full",
            collapsed ? "justify-center" : "justify-start"
          )}
          onClick={handleLogout}
        >
          <Link href="/login">
            <LogOut className={cn("h-4 w-4", collapsed ? "" : "mr-2")} />
            {!collapsed && <span>Đăng xuất</span>}
          </Link>
        </Button>
      </div>
    </div>
  );
}
