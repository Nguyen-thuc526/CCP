
"use client"
import { Button as UIButton } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge as UIBadge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  BrainIcon,
  User,
  UsersIcon,
  BarChart3,
  TrendingUp,
  Info,
  Clock,
  Star,
  Download,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { format as formatFn } from "date-fns"
import { vi as viLocale } from "date-fns/locale"
import { useEffect, useMemo, useRef, useState } from "react"
import { bookingService } from "@/services/bookingService"
import Link from "next/link"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { surveyConfig } from "@/app/config/surveyConfig"

const SURVEY_IDS = ["SV001", "SV002", "SV003", "SV004"] as const
export type SurveyId = (typeof SURVEY_IDS)[number]

interface PersonTypeDetail {
  name: string
  description: string | null
  detail?: string | null // HTML
  image?: string | null
  scores: Record<string, number>
}

interface SurveyResult {
  surveyId: SurveyId
  result: string
  description: string
  rawScores?: string
  scores: Record<string, number>
  createAt: string
  typeDetail?: PersonTypeDetail
}

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
  createAt: string
  status: number
  accessCode: string
}

interface CoupleSurveyResultsProps {
  memberName: string
  partnerName: string
  bookingId: string
}

interface MemberSurveysProps {
  member: CoupleData["member"] | CoupleData["member1"]
  resultsBySurvey: Partial<Record<SurveyId, SurveyResult[]>>
  title: string
}

function formatDate(dateString: string) {
  return formatFn(new Date(dateString), "dd/MM/yyyy HH:mm", {
    locale: viLocale,
  })
}

function formatDateOnly(dateString: string) {
  return formatFn(new Date(dateString), "dd/MM/yyyy", { locale: viLocale })
}

function parseRawScores(raw?: string | null): Record<string, number> | undefined {
  if (!raw) return undefined
  const obj: Record<string, number> = {}
  raw.split(/[,|]/).forEach((pair) => {
    const [k, v] = pair.split(":").map((s) => s.trim())
    if (k && v && !Number.isNaN(Number(v))) obj[k] = Number(v)
  })
  return Object.keys(obj).length ? obj : undefined
}

