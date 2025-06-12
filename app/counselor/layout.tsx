import type React from "react"
import { CounselorSidebar } from "@/components/counselor/counselor-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default function CounselorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <CounselorSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader role="counselor" />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
