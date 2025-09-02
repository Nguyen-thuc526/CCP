
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
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
} from 'lucide-react';
import { format as formatFn } from 'date-fns';
import { vi as viLocale } from 'date-fns/locale';
import { bookingService } from '@/services/bookingService';
import { useToast, ToastType } from '@/hooks/useToast';

interface NoteForm {
   problemSummary: string;
   problemAnalysis: string;
   guides: string;
}

interface FormErrors {
   problemSummary: string;
   guides: string;
}

interface BookingInfo {
   type: 'individual' | 'couple';
   memberName: string;
   partnerName?: string;
   memberId: string;
   partnerId?: string;
}

interface CallSidebarProps {
   isOpen: boolean;
   onToggle: () => void;
   notes: NoteForm;
   onSaveNotes: (form: NoteForm) => Promise<void>;
   bookingInfo: BookingInfo | null;
   bookingId: string;
   loading?: boolean;
}

interface SurveyResult {
   surveyId: string;
   result: string;
   description: string;
   scores: Record<string, number>;
   createAt: string;
   typeDetail?: {
      name: string;
      description: string;
      detail?: string;
      image?: string;
   };
}

interface CoupleData {
   member: {
      id: string;
      fullname: string;
      avatar: string | null;
   };
   member1: {
      id: string;
      fullname: string;
      avatar: string | null;
   };
   mbti: string | null;
   disc: string | null;
   loveLanguage: string | null;
   bigFive: string | null;
   mbti1: string | null;
   disc1: string | null;
   loveLanguage1: string | null;
   bigFive1: string | null;
   mbtiDescription: string | null;
   discDescription: string | null;
   loveLanguageDescription: string | null;
   bigFiveDescription: string | null;
   mbti1Description: string | null;
   disc1Description: string | null;
   loveLanguage1Description: string | null;
   bigFive1Description: string | null;
   createAt: string;

   // compatibility details
   mbtiDetail?: {
      id: string;
      description: string;
      detail: string;
      compatibility: number;
      image: string;
      weaknesses: string;
      strongPoints: string;
      category: { name: string };
      personType: { name: string; description: string };
      personType2: { name: string; description: string };
   };
   discDetail?: {
      id: string;
      description: string;
      detail: string;
      compatibility: number;
      image: string;
      weaknesses: string;
      strongPoints: string;
      category: { name: string };
      personType: { name: string; description: string };
      personType2: { name: string; description: string };
   };
   loveLanguageDetail?: {
      id: string;
      description: string;
      detail: string;
      compatibility: number;
      image: string;
      weaknesses: string;
      strongPoints: string;
      category: { name: string };
      personType: { name: string; description: string };
      personType2: { name: string; description: string };
   };
   bigFiveDetail?: {
      id: string;
      description: string;
      detail: string;
      compatibility: number;
      image: string;
      weaknesses: string;
      strongPoints: string;
      category: { name: string };
      personType: { name: string; description: string };
      personType2: { name: string; description: string };
   };
}

const SURVEY_IDS = ['SV001', 'SV002', 'SV003', 'SV004'] as const;
const surveyConfig = {
   SV001: { name: 'MBTI', icon: BrainIcon, color: 'blue' },
   SV002: { name: 'DISC', icon: Target, color: 'green' },
   SV003: { name: 'Love Language', icon: Heart, color: 'pink' },
   SV004: { name: 'Big Five', icon: BarChart3, color: 'purple' },
};

const MBTI_TRAITS = {
   E: { name: 'Extraversion', vietnamese: 'Hướng ngoại' },
   I: { name: 'Introversion', vietnamese: 'Hướng nội' },
   S: { name: 'Sensing', vietnamese: 'Giác quan' },
   N: { name: 'iNtuition', vietnamese: 'Trực giác' },
   T: { name: 'Thinking', vietnamese: 'Lý trí' },
   F: { name: 'Feeling', vietnamese: 'Cảm xúc' },
   J: { name: 'Judging', vietnamese: 'Nguyên tắc' },
   P: { name: 'Perceiving', vietnamese: 'Linh hoạt' },
};

