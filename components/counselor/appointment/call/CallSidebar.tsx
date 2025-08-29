"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  FileText,
  Search,
  Lightbulb,
  X,
  Send,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  BarChart3,
  User,
  BrainIcon,
  Heart,
  Target,
  TrendingUp,
  Info,
  Star,
  UsersIcon,
} from "lucide-react"
import { format as formatFn } from "date-fns"
import { vi as viLocale } from "date-fns/locale"
import { bookingService } from "@/services/bookingService"
import { useToast, ToastType } from "@/hooks/useToast"

interface NoteForm {
  problemSummary: string
  problemAnalysis: string
  guides: string
}

interface FormErrors {
  problemSummary: string
  guides: string
}

interface BookingInfo {
  type: "individual" | "couple"
  memberName: string
  partnerName?: string
  memberId: string
  partnerId?: string
}

interface CallSidebarProps {
  isOpen: boolean
  onToggle: () => void
  notes: NoteForm
  onSaveNotes: (form: NoteForm) => Promise<void>
  bookingInfo: BookingInfo | null
  bookingId: string
  loading?: boolean
}

interface SurveyResult {
  surveyId: string
  result: string
  description: string
  scores: Record<string, number>
  createAt: string
  typeDetail?: {
    name: string
    description: string
    detail?: string
    image?: string
  }
}