function normalizePersonTypeResponses(surveyId: SurveyId, apiData: any): SurveyResult[] {
  if (!apiData) return []
  const arr = Array.isArray(apiData) ? apiData : [apiData]
  return arr.map((item) => {
    const meta = item?.meta || item
    const result = meta.result ?? meta.type ?? meta.label ?? ""
    const description = meta.description ?? meta.desc ?? ""
    const createAt = meta.createAt ?? meta.createdAt ?? meta.date ?? new Date().toISOString()

    const scoresFromObj = meta.scores || meta.Scores || meta.score
    const scores: Record<string, number> =
      (typeof scoresFromObj === "object" && scoresFromObj) || parseRawScores(meta.rawScores || meta.RawScores) || {}

    const rawScores =
      typeof meta.rawScores === "string"
        ? meta.rawScores
        : typeof meta.RawScores === "string"
          ? meta.RawScores
          : undefined

    return {
      surveyId,
      result: String(result),
      description: String(description ?? ""),
      rawScores,
      scores,
      createAt: String(createAt),
    }
  })
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

function renderScoreChart(scores: Record<string, number>, surveyId?: SurveyId) {
  if (surveyId === "SV001") {
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

function renderCompactSurveyCard(result: SurveyResult, showDate = false) {
  const config = surveyConfig[result.surveyId]
  const Icon = config.icon

  const mergedDescription = result.typeDetail?.description ?? result.description
  const mergedScores = Object.keys(result.typeDetail?.scores ?? {}).length ? result.typeDetail!.scores : result.scores

  const key = `${result.surveyId}-${result.createAt}`
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card key={key} className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Icon className={`h-4 w-4 text-${config.color}-600`} />
          {config.name}
          {showDate && (
            <UIBadge variant="outline" className="ml-auto text-xs">
              {formatDate(result.createAt)}
            </UIBadge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-3 w-3 text-blue-600" />
            <span className="font-semibold text-blue-900 text-sm">{result.result || "(trống)"}</span>
          </div>
          {result.typeDetail?.image && (
            <img
              src={result.typeDetail.image || "/placeholder.svg"}
              alt={result.typeDetail.name}
              className="w-12 h-12 object-contain mb-2"
            />
          )}
          {mergedDescription && (
            <p className="text-xs text-gray-700 leading-relaxed line-clamp-2">{mergedDescription}</p>
          )}
        </div>

        {!!Object.keys(mergedScores || {}).length && (
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2 text-xs">
              <BarChart3 className="h-3 w-3" />
              Điểm số
            </h4>
            {renderScoreChart(mergedScores, result.surveyId)}
          </div>
        )}

        {result.typeDetail?.detail && (
          <div>
            <UIButton
              type="button"
              variant="outline"
              className="h-8 px-2 text-xs"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  Thu gọn <ChevronUp className="h-3 w-3 ml-1" />
                </>
              ) : (
                <>
                  Xem chi tiết <ChevronDown className="h-3 w-3 ml-1" />
                </>
              )}
            </UIButton>
            {isExpanded && (
              <div
                className="prose prose-sm max-w-none mt-3"
                dangerouslySetInnerHTML={{
                  __html: result.typeDetail.detail!,
                }}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function MemberSurveys({ member, resultsBySurvey, title }: MemberSurveysProps) {
  const resultsByDate = useMemo(() => {
    const dateGroups: Record<string, SurveyResult[]> = {}

    Object.values(resultsBySurvey).forEach((surveyResults) => {
      surveyResults?.forEach((result) => {
        const dateKey = formatDateOnly(result.createAt)
        if (!dateGroups[dateKey]) {
          dateGroups[dateKey] = []
        }
        dateGroups[dateKey].push(result)
      })
    })

    Object.keys(dateGroups).forEach((dateKey) => {
      dateGroups[dateKey].sort((a, b) => {
        const surveyOrder = SURVEY_IDS.indexOf(a.surveyId) - SURVEY_IDS.indexOf(b.surveyId)
        if (surveyOrder !== 0) return surveyOrder
        return new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
      })
    })

    const sortedDates = Object.keys(dateGroups).sort((a, b) => {
      const dateA = new Date(dateGroups[a][0].createAt)
      const dateB = new Date(dateGroups[b][0].createAt)
      return dateB.getTime() - dateA.getTime()
    })

    return sortedDates.map((date) => ({
      date,
      results: dateGroups[date],
    }))
  }, [resultsBySurvey])

  const latestResults = useMemo(() => {
    const latest: Partial<Record<SurveyId, SurveyResult>> = {}
    SURVEY_IDS.forEach((sid) => {
      const results = resultsBySurvey[sid]
      if (results && results.length > 0) {
        latest[sid] = results[0]
      }
    })
    return latest
  }, [resultsBySurvey])

  const hasAny = useMemo(() => Object.values(resultsBySurvey).some((arr) => (arr?.length ?? 0) > 0), [resultsBySurvey])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <User className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      {Object.keys(latestResults).length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-5 w-5 text-yellow-600" />
            <h4 className="text-md font-semibold">Kết quả mới nhất</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SURVEY_IDS.map((sid) => {
              const result = latestResults[sid]
              if (!result) {
                const config = surveyConfig[sid]
                const Icon = config.icon
                return (
                  <Card key={sid} className="opacity-50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Icon className={`h-4 w-4 text-${config.color}-600`} />
                        {config.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-4">
                        <Info className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                        <p className="text-gray-500 text-xs">Chưa có kết quả</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              }
              return renderCompactSurveyCard(result, true)
            })}
          </div>
        </div>
      )}

      {resultsByDate.length > 1 && (
        <div>
          <Separator className="my-6" />
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-gray-600" />
            <h4 className="text-md font-semibold">Lịch sử khảo sát</h4>
          </div>
          <div className="space-y-6">
            {resultsByDate.slice(1).map(({ date, results }) => (
              <div key={date}>
                <div className="flex items-center gap-2 mb-3">
                  <UIBadge variant="secondary" className="text-sm">
                    {date}
                  </UIBadge>
                  <span className="text-sm text-gray-500">{results.length} khảo sát</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {results.map((result) => renderCompactSurveyCard(result))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {!hasAny && (
        <div className="text-sm text-gray-500">Không có dữ liệu khảo sát.</div>
      )}
    </div>
  )
}

export function CoupleSurveyResults({ memberName, partnerName, bookingId }: CoupleSurveyResultsProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [coupleData, setCoupleData] = useState<CoupleData | null>(null)
  const [memberResultsBySurvey, setMemberResultsBySurvey] = useState<Partial<Record<SurveyId, SurveyResult[]>>>({})
  const [partnerResultsBySurvey, setPartnerResultsBySurvey] = useState<Partial<Record<SurveyId, SurveyResult[]>>>({})
  const [activeTab, setActiveTab] = useState<"member" | "partner">("member")

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
      const pdf = new jsPDF({
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      })
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
        `ket-qua-khao-sat-cap-doi-${memberName.replace(/\s+/g, "-").toLowerCase()}-${partnerName.replace(/\s+/g, "-").toLowerCase()}.pdf`
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
      setLoading(true)
      setError(null)

      try {
        const response = await bookingService.getCoupleByBooking(bookingId)
        if (cancelled) return

        const data = response?.data
        setCoupleData(data || null)

        if (data) {
          // Fetch survey history for member
          const memberPairs = await Promise.all(
            SURVEY_IDS.map(async (sid) => {
              const safeFetch = async () => {
                try {
                  const res = await bookingService.personTypeBeforeBooking({
                    memberId: data.member.id,
                    surveyId: sid,
                    bookingId,
                  })
                  return res?.data
                } catch (e: any) {
                  const code = e?.response?.status
                  if (code === 404 || code === 204 || code === 400) return null
                  throw e
                }
              }

              const raw = await safeFetch()
              const items = normalizePersonTypeResponses(sid, raw)
              items.sort((a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime())

              await Promise.all(
                items.map(async (it) => {
                  if (!it.result) return
                  try {
                    const r = await bookingService.getPersonTypeByName({
                      name: it.result,
                      surveyId: sid,
                    })
                    const d = r?.data as any
                    if (d) {
                      it.typeDetail = {
                        name: d.name ?? d.result ?? it.result,
                        description: d.description ?? null,
                        detail: d.detail ?? null,
                        image: d.image ?? null,
                        scores: d.scores ?? {},
                      }
                    }
                  } catch {}
                })
              )

              return [sid, items] as const
            })
          )

          const memberGrouped: Partial<Record<SurveyId, SurveyResult[]>> = {}
          memberPairs.forEach(([sid, items]) => (memberGrouped[sid] = items))
          if (!cancelled) setMemberResultsBySurvey(memberGrouped)

          // Fetch survey history for partner
          const partnerPairs = await Promise.all(
            SURVEY_IDS.map(async (sid) => {
              const safeFetch = async () => {
                try {
                  const res = await bookingService.personTypeBeforeBooking({
                    memberId: data.member1.id,
                    surveyId: sid,
                    bookingId,
                  })
                  return res?.data
                } catch (e: any) {
                  const code = e?.response?.status
                  if (code === 404 || code === 204 || code === 400) return null
                  throw e
                }
              }

              const raw = await safeFetch()
              const items = normalizePersonTypeResponses(sid, raw)
              items.sort((a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime())

              await Promise.all(
                items.map(async (it) => {
                  if (!it.result) return
                  try {
                    const r = await bookingService.getPersonTypeByName({
                      name: it.result,
                      surveyId: sid,
                    })
                    const d = r?.data as any
                    if (d) {
                      it.typeDetail = {
                        name: d.name ?? d.result ?? it.result,
                        description: d.description ?? null,
                        detail: d.detail ?? null,
                        image: d.image ?? null,
                        scores: d.scores ?? {},
                      }
                    }
                  } catch {}
                })
              )

              return [sid, items] as const
            })
          )

          const partnerGrouped: Partial<Record<SurveyId, SurveyResult[]>> = {}
          partnerPairs.forEach(([sid, items]) => (partnerGrouped[sid] = items))
          if (!cancelled) setPartnerResultsBySurvey(partnerGrouped)
        }
      } catch (e: any) {
        if (!cancelled) {
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
  }, [bookingId])

  const hasAnyData = useMemo(() => {
    return (
      Object.values(memberResultsBySurvey).some((arr) => (arr?.length ?? 0) > 0) ||
      Object.values(partnerResultsBySurvey).some((arr) => (arr?.length ?? 0) > 0)
    )
  }, [memberResultsBySurvey, partnerResultsBySurvey])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <UIButton variant="ghost" size="sm" asChild>
          <Link href="/counselor/appointments">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Link>
        </UIButton>
        <div className="flex items-center gap-2">
          <UsersIcon className="h-6 w-6 text-purple-600" />
          <h1 className="text-2xl font-bold">Kết quả khảo sát cặp đôi</h1>
        </div>
        <UIBadge variant="outline" className="ml-2 bg-purple-50 border-purple-200">
          <UsersIcon className="h-3 w-3 mr-1" />
          Cặp đôi
        </UIBadge>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <User className="h-4 w-4" />
        <span>
          {memberName} & {partnerName}
        </span>
      </div>
      {coupleData && (
        <div className="text-sm text-gray-500">
          Ngày tạo: {formatDate(coupleData.createAt)} • Mã truy cập: {coupleData.accessCode}
        </div>
      )}

      <div ref={exportRef} className="space-y-6">
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
        ) : !hasAnyData ? (
          <div className="rounded-md border p-4 bg-gray-50 text-gray-600 flex items-start gap-2">
            <Info className="h-5 w-5 mt-0.5" />
            <div>
              <div className="font-medium">Không có dữ liệu</div>
              <div className="text-sm">Chưa có kết quả khảo sát cho cặp đôi này.</div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex border-b border-gray-200">
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "member"
                    ? "border-b-2 border-purple-600 text-purple-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("member")}
              >
                {memberName}
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "partner"
                    ? "border-b-2 border-purple-600 text-purple-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("partner")}
              >
                {partnerName}
              </button>
            </div>
            <div>
              <div className={activeTab === "member" ? "block" : "hidden"}>
                {coupleData && (
                  <MemberSurveys
                    member={coupleData.member}
                    resultsBySurvey={memberResultsBySurvey}
                    title={memberName}
                  />
                )}
              </div>
              <div className={activeTab === "partner" ? "block" : "hidden"}>
                {coupleData && (
                  <MemberSurveys
                    member={coupleData.member1}
                    resultsBySurvey={partnerResultsBySurvey}
                    title={partnerName}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <Separator className="my-6" />

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {hasAnyData && (
            <UIButton onClick={handleExportPDF} disabled={exporting}>
              <Download className="h-4 w-4 mr-2" />
              {exporting ? "Đang xuất..." : "Xuất PDF"}
            </UIButton>
          )}
        </div>
      </div>
    </div>
  )
}
