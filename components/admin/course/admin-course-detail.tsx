"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
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
  Edit,
  Plus,
  Trash2,
  Upload,
  ImageIcon,
  Save,
  X,
  BookOpen,
  HelpCircle,
} from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import QuizBuilder from "./quiz-builder"
import { ToastType, useToast } from "@/hooks/useToast"


interface Question {
  id: string
  question: string
  answers: { id: string; text: string; isCorrect: boolean }[]
}

interface Chapter {
  id: string
  title: string
  type: "video" | "article" | "quiz"
  content: string // For article content or video URL
  videoFile?: File // For new video uploads
  videoUrl?: string // For existing video display
  duration?: string // For video
  readTime?: string // For article
  uploadProgress?: number // For video upload
  quiz?: Question[] // For quiz content
}

interface Course {
  id: string
  title: string
  description: string
  price: number
  isFree: boolean
  membershipRequired: string[]
  status: "public" | "hidden"
  createdAt: string
  chapters: Chapter[]
  enrollments: number
  thumbnail: string
  thumbnailFile?: File | null
  instructor: {
    name: string
    avatar: string
    email: string
    experience: string
  }
  stats: {
    enrollments: number
    rating: number
    reviews: number
    completionRate: number
  }
  reviews: any[] // Simplified for now
}

interface AdminCourseDetailProps {
  courseId: string
}

const membershipOptions = [
  { id: "basic", label: "Basic" },
  { id: "premium", label: "Premium" },
  { id: "vip", label: "VIP" },
]

