import { SurveyForm } from '@/components/admin/survey-form';

export default function CreateSurveyPage() {
   return (
      <div className="space-y-6">
         <h1 className="text-3xl font-bold">Thêm khảo sát mới</h1>
         <SurveyForm />
      </div>
   );
}
