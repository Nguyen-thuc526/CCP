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
  Target,
  User,
  BarChart3,
  TrendingUp,
  Info,
  Clock,
  Star,
  Download,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { format as formatFn } from "date-fns"
import { vi as viLocale } from "date-fns/locale"
import { useEffect, useMemo, useRef, useState } from "react"
import { bookingService } from "@/services/bookingService"

// libs for PDF
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

const SURVEY_IDS = ["SV001", "SV002", "SV003", "SV004"] as const
export type SurveyId = (typeof SURVEY_IDS)[number]

// Detail returned by get-by-name
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
  // enriched by get-by-name
  typeDetail?: PersonTypeDetail
}

interface IndividualSurveyResultsDialogProps {
  isOpen: boolean
  onClose: () => void
  memberName: string
  memberId: string
  bookingId: string
}

const surveyConfig: Record<SurveyId, { name: string; icon: any; color: string; description: string }> = {
  SV001: { name: "MBTI", icon: BrainIcon, color: "blue", description: "Chỉ số tính cách Myers-Briggs" },
  SV002: { name: "DISC", icon: Target, color: "green", description: "Phong cách hành vi và giao tiếp" },
  SV003: { name: "Love Languages", icon: Heart, color: "pink", description: "Ngôn ngữ tình yêu" },
  SV004: { name: "Big Five", icon: BarChart3, color: "purple", description: "Năm yếu tố tính cách lớn" },
}

function formatDate(dateString: string) {
  return formatFn(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: viLocale })
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

export function IndividualSurveyResultsDialog({
  isOpen,
  onClose,
  memberName,
  memberId,
  bookingId,
}: IndividualSurveyResultsDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resultsBySurvey, setResultsBySurvey] = useState<Partial<Record<SurveyId, SurveyResult[]>>>({})

  // UI state for expand detail per card (keyed by `${surveyId}-${createAt}`)
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
      if (!isOpen) return
      setLoading(true)
      setError(null)
      try {
        const pairs = await Promise.all(
          SURVEY_IDS.map(async (sid) => {
            const res = await bookingService.personTypeBeforeBooking({ memberId, surveyId: sid, bookingId })
            const items = normalizePersonTypeResponses(sid, res?.data)
            items.sort((a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime())

            // enrich each item with get-by-name (best-effort)
            await Promise.all(
              items.map(async (it) => {
                if (!it.result) return
                try {
                  const r = await bookingService.getPersonTypeByName({ name: it.result, surveyId: sid })
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
        if (!cancelled) setError(e?.message || "Không thể tải kết quả khảo sát")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchAll()
    return () => {
      cancelled = true
    }
  }, [isOpen, memberId, bookingId])

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
              {renderScoreChart(mergedScores)}
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
                  dangerouslySetInnerHTML={{ __html: result.typeDetail.detail! }}
                />
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
        {/* exportable region */}
        <div ref={exportRef} className="space-y-6">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <User className="h-6 w-6 text-blue-600" />
              Kết quả khảo sát cá nhân
            </DialogTitle>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{memberName}</span>
              <UIBadge variant="outline" className="ml-2">
                Cá nhân
              </UIBadge>
            </div>
          </DialogHeader>

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
            <UIButton variant="outline" onClick={onClose}>
              Đóng
            </UIButton>
            <UIButton onClick={handleExportPDF} disabled={exporting}>
              <Download className="h-4 w-4 mr-2" />
              {exporting ? "Đang xuất..." : "Xuất PDF"}
            </UIButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
