"use client"
import type { Certification } from "@/types/certification"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Calendar,
  Building,
  Edit,
  Save,
  X,
  Award,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Loader2,
} from "lucide-react"
import type { Category, SubCategory } from "@/types/category"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Checkbox } from "@/components/ui/checkbox"
import { categoryService } from "@/services/categoryService"
import { certificationService } from "@/services/certificationService"
import { useToast, ToastType } from "@/hooks/useToast"
import { CertificateStatus } from "@/utils/enum"

interface CategoryDetail {
  categoryId: string
  categoryName: string
  subCategories: SubCategory[]
}

/** Chỉ dùng trong state UI, mở rộng từ Certification */
type UICertification = Certification & {
  approvedDate?: string
  submittedDate?: string
  issuer?: string
}

interface CertificateDetailModalProps {
  open: boolean
  onClose: () => void
  certificate: Certification | null
  onUpdate?: (certificate: Certification) => void
}

interface ValidationErrors {
  name?: string
  description?: string
  categories?: string
}

export default function CertificateDetailModal({ open, onClose, certificate, onUpdate }: CertificateDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<UICertification | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([])
  const [openCategories, setOpenCategories] = useState<string[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    if (isEditing && categories.length === 0) {
      fetchCategories()
    }
  }, [isEditing])

  useEffect(() => {
    if (certificate && isEditing) {
      const subCategoryIds =
        (certificate.categories as any[])?.flatMap((cat: any) => cat.subCategories.map((sub: any) => sub.id)) || []
      setSelectedSubCategories(subCategoryIds)
      setEditData({
        ...(certificate as UICertification),
        categories: (certificate.categories as any[]) || [],
      })
    } else if (certificate && !isEditing) {
      setEditData(null)
      setSelectedSubCategories([])
      setOpenCategories([])
    }
  }, [certificate, isEditing])

  const fetchCategories = async () => {
    setIsLoadingCategories(true)
    try {
      const response = await categoryService.getActiveCategoriesWithSub()
      if (response.success) {
        setCategories(response.data)
      } else {
        showToast("Lỗi khi tải danh mục.", ToastType.Error)
      }
    } catch (error: any) {
      showToast(error.message || "Không thể tải danh mục.", ToastType.Error)
    } finally {
      setIsLoadingCategories(false)
    }
  }

  const isApproved = (() => {
    const s = certificate?.status
    if (typeof s === "string") return s === "approved"
    if (typeof s === "number") return s === CertificateStatus.Active
    return false
  })()

  const handleSubCategoryToggle = (subCategoryId: string) => {
    setSelectedSubCategories((prev) => {
      const newSelection = prev.includes(subCategoryId)
        ? prev.filter((id) => id !== subCategoryId)
        : [...prev, subCategoryId]

      if (editData) {
        const updatedCategories = categories
          .map((cat) => ({
            categoryId: cat.id,
            categoryName: cat.name,
            subCategories: cat.subCategories
              .filter((sub) => newSelection.includes(sub.id))
              .map((sub) => ({
                id: sub.id,
                name: sub.name,
                status: sub.status,
              })),
          }))
          .filter((cat) => cat.subCategories.length > 0)
        setEditData({ ...editData, categories: updatedCategories as any })
      }

      if (hasAttemptedSubmit) {
        const error = validateField("categories", newSelection)
        setValidationErrors((prev) => ({ ...prev, categories: error }))
      }

      return newSelection
    })
  }

  const removeSubCategory = (subCategoryId: string) => {
    handleSubCategoryToggle(subCategoryId)
  }

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const getSubCategoryInfo = (subCategoryId: string) => {
    for (const category of categories) {
      const subCategory = category.subCategories?.find((sub) => sub.id === subCategoryId)
      if (subCategory) {
        return { name: subCategory.name, categoryName: category.name }
      }
    }
    return { name: "", categoryName: "" }
  }

  if (!certificate) return null

  const handleEdit = () => {
    setEditData({ ...(certificate as UICertification) })
    setIsEditing(true)
    setSelectedSubCategories(
      ((certificate.categories as any[]) || []).flatMap((cat: any) => cat.subCategories.map((sub: any) => sub.id)),
    )
    setOpenCategories([])
  }

  const handleSave = async () => {
    if (!editData || !onUpdate) return

    setHasAttemptedSubmit(true)
    if (!validateForm()) {
      showToast("Vui lòng kiểm tra và sửa các lỗi trong form", ToastType.Error)
      return
    }

    setIsSaving(true)
    try {
      const updateData = {
        certificationId: editData.id,
        name: editData.name,
        description: editData.description,
        image: editData.image,
        subCategoryIds: selectedSubCategories,
      }

      const response = await certificationService.updateCertification(updateData)
      if (response.success) {
        const updatedCertificate: Certification = {
          ...certificate!, // giữ các field bắt buộc gốc (vd: rejectReason, time, counselor, ...)
          ...editData, // ghi đè tên/mô tả/ảnh
          categories: categories
            .map((cat) => ({
              categoryId: cat.id,
              categoryName: cat.name,
              subCategories: cat.subCategories
                .filter((sub) => selectedSubCategories.includes(sub.id))
                .map((sub) => ({ id: sub.id, name: sub.name, status: sub.status })),
            }))
            .filter((cat) => cat.subCategories.length > 0),
        } as unknown as Certification

        onUpdate(updatedCertificate)
        showToast("Cập nhật chứng chỉ thành công!", ToastType.Success)
        setIsEditing(false)
        setEditData(null)
        setSelectedSubCategories([])
        setOpenCategories([])
        setValidationErrors({})
        setHasAttemptedSubmit(false)
      } else {
        showToast(response.error || "Lỗi khi cập nhật chứng chỉ.", ToastType.Error)
      }
    } catch (error: any) {
      showToast(error.message || "Không thể cập nhật chứng chỉ.", ToastType.Error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData(null)
    setSelectedSubCategories([])
    setOpenCategories([])
    setValidationErrors({})
    setHasAttemptedSubmit(false)
  }

  const handleChange = (field: keyof UICertification, value: string) => {
    if (editData) {
      setEditData({ ...editData, [field]: value } as UICertification)
      if (hasAttemptedSubmit) {
        const error = validateField(field as keyof ValidationErrors, value)
        setValidationErrors((prev) => ({ ...prev, [field]: error }))
      }
    }
  }

  const validateField = (field: keyof ValidationErrors, value: any): string | undefined => {
    switch (field) {
      case "name":
        if (!value || value.trim().length === 0) {
          return "Tên chứng chỉ là bắt buộc"
        }
        if (value.trim().length < 3) {
          return "Tên chứng chỉ phải có ít nhất 3 ký tự"
        }
        if (value.trim().length > 100) {
          return "Tên chứng chỉ không được vượt quá 100 ký tự"
        }
        break
      case "description":
        if (!value || value.trim().length === 0) {
          return "Mô tả là bắt buộc"
        }
        if (value.trim().length < 10) {
          return "Mô tả phải có ít nhất 10 ký tự"
        }
        if (value.trim().length > 5000) {
          return "Mô tả không được vượt quá 5000 ký tự"
        }
        break
      case "categories":
        if (!selectedSubCategories || selectedSubCategories.length === 0) {
          return "Vui lòng chọn ít nhất một danh mục"
        }
        break
    }
    return undefined
  }

  const validateForm = (): boolean => {
    if (!editData) return false

    const errors: ValidationErrors = {}
    errors.name = validateField("name", editData.name)
    errors.description = validateField("description", editData.description)
    errors.categories = validateField("categories", selectedSubCategories)

    setValidationErrors(errors)
    return !Object.values(errors).some((error) => error !== undefined)
  }

  const handleFieldBlur = (field: keyof ValidationErrors, value: any) => {
    if (hasAttemptedSubmit) {
      const error = validateField(field, value)
      setValidationErrors((prev) => ({ ...prev, [field]: error }))
    }
  }

  const getStatusBadge = (status?: string | number) => {
    const statusNum =
      typeof status === "string"
        ? status === "approved"
          ? CertificateStatus.Active
          : CertificateStatus.Pending
        : status
    switch (statusNum) {
      case CertificateStatus.Active:
        return { label: "Đã duyệt", variant: "default" as const, icon: Award, color: "text-green-600" }
      case CertificateStatus.Pending:
        return { label: "Chờ xử lý", variant: "secondary" as const, icon: AlertCircle, color: "text-yellow-600" }
      default:
        return { label: "Không xác định", variant: "outline" as const, icon: Clock, color: "text-gray-600" }
    }
  }

  const statusInfo = getStatusBadge(certificate.status as any)
  const StatusIcon = statusInfo.icon
  const currentData = isEditing ? editData! : (certificate as UICertification)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StatusIcon className="w-5 h-5" />
              <DialogTitle className="text-xl">Chi tiết chứng chỉ</DialogTitle>
            </div>
            <Badge variant={statusInfo.variant} className="flex items-center gap-1">
              <StatusIcon className="w-3 h-3" />
              {statusInfo.label}
            </Badge>
          </div>
          <DialogDescription>
            {isApproved
              ? "Thông tin chi tiết về chứng chỉ đã được phê duyệt"
              : "Thông tin chi tiết về chứng chỉ đang chờ xét duyệt"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Certificate Image */}
          <div className="space-y-2">
            <Label>Hình ảnh chứng chỉ</Label>
            <div className="border rounded-lg overflow-hidden">
              <img
                src={currentData.image || "/placeholder.svg"}
                alt={currentData.name}
                className="w-full h-64 object-cover"
              />
            </div>
          </div>

          {/* Certificate Name */}
          <div className="space-y-2">
            <Label htmlFor="cert-name">Tên chứng chỉ</Label>
            {isEditing ? (
              <div className="space-y-1">
                <div className="relative">
                  <Input
                    id="cert-name"
                    value={currentData.name || ""}
                    onChange={(e) => handleChange("name", e.target.value)}
                    onBlur={(e) => handleFieldBlur("name", e.target.value)}
                    className={validationErrors.name ? "border-red-500 focus:border-red-500" : ""}
                    placeholder="Nhập tên chứng chỉ..."
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                    {(currentData.name || "").length}/100
                  </div>
                </div>
                {validationErrors.name && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {validationErrors.name}
                  </p>
                )}
              </div>
            ) : (
              <div className="p-3 bg-gray-50 rounded-md">
                <h3 className="font-semibold text-lg">{currentData.name}</h3>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="cert-description">Mô tả</Label>
            {isEditing ? (
              <div className="space-y-1">
                <div className="relative">
                  <Textarea
                    id="cert-description"
                    value={currentData.description || ""}
                    onChange={(e) => handleChange("description", e.target.value)}
                    onBlur={(e) => handleFieldBlur("description", e.target.value)}
                    className={validationErrors.description ? "border-red-500 focus:border-red-500" : ""}
                    rows={4}
                    placeholder="Nhập mô tả chứng chỉ..."
                  />
                  <div className="absolute right-3 bottom-3 text-xs text-gray-400">
                    {(currentData.description || "").length}/500
                  </div>
                </div>
                {validationErrors.description && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {validationErrors.description}
                  </p>
                )}
              </div>
            ) : (
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-700">{currentData.description}</p>
              </div>
            )}
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <Label>Danh mục</Label>
            {isEditing ? (
              <div className="space-y-3">
                <div
                  className={`border rounded-lg p-4 bg-gray-50 max-h-60 overflow-y-auto ${validationErrors.categories ? "border-red-500" : ""}`}
                >
                  {isLoadingCategories ? (
                    <div className="text-center py-4">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                      <p className="text-sm text-muted-foreground">Đang tải danh mục...</p>
                    </div>
                  ) : categories.length > 0 ? (
                    categories.map((category) => (
                      <div key={category.id} className="mb-3 last:mb-0">
                        <Collapsible
                          open={openCategories.includes(category.id)}
                          onOpenChange={() => toggleCategory(category.id)}
                        >
                          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-left bg-white border rounded-md hover:bg-gray-50 transition-colors">
                            <span className="font-medium">{category.name}</span>
                            <div className="flex items-center gap-2">
                              {category.subCategories?.length > 0 && (
                                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                                  {category.subCategories.length} mục con
                                </span>
                              )}
                              {category.subCategories?.length > 0 &&
                                (openCategories.includes(category.id) ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                ))}
                            </div>
                          </CollapsibleTrigger>
                          {category.subCategories?.length > 0 && (
                            <CollapsibleContent className="mt-2 ml-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                {category.subCategories.map((subCategory) => (
                                  <div key={subCategory.id} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`edit-${subCategory.id}`}
                                      checked={selectedSubCategories.includes(subCategory.id)}
                                      onCheckedChange={() => handleSubCategoryToggle(subCategory.id)}
                                    />
                                    <Label
                                      htmlFor={`edit-${subCategory.id}`}
                                      className="text-sm font-normal cursor-pointer"
                                    >
                                      {subCategory.name}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </CollapsibleContent>
                          )}
                        </Collapsible>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-4 text-muted-foreground">Không có danh mục nào.</p>
                  )}
                </div>

                {validationErrors.categories && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {validationErrors.categories}
                  </p>
                )}

                {selectedSubCategories.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">
                      Danh mục đã chọn ({selectedSubCategories.length}):
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedSubCategories.map((subCategoryId) => {
                        const info = getSubCategoryInfo(subCategoryId)
                        return info.name ? (
                          <Badge key={subCategoryId} variant="secondary" className="flex items-center gap-1">
                            <span className="text-xs text-gray-600">{info.categoryName}:</span>
                            <span>{info.name}</span>
                            <X
                              className="w-3 h-3 cursor-pointer hover:text-red-500"
                              onClick={() => removeSubCategory(subCategoryId)}
                            />
                          </Badge>
                        ) : null
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {(currentData.categories as any[]) && (currentData.categories as any[]).length > 0 ? (
                  (currentData.categories as any[]).map((category: any, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center gap-1">
                        <Badge
                          variant="default"
                          className="text-sm font-medium bg-primary/10 text-primary border-primary/20"
                        >
                          {category.categoryName}
                        </Badge>
                      </div>
                      {category.subCategories && category.subCategories.length > 0 && (
                        <div className="flex flex-wrap gap-2 ml-4">
                          {category.subCategories.map((sub: any, subIndex: number) => (
                            <div key={subIndex} className="flex items-center gap-1">
                              <ChevronRight className="w-3 h-3 text-muted-foreground" />
                              <Badge variant="secondary" className="text-sm bg-muted/50 text-muted-foreground">
                                {sub.name}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Không có danh mục</p>
                )}
              </div>
            )}
          </div>

          <Separator />

          {/* Certificate Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(certificate as any).issuer && (
              <div className="flex items-center gap-2 text-sm">
                <Building className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Cơ quan cấp:</span>
                <span className="font-medium">{(certificate as any).issuer}</span>
              </div>
            )}

            {(certificate as any).approvedDate && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Ngày duyệt:</span>
                <span className="font-medium">
                  {new Date((certificate as any).approvedDate).toLocaleDateString("vi-VN")}
                </span>
              </div>
            )}

            {(certificate as any).submittedDate && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Ngày nộp:</span>
                <span className="font-medium">
                  {new Date((certificate as any).submittedDate).toLocaleDateString("vi-VN")}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" size="sm" onClick={handleCancel} disabled={isSaving}>
                    <X className="w-4 h-4 mr-2" />
                    Hủy
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Lưu
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  <Edit className="w-4 h-4 mr-2" />
                  Chỉnh sửa
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
