"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button as UIButton } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge as UIBadge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  BrainIcon,
  Heart,
  UsersIcon,
  Target,
  User,
  BarChart3,
  TrendingUp,
  Info,
  Star,
  Download,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { format as formatFn } from "date-fns"
import { vi as viLocale } from "date-fns/locale"
import { useEffect, useRef, useState } from "react"
import { bookingService } from "@/services/bookingService"

// libs for PDF
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

interface CoupleData {
  id: string
  isOwned: boolean
  member: {
    id: string
    accountId: string
    fullname: string
    avatar: string | null
    phone: string | null
    dob: string | null
    mbti: string | null
    disc: string | null
    loveLanguage: string | null
    bigFive: string | null
    gender: string | null
    status: number
  }
  member1: {
    id: string
    accountId: string
    fullname: string
    avatar: string | null
    phone: string | null
    dob: string | null
    mbti: string | null
    disc: string | null
    loveLanguage: string | null
    bigFive: string | null
    gender: string | null
    status: number
  }
  mbti: string | null
  disc: string | null
  loveLanguage: string | null
  bigFive: string | null
  mbti1: string | null
  disc1: string | null
  loveLanguage1: string | null
  bigFive1: string | null
  mbtiDescription: string | null
  discDescription: string | null
  loveLanguageDescription: string | null
  bigFiveDescription: string | null
  mbti1Description: string | null
  disc1Description: string | null
  loveLanguage1Description: string | null
  bigFive1Description: string | null
  mbtiResult: string | null
  discResult: string | null
  loveLanguageResult: string | null
  bigFiveResult: string | null
  mbtiDetail?: {
    id: string
    description: string
    detail: string
    compatibility: number
    image: string
    weaknesses: string
    strongPoints: string
    category: {
      name: string
    }
    personType: {
      name: string
      description: string
    }
    personType2: {
      name: string
      description: string
    }
  }
  createAt: string
  status: number
  accessCode: string
}

interface CoupleSurveyResultsDialogProps {
  isOpen: boolean
  onClose: () => void
  memberName: string
  partnerName: string
  bookingId: string
}

const surveyConfig = {
  mbti: { name: "MBTI", icon: BrainIcon, color: "blue", description: "Chỉ số tính cách Myers-Briggs" },
  disc: { name: "DISC", icon: Target, color: "green", description: "Phong cách hành vi và giao tiếp" },
  loveLanguage: { name: "Love Languages", icon: Heart, color: "pink", description: "Ngôn ngữ tình yêu" },
  bigFive: { name: "Big Five", icon: BarChart3, color: "purple", description: "Năm yếu tố tính cách lớn" },
}

function formatDate(dateString: string) {
  return formatFn(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: viLocale })
}

function parseScores(description: string | null): Record<string, number> {
  if (!description) return {}
  const obj: Record<string, number> = {}
  description.split(/[,|]/).forEach((pair) => {
    const [k, v] = pair.split(":").map((s) => s.trim())
    if (k && v && !Number.isNaN(Number(v))) obj[k] = Number(v)
  })
  return obj
}

