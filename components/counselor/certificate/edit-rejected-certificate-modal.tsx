"use client"

import type React from "react"
import type { Category } from "@/types/category"
import { useRef, useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Edit, Loader2, X, ChevronDown, ChevronRight, CheckCircle, Clock, AlertTriangle } from "lucide-react"
import { useUploadImage } from "@/hooks/upload-image"
import { categoryService } from "@/services/categoryService"
import { certificationService } from "@/services/certificationService"
import { useToast, ToastType } from "@/hooks/useToast"
import type { Certification } from "@/types/certification"

interface EditRejectedCertificateModalProps {
  open: boolean
  onClose: () => void
  certificate: Certification
  onSuccess: () => void
}

interface ValidationErrors {
  name?: string
  categories?: string
  image?: string
  description?: string
}

const VALIDATION_RULES = {
  name: {
    minLength: 3,
    maxLength: 100,
  },
  description: {
    minLength: 10,
    maxLength: 5000,
  },
  image: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  },
}

export default function EditRejectedCertificateModal({
  open,
  onClose,
  certificate,
  onSuccess,
}: EditRejectedCertificateModalProps) {
  const { uploadImage, loading } = useUploadImage()
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([])
  const [openCategories, setOpenCategories] = useState<string[]>([])
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    image: "",
  })
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const fileInputRef = useRef<HTMLInputElement>(null)
  const { showToast } = useToast()

  const validateField = (field: string, value: any): string | undefined => {
    switch (field) {
      case "name":
        if (!value || value.trim().length === 0) {
          return "Tên chứng chỉ là bắt buộc"
        }
        if (value.trim().length < VALIDATION_RULES.name.minLength) {
          return `Tên chứng chỉ phải có ít nhất ${VALIDATION_RULES.name.minLength} ký tự`
        }
        if (value.trim().length > VALIDATION_RULES.name.maxLength) {
          return `Tên chứng chỉ không được vượt quá ${VALIDATION_RULES.name.maxLength} ký tự`
        }
        break

      case "categories":
        if (!selectedSubCategories || selectedSubCategories.length === 0) {
          return "Vui lòng chọn ít nhất một danh mục"
        }
        break

      case "image":
        if (!value || value.trim().length === 0) {
          return "Ảnh chứng chỉ là bắt buộc"
        }
        break

      case "description":
        if (!value || value.trim().length === 0) {
          return "Mô tả là bắt buộc"
        }
        if (value.trim().length < VALIDATION_RULES.description.minLength) {
          return `Mô tả phải có ít nhất ${VALIDATION_RULES.description.minLength} ký tự`
        }
        if (value.trim().length > VALIDATION_RULES.description.maxLength) {
          return `Mô tả không được vượt quá ${VALIDATION_RULES.description.maxLength} ký tự`
        }
        break

      default:
        return undefined
    }
    return undefined
  }

  const validateFile = (file: File): string | undefined => {
    if (!VALIDATION_RULES.image.allowedTypes.includes(file.type)) {
      return "Chỉ chấp nhận file ảnh định dạng JPG, PNG, WEBP"
    }
    if (file.size > VALIDATION_RULES.image.maxSize) {
      return "Kích thước file không được vượt quá 5MB"
    }
    return undefined
  }

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}

    newErrors.name = validateField("name", formData.name)
    newErrors.categories = validateField("categories", selectedSubCategories)
    newErrors.image = validateField("image", formData.image)
    newErrors.description = validateField("description", formData.description)

    setErrors(newErrors)

    return !Object.values(newErrors).some((error) => error !== undefined)
  }

  const handleFieldBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))

    const error =
      field === "categories"
        ? validateField("categories", selectedSubCategories)
        : validateField(field, formData[field as keyof typeof formData])

    setErrors((prev) => ({ ...prev, [field]: error }))
  }

  useEffect(() => {
    if (open && certificate) {
      // Pre-fill form with certificate data
      setFormData({
        id: certificate.id,
        name: certificate.name || "",
        description: certificate.description || "",
        image: certificate.image || "",
      })

      // Convert subCategories from categories to IDs when opening
      const subCategoryIds = certificate.categories?.flatMap((cat) => cat.subCategories.map((sub) => sub.id)) || []
      setSelectedSubCategories(subCategoryIds)

      setErrors({})
      setTouched({})

      fetchCategories()
    }
  }, [open, certificate])

  useEffect(() => {
    if (touched.categories) {
      const error = validateField("categories", selectedSubCategories)
      setErrors((prev) => ({ ...prev, categories: error }))
    }
  }, [selectedSubCategories, touched.categories])

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const fileError = validateFile(file)
      if (fileError) {
        setErrors((prev) => ({ ...prev, image: fileError }))
        showToast(fileError, ToastType.Error)
        return
      }

      // Clear image error if file is valid
      setErrors((prev) => ({ ...prev, image: undefined }))

      uploadImage({
        file,
        onSuccess: (url) => {
          setFormData((prev) => ({ ...prev, image: url }))
          setErrors((prev) => ({ ...prev, image: undefined }))
        },
        onError: (err) => {
          setErrors((prev) => ({ ...prev, image: "Upload ảnh thất bại" }))
          showToast("Upload ảnh thất bại: " + err, ToastType.Error)
        },
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))

    if (touched[id]) {
      const error = validateField(id, value)
      setErrors((prev) => ({ ...prev, [id]: error }))
    }
  }

  const handleSubCategoryToggle = (subCategoryId: string) => {
    setSelectedSubCategories((prev) => {
      const newSelection = prev.includes(subCategoryId)
        ? prev.filter((id) => id !== subCategoryId)
        : [...prev, subCategoryId]

      return newSelection
    })
  }

  const removeSubCategory = (subCategoryId: string) => {
    setSelectedSubCategories((prev) => prev.filter((id) => id !== subCategoryId))
  }

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId)
      } else {
        return [...prev, categoryId]
      }
    })
  }

  const getSubCategoryInfo = (subCategoryId: string) => {
    for (const category of categories) {
      const subCategory = category.subCategories?.find((sub) => sub.id === subCategoryId)
      if (subCategory) {
        return {
          name: subCategory.name,
          categoryName: category.name,
        }
      }
    }
    return { name: "", categoryName: "" }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setTouched({
      name: true,
      categories: true,
      image: true,
      description: true,
    })

    if (!validateForm()) {
      showToast("Vui lòng kiểm tra và sửa các lỗi trong form", ToastType.Error)
      return
    }

    setIsSubmitting(true)

    try {
      const submittedData = {
        id: formData.id,
        name: formData.name.trim(),
        description: formData.description.trim(),
        image: formData.image,
        subCategoryIds: selectedSubCategories, // Send only subCategory IDs
      }

      const response = await certificationService.updateCertification(submittedData as any)
      if (response.success) {
        setIsSubmitted(true)
        showToast("Chỉnh sửa và gửi lại chứng chỉ thành công!", ToastType.Success)
        setTimeout(() => {
          resetForm()
          onSuccess()
        }, 2000)
      } else {
        showToast(response.message || "Chỉnh sửa chứng chỉ thất bại.", ToastType.Error)
      }
    } catch (error: any) {
      showToast(error.message || "Không thể chỉnh sửa chứng chỉ.", ToastType.Error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      description: "",
      image: "",
    })
    setSelectedSubCategories([])
    setOpenCategories([])
    setIsSubmitted(false)
    setErrors({})
    setTouched({})
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm()
      onClose()
    }
  }

  if (!certificate) return null

  // Success screen
  if (isSubmitted) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center space-y-4 py-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Chỉnh sửa thành công!</h3>
              <p className="text-sm text-gray-600">
                Chứng chỉ "{formData.name}" đã được chỉnh sửa và gửi lại để xét duyệt.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-center gap-2 text-blue-700">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">Đang chờ xét duyệt lại</span>
              </div>
              <p className="text-xs text-blue-600 mt-1">Chúng tôi sẽ xem xét lại trong vòng 24-48 giờ</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Chỉnh sửa chứng chỉ bị từ chối
          </DialogTitle>
          <DialogDescription>Chỉnh sửa thông tin chứng chỉ theo yêu cầu và gửi lại để xét duyệt.</DialogDescription>
        </DialogHeader>

        {/* Rejection Reason Display */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-red-900">Lý do từ chối:</h4>
              <p className="text-sm text-red-700">{certificate.rejectReason}</p>

              {certificate.rejectionDetails && certificate.rejectionDetails.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-medium text-red-800 mb-1">Chi tiết cần chỉnh sửa:</p>
                  <ul className="text-xs text-red-700 space-y-1">
                    {certificate.rejectionDetails.map((detail: string, index: number) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-red-500 mt-1">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">
              Tên chứng chỉ <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={() => handleFieldBlur("name")}
              className={errors.name ? "border-red-500 focus:border-red-500" : ""}
              placeholder="Nhập tên chứng chỉ (3-100 ký tự)"
            />
            {errors.name && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {errors.name}
              </p>
            )}
            <p className="text-xs text-gray-500">
              {formData.name.length}/{VALIDATION_RULES.name.maxLength} ký tự
            </p>
          </div>

          <div className="space-y-3">
            <Label>
              Chọn danh mục <span className="text-red-500">*</span>
              <span className="text-sm text-gray-500 font-normal ml-1">(có thể chọn từ nhiều danh mục khác nhau)</span>
            </Label>
            <div
              className={`border rounded-lg p-4 bg-gray-50 max-h-60 overflow-y-auto ${
                errors.categories ? "border-red-500" : ""
              }`}
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
                                  id={subCategory.id}
                                  checked={selectedSubCategories.includes(subCategory.id)}
                                  onCheckedChange={() => {
                                    handleSubCategoryToggle(subCategory.id)
                                    handleFieldBlur("categories")
                                  }}
                                />
                                <Label htmlFor={subCategory.id} className="text-sm font-normal cursor-pointer">
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

            {errors.categories && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {errors.categories}
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
                    return (
                      <Badge key={subCategoryId} variant="secondary" className="flex items-center gap-1">
                        <span className="text-xs text-gray-600">{info.categoryName}:</span>
                        <span>{info.name}</span>
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-red-500"
                          onClick={() => removeSubCategory(subCategoryId)}
                        />
                      </Badge>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="cert-image">
              Tải ảnh chứng chỉ mới <span className="text-red-500">*</span>
            </Label>
            <Input
              ref={fileInputRef}
              id="cert-image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={errors.image ? "border-red-500" : ""}
            />
            <p className="text-xs text-muted-foreground">
              Vui lòng tải lên hình ảnh chất lượng cao, rõ nét để tránh bị từ chối lần nữa. Chấp nhận JPG, PNG, WEBP.
              Tối đa 5MB.
            </p>
            {errors.image && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {errors.image}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="image">Link ảnh chứng chỉ</Label>
            <Input id="image" value={formData.image} readOnly className={errors.image ? "border-red-500" : ""} />

            {loading && (
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang tải ảnh lên...
              </div>
            )}

            {formData.image && (
              <div className="mt-2">
                <Label className="text-sm text-muted-foreground mb-1 block">Ảnh hiện tại:</Label>
                <img
                  src={formData.image || "/placeholder.svg"}
                  alt="Certificate Preview"
                  className="w-full max-w-xs rounded-md border"
                />
              </div>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">
              Mô tả <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              onBlur={() => handleFieldBlur("description")}
              className={errors.description ? "border-red-500 focus:border-red-500" : ""}
              placeholder="Mô tả chi tiết về chứng chỉ, cơ quan cấp, nội dung học tập... (10-1000 ký tự)"
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {errors.description}
              </p>
            )}
            <p className="text-xs text-gray-500">
              {formData.description.length}/{VALIDATION_RULES.description.maxLength} ký tự
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading || isLoadingCategories || isSubmitting}>
              {loading || isLoadingCategories || isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Chỉnh sửa & Gửi lại"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
