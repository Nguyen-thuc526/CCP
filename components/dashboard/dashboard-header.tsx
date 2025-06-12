"use client"
import { useRouter } from "next/navigation"
import { Bell, Home, Menu, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { CounselorSidebar } from "@/components/counselor/counselor-sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface DashboardHeaderProps {
  role: "admin" | "counselor"
}

export function DashboardHeader({ role }: DashboardHeaderProps) {
  const { setTheme, theme } = useTheme()
  const router = useRouter()

  // Thông tin người dùng giả định dựa trên vai trò
  const userInfo = {
    admin: {
      name: "Admin",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "AD",
      role: "Quản trị viên",
    },
    counselor: {
      name: "TS. Trần Văn C",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "TC",
      role: "Chuyên viên tư vấn",
    },
  }

  const currentUser = userInfo[role]

  const handleNotificationClick = () => {
    router.push(`/${role}/notifications`)
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-4 border-b bg-white px-4 dark:bg-gray-950 lg:h-[60px] lg:px-6">
      <div className="flex items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="mr-2 lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Mở menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="lg:hidden">
            {role === "admin" ? <AdminSidebar /> : <CounselorSidebar />}
          </SheetContent>
        </Sheet>

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/${role}/dashboard`} className="flex items-center">
                  <Home className="h-4 w-4 mr-1" />
                  <span className="font-medium">Trang chủ</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink className="font-medium capitalize">
                {router.pathname?.split("/").pop() || "Thông báo"}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" className="relative" onClick={handleNotificationClick}>
          <Bell className="h-5 w-5" />
          <span className="sr-only">Thông báo</span>
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-medium text-white">
            3
          </span>
        </Button>

        <Button variant="outline" size="icon" onClick={toggleTheme}>
          {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>

        <div className="flex items-center gap-2 rounded-full border border-muted px-2 py-1">
          <Avatar className="h-8 w-8">
            <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
            <AvatarFallback>{currentUser.initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start text-left">
            <span className="text-sm font-medium">{currentUser.name}</span>
            <span className="text-xs text-muted-foreground">{currentUser.role}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
