"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileText,
  Heart,
  LayoutDashboard,
  LogOut,
  Users,
  UserCircle,
  Flag,
  Shield,
  Package,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SidebarLink {
  href: string
  icon: React.ReactNode
  title: string
}

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const links: SidebarLink[] = [
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
  ]

  return (
    <div
      className={cn(
        "h-screen sticky top-0 flex flex-col border-r bg-white dark:bg-gray-950 transition-all duration-300",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-20 z-10 h-6 w-6 rounded-full border bg-background"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>
      <div className={cn("flex h-14 items-center border-b px-4", collapsed ? "justify-center" : "")}>
        <Link
          href="/admin/dashboard"
          className={cn("flex items-center gap-2 font-semibold", collapsed ? "justify-center" : "")}
        >
          <Heart className="h-6 w-6 text-rose-500" />
          {!collapsed && <span className="text-lg">CCP Admin</span>}
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
                  : "text-gray-500 dark:text-gray-400",
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
        <Button variant="outline" className={cn("w-full", collapsed ? "justify-center" : "justify-start")} asChild>
          <Link href="/login">
            <LogOut className={cn("h-4 w-4", collapsed ? "" : "mr-2")} />
            {!collapsed && <span>Đăng xuất</span>}
          </Link>
        </Button>
      </div>
    </div>
  )
}
