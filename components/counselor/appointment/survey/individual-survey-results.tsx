"use client"
import { Button as UIButton } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge as UIBadge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  BrainIcon,
  User,
  BarChart3,
  TrendingUp,
  Info,
  Clock,
  Star,
  Download,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
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

interface IndividualSurveyResultsProps {
  memberName: string
  memberId: string
  bookingId: string
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

function calculateMBTIPercentages(scores: Record<string, number>): Record<string, number> {
  const mbtiPairs = [
    { key: "E/I", traits: ["E", "I"] },
    { key: "S/N", traits: ["S", "N"] },
    { key: "T/F", traits: ["T", "F"] },
    { key: "J/P", traits: ["J", "P"] },
  ]

  const percentages: Record<string, number> = {}

  mbtiPairs.forEach(({ key, traits }) => {
    const [trait1, trait2] = traits
    const score1 = scores[trait1] || 0
    const score2 = scores[trait2] || 0
    const total = score1 + score2

    if (total > 0) {
      const dominant = score1 >= score2 ? trait1 : trait2
      const dominantScore = score1 >= score2 ? score1 : score2
      const percentage = Math.round((dominantScore / total) * 100)
      percentages[key] = percentage
    }
  })

  return percentages
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

export function IndividualSurveyResults({ memberName, memberId, bookingId }: IndividualSurveyResultsProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resultsBySurvey, setResultsBySurvey] = useState<Partial<Record<SurveyId, SurveyResult[]>>>({})

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
      pdf.save(`ket-qua-khao-sat-${memberName.replace(/\s+/g, "-").toLowerCase()}.pdf`)
    } catch (e) {
      console.error(e)
    } finally {
      setExporting(false)
    }
  }

  useEffect(() => {
    let cancelled = false

    async function fetchAll() {
      setLoading(true)
      setError(null)

      try {
        const pairs = await Promise.all(
          SURVEY_IDS.map(async (sid) => {
            const safeFetch = async () => {
              try {
                const res = await bookingService.personTypeBeforeBooking({
                  memberId,
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
              }),
            )

            return [sid, items] as const
          }),
        )

        if (!cancelled) {
          const grouped: Partial<Record<SurveyId, SurveyResult[]>> = {}
          pairs.forEach(([sid, items]) => (grouped[sid] = items))
          setResultsBySurvey(grouped)
        }
      } catch (e: any) {
        if (!cancelled) {
          setError("Không thể tải kết quả khảo sát")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchAll()
    return () => {
      cancelled = true
    }
  }, [memberId, bookingId])

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

  const renderScoreChart = (scores: Record<string, number>, surveyId?: SurveyId) => {
    // Special handling for MBTI (SV001)
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

    // Original logic for other surveys
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

  const renderCompactSurveyCard = (result: SurveyResult, showDate = false) => {
    const config = surveyConfig[result.surveyId]
    const Icon = config.icon

    const mergedDescription = result.typeDetail?.description ?? result.description
    const mergedScores = Object.keys(result.typeDetail?.scores ?? {}).length ? result.typeDetail!.scores : result.scores

    const key = `${result.surveyId}-${result.createAt}`
    const isExpanded = !!expanded[key]

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
                onClick={() => setExpanded((s) => ({ ...s, [key]: !s[key] }))}
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
          <User className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Kết quả khảo sát cá nhân</h1>
        </div>
        <UIBadge variant="outline" className="ml-2">
          Cá nhân
        </UIBadge>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <User className="h-4 w-4" />
        <span>{memberName}</span>
      </div>

      <div ref={exportRef} className="space-y-6">
        <div className="space-y-6">
          {Object.keys(latestResults).length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-5 w-5 text-yellow-600" />
                <h3 className="text-lg font-semibold">Kết quả mới nhất</h3>
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
                <h3 className="text-lg font-semibold">Lịch sử khảo sát</h3>
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
        </div>
      </div>

      <Separator className="my-6" />

      <div className="flex items-center justify-between gap-4">
        {loading ? (
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <BrainIcon className="h-4 w-4 animate-pulse" /> Đang tải kết quả...
          </div>
        ) : error ? (
          <div className="text-sm text-red-600">{error}</div>
        ) : !hasAny ? (
          <div className="text-sm text-gray-500">Không có dữ liệu khảo sát.</div>
        ) : null}

        <div className="flex items-center gap-2">
          <UIButton onClick={handleExportPDF} disabled={exporting}>
            <Download className="h-4 w-4 mr-2" />
            {exporting ? "Đang xuất..." : "Xuất PDF"}
          </UIButton>
        </div>
      </div>
    </div>
  )
}