interface CoupleData {
  member: {
    id: string
    fullname: string
    avatar: string | null
  }
  member1: {
    id: string
    fullname: string
    avatar: string | null
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
  createAt: string
}

const SURVEY_IDS = ["SV001", "SV002", "SV003", "SV004"] as const
const surveyConfig = {
  SV001: { name: "MBTI", icon: BrainIcon, color: "blue" },
  SV002: { name: "DISC", icon: Target, color: "green" },
  SV003: { name: "Love Language", icon: Heart, color: "pink" },
  SV004: { name: "Big Five", icon: BarChart3, color: "purple" },
}

const MBTI_TRAITS = {
  E: { name: "Extraversion", vietnamese: "Hướng ngoại" },
  I: { name: "Introversion", vietnamese: "Hướng nội" },
  S: { name: "Sensing", vietnamese: "Giác quan" },
  N: { name: "iNtuition", vietnamese: "Trực giác" },
  T: { name: "Thinking", vietnamese: "Lý trí" },
  F: { name: "Feeling", vietnamese: "Cảm xúc" },
  J: { name: "Judging", vietnamese: "Nguyên tắc" },
  P: { name: "Perceiving", vietnamese: "Linh hoạt" },
}

function formatDate(dateString: string) {
  return formatFn(new Date(dateString), "dd/MM/yyyy HH:mm", {
    locale: viLocale,
  })
}

function parseScores(description: string | null | undefined): Record<string, number> {
  if (!description) return {}
  const obj: Record<string, number> = {}
  description.split(/[,|]/).forEach((pair) => {
    const [k, v] = pair.split(":").map((s) => s.trim())
    if (k && v && !Number.isNaN(Number(v))) obj[k] = Number(v)
  })
  return obj
}

export default function CallSidebar({
  isOpen,
  onToggle,
  notes,
  onSaveNotes,
  bookingInfo,
  bookingId,
  loading = false,
}: CallSidebarProps) {
  const [noteForm, setNoteForm] = useState<NoteForm>({
    problemSummary: "",
    problemAnalysis: "",
    guides: "",
  })
  const [formErrors, setFormErrors] = useState<FormErrors>({
    problemSummary: "",
    guides: "",
  })
  const [isSending, setIsSending] = useState(false)
  const [collapsedSections, setCollapsedSections] = useState({
    problemSummary: false,
    problemAnalysis: false,
    guides: false,
  })
  const [sendingStates, setSendingStates] = useState<Record<string, boolean>>({})
  const [individualResults, setIndividualResults] = useState<Record<string, SurveyResult[]>>({})
  const [coupleData, setCoupleData] = useState<CoupleData | null>(null)
  const [loadingSurvey, setLoadingSurvey] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    setNoteForm({
      problemSummary: notes.problemSummary || "",
      problemAnalysis: notes.problemAnalysis || "",
      guides: notes.guides || "",
    })
    setFormErrors({ problemSummary: "", guides: "" })
  }, [notes])

  const handleSaveAndSend = async () => {
    const errors: FormErrors = { problemSummary: "", guides: "" }
    if (!noteForm.problemSummary.trim()) {
      errors.problemSummary = "Tóm tắt vấn đề là bắt buộc"
    }
    if (!noteForm.guides.trim()) {
      errors.guides = "Hướng dẫn là bắt buộc"
    }
    setFormErrors(errors)

    if (errors.problemSummary || errors.guides) {
      return
    }

    setIsSending(true)
    try {
      if (bookingInfo?.type === "individual") {
        await Promise.all([
          bookingService.updateNote({
            bookingId,
            problemSummary: noteForm.problemSummary,
            problemAnalysis: noteForm.problemAnalysis,
            guides: noteForm.guides,
          }),
          bookingService.updateReportMetadata({
            bookingId,
            reportMetadata: "1",
          }),
        ])
      } else {
        await Promise.all([
          bookingService.updateNote({
            bookingId,
            problemSummary: noteForm.problemSummary,
            problemAnalysis: noteForm.problemAnalysis,
            guides: noteForm.guides,
          }),
          bookingService.updateReportMetadata({
            bookingId,
            reportMetadata: "3",
          }),
          bookingService.updateReportMetadata({
            bookingId,
            reportMetadata: "4",
          }),
        ])
      }

      onSaveNotes(noteForm)

      showToast("Đã lưu ghi chú và gửi báo cáo thành công", ToastType.Success)
    } catch (error) {
      showToast("Có lỗi xảy ra khi lưu và gửi", ToastType.Error)
    } finally {
      setIsSending(false)
    }
  }

  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const loadSurveyResults = async () => {
    if (!bookingInfo) return

    setLoadingSurvey(true)
    try {
      if (bookingInfo.type === "individual") {
        const results: Record<string, SurveyResult[]> = {}

        for (const surveyId of SURVEY_IDS) {
          try {
            const response = await bookingService.personTypeBeforeBooking({
              memberId: bookingInfo.memberId,
              surveyId,
              bookingId,
            })

            if (response?.data) {
              const data = Array.isArray(response.data) ? response.data : [response.data]
              const sortedResults = data
                .map((item: any) => ({
                  surveyId,
                  result: item.result || item.type || "",
                  description: item.description || "",
                  scores: item.scores || parseScores(item.rawScores) || {},
                  createAt: item.createAt || new Date().toISOString(),
                }))
                .sort(
                  (a: SurveyResult, b: SurveyResult) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime(),
                )
              results[surveyId] = sortedResults
            }
          } catch (error) {
            console.log(`No data for survey ${surveyId}`)
          }
        }

        setIndividualResults(results)
      } else {
        try {
          const response = await bookingService.getCoupleByBooking(bookingId)
          if (response?.data) {
            setCoupleData(response.data)
          }
        } catch (error) {
          console.log("No couple data found")
        }
      }
    } catch (error) {
      console.error("Error fetching survey data:", error)
    } finally {
      setLoadingSurvey(false)
    }
  }

  const renderMBTIChart = (scores: Record<string, number>) => {
    const mbtiPairs = [
      { left: "E", right: "I", key: "E/I" },
      { left: "S", right: "N", key: "S/N" },
      { left: "T", right: "F", key: "T/F" },
      { left: "J", right: "P", key: "J/P" },
    ]

    return (
      <div className="space-y-3">
        {mbtiPairs.map((pair) => {
          const leftScore = scores[pair.left] || 0
          const rightScore = scores[pair.right] || 0
          const total = leftScore + rightScore

          if (total === 0) return null

          const leftPercentage = Math.round((leftScore / total) * 100)
          const rightPercentage = Math.round((rightScore / total) * 100)
          const dominantTrait = leftScore > rightScore ? pair.left : pair.right
          const dominantPercentage = Math.max(leftPercentage, rightPercentage)
          const progressValue = leftScore > rightScore ? leftPercentage : 100 - rightPercentage

          const dominantTraitInfo = MBTI_TRAITS[dominantTrait as keyof typeof MBTI_TRAITS]
          const leftTraitInfo = MBTI_TRAITS[pair.left as keyof typeof MBTI_TRAITS]
          const rightTraitInfo = MBTI_TRAITS[pair.right as keyof typeof MBTI_TRAITS]

          return (
            <div key={pair.key} className="space-y-1">
              <div className="text-center">
                <span className="text-xs font-semibold text-blue-700">
                  {dominantPercentage}% {dominantTraitInfo.name} ({dominantTraitInfo.vietnamese})
                </span>
              </div>
              <div className="relative">
                <div className="flex justify-between text-xs font-medium text-gray-500 mb-1">
                  <span>{leftTraitInfo.name}</span>
                  <span>{rightTraitInfo.name}</span>
                </div>
                <Progress value={progressValue} className="h-2" />
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderScoreChart = (scores: Record<string, number>, surveyId?: string) => {
    if (surveyId === "SV001") {
      return renderMBTIChart(scores)
    }

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

  const renderIndividualSurvey = (surveyId: string, results: SurveyResult[]) => {
    if (!results || results.length === 0) return null

    const config = surveyConfig[surveyId as keyof typeof surveyConfig]
    const Icon = config.icon
    const latestResult = results[0]

    return (
      <Card key={surveyId}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Icon className={`h-4 w-4 text-${config.color}-600`} />
            {config.name}
            <Badge variant="outline" className="ml-auto text-xs">
              {formatDate(latestResult.createAt)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className={`p-3 bg-${config.color}-50 rounded-lg`}>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className={`h-3 w-3 text-${config.color}-600`} />
              <span className={`font-semibold text-${config.color}-900 text-sm`}>
                {latestResult.result || "(trống)"}
              </span>
            </div>
            {latestResult.description && (
              <p className="text-xs text-gray-700 leading-relaxed">{latestResult.description}</p>
            )}
          </div>

          {Object.keys(latestResult.scores).length > 0 && (
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2 text-xs">
                <BarChart3 className="h-3 w-3" />
                Điểm số
              </h4>
              {renderScoreChart(latestResult.scores, surveyId)}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const renderCoupleSurvey = () => {
    if (!coupleData) return null

    const member1Data = {
      name: coupleData.member.fullname,
      id: coupleData.member.id,
      mbti: coupleData.mbti,
      disc: coupleData.disc,
      loveLanguage: coupleData.loveLanguage,
      bigFive: coupleData.bigFive,
      mbtiScores: parseScores(coupleData.mbtiDescription),
      discScores: parseScores(coupleData.discDescription),
      loveLanguageScores: parseScores(coupleData.loveLanguageDescription),
      bigFiveScores: parseScores(coupleData.bigFiveDescription),
    }

    const member2Data = {
      name: coupleData.member1.fullname,
      id: coupleData.member1.id,
      mbti: coupleData.mbti1,
      disc: coupleData.disc1,
      loveLanguage: coupleData.loveLanguage1,
      bigFive: coupleData.bigFive1,
      mbtiScores: parseScores(coupleData.mbti1Description),
      discScores: parseScores(coupleData.disc1Description),
      loveLanguageScores: parseScores(coupleData.loveLanguage1Description),
      bigFiveScores: parseScores(coupleData.bigFive1Description),
    }

    const renderMemberData = (memberData: typeof member1Data, title: string) => (
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          <User className="h-4 w-4 text-blue-600" />
          {title}
        </h4>

        <div className="grid grid-cols-1 gap-4">
          {memberData.mbti && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BrainIcon className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-blue-900">MBTI: {memberData.mbti}</span>
              </div>
              {Object.keys(memberData.mbtiScores).length > 0 && renderMBTIChart(memberData.mbtiScores)}
            </div>
          )}

          {memberData.disc && (
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-green-600" />
                <span className="font-semibold text-green-900">DISC: {memberData.disc}</span>
              </div>
              {Object.keys(memberData.discScores).length > 0 && renderScoreChart(memberData.discScores)}
            </div>
          )}

          {memberData.loveLanguage && (
            <div className="p-3 bg-pink-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="h-4 w-4 text-pink-600" />
                <span className="font-semibold text-pink-900">Love Language: {memberData.loveLanguage}</span>
              </div>
              {Object.keys(memberData.loveLanguageScores).length > 0 && renderScoreChart(memberData.loveLanguageScores)}
            </div>
          )}

          {memberData.bigFive && (
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 text-purple-600" />
                <span className="font-semibold text-purple-900">Big Five: {memberData.bigFive}</span>
              </div>
              {Object.keys(memberData.bigFiveScores).length > 0 && renderScoreChart(memberData.bigFiveScores)}
            </div>
          )}
        </div>
      </div>
    )

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">Ngày tạo: {formatDate(coupleData.createAt)}</div>
        </div>

        <Tabs defaultValue="member1" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="member1">{member1Data.name}</TabsTrigger>
            <TabsTrigger value="member2">{member2Data.name}</TabsTrigger>
            <TabsTrigger value="both">Cả hai</TabsTrigger>
          </TabsList>

          <TabsContent value="member1" className="mt-4">
            {renderMemberData(member1Data, member1Data.name)}
          </TabsContent>

          <TabsContent value="member2" className="mt-4">
            {renderMemberData(member2Data, member2Data.name)}
          </TabsContent>

          <TabsContent value="both" className="mt-4">
            <div className="space-y-6">
              {renderMemberData(member1Data, member1Data.name)}
              {renderMemberData(member2Data, member2Data.name)}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-white border-l shadow-lg transition-all duration-300 z-50 ${
        isOpen ? "w-96" : "w-0"
      } overflow-hidden`}
      style={{ top: "64px", height: "calc(100vh - 64px)" }}
    >
      {/* Toggle Button */}
      <Button
        onClick={onToggle}
        variant="outline"
        size="sm"
        className="absolute -left-10 top-1/2 transform -translate-y-1/2 rounded-l-md rounded-r-none border-r-0 bg-white hover:bg-gray-50"
      >
        {isOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>

      {/* Sidebar Content */}
      <Tabs defaultValue="notes" className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b bg-gray-50">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Ghi chú
            </TabsTrigger>
            <TabsTrigger value="survey" className="flex items-center gap-2" onClick={loadSurveyResults}>
              <BarChart3 className="h-4 w-4" />
              Khảo sát
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Notes Tab Content */}
        <TabsContent value="notes" className="flex-1 overflow-y-auto p-4 m-0">
          <div className="space-y-4">
            {/* Problem Summary */}
            <Card>
              <CardHeader
                className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection("problemSummary")}
              >
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  Tóm tắt vấn đề
                  <Badge variant="destructive" className="ml-2 text-xs">
                    Bắt buộc
                  </Badge>
                  {collapsedSections.problemSummary ? (
                    <ChevronDown className="h-4 w-4 ml-auto" />
                  ) : (
                    <ChevronUp className="h-4 w-4 ml-auto" />
                  )}
                </CardTitle>
              </CardHeader>
              {!collapsedSections.problemSummary && (
                <CardContent>
                  <Textarea
                    value={noteForm.problemSummary}
                    onChange={(e) =>
                      setNoteForm({
                        ...noteForm,
                        problemSummary: e.target.value,
                      })
                    }
                    placeholder="Tóm tắt ngắn gọn vấn đề chính..."
                    rows={3}
                    className={`resize-none text-sm ${formErrors.problemSummary ? "border-red-500" : ""}`}
                  />
                  {formErrors.problemSummary && (
                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {formErrors.problemSummary}
                    </p>
                  )}
                </CardContent>
              )}
            </Card>

            {/* Problem Analysis */}
            <Card>
              <CardHeader
                className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection("problemAnalysis")}
              >
                <CardTitle className="text-sm flex items-center gap-2">
                  <Search className="h-4 w-4 text-green-600" />
                  Phân tích vấn đề
                  <Badge variant="outline" className="ml-2 text-xs">
                    Tùy chọn
                  </Badge>
                  {collapsedSections.problemAnalysis ? (
                    <ChevronDown className="h-4 w-4 ml-auto" />
                  ) : (
                    <ChevronUp className="h-4 w-4 ml-auto" />
                  )}
                </CardTitle>
              </CardHeader>
              {!collapsedSections.problemAnalysis && (
                <CardContent>
                  <Textarea
                    value={noteForm.problemAnalysis}
                    onChange={(e) =>
                      setNoteForm({
                        ...noteForm,
                        problemAnalysis: e.target.value,
                      })
                    }
                    placeholder="Phân tích chi tiết về nguyên nhân..."
                    rows={3}
                    className="resize-none text-sm"
                  />
                </CardContent>
              )}
            </Card>

            {/* Guides */}
            <Card>
              <CardHeader
                className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection("guides")}
              >
                <CardTitle className="text-sm flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-600" />
                  Hướng dẫn
                  <Badge variant="destructive" className="ml-2 text-xs">
                    Bắt buộc
                  </Badge>
                  {collapsedSections.guides ? (
                    <ChevronDown className="h-4 w-4 ml-auto" />
                  ) : (
                    <ChevronUp className="h-4 w-4 ml-auto" />
                  )}
                </CardTitle>
              </CardHeader>
              {!collapsedSections.guides && (
                <CardContent>
                  <Textarea
                    value={noteForm.guides}
                    onChange={(e) =>
                      setNoteForm({
                        ...noteForm,
                        guides: e.target.value,
                      })
                    }
                    placeholder="Các bước tiếp theo, lời khuyên..."
                    rows={3}
                    className={`resize-none text-sm ${formErrors.guides ? "border-red-500" : ""}`}
                  />
                  {formErrors.guides && (
                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {formErrors.guides}
                    </p>
                  )}
                </CardContent>
              )}
            </Card>

            <Button onClick={handleSaveAndSend} className="w-full" disabled={isSending}>
              {isSending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
              {isSending ? "Đang gửi..." : "Lưu và gửi"}
            </Button>
          </div>
        </TabsContent>

        {/* Survey Tab Content */}
        <TabsContent value="survey" className="flex-1 overflow-y-auto p-4 m-0">
          <div className="space-y-4">
            {loadingSurvey ? (
              <div className="text-center py-8">
                <BrainIcon className="h-8 w-8 animate-pulse mx-auto mb-2 text-blue-600" />
                <div className="text-sm text-gray-500">Đang tải kết quả khảo sát...</div>
              </div>
            ) : bookingInfo?.type === "individual" ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-4 w-4 text-yellow-600" />
                  <h3 className="text-base font-semibold">Kết quả mới nhất - {bookingInfo.memberName}</h3>
                </div>

                {Object.keys(individualResults).length === 0 ? (
                  <div className="text-center py-8">
                    <Info className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <div className="text-sm text-gray-500">Chưa có kết quả khảo sát</div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {SURVEY_IDS.map((surveyId) => renderIndividualSurvey(surveyId, individualResults[surveyId] || []))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <UsersIcon className="h-4 w-4 text-purple-600" />
                  <h3 className="text-base font-semibold">Kết quả khảo sát cặp đôi</h3>
                </div>

                {!coupleData ? (
                  <div className="text-center py-8">
                    <Info className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <div className="text-sm text-gray-500">Chưa có kết quả khảo sát cặp đôi</div>
                  </div>
                ) : (
                  renderCoupleSurvey()
                )}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
