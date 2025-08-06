"use client"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface CourseHeaderProps {
  courseId: string
  title: string
  status: "public" | "hidden"
  onToggleStatus: (newStatus: "public" | "hidden") => void
}

export function CourseHeader(props: CourseHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/managecourse">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Chi tiết khóa học: {props.title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Label htmlFor="course-status-toggle">{props.status === "public" ? "Công khai" : "Ẩn"}</Label>
        <Switch
          id="course-status-toggle"
          checked={props.status === "public"}
          onCheckedChange={(checked) => props.onToggleStatus(checked ? "public" : "hidden")}
        />
      </div>
    </div>
  )
}