function formatDate(dateString: string) {
   return formatFn(new Date(dateString), 'dd/MM/yyyy HH:mm', {
      locale: viLocale,
   });
}

function parseScores(
   description: string | null | undefined
): Record<string, number> {
   if (!description) return {};
   const obj: Record<string, number> = {};
   description.split(/[,|]/).forEach((pair) => {
      const [k, v] = pair.split(':').map((s) => s.trim());
      if (k && v && !Number.isNaN(Number(v))) obj[k] = Number(v);
   });
   return obj;
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
      problemSummary: '',
      problemAnalysis: '',
      guides: '',
   });
   const [formErrors, setFormErrors] = useState<FormErrors>({
      problemSummary: '',
      guides: '',
   });
   const [isSending, setIsSending] = useState(false);
   const [collapsedSections, setCollapsedSections] = useState({
      problemSummary: false,
      problemAnalysis: false,
      guides: false,
   });
   const [individualResults, setIndividualResults] = useState<
      Record<string, SurveyResult[]>
   >({});
   const [coupleData, setCoupleData] = useState<CoupleData | null>(null);
   const [loadingSurvey, setLoadingSurvey] = useState(false);
   const { showToast } = useToast();

   useEffect(() => {
      setNoteForm({
         problemSummary: notes.problemSummary || '',
         problemAnalysis: notes.problemAnalysis || '',
         guides: notes.guides || '',
      });
      setFormErrors({ problemSummary: '', guides: '' });
   }, [notes]);

 const handleSaveAndSend = async () => {
  const errors: FormErrors = { problemSummary: '', guides: '' };
  if (!noteForm.problemSummary.trim())
    errors.problemSummary = 'Tóm tắt vấn đề là bắt buộc';
  if (!noteForm.guides.trim()) errors.guides = 'Hướng dẫn là bắt buộc';
  setFormErrors(errors);
  if (errors.problemSummary || errors.guides) return;

  setIsSending(true);
  try {
    // Luôn cập nhật note
    const metadataUpdates: Promise<any>[] = [
      bookingService.updateNote({
        bookingId,
        problemSummary: noteForm.problemSummary,
        problemAnalysis: noteForm.problemAnalysis,
        guides: noteForm.guides,
      }),
    ];

    // Xác định duy nhất 1 giá trị reportMetadata cần gửi
    let reportMetadata: string | null = null;
    if (bookingInfo?.type === 'individual') {
      reportMetadata = '1';
    } else if (bookingInfo?.type === 'couple') {
      reportMetadata = coupleData ? '4' : '3'; // Nếu có coupleData => chỉ gửi 4
    }

    if (reportMetadata) {
      metadataUpdates.push(
        bookingService.updateReportMetadata({
          bookingId,
          reportMetadata,
        })
      );
    }

    await Promise.all(metadataUpdates);
    await onSaveNotes(noteForm);
    onToggle(); // Đóng sidebar sau khi lưu thành công
  } catch (error) {
    showToast('Có lỗi xảy ra khi lưu và gửi', ToastType.Error);
  } finally {
    setIsSending(false);
  }
};

   const toggleSection = (section: keyof typeof collapsedSections) => {
      setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }));
   };

   const loadSurveyResults = async () => {
      if (!bookingInfo) return;
      setLoadingSurvey(true);
      try {
         if (bookingInfo.type === 'individual') {
            const results: Record<string, SurveyResult[]> = {};
            for (const surveyId of SURVEY_IDS) {
               try {
                  const response = await bookingService.personTypeBeforeBooking({
                     memberId: bookingInfo.memberId,
                     surveyId,
                     bookingId,
                  });
                  if (response?.data) {
                     const data = Array.isArray(response.data)
                        ? response.data
                        : [response.data];
                     const sortedResults = data
                        .map((item: any) => ({
                           surveyId,
                           result: item.result || item.type || '',
                           description: item.description || '',
                           scores: item.scores || parseScores(item.rawScores) || {},
                           createAt: item.createAt || new Date().toISOString(),
                        }))
                        .sort(
                           (a: SurveyResult, b: SurveyResult) =>
                              new Date(b.createAt).getTime() -
                              new Date(a.createAt).getTime()
                        );
                     results[surveyId] = sortedResults;
                  }
               } catch {
                  // ignore missing data
               }
            }
            setIndividualResults(results);
         } else {
            // Luôn gọi personTypeBeforeBooking cho cả hai thành viên nếu là couple
            const results: Record<string, SurveyResult[]> = {};
            for (const surveyId of SURVEY_IDS) {
               try {
                  const [memberResult, partnerResult] = await Promise.all([
                     bookingService.personTypeBeforeBooking({
                        memberId: bookingInfo.memberId,
                        surveyId,
                        bookingId,
                     }),
                     bookingInfo.partnerId
                        ? bookingService.personTypeBeforeBooking({
                             memberId: bookingInfo.partnerId,
                             surveyId,
                             bookingId,
                          })
                        : null,
                  ]);

                  if (memberResult?.data) {
                     const data = Array.isArray(memberResult.data)
                        ? memberResult.data
                        : [memberResult.data];
                     results[`${surveyId}_member`] = data.map((item: any) => ({
                        surveyId,
                        result: item.result || item.type || '',
                        description: item.description || '',
                        scores: item.scores || parseScores(item.rawScores) || {},
                        createAt: item.createAt || new Date().toISOString(),
                     }));
                  }
                  if (bookingInfo.partnerId && partnerResult?.data) {
                     const data = Array.isArray(partnerResult.data)
                        ? partnerResult.data
                        : [partnerResult.data];
                     results[`${surveyId}_partner`] = data.map((item: any) => ({
                        surveyId,
                        result: item.result || item.type || '',
                        description: item.description || '',
                        scores: item.scores || parseScores(item.rawScores) || {},
                        createAt: item.createAt || new Date().toISOString(),
                     }));
                  }
               } catch {
                  // ignore missing data
               }
            }
            setIndividualResults(results);

            // Chỉ gọi getCoupleByBooking nếu cần kiểm tra dữ liệu cặp đôi đã tồn tại
            try {
               const response = await bookingService.getCoupleByBooking(bookingId);
               if (response?.data) {
                  setCoupleData(response.data);
               }
            } catch {
               // Nếu không có dữ liệu cặp đôi, vẫn sử dụng individualResults
            }
         }
      } catch (error) {
         console.error('Error fetching survey data:', error);
      } finally {
         setLoadingSurvey(false);
      }
   };

   const renderMBTIChart = (scores: Record<string, number>) => {
      const mbtiPairs = [
         { left: 'E', right: 'I', key: 'E/I' },
         { left: 'S', right: 'N', key: 'S/N' },
         { left: 'T', right: 'F', key: 'T/F' },
         { left: 'J', right: 'P', key: 'J/P' },
      ];

      return (
         <div className="space-y-3">
            {mbtiPairs.map((pair) => {
               const leftScore = scores[pair.left] || 0;
               const rightScore = scores[pair.right] || 0;
               const total = leftScore + rightScore;
               if (total === 0) return null;

               const leftPercentage = Math.round((leftScore / total) * 100);
               const rightPercentage = Math.round((rightScore / total) * 100);
               const dominantTrait =
                  leftScore > rightScore ? pair.left : pair.right;
               const dominantPercentage = Math.max(
                  leftPercentage,
                  rightPercentage
               );
               const progressValue =
                  leftScore > rightScore
                     ? leftPercentage
                     : 100 - rightPercentage;

               const dominantTraitInfo =
                  MBTI_TRAITS[dominantTrait as keyof typeof MBTI_TRAITS];
               const leftTraitInfo =
                  MBTI_TRAITS[pair.left as keyof typeof MBTI_TRAITS];
               const rightTraitInfo =
                  MBTI_TRAITS[pair.right as keyof typeof MBTI_TRAITS];

               return (
                  <div key={pair.key} className="space-y-1">
                     <div className="text-center">
                        <span className="text-xs font-semibold text-blue-700">
                           {dominantPercentage}% {dominantTraitInfo.name} (
                           {dominantTraitInfo.vietnamese})
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
               );
            })}
         </div>
      );
   };

   const renderScoreChart = (
      scores: Record<string, number>,
      surveyId?: string
   ) => {
      if (surveyId === 'SV001') return renderMBTIChart(scores);
      const maxScore = Math.max(1, ...Object.values(scores));
      return (
         <div className="space-y-2">
            {Object.entries(scores).map(([key, value]) => (
               <div key={key} className="space-y-1">
                  <div className="flex justify-between text-xs">
                     <span className="font-medium">{key}</span>
                     <span className="text-gray-600">{value}</span>
                  </div>
                  <Progress
                     value={(value / maxScore) * 100}
                     className="h-1.5"
                  />
               </div>
            ))}
         </div>
      );
   };

   const renderIndividualSurvey = (
      surveyId: string,
      results: SurveyResult[],
      memberName: string
   ) => {
      if (!results || results.length === 0) return null;
      const config = surveyConfig[surveyId as keyof typeof surveyConfig];
      const Icon = config.icon;
      const latestResult = results[0];

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
                     <TrendingUp
                        className={`h-3 w-3 text-${config.color}-600`}
                     />
                     <span
                        className={`font-semibold text-${config.color}-900 text-sm`}
                     >
                        {latestResult.result || '(trống)'}
                     </span>
                  </div>
                  {latestResult.description && (
                     <p className="text-xs text-gray-700 leading-relaxed">
                        {latestResult.description}
                     </p>
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
      );
   };

   const renderCompatibilityCard = (data: CoupleData) => {
      const blocks = [
         {
            key: 'mbti',
            title: 'MBTI',
            icon: BrainIcon,
            color: 'blue',
            detail: data.mbtiDetail,
         },
         {
            key: 'disc',
            title: 'DISC',
            icon: Target,
            color: 'green',
            detail: data.discDetail,
         },
         {
            key: 'loveLanguage',
            title: 'Love Language',
            icon: Heart,
            color: 'pink',
            detail: data.loveLanguageDetail,
         },
         {
            key: 'bigFive',
            title: 'Big Five',
            icon: BarChart3,
            color: 'purple',
            detail: data.bigFiveDetail,
         },
      ].filter((b) => b.detail);

      if (blocks.length === 0) return null;

      return (
         <div className="space-y-4">
            {blocks.map(({ key, title, icon: Icon, color, detail }: any) => (
               <Card key={key} className="border">
                  <CardHeader className="pb-2">
                     <CardTitle className="text-sm flex items-center gap-2">
                        <Icon className={`h-4 w-4 text-${color}-600`} />
                        {title}
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                     <div
                        className={`flex items-center justify-between p-3 bg-${color}-50 rounded-lg border border-${color}-100`}
                     >
                        <div className="flex items-center gap-3">
                           {detail.image && (
                              <img
                                 src={detail.image || '/placeholder.svg'}
                                 alt="Compatibility"
                                 className="w-12 h-12 object-contain"
                              />
                           )}
                           <div>
                              <div
                                 className={`text-2xl font-bold text-${color}-900`}
                              >
                                 {detail.compatibility}%
                              </div>
                              <div
                                 className={`text-xs font-medium text-${color}-700`}
                              >
                                 Độ tương thích
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-1">
                        <div className="text-xs font-semibold text-gray-900">
                           {detail.personType?.name} &{' '}
                           {detail.personType2?.name}
                        </div>
                        <div className="text-xs text-gray-600">
                           {detail.category?.name}
                        </div>
                     </div>

                     <div className="space-y-1">
                        <Progress
                           value={detail.compatibility}
                           className="h-2 rounded-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                           <span>0%</span>
                           <span>100%</span>
                        </div>
                     </div>

                     {detail.description && (
                        <div className="p-2 bg-gray-50 rounded text-xs text-gray-700 leading-relaxed">
                           {detail.description}
                        </div>
                     )}

                     {detail.detail && (
                        <details className="group">
                           <summary className="cursor-pointer text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1">
                              <ChevronDown className="h-3 w-3 group-open:rotate-180 transition-transform" />
                              Xem chi tiết
                           </summary>
                           <div className="mt-2 space-y-3">
                              <div
                                 className="prose prose-xs max-w-none text-gray-700 text-xs leading-relaxed"
                                 dangerouslySetInnerHTML={{
                                    __html: detail.detail,
                                 }}
                              />

                              <div className="space-y-3">
                                 {detail.strongPoints && (
                                    <div
                                       className={`p-2 bg-green-50 rounded border border-green-100`}
                                    >
                                       <h4 className="text-xs font-semibold text-green-900 mb-1 flex items-center gap-1">
                                          <Star className="h-3 w-3" />
                                          Điểm mạnh
                                       </h4>
                                       <div
                                          className="prose prose-xs max-w-none text-green-800 text-xs"
                                          dangerouslySetInnerHTML={{
                                             __html: detail.strongPoints,
                                          }}
                                       />
                                    </div>
                                 )}
                                 {detail.weaknesses && (
                                    <div className="p-2 bg-orange-50 rounded border border-orange-100">
                                       <h4 className="text-xs font-semibold text-orange-900 mb-1 flex items-center gap-1">
                                          <Info className="h-3 w-3" />
                                          Thách thức
                                       </h4>
                                       <div
                                          className="prose prose-xs max-w-none text-orange-800 text-xs"
                                          dangerouslySetInnerHTML={{
                                             __html: detail.weaknesses,
                                          }}
                                       />
                                    </div>
                                 )}
                              </div>
                           </div>
                        </details>
                     )}
                  </CardContent>
               </Card>
            ))}
         </div>
      );
   };

   const renderCoupleSurvey = () => {
      if (loadingSurvey) {
         return (
            <div className="text-center py-8">
               <BrainIcon className="h-8 w-8 animate-pulse mx-auto mb-2 text-blue-600" />
               <div className="text-sm text-gray-500">
                  Đang tải kết quả khảo sát...
               </div>
            </div>
         );
      }

      if (!coupleData && bookingInfo?.type === 'couple') {
         return (
            <Tabs defaultValue="member">
               <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="member" className="flex items-center gap-2">
                     <User className="h-4 w-4 text-blue-600" />
                     {bookingInfo.memberName}
                  </TabsTrigger>
                  {bookingInfo.partnerName && (
                     <TabsTrigger value="partner" className="flex items-center gap-2">
                        <User className="h-4 w-4 text-green-600" />
                        {bookingInfo.partnerName}
                     </TabsTrigger>
                  )}
               </TabsList>
               <TabsContent value="member" className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                     <Star className="h-4 w-4 text-yellow-600" />
                     <h3 className="text-base font-semibold">
                        Kết quả khảo sát - {bookingInfo.memberName}
                     </h3>
                  </div>
                  {Object.keys(individualResults)
                     .filter((key) => key.endsWith('_member'))
                     .length === 0 ? (
                     <div className="text-center py-8">
                        <Info className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <div className="text-sm text-gray-500">
                           Chưa có kết quả khảo sát cho {bookingInfo.memberName}.
                        </div>
                     </div>
                  ) : (
                     <div className="grid grid-cols-1 gap-4">
                        {SURVEY_IDS.map((surveyId) =>
                           renderIndividualSurvey(
                              surveyId,
                              individualResults[`${surveyId}_member`] || [],
                              bookingInfo.memberName
                           )
                        )}
                     </div>
                  )}
               </TabsContent>
               {bookingInfo.partnerName && (
                  <TabsContent value="partner" className="space-y-4">
                     <div className="flex items-center gap-2 mb-4">
                        <Star className="h-4 w-4 text-yellow-600" />
                        <h3 className="text-base font-semibold">
                           Kết quả khảo sát - {bookingInfo.partnerName}
                        </h3>
                     </div>
                     {Object.keys(individualResults)
                        .filter((key) => key.endsWith('_partner'))
                        .length === 0 ? (
                        <div className="text-center py-8">
                           <Info className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                           <div className="text-sm text-gray-500">
                              Chưa có kết quả khảo sát cho {bookingInfo.partnerName}.
                           </div>
                        </div>
                     ) : (
                        <div className="grid grid-cols-1 gap-4">
                           {SURVEY_IDS.map((surveyId) =>
                              renderIndividualSurvey(
                                 surveyId,
                                 individualResults[`${surveyId}_partner`] || [],
                                 bookingInfo.partnerName || ''
                              )
                           )}
                        </div>
                     )}
                  </TabsContent>
               )}
            </Tabs>
         );
      }

      if (!coupleData) {
         return (
            <div className="text-center py-10">
               <div className="text-sm text-gray-500">
                  Chưa có thông tin khảo sát.
               </div>
            </div>
         );
      }

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
      };

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
      };

      const renderMemberData = (
         memberData: typeof member1Data,
         title: string
      ) => (
         <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
               <User className="h-4 w-4 text-blue-600" />
               {title}
            </h4>
            <div className="space-y-3">
               {memberData.mbti && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                     <div className="flex items-center gap-2 mb-2">
                        <BrainIcon className="h-4 w-4 text-blue-600" />
                        <span className="font-semibold text-blue-900 text-sm">
                           MBTI: {memberData.mbti}
                        </span>
                     </div>
                     {Object.keys(memberData.mbtiScores).length > 0 &&
                        renderMBTIChart(memberData.mbtiScores)}
                  </div>
               )}
               {memberData.disc && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                     <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-green-900 text-sm">
                           DISC: {memberData.disc}
                        </span>
                     </div>
                     {Object.keys(memberData.discScores).length > 0 &&
                        renderScoreChart(memberData.discScores)}
                  </div>
               )}
               {memberData.loveLanguage && (
                  <div className="p-3 bg-pink-50 rounded-lg border border-pink-100">
                     <div className="flex items-center gap-2 mb-2">
                        <Heart className="h-4 w-4 text-pink-600" />
                        <span className="font-semibold text-pink-900 text-sm">
                           Love Language: {memberData.loveLanguage}
                        </span>
                     </div>
                     {Object.keys(memberData.loveLanguageScores).length > 0 &&
                        renderScoreChart(memberData.loveLanguageScores)}
                  </div>
               )}
               {memberData.bigFive && (
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                     <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="h-4 w-4 text-purple-600" />
                        <span className="font-semibold text-purple-900 text-sm">
                           Big Five: {memberData.bigFive}
                        </span>
                     </div>
                     {Object.keys(memberData.bigFiveScores).length > 0 &&
                        renderScoreChart(memberData.bigFiveScores)}
                  </div>
               )}
            </div>
         </div>
      );

      return (
         <div className="space-y-6">
            <div className="flex items-center justify-between">
               <div className="text-xs text-gray-500">
                  Ngày tạo: {formatDate(coupleData.createAt)}
               </div>
            </div>

            <Card className="border border-blue-100">
               <CardHeader className="bg-blue-50 py-3">
                  <CardTitle className="text-base flex items-center gap-2">
                     <UsersIcon className="h-5 w-5 text-blue-600" />
                     Kết quả khảo sát cá nhân
                  </CardTitle>
               </CardHeader>
               <CardContent className="p-4">
                  <div className="space-y-6">
                     {renderMemberData(member1Data, member1Data.name)}
                     <div className="border-t border-gray-200 pt-4">
                        {renderMemberData(member2Data, member2Data.name)}
                     </div>
                  </div>
               </CardContent>
            </Card>

            <div className="space-y-4">
               <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <h3 className="text-base font-semibold text-gray-900">
                     Phân tích tương thích
                  </h3>
               </div>
               {renderCompatibilityCard(coupleData)}
            </div>
         </div>
      );
   };

   return (
      <div
         className={`fixed top-0 right-0 h-full bg-white border-l shadow-lg transition-all duration-300 z-50 ${isOpen ? 'w-96' : 'w-0'} overflow-hidden`}
      >
         {/* Toggle Button */}
         <Button
            onClick={onToggle}
            variant="outline"
            size="sm"
            className="absolute -left-10 top-1/2 transform -translate-y-1/2 rounded-l-md rounded-r-none border-r-0 bg-white hover:bg-gray-50"
         >
            {isOpen ? (
               <ChevronRight className="h-4 w-4" />
            ) : (
               <ChevronLeft className="h-4 w-4" />
            )}
         </Button>

         {/* Sidebar Content */}
         <Tabs defaultValue="notes" className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b bg-gray-50">
               <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                     value="notes"
                     className="flex items-center gap-2"
                  >
                     <FileText className="h-4 w-4" />
                     Ghi chú
                  </TabsTrigger>
                  <TabsTrigger
                     value="survey"
                     className="flex items-center gap-2"
                     onClick={loadSurveyResults}
                  >
                     <BarChart3 className="h-4 w-4" />
                     Khảo sát
                  </TabsTrigger>
               </TabsList>
            </div>

            {/* Notes Tab Content */}
            <TabsContent
               value="notes"
               className="flex-1 overflow-y-auto p-4 m-0"
            >
               <div className="space-y-4">
                  {/* Problem Summary */}
                  <Card>
                     <CardHeader
                        className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => toggleSection('problemSummary')}
                     >
                        <CardTitle className="text-sm flex items-center gap-2">
                           <FileText className="h-4 w-4 text-blue-600" />
                           Tóm tắt vấn đề
                           <Badge
                              variant="destructive"
                              className="ml-2 text-xs"
                           >
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
                              className={`resize-none text-sm ${formErrors.problemSummary ? 'border-red-500' : ''}`}
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
                        onClick={() => toggleSection('problemAnalysis')}
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
                        onClick={() => toggleSection('guides')}
                     >
                        <CardTitle className="text-sm flex items-center gap-2">
                           <Lightbulb className="h-4 w-4 text-amber-600" />
                           Hướng dẫn
                           <Badge
                              variant="destructive"
                              className="ml-2 text-xs"
                           >
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
                              className={`resize-none text-sm ${formErrors.guides ? 'border-red-500' : ''}`}
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

                  <Button
                     onClick={handleSaveAndSend}
                     className="w-full"
                     disabled={isSending}
                  >
                     {isSending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                     ) : (
                        <Send className="h-4 w-4 mr-2" />
                     )}
                     {isSending ? 'Đang gửi...' : 'Lưu và gửi'}
                  </Button>
               </div>
            </TabsContent>

            {/* Survey Tab Content */}
            <TabsContent
               value="survey"
               className="flex-1 overflow-y-auto p-4 m-0"
            >
               <div className="space-y-4">
                  {loadingSurvey ? (
                     <div className="text-center py-8">
                        <BrainIcon className="h-8 w-8 animate-pulse mx-auto mb-2 text-blue-600" />
                        <div className="text-sm text-gray-500">
                           Đang tải kết quả khảo sát...
                        </div>
                     </div>
                  ) : bookingInfo?.type === 'individual' ? (
                     <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                           <Star className="h-4 w-4 text-yellow-600" />
                           <h3 className="text-base font-semibold">
                              Kết quả mới nhất - {bookingInfo.memberName}
                           </h3>
                        </div>
                        {Object.keys(individualResults).length === 0 ? (
                           <div className="text-center py-8">
                              <Info className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                              <div className="text-sm text-gray-500">
                                 Chưa có kết quả khảo sát
                              </div>
                           </div>
                        ) : (
                           <div className="grid grid-cols-1 gap-4">
                              {SURVEY_IDS.map((surveyId) =>
                                 renderIndividualSurvey(
                                    surveyId,
                                    individualResults[surveyId] || [],
                                    bookingInfo.memberName
                                 )
                              )}
                           </div>
                        )}
                     </div>
                  ) : (
                     renderCoupleSurvey()
                  )}
               </div>
            </TabsContent>
         </Tabs>
      </div>
   );
}