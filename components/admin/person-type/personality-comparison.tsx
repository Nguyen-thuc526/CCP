"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import {
  Heart,
  Users,
  BookOpen,
  Star,
  RefreshCw,
  Download,
  Calendar,
  CheckCircle,
  Sparkles,
  Info,
  Loader2,
  Search,
  Eye,
  Filter,
  ArrowRight,
  ArrowLeft,
} from "lucide-react"
import Image from "next/image"
import { useErrorLoadingWithUI } from "@/hooks/useErrorLoading"
import { useToast, ToastType } from "@/hooks/useToast"
import type { ResultPersonType } from "@/types/result-person-type"
import { comparePersonType } from "@/services/personTypeService"

interface PersonalityComparisonProps {
  initialPersonTypeId: string
}

export default function PersonalityComparison({ initialPersonTypeId }: PersonalityComparisonProps) {
  const { loading, error, startLoading, stopLoading, setErrorMessage, renderStatus } = useErrorLoadingWithUI()
  const { showToast } = useToast()

  // State for the actual data - now it's an array
  const [data, setData] = useState<ResultPersonType[]>([])
  const [filteredData, setFilteredData] = useState<ResultPersonType[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [currentPersonType, setCurrentPersonType] = useState<any>(null)

  // State for detail view
  const [viewMode, setViewMode] = useState<"list" | "detail">("list")
  const [selectedComparison, setSelectedComparison] = useState<ResultPersonType | null>(null)

  const loadData = async () => {
    startLoading()
    try {
      const result = await comparePersonType(initialPersonTypeId)
      setData(result)
      setFilteredData(result)

      // Set current person type from the first result
      if (result.length > 0) {
        setCurrentPersonType(result[0].personType)
      }

      showToast("Tải dữ liệu thành công!", ToastType.Success)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định"
      setErrorMessage(errorMessage)
      showToast("Không thể tải dữ liệu so sánh", ToastType.Error)
      console.error("Error loading personality comparison:", err)
    } finally {
      stopLoading()
    }
  }

  const handleRefresh = () => {
    showToast("Đang làm mới dữ liệu...", ToastType.Info)
    loadData()
  }

  const handleViewDetails = (comparison: ResultPersonType) => {
    setSelectedComparison(comparison)
    setViewMode("detail")
  }

  const handleBackToList = () => {
    setViewMode("list")
    setSelectedComparison(null)
  }

  const handleSaveResult = () => {
    if (selectedComparison) {
      showToast("Kết quả đã được lưu thành công!", ToastType.Success)
    } else {
      showToast("Không có dữ liệu để lưu", ToastType.Warning)
    }
  }

  // Filter and search functionality
  useEffect(() => {
    let filtered = data

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.personType2?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category?.name === selectedCategory)
    }

    setFilteredData(filtered)
  }, [data, searchTerm, selectedCategory])

  useEffect(() => {
    if (initialPersonTypeId) {
      loadData()
    }
  }, [initialPersonTypeId])

  const getCompatibilityLevel = (score: number) => {
    if (score >= 80) return { level: "Rất tốt", color: "text-green-600", bgColor: "bg-green-500" }
    if (score >= 60) return { level: "Tốt", color: "text-blue-600", bgColor: "bg-blue-500" }
    if (score >= 40) return { level: "Trung bình", color: "text-yellow-600", bgColor: "bg-yellow-500" }
    return { level: "Cần cải thiện", color: "text-red-600", bgColor: "bg-red-500" }
  }

  const categories = Array.from(new Set(data.map((item) => item.category?.name).filter(Boolean)))

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          <div className="text-center space-y-4">
            <Skeleton className="h-12 w-96 mx-auto" />
            <Skeleton className="h-6 w-64 mx-auto" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <Skeleton className="h-32 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // No data state
  if (!data.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto p-6 pt-20">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <Info className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Không tìm thấy dữ liệu</h3>
              <p className="text-gray-500 mb-6">Không thể tải thông tin so sánh tính cách</p>
              <Button onClick={loadData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Thử lại
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Detail View - when a specific comparison is selected
  if (viewMode === "detail" && selectedComparison) {
    const compatibility = getCompatibilityLevel(selectedComparison.compatibility)

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-6xl mx-auto p-6 space-y-8">
          {/* Back Button */}
          <Button onClick={handleBackToList} variant="outline" className="mb-4 bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>

          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-purple-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Phân Tích Tương Thích Tính Cách
              </h1>
            </div>
            <Badge variant="secondary" className="text-sm px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              {selectedComparison.category?.name || "Không xác định"}
            </Badge>
          </div>

          {/* Compatibility Overview */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Heart className="w-6 h-6 text-red-500" />
                Tổng Quan Tương Thích
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-8 items-center">
                {/* Person Type 1 */}
                <div className="text-center space-y-4">
                  <div className="relative w-28 h-28 mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse opacity-20"></div>
                    <Image
                      src={selectedComparison.personType?.image || "/placeholder.svg?height=112&width=112"}
                      alt={selectedComparison.personType?.name || "Person Type"}
                      width={112}
                      height={112}
                      className="rounded-full object-cover relative z-10 border-4 border-white shadow-lg"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {selectedComparison.personType?.name || "Không xác định"}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                      {selectedComparison.personType?.description || ""}
                    </p>
                  </div>
                </div>

                {/* Compatibility Score */}
                <div className="text-center space-y-6">
                  <div className="relative">
                    <div className="w-32 h-32 mx-auto relative">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          className="text-gray-200"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          strokeDashoffset={`${2 * Math.PI * 40 * (1 - selectedComparison.compatibility / 100)}`}
                          className={compatibility.color.replace("text-", "text-")}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-gray-800">{selectedComparison.compatibility}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Badge
                      variant="secondary"
                      className={`${compatibility.color} bg-opacity-10 border-current px-4 py-2`}
                    >
                      {compatibility.level}
                    </Badge>
                    <p className="text-sm text-gray-600">Độ Tương Thích</p>
                  </div>
                </div>

                {/* Person Type 2 */}
                <div className="text-center space-y-4">
                  <div className="relative w-28 h-28 mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse opacity-20"></div>
                    <Image
                      src={selectedComparison.personType2?.image || "/placeholder.svg?height=112&width=112"}
                      alt={selectedComparison.personType2?.name || "Person Type 2"}
                      width={112}
                      height={112}
                      className="rounded-full object-cover relative z-10 border-4 border-white shadow-lg"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {selectedComparison.personType2?.name || "Không xác định"}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                      {selectedComparison.personType2?.description || ""}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Analysis */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <Tabs defaultValue="type1" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="type1" className="flex items-center gap-2 py-3">
                  <BookOpen className="w-4 h-4" />
                  <span className="font-medium">{selectedComparison.personType?.name || "Loại 1"} - Chi Tiết</span>
                </TabsTrigger>
                <TabsTrigger value="type2" className="flex items-center gap-2 py-3">
                  <Star className="w-4 h-4" />
                  <span className="font-medium">{selectedComparison.personType2?.name || "Loại 2"} - Chi Tiết</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="type1" className="mt-0">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20">
                      <Image
                        src={selectedComparison.personType?.image || "/placeholder.svg?height=80&width=80"}
                        alt={selectedComparison.personType?.name || "Person Type"}
                        width={80}
                        height={80}
                        className="rounded-full object-cover border-4 border-white shadow-md"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-3xl text-gray-800">
                        {selectedComparison.personType?.name || "Không xác định"}
                      </CardTitle>
                      <CardDescription className="text-base text-gray-600 mt-2">
                        {selectedComparison.personType?.description || ""}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: selectedComparison.personType?.detail || "Không có thông tin chi tiết",
                    }}
                  />
                </CardContent>
              </TabsContent>
              <TabsContent value="type2" className="mt-0">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20">
                      <Image
                        src={selectedComparison.personType2?.image || "/placeholder.svg?height=80&width=80"}
                        alt={selectedComparison.personType2?.name || "Person Type 2"}
                        width={80}
                        height={80}
                        className="rounded-full object-cover border-4 border-white shadow-md"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-3xl text-gray-800">
                        {selectedComparison.personType2?.name || "Không xác định"}
                      </CardTitle>
                      <CardDescription className="text-base text-gray-600 mt-2">
                        {selectedComparison.personType2?.description || ""}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: selectedComparison.personType2?.detail || "Không có thông tin chi tiết",
                    }}
                  />
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Compatibility Details */}
          {(selectedComparison.description || selectedComparison.detail) && (
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Chi Tiết Tương Thích
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedComparison.description && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Mô tả:</h4>
                    <p className="text-gray-700 leading-relaxed">{selectedComparison.description}</p>
                  </div>
                )}
                {selectedComparison.detail && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Chi tiết:</h4>
                    <div
                      className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: selectedComparison.detail }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button onClick={handleBackToList} variant="outline" className="px-6 py-3 bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
            <Button
              onClick={handleSaveResult}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Lưu kết quả
            </Button>
          </div>

          {/* Metadata */}
          <Card className="bg-gray-50/80 backdrop-blur-sm border-0">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Info className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">ID Kết quả</p>
                    <p className="text-gray-600 text-xs font-mono">{selectedComparison.id.slice(-8)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Khảo sát</p>
                    <p className="text-gray-600">{selectedComparison.surveyId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Ngày tạo</p>
                    <p className="text-gray-600">{new Date(selectedComparison.createAt).toLocaleDateString("vi-VN")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Trạng thái</p>
                    <Badge variant={selectedComparison.status === 1 ? "default" : "secondary"} className="mt-1">
                      {selectedComparison.status === 1 ? "Hoạt động" : "Không hoạt động"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // List View - default view showing all comparisons
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              So Sánh Tính Cách MBTI
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Khám phá mức độ tương thích với các loại tính cách khác</p>
        </div>

        {/* Current Person Type Info */}
        {currentPersonType && (
          <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Loại Tính Cách Hiện Tại
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse opacity-20"></div>
                  <Image
                    src={currentPersonType.image || "/placeholder.svg?height=80&width=80&query=current-mbti"}
                    alt={currentPersonType.name || "Current Person Type"}
                    width={80}
                    height={80}
                    className="rounded-full object-cover relative z-10 border-4 border-white shadow-lg"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {currentPersonType.name || "Không xác định"}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">{currentPersonType.description || ""}</p>
                </div>
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  {data.length} so sánh
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filter */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm theo tên MBTI hoặc loại tương thích..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tất cả loại</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <Button onClick={handleRefresh} disabled={loading} variant="outline">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{data.length}</div>
              <div className="text-sm opacity-90">Tổng so sánh</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-4 text-center">
              <Heart className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{data.filter((item) => item.compatibility >= 80).length}</div>
              <div className="text-sm opacity-90">Tương thích cao</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-4 text-center">
              <Filter className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{categories.length}</div>
              <div className="text-sm opacity-90">Loại tương thích</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {data.length > 0
                  ? Math.round(data.reduce((sum, item) => sum + item.compatibility, 0) / data.length)
                  : 0}
                %
              </div>
              <div className="text-sm opacity-90">Tương thích TB</div>
            </CardContent>
          </Card>
        </div>

        {/* Comparison Cards */}
        {filteredData.length === 0 ? (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <Info className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Không tìm thấy kết quả</h3>
              <p className="text-gray-500 mb-6">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                }}
                variant="outline"
              >
                Xóa bộ lọc
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredData.map((comparison) => {
              const compatibility = getCompatibilityLevel(comparison.compatibility)

              return (
                <Card
                  key={comparison.id}
                  className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <CardContent className="p-6">
                    {/* Comparison Header */}
                    <div className="flex items-center justify-center mb-4">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium text-gray-600">
                          {currentPersonType?.name?.split(" - ")[0] || "Hiện tại"}
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <div className="text-sm font-medium text-gray-800">
                          {comparison.personType2?.name?.split(" - ")[0] || "Không xác định"}
                        </div>
                      </div>
                    </div>

                    {/* Target Person Type */}
                    <div className="text-center mb-4">
                      <div className="relative w-20 h-20 mx-auto mb-3">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse opacity-20"></div>
                        <Image
                          src={comparison.personType2?.image || "/placeholder.svg?height=80&width=80&query=target-mbti"}
                          alt={comparison.personType2?.name || "Target MBTI"}
                          width={80}
                          height={80}
                          className="rounded-full object-cover relative z-10 border-4 border-white shadow-lg"
                        />
                      </div>
                      <h3 className="font-bold text-lg text-gray-800 mb-1">
                        {comparison.personType2?.name?.split(" - ")[1] ||
                          comparison.personType2?.name ||
                          "Không xác định"}
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-2">{comparison.personType2?.description || ""}</p>
                    </div>

                    {/* Compatibility Score */}
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 mb-2">
                        <span className="text-xl font-bold text-gray-800">{comparison.compatibility}%</span>
                      </div>
                      <Badge variant="secondary" className={`${compatibility.color} bg-opacity-10 border-current`}>
                        {compatibility.level}
                      </Badge>
                    </div>

                    {/* Category and Description */}
                    <div className="mb-4">
                      <Badge variant="outline" className="mb-2 text-xs">
                        <Users className="w-3 h-3 mr-1" />
                        {comparison.category?.name || "Không xác định"}
                      </Badge>
                      {comparison.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">{comparison.description}</p>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(comparison.createAt).toLocaleDateString("vi-VN")}
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {comparison.status === 1 ? "Hoạt động" : "Không hoạt động"}
                      </div>
                    </div>

                    {/* View Details Button */}
                    <Button
                      onClick={() => handleViewDetails(comparison)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Xem Chi Tiết
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
