import { SurveyList } from '@/components/admin/survey-list';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function SurveysPage() {
   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Khảo sát hôn nhân</h1>
            <Button asChild>
               <Link href="/admin/surveys/create">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Thêm khảo sát mới
               </Link>
            </Button>
         </div>
         <SurveyList />
      </div>
   );
}
