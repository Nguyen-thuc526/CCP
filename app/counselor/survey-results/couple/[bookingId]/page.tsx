import { CoupleSurveyResults } from '@/components/counselor/appointment/survey/couple-survey-results';

interface CoupleSurveyResultsPageProps {
   params: Promise<{ bookingId: string }>;
   searchParams: Promise<{ memberName?: string; partnerName?: string }>;
}

export default async function CoupleSurveyResultsPage({
   params,
   searchParams,
}: CoupleSurveyResultsPageProps) {
   const resolvedParams = await params;
   const resolvedSearchParams = await searchParams;
   const { bookingId } = resolvedParams;
   const { memberName = 'Thành viên 1', partnerName = 'Thành viên 2' } =
      resolvedSearchParams;

   return (
      <div className="space-y-6">
         <CoupleSurveyResults
            bookingId={bookingId}
            memberName={memberName}
            partnerName={partnerName}
         />
      </div>
   );
}