export function CoupleSurveyResultsDialog({
  isOpen,
  onClose,
  memberName,
  partnerName,
  bookingId,
}: CoupleSurveyResultsDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [coupleData, setCoupleData] = useState<CoupleData | null>(null)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const exportRef = useRef<HTMLDivElement | null>(null)
  const [exporting, setExporting] = useState(false)

  const handleExportPDF = async () => {
    if (!exportRef.current) return
    try {
      setExporting(true)
      const canvas = await html2canvas(exportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        windowWidth: exportRef.current.scrollWidth,
      })
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" })
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = pageWidth
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST")
      heightLeft -= pageHeight
      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST")
        heightLeft -= pageHeight
      }
      pdf.save(
        `ket-qua-khao-sat-cap-doi-${memberName.replace(/\s+/g, "-").toLowerCase()}-${partnerName.replace(/\s+/g, "-").toLowerCase()}.pdf`,
      )
    } catch (e) {
      console.error(e)
    } finally {
      setExporting(false)
    }
  }

 useEffect(() => {
  let cancelled = false

  async function fetchCoupleData() {
    if (!isOpen) return
    setLoading(true)
    setError(null)

    try {
      const response = await bookingService.getCoupleByBooking(bookingId)
      if (cancelled) return

      const data = response?.data

      // Nếu API trả về rỗng/không có kết quả -> coi là empty state, KHÔNG set error
      const noResult =
        !data ||
        (
          !data.mbti &&
          !data.disc &&
          !data.loveLanguage &&
          !data.bigFive &&
          !data.mbtiDetail
        )

      if (noResult) {
        setCoupleData(null)
        setError(null)
      } else {
        setCoupleData(data)
      }
    } catch (e: any) {
      if (cancelled) return
      const code = e?.response?.status
      // Những lỗi "không có dữ liệu" coi như empty state
      if (code === 404 || code === 204 || code === 400) {
        setCoupleData(null)
        setError(null)
      } else {
        // Chỉ những lỗi thật sự (network, 5xx...) mới hiển thị
        setError("Không thể tải kết quả khảo sát cặp đôi")
      }
    } finally {
      if (!cancelled) setLoading(false)
    }
  }

  fetchCoupleData()
  return () => {
    cancelled = true
  }
}, [isOpen, bookingId])


  const renderScoreChart = (scores: Record<string, number>) => {
    const maxScore = Math.max(1, ...Object.values(scores))
    return (
      <div className="space-y-2">
        {Object.entries(scores).map(([key, value]) => (
          <div key={key} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium">{key}</span>
              <span className="text-gray-600">{value}</span>
            </div>
            <Progress value={(value / maxScore) * 100} className="h-1.5" />
          </div>
        ))}
      </div>
    )
  }

  const renderMemberCard = (member: CoupleData["member"] | CoupleData["member1"], title: string, isFirst: boolean) => {
    const mbtiType = isFirst ? coupleData?.mbti : coupleData?.mbti1
    const discType = isFirst ? coupleData?.disc : coupleData?.disc1
    const loveLanguageType = isFirst ? coupleData?.loveLanguage : coupleData?.loveLanguage1
    const bigFiveType = isFirst ? coupleData?.bigFive : coupleData?.bigFive1

    const mbtiScores = parseScores(isFirst ? coupleData?.mbtiDescription : coupleData?.mbti1Description)
    const discScores = parseScores(isFirst ? coupleData?.discDescription : coupleData?.disc1Description)
    const loveLanguageScores = parseScores(
      isFirst ? coupleData?.loveLanguageDescription : coupleData?.loveLanguage1Description,
    )
    const bigFiveScores = parseScores(isFirst ? coupleData?.bigFiveDescription : coupleData?.bigFive1Description)

    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            {title}
          </CardTitle>
          <div className="flex items-center gap-3">
            {member.avatar && (
              <img
                src={member.avatar || "/placeholder.svg"}
                alt={member.fullname}
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
            <div>
              <p className="font-semibold text-gray-900">{member.fullname}</p>
              {member.dob && (
                <p className="text-sm text-gray-500">
                  Sinh: {formatFn(new Date(member.dob), "dd/MM/yyyy", { locale: viLocale })}
                </p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* MBTI */}
          {mbtiType && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BrainIcon className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-blue-900">MBTI: {mbtiType}</span>
              </div>
              {Object.keys(mbtiScores).length > 0 && renderScoreChart(mbtiScores)}
            </div>
          )}

          {/* DISC */}
          {discType && (
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-green-600" />
                <span className="font-semibold text-green-900">DISC: {discType}</span>
              </div>
              {Object.keys(discScores).length > 0 && renderScoreChart(discScores)}
            </div>
          )}

          {/* Love Language */}
          {loveLanguageType && (
            <div className="p-3 bg-pink-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="h-4 w-4 text-pink-600" />
                <span className="font-semibold text-pink-900">Love Language: {loveLanguageType}</span>
              </div>
              {Object.keys(loveLanguageScores).length > 0 && renderScoreChart(loveLanguageScores)}
            </div>
          )}

          {/* Big Five */}
          {bigFiveType && (
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 text-purple-600" />
                <span className="font-semibold text-purple-900">Big Five: {bigFiveType}</span>
              </div>
              {Object.keys(bigFiveScores).length > 0 && renderScoreChart(bigFiveScores)}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const renderCompatibilityCard = () => {
    if (!coupleData?.mbtiDetail) return null

    const key = "compatibility-detail"
    const isExpanded = !!expanded[key]

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            Phân tích tương thích
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
            <div className="flex items-center gap-3">
              {coupleData.mbtiDetail.image && (
                <img
                  src={coupleData.mbtiDetail.image || "/placeholder.svg"}
                  alt="Compatibility"
                  className="w-16 h-16 object-contain"
                />
              )}
              <div>
                <div className="text-2xl font-bold text-purple-900">{coupleData.mbtiDetail.compatibility}%</div>
                <div className="text-sm text-purple-700">Độ tương thích</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-900">
                {coupleData.mbtiDetail.personType.name} & {coupleData.mbtiDetail.personType2.name}
              </div>
              <div className="text-sm text-gray-600">{coupleData.mbtiDetail.category.name}</div>
            </div>
          </div>

          <Progress value={coupleData.mbtiDetail.compatibility} className="h-3" />

          <p className="text-gray-700 leading-relaxed">{coupleData.mbtiDetail.description}</p>

          {coupleData.mbtiDetail.detail && (
            <div>
              <UIButton
                type="button"
                variant="outline"
                className="mb-3"
                onClick={() => setExpanded((s) => ({ ...s, [key]: !s[key] }))}
              >
                {isExpanded ? (
                  <>
                    Thu gọn <ChevronUp className="h-4 w-4 ml-1" />
                  </>
                ) : (
                  <>
                    Xem chi tiết <ChevronDown className="h-4 w-4 ml-1" />
                  </>
                )}
              </UIButton>
              {isExpanded && (
                <div className="space-y-4">
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: coupleData.mbtiDetail.detail }}
                  />

                  {coupleData.mbtiDetail.strongPoints && (
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Điểm mạnh
                      </h4>
                      <div
                        className="prose prose-sm max-w-none text-green-800"
                        dangerouslySetInnerHTML={{ __html: coupleData.mbtiDetail.strongPoints }}
                      />
                    </div>
                  )}

                  {coupleData.mbtiDetail.weaknesses && (
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <h4 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        Thách thức
                      </h4>
                      <div
                        className="prose prose-sm max-w-none text-orange-800"
                        dangerouslySetInnerHTML={{ __html: coupleData.mbtiDetail.weaknesses }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
        <div ref={exportRef} className="space-y-6">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <UsersIcon className="h-6 w-6 text-purple-600" />
              Kết quả khảo sát cặp đôi
            </DialogTitle>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>
                {memberName} & {partnerName}
              </span>
              <UIBadge variant="outline" className="ml-2 bg-purple-50 border-purple-200">
                <UsersIcon className="h-3 w-3 mr-1" />
                Cặp đôi
              </UIBadge>
            </div>
            {coupleData && (
              <div className="text-sm text-gray-500">
                Ngày tạo: {formatDate(coupleData.createAt)} • Mã truy cập: {coupleData.accessCode}
              </div>
            )}
          </DialogHeader>

          {loading ? (
            <div className="text-center py-8">
              <BrainIcon className="h-8 w-8 animate-pulse mx-auto mb-2 text-purple-600" />
              <div className="text-sm text-gray-500">Đang tải kết quả khảo sát cặp đôi...</div>
            </div>
          ) : error ? (
            <div className="rounded-md border p-4 bg-red-50 text-red-800 flex items-start gap-2">
              <Info className="h-5 w-5 mt-0.5" />
              <div>
                <div className="font-medium">Lỗi tải dữ liệu</div>
                <div className="text-sm">{error}</div>
              </div>
            </div>
          ) : !coupleData ? (
            <div className="rounded-md border p-4 bg-gray-50 text-gray-600 flex items-start gap-2">
              <Info className="h-5 w-5 mt-0.5" />
              <div>
                <div className="font-medium">Không có dữ liệu</div>
                <div className="text-sm">Chưa có kết quả khảo sát cho cặp đôi này.</div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Individual Results */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Kết quả cá nhân
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {renderMemberCard(coupleData.member, memberName, true)}
                  {renderMemberCard(coupleData.member1, partnerName, false)}
                </div>
              </div>

              <Separator />

              {/* Compatibility Analysis */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  Phân tích tương thích
                </h3>
                {renderCompatibilityCard()}
              </div>
            </div>
          )}
        </div>

        <Separator className="my-6" />

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <UIButton variant="outline" onClick={onClose}>
              Đóng
            </UIButton>
            {coupleData && (
              <UIButton onClick={handleExportPDF} disabled={exporting}>
                <Download className="h-4 w-4 mr-2" />
                {exporting ? "Đang xuất..." : "Xuất PDF"}
              </UIButton>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
