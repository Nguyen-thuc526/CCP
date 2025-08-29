"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
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
  Send,
  Loader2,
} from "lucide-react"
import { format as formatFn } from "date-fns"
import { vi as viLocale } from "date-fns/locale"
import { bookingService } from "@/services/bookingService"
import { useToast, ToastType } from "@/hooks/useToast"

interface SurveyHistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bookingId: string
  bookingType: "individual" | "couple"
  memberName: string
  partnerName?: string
  memberId: string
  partnerId?: string
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

export function SurveyHistoryDialog({
  open,
  onOpenChange,
  bookingId,
  bookingType,
  memberName,
  partnerName,
  memberId,
  partnerId,
}: SurveyHistoryDialogProps) {
  const [loading, setLoading] = useState(false)
  const [sendingStates, setSendingStates] = useState<Record<string, boolean>>({})
  const [individualResults, setIndividualResults] = useState<Record<string, SurveyResult[]>>({})
  const [coupleData, setCoupleData] = useState<CoupleData | null>(null)
  const [activeTab, setActiveTab] = useState("latest")
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const { showToast } = useToast()

  useEffect(() => {
    if (!open) return

    const fetchSurveyData = async () => {
      setLoading(true)
      try {
        if (bookingType === "individual") {
          const results: Record<string, SurveyResult[]> = {}

          for (const surveyId of SURVEY_IDS) {
            try {
              const response = await bookingService.personTypeBeforeBooking({
                memberId,
                surveyId,
                bookingId,
              })

              if (response?.data) {
                const data = Array.isArray(response.data) ? response.data : [response.data]
                results[surveyId] = data.map((item: any) => ({
                  surveyId,
                  result: item.result || item.type || "",
                  description: item.description || "",
                  scores: item.scores || parseScores(item.rawScores) || {},
                  createAt: item.createAt || new Date().toISOString(),
                }))
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
        setLoading(false)
      }
    }

    fetchSurveyData()
  }, [open, bookingId, bookingType, memberId])

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

  const handleSendCompleteHistory = async (recipientId: string, recipientName: string) => {
    const key = `complete-history-${recipientId}`
    setSendingStates((prev) => ({ ...prev, [key]: true }))

    try {
      await bookingService.updateReportMetadata({
        bookingId,
        reportMetadata: "1",
      })

      showToast(`Đã gửi kết quả khảo sát cho ${recipientName}`, ToastType.Success)
    } catch (error) {
      showToast("Có lỗi xảy ra khi gửi kết quả khảo sát", ToastType.Error)
    } finally {
      setSendingStates((prev) => ({ ...prev, [key]: false }))
    }
  }

  const handleSendCoupleToIndividual = async (recipientId: string, recipientName: string) => {
    const key = `couple-individual-${recipientId}`
    setSendingStates((prev) => ({ ...prev, [key]: true }))

    try {
      const reportMetadata = recipientId === memberId ? "1" : "2"

      await bookingService.updateReportMetadata({
        bookingId,
        reportMetadata,
      })

      showToast(`Đã gửi kết quả khảo sát cho ${recipientName}`, ToastType.Success)
    } catch (error) {
      showToast("Có lỗi xảy ra khi gửi kết quả khảo sát", ToastType.Error)
    } finally {
      setSendingStates((prev) => ({ ...prev, [key]: false }))
    }
  }

  const handleSendToBoth = async () => {
    const key = "couple-both"
    setSendingStates((prev) => ({ ...prev, [key]: true }))

    try {
      await bookingService.updateReportMetadata({
        bookingId,
        reportMetadata: "3",
      })

      showToast("Đã gửi kết quả khảo sát cho cả hai người", ToastType.Success)
    } catch (error) {
      showToast("Có lỗi xảy ra khi gửi kết quả khảo sát", ToastType.Error)
    } finally {
      setSendingStates((prev) => ({ ...prev, [key]: false }))
    }
  }

  const handleSendCoupleAnalysis = async () => {
    const key = "couple-analysis"
    setSendingStates((prev) => ({ ...prev, [key]: true }))

    try {
      await bookingService.updateReportMetadata({
        bookingId,
        reportMetadata: "4",
      })

      showToast("Đã gửi phân tích cặp đôi cho cả hai người", ToastType.Success)
    } catch (error) {
      showToast("Có lỗi xảy ra khi gửi phân tích cặp đôi", ToastType.Error)
    } finally {
      setSendingStates((prev) => ({ ...prev, [key]: false }))
    }
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
              {renderScoreChart(latestResult.scores)}
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

    const renderMemberData = (memberData: typeof member1Data, title: string, showSendButton = false) => (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <User className="h-4 w-4 text-blue-600" />
            {title}
          </h4>
          {showSendButton && (
            <Button
              onClick={() => handleSendCoupleToIndividual(memberData.id, memberData.name)}
              disabled={sendingStates[`couple-individual-${memberData.id}`]}
              size="sm"
              variant="outline"
            >
              {sendingStates[`couple-individual-${memberData.id}`] ? (
                <Loader2 className="h-3 w-3 animate-spin mr-2" />
              ) : (
                <Send className="h-3 w-3 mr-2" />
              )}
              Gửi cho {memberData.name}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {memberData.mbti && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BrainIcon className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-blue-900">MBTI: {memberData.mbti}</span>
              </div>
              {Object.keys(memberData.mbtiScores).length > 0 && renderScoreChart(memberData.mbtiScores)}
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
          <div className="flex gap-2">
            <Button onClick={handleSendToBoth} disabled={sendingStates["couple-both"]} size="sm" variant="outline">
              {sendingStates["couple-both"] ? (
                <Loader2 className="h-3 w-3 animate-spin mr-2" />
              ) : (
                <Send className="h-3 w-3 mr-2" />
              )}
              Gửi cho cả hai
            </Button>
            <Button onClick={handleSendCoupleAnalysis} disabled={sendingStates["couple-analysis"]} size="sm">
              {sendingStates["couple-analysis"] ? (
                <Loader2 className="h-3 w-3 animate-spin mr-2" />
              ) : (
                <Send className="h-3 w-3 mr-2" />
              )}
              Gửi phân tích cặp đôi
            </Button>
          </div>
        </div>

        <Tabs defaultValue="member1" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="member1">{member1Data.name}</TabsTrigger>
            <TabsTrigger value="member2">{member2Data.name}</TabsTrigger>
            <TabsTrigger value="both">Cả hai</TabsTrigger>
          </TabsList>

          <TabsContent value="member1" className="mt-4">
            {renderMemberData(member1Data, member1Data.name, true)}
          </TabsContent>

          <TabsContent value="member2" className="mt-4">
            {renderMemberData(member2Data, member2Data.name, true)}
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            {bookingType === "individual" ? (
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            ) : (
              <UsersIcon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
            )}
            <span className="text-balance">
              Lịch sử khảo sát {bookingType === "individual" ? "cá nhân" : "cặp đôi"}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <BrainIcon className="h-8 w-8 animate-pulse mx-auto mb-2 text-blue-600" />
              <div className="text-sm text-gray-500">Đang tải kết quả khảo sát...</div>
            </div>
          ) : bookingType === "individual" ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                <h3 className="text-base sm:text-lg font-semibold text-balance">Kết quả mới nhất - {memberName}</h3>
              </div>

              {Object.keys(individualResults).length === 0 ? (
                <div className="text-center py-8">
                  <Info className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <div className="text-sm text-gray-500">Chưa có kết quả khảo sát</div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {SURVEY_IDS.map((surveyId) => renderIndividualSurvey(surveyId, individualResults[surveyId] || []))}
                  </div>

                  <div className="flex justify-center pt-4 border-t">
                    <Button
                      onClick={() => handleSendCompleteHistory(memberId, memberName)}
                      disabled={sendingStates[`complete-history-${memberId}`]}
                      size="lg"
                      className="px-4 sm:px-8 text-sm sm:text-base"
                    >
                      {sendingStates[`complete-history-${memberId}`] ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      <span className="text-balance">Gửi kết quả khảo sát cho {memberName}</span>
                    </Button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <UsersIcon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                <h3 className="text-base sm:text-lg font-semibold">Kết quả khảo sát cặp đôi</h3>
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
      </DialogContent>
    </Dialog>
  )
}
