import { IndividualSurveyResults } from '@/components/counselor/appointment/survey/individual-survey-results';

interface IndividualSurveyResultsPageProps {
   params: Promise<{ bookingId: string }>;
   searchParams: Promise<{ memberName?: string; memberId?: string }>;
}

export default async function IndividualSurveyResultsPage({
   params,
   searchParams,
}: IndividualSurveyResultsPageProps) {
   const resolvedParams = await params;
   const resolvedSearchParams = await searchParams;
   const { bookingId } = resolvedParams;
   const { memberName = 'Thành viên', memberId = '' } = resolvedSearchParams;

   return (
      <div className="space-y-6">
         <IndividualSurveyResults
            bookingId={bookingId}
            memberName={memberName}
            memberId={memberId}
         />
      </div>
   );
}
