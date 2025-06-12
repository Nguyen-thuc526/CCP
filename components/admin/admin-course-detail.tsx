"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Users,
  Star,
  MessageSquare,
  DollarSign,
  Clock,
  PlayCircle,
  FileText,
} from "lucide-react"
import Link from "next/link"

interface AdminCourseDetailProps {
  courseId: string
}

export function AdminCourseDetail({ courseId }: AdminCourseDetailProps) {
  // Mock data - trong thực tế sẽ fetch từ API
  const course = {
    id: courseId,
    title: "Tư vấn tâm lý cơ bản",
    description:
      "Khóa học cung cấp kiến thức cơ bản về tư vấn tâm lý, giúp học viên hiểu rõ về các phương pháp tư vấn hiệu quả.",
    instructor: {
      name: "Nguyễn Văn A",
      avatar: "/placeholder.svg?height=40&width=40",
      email: "nguyenvana@example.com",
      experience: "5 năm kinh nghiệm",
    },
    price: 500000,
    isFree: false,
    membershipRequired: ["premium"],
    status: "pending",
    createdAt: "2024-01-15",
    thumbnail: "/placeholder.svg?height=300&width=500",
    chapters: [
      {
        id: "1",
        title: "Giới thiệu về tư vấn tâm lý",
        type: "video",
        duration: "15:30",
        content: "Tổng quan về lĩnh vực tư vấn tâm lý",
      },
      {
        id: "2",
        title: "Các phương pháp tư vấn cơ bản",
        type: "article",
        readTime: "10 phút",
        content: "Bài viết chi tiết về các phương pháp tư vấn",
      },
    ],
    stats: {
      enrollments: 0,
      rating: 0,
      reviews: 0,
      completionRate: 0,
    },
    reviews: [],
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/managecourse">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Chi tiết khóa học</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <img
                  src={course.thumbnail || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardTitle className="text-2xl">{course.title}</CardTitle>
              <p className="text-muted-foreground">{course.description}</p>
            </CardHeader>
          </Card>

          <Tabs defaultValue="content" className="space-y-4">
            <TabsList>
              <TabsTrigger value="content">Nội dung khóa học</TabsTrigger>
              <TabsTrigger value="stats">Thống kê</TabsTrigger>
              <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
            </TabsList>

            <TabsContent value="content">
              <Card>
                <CardHeader>
                  <CardTitle>Danh sách chương</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {course.chapters.map((chapter, index) => (
                    <div key={chapter.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        {chapter.type === "video" ? (
                          <PlayCircle className="h-6 w-6 text-blue-500" />
                        ) : (
                          <FileText className="h-6 w-6 text-green-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">
                          Chương {index + 1}: {chapter.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">{chapter.content}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {chapter.type === "video" ? chapter.duration : chapter.readTime}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Học viên</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{course.stats.enrollments}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Đánh giá</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{course.stats.rating}/5</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Bình luận</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{course.stats.reviews}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tỷ lệ hoàn thành</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{course.stats.completionRate}%</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>Đánh giá từ học viên</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Chưa có đánh giá nào.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin giá</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                {course.isFree ? (
                  <span className="font-semibold text-green-600">Miễn phí</span>
                ) : (
                  <span className="font-semibold">{course.price.toLocaleString("vi-VN")} VNĐ</span>
                )}
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Yêu cầu membership:</p>
                <div className="flex gap-2">
                  {course.membershipRequired.map((membership) => (
                    <Badge key={membership} variant="outline">
                      {membership}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