export function AdminCourseDetail({ courseId }: AdminCourseDetailProps) {
  const [course, setCourse] = useState<Course | null>(null)
  const [isEditingBasicInfo, setIsEditingBasicInfo] = useState(false)
  const [isEditingPricing, setIsEditingPricing] = useState(false)
  const [isAddingChapter, setIsAddingChapter] = useState(false)
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null)

  // State for editing basic info
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editThumbnail, setEditThumbnail] = useState("")
  const [editThumbnailFile, setEditThumbnailFile] = useState<File | null>(null)

  // State for editing pricing
  const [editPrice, setEditPrice] = useState(0)
  const [editIsFree, setEditIsFree] = useState(false)
  const [editMembershipRequired, setEditMembershipRequired] = useState<string[]>([])

  // State for new chapter
  const [newChapter, setNewChapter] = useState({
    title: "",
    type: "video" as "video" | "article" | "quiz",
    content: "",
    videoFile: null as File | null,
    duration: "",
    readTime: "",
    uploadProgress: undefined as number | undefined,
    quiz: [] as Question[],
  })

  // State for editing existing chapter
  const [currentEditingChapter, setCurrentEditingChapter] = useState<Chapter | null>(null)

  const thumbnailInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const editingVideoInputRef = useRef<HTMLInputElement>(null)

  const { showToast } = useToast() // Use the custom hook

  useEffect(() => {
    // Simulate fetching course data
    // In a real app, you would fetch this from your API based on courseId
    const fetchedCourse: Course = {
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
      status: "hidden", // Initial status
      createdAt: "2024-01-15",
      thumbnail: "/placeholder.svg?height=300&width=500",
      chapters: [
        {
          id: "chap1",
          title: "Giới thiệu về tư vấn tâm lý",
          type: "video",
          duration: "15:30",
          content: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Example video URL
          videoUrl: "/placeholder.svg?height=100&width=150", // Placeholder for video thumbnail
        },
        {
          id: "chap2",
          title: "Các phương pháp tư vấn cơ bản",
          type: "article",
          readTime: "10 phút",
          content:
            "Bài viết chi tiết về các phương pháp tư vấn, bao gồm CBT, DBT, và liệu pháp thân chủ trọng tâm. Khóa học này sẽ đi sâu vào từng phương pháp, cung cấp các ví dụ thực tế và bài tập ứng dụng để học viên có thể nắm vững kiến thức và áp dụng vào thực tiễn.",
        },
        {
          id: "chap3",
          title: "Quiz cuối khóa",
          type: "quiz",
          content: "",
          quiz: [
            {
              id: "q1",
              question: "Tư vấn tâm lý là gì?",
              answers: [
                { id: "a1", text: "Giúp đỡ người khác giải quyết vấn đề tâm lý", isCorrect: true },
                { id: "a2", text: "Chẩn đoán bệnh tâm thần", isCorrect: false },
                { id: "a3", text: "Kê đơn thuốc", isCorrect: false },
              ],
            },
            {
              id: "q2",
              question: "CBT là viết tắt của gì?",
              answers: [
                { id: "b1", text: "Cognitive Behavioral Therapy", isCorrect: true },
                { id: "b2", text: "Client-Based Therapy", isCorrect: false },
                { id: "b3", text: "Creative Brain Training", isCorrect: false },
              ],
            },
          ],
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
    setCourse(fetchedCourse)
    // Initialize edit states with fetched data
    setEditTitle(fetchedCourse.title)
    setEditDescription(fetchedCourse.description)
    setEditThumbnail(fetchedCourse.thumbnail)
    setEditPrice(fetchedCourse.price)
    setEditIsFree(fetchedCourse.isFree)
    setEditMembershipRequired(fetchedCourse.membershipRequired)
  }, [courseId])

  const handleSaveBasicInfo = () => {
    if (!course) return
    // Simulate API call to update basic info
    setCourse((prev) =>
      prev
        ? {
            ...prev,
            title: editTitle,
            description: editDescription,
            thumbnail: editThumbnail,
            thumbnailFile: editThumbnailFile,
          }
        : null,
    )
    setIsEditingBasicInfo(false)
    showToast("Thông tin cơ bản đã được cập nhật.", ToastType.Success) // Using showToast
  }

  const handleCancelBasicInfo = () => {
    if (!course) return
    setEditTitle(course.title)
    setEditDescription(course.description)
    setEditThumbnail(course.thumbnail)
    setEditThumbnailFile(null)
    setIsEditingBasicInfo(false)
  }

  const handleSavePricing = () => {
    if (!course) return
    // Simulate API call to update pricing
    setCourse((prev) =>
      prev
        ? {
            ...prev,
            price: editPrice,
            isFree: editIsFree,
            membershipRequired: editMembershipRequired,
          }
        : null,
    )
    setIsEditingPricing(false)
    showToast("Thông tin giá và membership đã được cập nhật.", ToastType.Success) // Using showToast
  }

  const handleCancelPricing = () => {
    if (!course) return
    setEditPrice(course.price)
    setEditIsFree(course.isFree)
    setEditMembershipRequired(course.membershipRequired)
    setIsEditingPricing(false)
  }

  const handleThumbnailUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setEditThumbnailFile(file)
      setEditThumbnail(URL.createObjectURL(file))
    }
  }

  const handleMembershipChange = (membershipId: string, checked: boolean) => {
    if (checked) {
      setEditMembershipRequired((prev) => [...prev, membershipId])
    } else {
      setEditMembershipRequired((prev) => prev.filter((id) => id !== membershipId))
    }
  }

  const simulateUpload = (file: File, isNewChapter: boolean, chapterId?: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      if (isNewChapter) {
        setNewChapter((prev) => ({
          ...prev,
          uploadProgress: progress,
        }))
      } else if (chapterId) {
        setCurrentEditingChapter((prev) => (prev ? { ...prev, uploadProgress: progress } : null))
      }

      if (progress >= 100) {
        clearInterval(interval)
        const videoUrl = URL.createObjectURL(file)
        if (isNewChapter) {
          setNewChapter((prev) => ({
            ...prev,
            content: videoUrl,
            videoUrl: videoUrl,
            uploadProgress: undefined,
          }))
        } else if (chapterId) {
          setCurrentEditingChapter((prev) =>
            prev ? { ...prev, content: videoUrl, videoUrl: videoUrl, uploadProgress: undefined } : null,
          )
        }
        showToast("Video đã được tải lên.", ToastType.Success) // Using showToast
      }
    }, 200)
  }

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>, isNewChapter: boolean, chapterId?: string) => {
    const file = event.target.files?.[0]
    if (file) {
      if (isNewChapter) {
        setNewChapter((prev) => ({ ...prev, videoFile: file }))
        simulateUpload(file, true)
      } else if (chapterId) {
        setCurrentEditingChapter((prev) => (prev ? { ...prev, videoFile: file } : null))
        simulateUpload(file, false, chapterId)
      }
    }
  }

  const addChapter = () => {
    if (!course) return
    if (
      newChapter.title.trim() === "" ||
      (newChapter.type === "article" && newChapter.content.trim() === "") ||
      (newChapter.type === "video" && !newChapter.videoFile && !newChapter.content) ||
      (newChapter.type === "quiz" && newChapter.quiz.length === 0)
    ) {
      showToast("Vui lòng điền đầy đủ thông tin chương.", ToastType.Error) // Using showToast
      return
    }

    const chapterToAdd: Chapter = {
      id: Date.now().toString(),
      title: newChapter.title,
      type: newChapter.type,
      content: newChapter.content,
      videoUrl: newChapter.videoUrl,
      duration: newChapter.duration,
      readTime: newChapter.readTime,
      quiz: newChapter.quiz,
    }

    setCourse((prev) => (prev ? { ...prev, chapters: [...prev.chapters, chapterToAdd] } : null))
    showToast("Chương mới đã được thêm.", ToastType.Success) // Using showToast
    // Reset new chapter state
    setNewChapter({
      title: "",
      type: "video",
      content: "",
      videoFile: null,
      duration: "",
      readTime: "",
      uploadProgress: undefined,
      quiz: [],
    })
    setIsAddingChapter(false)
    if (videoInputRef.current) videoInputRef.current.value = ""
  }

  const removeChapter = (chapterId: string) => {
    if (!course) return
    setCourse((prev) => (prev ? { ...prev, chapters: prev.chapters.filter((chap) => chap.id !== chapterId) } : null))
    showToast("Chương đã được xóa.", ToastType.Success) // Using showToast
  }

  const startEditingChapter = (chapter: Chapter) => {
    setEditingChapterId(chapter.id)
    setCurrentEditingChapter({ ...chapter }) // Create a copy to edit
  }

  const saveEditingChapter = () => {
    if (!course || !currentEditingChapter) return

    if (
      currentEditingChapter.title.trim() === "" ||
      (currentEditingChapter.type === "article" && currentEditingChapter.content.trim() === "") ||
      (currentEditingChapter.type === "video" && !currentEditingChapter.videoUrl && !currentEditingChapter.videoFile) ||
      (currentEditingChapter.type === "quiz" && currentEditingChapter.quiz?.length === 0)
    ) {
      showToast("Vui lòng điền đầy đủ thông tin chương.", ToastType.Error) // Using showToast
      return
    }

    setCourse((prev) =>
      prev
        ? {
            ...prev,
            chapters: prev.chapters.map((chap) =>
              chap.id === currentEditingChapter.id ? currentEditingChapter : chap,
            ),
          }
        : null,
    )
    showToast("Chương đã được cập nhật.", ToastType.Success) // Using showToast
    setEditingChapterId(null)
    setCurrentEditingChapter(null)
  }

  const cancelEditingChapter = () => {
    setEditingChapterId(null)
    setCurrentEditingChapter(null)
  }

  const handleToggleCourseStatus = (newStatus: "public" | "hidden") => {
    if (!course) return
    setCourse((prev) => (prev ? { ...prev, status: newStatus } : null))
    showToast(`Khóa học đã được ${newStatus === "public" ? "công khai" : "ẩn"}.`, ToastType.Success) // Using showToast
    console.log(`Course ${course.id} status toggled to ${newStatus}`)
  }

  if (!course) {
    return <div>Đang tải chi tiết khóa học...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/managecourse">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Chi tiết khóa học: {course.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="course-status-toggle">{course.status === "public" ? "Công khai" : "Ẩn"}</Label>
          <Switch
            id="course-status-toggle"
            checked={course.status === "public"}
            onCheckedChange={(checked) => handleToggleCourseStatus(checked ? "public" : "hidden")}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl">Thông tin cơ bản</CardTitle>
              {!isEditingBasicInfo && (
                <Button variant="outline" size="sm" onClick={() => setIsEditingBasicInfo(true)}>
                  <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <img
                  src={editThumbnail || course.thumbnail || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditingBasicInfo && (
                <div className="space-y-2">
                  <Label>Ảnh thumbnail</Label>
                  <div className="flex items-center gap-4">
                    <input
                      ref={thumbnailInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                    />
                    <Button type="button" variant="outline" onClick={() => thumbnailInputRef.current?.click()}>
                      <ImageIcon className="mr-2 h-4 w-4" />
                      {editThumbnail ? "Thay đổi ảnh" : "Chọn ảnh"}
                    </Button>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="title">Tên khóa học</Label>
                {isEditingBasicInfo ? (
                  <Input
                    id="title"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Nhập tên khóa học"
                  />
                ) : (
                  <p className="text-lg font-semibold">{course.title}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả khóa học</Label>
                {isEditingBasicInfo ? (
                  <Textarea
                    id="description"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Mô tả chi tiết về khóa học"
                    rows={4}
                  />
                ) : (
                  <p className="text-muted-foreground">{course.description}</p>
                )}
              </div>
              {isEditingBasicInfo && (
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={handleCancelBasicInfo}>
                    <X className="mr-2 h-4 w-4" /> Hủy
                  </Button>
                  <Button onClick={handleSaveBasicInfo}>
                    <Save className="mr-2 h-4 w-4" /> Lưu
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="content" className="space-y-4">
            <TabsList>
              <TabsTrigger value="content">Nội dung khóa học</TabsTrigger>
              <TabsTrigger value="stats">Thống kê</TabsTrigger>
              <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
            </TabsList>

            <TabsContent value="content">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Danh sách chương</CardTitle>
                  {!isAddingChapter && (
                    <Button size="sm" onClick={() => setIsAddingChapter(true)}>
                      <Plus className="mr-2 h-4 w-4" /> Thêm chương mới
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {isAddingChapter && (
                    <div className="p-4 border rounded-lg space-y-4 bg-muted/20">
                      <h3 className="font-semibold">Thêm chương mới</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="new-chapter-title">Tên chương</Label>
                          <Input
                            id="new-chapter-title"
                            value={newChapter.title}
                            onChange={(e) => setNewChapter((prev) => ({ ...prev, title: e.target.value }))}
                            placeholder="Nhập tên chương"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-chapter-type">Loại nội dung</Label>
                          <Select
                            value={newChapter.type}
                            onValueChange={(value: "video" | "article" | "quiz") =>
                              setNewChapter((prev) => ({
                                ...prev,
                                type: value,
                                videoFile: null,
                                content: "",
                                duration: "",
                                readTime: "",
                                quiz: value === "quiz" ? prev.quiz : [],
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="video">Video</SelectItem>
                              <SelectItem value="article">Bài viết</SelectItem>
                              <SelectItem value="quiz">Quiz</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {newChapter.type === "video" && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Video</Label>
                            <div className="space-y-4">
                              {newChapter.videoFile && (
                                <div className="relative">
                                  <video
                                    src={URL.createObjectURL(newChapter.videoFile)}
                                    controls
                                    className="w-full max-w-md h-48 rounded-lg border"
                                  />
                                  {newChapter.uploadProgress !== undefined && (
                                    <div className="mt-2">
                                      <div className="flex items-center justify-between text-sm mb-1">
                                        <span>Đang tải lên...</span>
                                        <span>{newChapter.uploadProgress}%</span>
                                      </div>
                                      <Progress value={newChapter.uploadProgress} className="w-full" />
                                    </div>
                                  )}
                                </div>
                              )}
                              <div className="flex items-center gap-4">
                                <input
                                  ref={videoInputRef}
                                  type="file"
                                  accept="video/*"
                                  onChange={(e) => handleVideoUpload(e, true)}
                                  className="hidden"
                                />
                                <Button type="button" variant="outline" onClick={() => videoInputRef.current?.click()}>
                                  <Upload className="mr-2 h-4 w-4" />
                                  {newChapter.videoFile ? "Thay đổi video" : "Chọn video"}
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-duration">Thời lượng (phút:giây)</Label>
                            <Input
                              id="new-duration"
                              value={newChapter.duration}
                              onChange={(e) => setNewChapter((prev) => ({ ...prev, duration: e.target.value }))}
                              placeholder="15:30"
                            />
                          </div>
                        </div>
                      )}

                      {newChapter.type === "article" && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="new-chapter-content">Nội dung bài viết</Label>
                            <Textarea
                              id="new-chapter-content"
                              value={newChapter.content}
                              onChange={(e) => setNewChapter((prev) => ({ ...prev, content: e.target.value }))}
                              placeholder="Nhập nội dung bài viết"
                              rows={6}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-read-time">Thời gian đọc (phút)</Label>
                            <Input
                              id="new-read-time"
                              value={newChapter.readTime}
                              onChange={(e) => setNewChapter((prev) => ({ ...prev, readTime: e.target.value }))}
                              placeholder="10"
                            />
                          </div>
                        </div>
                      )}

                      {newChapter.type === "quiz" && (
                        <div className="space-y-4">
                          <Label>Quiz câu hỏi</Label>
                          <QuizBuilder
                            quiz={newChapter.quiz}
                            setQuiz={(quiz) => setNewChapter((prev) => ({ ...prev, quiz }))}
                          />
                        </div>
                      )}

                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={() => setIsAddingChapter(false)}>
                          <X className="mr-2 h-4 w-4" /> Hủy
                        </Button>
                        <Button onClick={addChapter}>
                          <Plus className="mr-2 h-4 w-4" /> Thêm chương
                        </Button>
                      </div>
                    </div>
                  )}

                  {course.chapters.length === 0 && !isAddingChapter ? (
                    <p className="text-muted-foreground text-center py-4">
                      Chưa có chương nào. Bấm "Thêm chương mới" để bắt đầu.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {course.chapters.map((chapter, index) => (
                        <div key={chapter.id} className="flex items-start gap-4 p-4 border rounded-lg">
                          <div className="flex-shrink-0 mt-1">
                            {chapter.type === "video" ? (
                              <PlayCircle className="h-6 w-6 text-blue-500" />
                            ) : chapter.type === "article" ? (
                              <FileText className="h-6 w-6 text-green-500" />
                            ) : (
                              <HelpCircle className="h-6 w-6 text-purple-500" />
                            )}
                          </div>
                          <div className="flex-1 space-y-2">
                            {editingChapterId === chapter.id && currentEditingChapter ? (
                              <div className="space-y-4 w-full">
                                <div className="space-y-2">
                                  <Label htmlFor={`edit-chapter-title-${chapter.id}`}>Tên chương</Label>
                                  <Input
                                    id={`edit-chapter-title-${chapter.id}`}
                                    value={currentEditingChapter.title}
                                    onChange={(e) =>
                                      setCurrentEditingChapter((prev) =>
                                        prev ? { ...prev, title: e.target.value } : null,
                                      )
                                    }
                                    placeholder="Nhập tên chương"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`edit-chapter-type-${chapter.id}`}>Loại nội dung</Label>
                                  <Select
                                    value={currentEditingChapter.type}
                                    onValueChange={(value: "video" | "article" | "quiz") =>
                                      setCurrentEditingChapter((prev) =>
                                        prev
                                          ? {
                                              ...prev,
                                              type: value,
                                              videoFile: null,
                                              content: "",
                                              duration: "",
                                              readTime: "",
                                              quiz: value === "quiz" ? prev.quiz : [],
                                            }
                                          : null,
                                      )
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="video">Video</SelectItem>
                                      <SelectItem value="article">Bài viết</SelectItem>
                                      <SelectItem value="quiz">Quiz</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                {currentEditingChapter.type === "video" && (
                                  <div className="space-y-4">
                                    <div className="space-y-2">
                                      <Label>Video</Label>
                                      <div className="space-y-4">
                                        {(currentEditingChapter.videoFile || currentEditingChapter.videoUrl) && (
                                          <div className="relative">
                                            <video
                                              src={
                                                currentEditingChapter.videoFile
                                                  ? URL.createObjectURL(currentEditingChapter.videoFile)
                                                  : currentEditingChapter.videoUrl
                                              }
                                              controls
                                              className="w-full max-w-md h-48 rounded-lg border"
                                            />
                                            {currentEditingChapter.uploadProgress !== undefined && (
                                              <div className="mt-2">
                                                <div className="flex items-center justify-between text-sm mb-1">
                                                  <span>Đang tải lên...</span>
                                                  <span>{currentEditingChapter.uploadProgress}%</span>
                                                </div>
                                                <Progress
                                                  value={currentEditingChapter.uploadProgress}
                                                  className="w-full"
                                                />
                                              </div>
                                            )}
                                          </div>
                                        )}
                                        <div className="flex items-center gap-4">
                                          <input
                                            ref={editingVideoInputRef}
                                            type="file"
                                            accept="video/*"
                                            onChange={(e) => handleVideoUpload(e, false, chapter.id)}
                                            className="hidden"
                                          />
                                          <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => editingVideoInputRef.current?.click()}
                                          >
                                            <Upload className="mr-2 h-4 w-4" />
                                            {currentEditingChapter.videoFile || currentEditingChapter.videoUrl
                                              ? "Thay đổi video"
                                              : "Chọn video"}
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`edit-duration-${chapter.id}`}>Thời lượng (phút:giây)</Label>
                                      <Input
                                        id={`edit-duration-${chapter.id}`}
                                        value={currentEditingChapter.duration || ""}
                                        onChange={(e) =>
                                          setCurrentEditingChapter((prev) =>
                                            prev ? { ...prev, duration: e.target.value } : null,
                                          )
                                        }
                                        placeholder="15:30"
                                      />
                                    </div>
                                  </div>
                                )}

                                {currentEditingChapter.type === "article" && (
                                  <div className="space-y-4">
                                    <div className="space-y-2">
                                      <Label htmlFor={`edit-chapter-content-${chapter.id}`}>Nội dung bài viết</Label>
                                      <Textarea
                                        id={`edit-chapter-content-${chapter.id}`}
                                        value={currentEditingChapter.content}
                                        onChange={(e) =>
                                          setCurrentEditingChapter((prev) =>
                                            prev ? { ...prev, content: e.target.value } : null,
                                          )
                                        }
                                        placeholder="Nhập nội dung bài viết"
                                        rows={6}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`edit-read-time-${chapter.id}`}>Thời gian đọc (phút)</Label>
                                      <Input
                                        id={`edit-read-time-${chapter.id}`}
                                        value={currentEditingChapter.readTime || ""}
                                        onChange={(e) =>
                                          setCurrentEditingChapter((prev) =>
                                            prev ? { ...prev, readTime: e.target.value } : null,
                                          )
                                        }
                                        placeholder="10"
                                      />
                                    </div>
                                  </div>
                                )}

                                {currentEditingChapter.type === "quiz" && (
                                  <div className="space-y-4">
                                    <Label>Quiz câu hỏi</Label>
                                    <QuizBuilder
                                      quiz={currentEditingChapter.quiz || []}
                                      setQuiz={(quiz) =>
                                        setCurrentEditingChapter((prev) => (prev ? { ...prev, quiz } : null))
                                      }
                                    />
                                  </div>
                                )}

                                <div className="flex gap-2 justify-end">
                                  <Button variant="outline" onClick={cancelEditingChapter}>
                                    <X className="mr-2 h-4 w-4" /> Hủy
                                  </Button>
                                  <Button onClick={saveEditingChapter}>
                                    <Save className="mr-2 h-4 w-4" /> Lưu chương
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <h4 className="font-medium">
                                  Chương {index + 1}: {chapter.title}
                                </h4>
                                {chapter.type === "video" && chapter.videoUrl && (
                                  <div className="relative">
                                    <video
                                      src={chapter.videoUrl}
                                      controls
                                      className="w-full max-w-sm h-32 rounded border"
                                    />
                                  </div>
                                )}
                                {chapter.type === "article" && (
                                  <p className="text-sm text-muted-foreground line-clamp-3">{chapter.content}</p>
                                )}
                                {chapter.type === "quiz" && chapter.quiz && chapter.quiz.length > 0 && (
                                  <p className="text-sm text-muted-foreground">
                                    <BookOpen className="inline-block h-4 w-4 mr-1" /> {chapter.quiz.length} câu hỏi
                                  </p>
                                )}
                                <div className="text-sm text-muted-foreground">
                                  {chapter.type === "video"
                                    ? chapter.duration
                                    : chapter.type === "article"
                                      ? `${chapter.readTime} phút`
                                      : "Quiz"}
                                </div>
                              </>
                            )}
                          </div>
                          {editingChapterId !== chapter.id && (
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" onClick={() => startEditingChapter(chapter)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeChapter(chapter.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
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
          {/* Pricing Info Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Thông tin giá</CardTitle>
              {!isEditingPricing && (
                <Button variant="outline" size="sm" onClick={() => setIsEditingPricing(true)}>
                  <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                {isEditingPricing ? (
                  <div className="flex items-center space-x-2">
                    <Switch id="edit-is-free" checked={editIsFree} onCheckedChange={setEditIsFree} />
                    <Label htmlFor="edit-is-free">Khóa học miễn phí</Label>
                  </div>
                ) : course.isFree ? (
                  <span className="font-semibold text-green-600">Miễn phí</span>
                ) : (
                  <span className="font-semibold">{course.price.toLocaleString("vi-VN")} VNĐ</span>
                )}
              </div>

              {!editIsFree && isEditingPricing && (
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Giá khóa học (VNĐ)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    placeholder="0"
                  />
                </div>
              )}

              <div className="space-y-4">
                <p className="text-sm font-medium mb-2">Yêu cầu membership:</p>
                {isEditingPricing ? (
                  <div className="space-y-2">
                    {membershipOptions.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-membership-${option.id}`}
                          checked={editMembershipRequired.includes(option.id)}
                          onCheckedChange={(checked) => handleMembershipChange(option.id, checked as boolean)}
                        />
                        <Label htmlFor={`edit-membership-${option.id}`}>{option.label}</Label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex gap-2 flex-wrap">
                    {course.membershipRequired.length > 0 ? (
                      course.membershipRequired.map((membership) => (
                        <Badge key={membership} variant="outline">
                          {membershipOptions.find((opt) => opt.id === membership)?.label || membership}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="secondary">Không yêu cầu</Badge>
                    )}
                  </div>
                )}
              </div>
              {isEditingPricing && (
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={handleCancelPricing}>
                    <X className="mr-2 h-4 w-4" /> Hủy
                  </Button>
                  <Button onClick={handleSavePricing}>
                    <Save className="mr-2 h-4 w-4" /> Lưu
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Instructor Info Card (Read-only) */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin giảng viên</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={course.instructor.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{course.instructor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{course.instructor.name}</h3>
                  <p className="text-sm text-muted-foreground">{course.instructor.email}</p>
                  <p className="text-sm text-muted-foreground">{course.instructor.experience}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
