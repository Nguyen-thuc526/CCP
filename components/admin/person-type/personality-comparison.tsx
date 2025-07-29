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
  Info,
  Loader2,
  Search,
  Eye,
  Filter,
  ArrowRight,
  ArrowLeft,
  Edit,
} from "lucide-react"
import Image from "next/image"
import { useErrorLoadingWithUI } from "@/hooks/useErrorLoading"
import { useToast, ToastType } from "@/hooks/useToast"
import type { ResultPersonType } from "@/types/result-person-type"
import { comparePersonType, updateResultPersonType } from "@/services/personTypeService"
import { UpdatePersonTypePayload } from "@/types/result-person-type"
import EditResultPersonTypeModal from "./edit-result-person-type"

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

  const [editingComparison, setEditingComparison] = useState<ResultPersonType | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [formValues, setFormValues] = useState<UpdatePersonTypePayload>({
    id: '',
    description: '',
    detail: '',
    image: '',
    categoryId: '',
    compatibility: 0,
  })
  // State for detail view
  const [viewMode, setViewMode] = useState<"list" | "detail">("list")
  const [selectedComparison, setSelectedComparison] = useState<ResultPersonType | null>(null)
  const handleEdit = (comparison: ResultPersonType) => {
    setEditingComparison(comparison);
    setFormValues({
      id: comparison.id,
      description: comparison.description || '',
      detail: comparison.detail || '',
      image: comparison.personType2?.image || '',
      categoryId: comparison.categoryId || '',
      compatibility: comparison.compatibility || 0
    });
    setIsEditModalOpen(true);
  };

  const handleModalSubmit = async (data: UpdatePersonTypePayload) => {
    setIsSaving(true);
    try {
      await updateResultPersonType(data);
      setIsEditModalOpen(false);

      await loadData();

      showToast("Cập nhật thành công", ToastType.Success);
    } catch (err) {
      console.error("Error updating:", err);
      showToast("Cập nhật thất bại", ToastType.Error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFormChange = (field: keyof UpdatePersonTypePayload, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };
  const loadData = async () => {
    startLoading()
    try {
      const result = await comparePersonType(initialPersonTypeId)
      setData(Array.isArray(result) ? result : [result])
      setFilteredData(Array.isArray(result) ? result : [result])
      // Set current person type from the first result
      if ((Array.isArray(result) ? result : [result]).length > 0) {
        setCurrentPersonType((Array.isArray(result) ? result : [result])[0].personType)
      }
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
    if (score >= 80) return { level: "Rất tốt", color: "text-green-700", bgColor: "bg-green-50 border-green-200" }
    if (score >= 60) return { level: "Tốt", color: "text-blue-700", bgColor: "bg-blue-50 border-blue-200" }
    if (score >= 40) return { level: "Trung bình", color: "text-yellow-700", bgColor: "bg-yellow-50 border-yellow-200" }
    return { level: "Cần cải thiện", color: "text-red-700", bgColor: "bg-red-50 border-red-200" }
  }

  const categories = Array.from(new Set(data.map((item) => item.category?.name).filter(Boolean)))

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-96" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="border border-gray-200">
                <CardContent className="p-6">
                  <Skeleton className="h-24 w-full mb-4" />
                  <Skeleton className="h-8 w-full" />
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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-6 pt-20">
          <Card className="border border-gray-200">
            <CardContent className="text-center py-12">
              <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy dữ liệu</h3>
              <p className="text-gray-600 mb-6">Không thể tải thông tin so sánh tính cách</p>
              <Button onClick={loadData} variant="outline">
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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          {/* Back Button */}
          <Button onClick={handleBackToList} variant="outline" className="mb-4 bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>

          {/* Header */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">Phân Tích Tương Thích Tính Cách</h1>
            </div>
            <Badge variant="secondary" className="text-sm">
              <Users className="w-4 h-4 mr-2" />
              {selectedComparison.category?.name || "Không xác định"}
            </Badge>
          </div>

          {/* Compatibility Overview */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Heart className="w-5 h-5 text-gray-700" />
                Tổng Quan Tương Thích
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-8 items-center">
                {/* Person Type 1 */}
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 mx-auto">
                    <Image
                      src={selectedComparison.personType?.image || "/placeholder.svg?height=96&width=96"}
                      alt={selectedComparison.personType?.name || "Person Type"}
                      width={96}
                      height={96}
                      className="rounded-full object-cover border-2 border-gray-200"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {selectedComparison.personType?.name || "Không xác định"}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">{selectedComparison.personType?.description || ""}</p>
                  </div>
                </div>

                {/* Compatibility Score */}
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{selectedComparison.compatibility}%</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Badge variant="secondary" className={`${compatibility.bgColor} ${compatibility.color} border`}>
                      {compatibility.level}
                    </Badge>
                    <p className="text-sm text-gray-600">Độ Tương Thích</p>
                  </div>
                </div>

                {/* Person Type 2 */}
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 mx-auto">
                    <Image
                      src={selectedComparison.personType2?.image || "/placeholder.svg?height=96&width=96"}
                      alt={selectedComparison.personType2?.name || "Person Type 2"}
                      width={96}
                      height={96}
                      className="rounded-full object-cover border-2 border-gray-200"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {selectedComparison.personType2?.name || "Không xác định"}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">{selectedComparison.personType2?.description || ""}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Analysis */}
          <Card className="border border-gray-200">
            <Tabs defaultValue="type1" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="type1" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>{selectedComparison.personType?.name || "Loại 1"} - Chi Tiết</span>
                </TabsTrigger>
                <TabsTrigger value="type2" className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  <span>{selectedComparison.personType2?.name || "Loại 2"} - Chi Tiết</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="type1" className="mt-0">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16">
                      <Image
                        src={selectedComparison.personType?.image || "/placeholder.svg?height=64&width=64"}
                        alt={selectedComparison.personType?.name || "Person Type"}
                        width={64}
                        height={64}
                        className="rounded-full object-cover border-2 border-gray-200"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-900">
                        {selectedComparison.personType?.name || "Không xác định"}
                      </CardTitle>
                      <CardDescription className="text-gray-600 mt-1">
                        {selectedComparison.personType?.description || ""}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{
                      __html: selectedComparison.personType?.detail || "Không có thông tin chi tiết",
                    }}
                  />
                </CardContent>
              </TabsContent>

              <TabsContent value="type2" className="mt-0">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16">
                      <Image
                        src={selectedComparison.personType2?.image || "/placeholder.svg?height=64&width=64"}
                        alt={selectedComparison.personType2?.name || "Person Type 2"}
                        width={64}
                        height={64}
                        className="rounded-full object-cover border-2 border-gray-200"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-900">
                        {selectedComparison.personType2?.name || "Không xác định"}
                      </CardTitle>
                      <CardDescription className="text-gray-600 mt-1">
                        {selectedComparison.personType2?.description || ""}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose max-w-none text-gray-700"
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
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-gray-700" />
                  Chi Tiết Tương Thích
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedComparison.description && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Mô tả:</h4>
                    <p className="text-gray-700">{selectedComparison.description}</p>
                  </div>
                )}
                {selectedComparison.detail && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Chi tiết:</h4>
                    <div
                      className="prose max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{ __html: selectedComparison.detail }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button onClick={handleBackToList} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
            <Button onClick={handleSaveResult}>
              <Download className="w-4 h-4 mr-2" />
              Lưu kết quả
            </Button>
          </div>

          {/* Metadata */}
          <Card className="bg-gray-50 border border-gray-200">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <Info className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">ID Kết quả</p>
                    <p className="text-gray-600 text-xs font-mono">{selectedComparison.id.slice(-8)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Khảo sát</p>
                    <p className="text-gray-600">{selectedComparison.surveyId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Ngày tạo</p>
                    <p className="text-gray-600">{new Date(selectedComparison.createAt).toLocaleDateString("vi-VN")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Trạng thái</p>
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">So Sánh Tính Cách MBTI</h1>
          </div>
          <p className="text-gray-600">Khám phá mức độ tương thích với các loại tính cách khác</p>
        </div>

        {/* Current Person Type Info */}
        {currentPersonType && (
          <Card className="border border-gray-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Loại Tính Cách Hiện Tại
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16">
                  <Image
                    src={currentPersonType.image || "/placeholder.svg?height=64&width=64&query=current-mbti"}
                    alt={currentPersonType.name || "Current Person Type"}
                    width={64}
                    height={64}
                    className="rounded-full object-cover border-2 border-gray-200"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {currentPersonType.name || "Không xác định"}
                  </h2>
                  <p className="text-gray-700">{currentPersonType.description || ""}</p>
                </div>
                <Badge variant="secondary" className="text-sm">
                  {data.length} so sánh
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filter */}
        <Card className="border border-gray-200">
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
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border border-gray-200">
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-gray-600" />
              <div className="text-xl font-bold text-gray-900">{data.length}</div>
              <div className="text-sm text-gray-600">Tổng so sánh</div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="p-4 text-center">
              <Heart className="w-6 h-6 mx-auto mb-2 text-gray-600" />
              <div className="text-xl font-bold text-gray-900">
                {data.filter((item) => item.compatibility >= 80).length}
              </div>
              <div className="text-sm text-gray-600">Tương thích cao</div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="p-4 text-center">
              <Filter className="w-6 h-6 mx-auto mb-2 text-gray-600" />
              <div className="text-xl font-bold text-gray-900">{categories.length}</div>
              <div className="text-sm text-gray-600">Loại tương thích</div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-6 h-6 mx-auto mb-2 text-gray-600" />
              <div className="text-xl font-bold text-gray-900">
                {data.length > 0
                  ? Math.round(data.reduce((sum, item) => sum + item.compatibility, 0) / data.length)
                  : 0}
                %
              </div>
              <div className="text-sm text-gray-600">Tương thích TB</div>
            </CardContent>
          </Card>
        </div>

        {/* Comparison Cards */}
        {filteredData.length === 0 ? (
          <Card className="border border-gray-200">
            <CardContent className="text-center py-12">
              <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy kết quả</h3>
              <p className="text-gray-600 mb-6">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredData.map((comparison) => {
              const compatibility = getCompatibilityLevel(comparison.compatibility)
              return (
                <Card
                  key={comparison.id}
                  className="border border-gray-200 hover:shadow-md transition-shadow duration-200"
                >
                  <CardContent className="p-6">
                    {/* Comparison Header */}
                    <div className="flex items-center justify-center mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{currentPersonType?.name?.split(" - ")[0] || "Hiện tại"}</span>
                        <ArrowRight className="w-4 h-4" />
                        <span className="font-medium text-gray-900">
                          {comparison.personType2?.name?.split(" - ")[0] || "Không xác định"}
                        </span>
                      </div>
                    </div>

                    {/* Target Person Type */}
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 mx-auto mb-3">
                        <Image
                          src={comparison.personType2?.image || "/placeholder.svg?height=64&width=64&query=target-mbti"}
                          alt={comparison.personType2?.name || "Target MBTI"}
                          width={64}
                          height={64}
                          className="rounded-full object-cover border-2 border-gray-200"
                        />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {comparison.personType2?.name?.split(" - ")[1] ||
                          comparison.personType2?.name ||
                          "Không xác định"}
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-2">{comparison.personType2?.description || ""}</p>
                    </div>

                    {/* Compatibility Score */}
                    <div className="text-center mb-4 space-x-2">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 border border-gray-200 mb-2">
                        <span className="text-lg font-bold text-gray-900">{comparison.compatibility}%</span>
                      </div>
                      <Badge variant="secondary" className={`${compatibility.bgColor} ${compatibility.color} border`}>
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
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        onClick={() => handleViewDetails(comparison)}
                        className="w-full sm:w-1/2"
                        variant="outline"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Xem Chi Tiết
                      </Button>
                      <Button
                        onClick={() => handleEdit(comparison)}
                        className="w-full sm:w-1/2"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Chỉnh Sửa
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
      <EditResultPersonTypeModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleModalSubmit}
        isSaving={isSaving}
        formValues={formValues}
        onChange={handleFormChange}
      />
    </div>

  )
}
