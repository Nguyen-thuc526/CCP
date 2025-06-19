import { ConsultationList } from '@/components/counselor/consultation-list';
import { ConsultationFilters } from '@/components/counselor/consultation-filters';

export default function ConsultationsPage() {
   return (
      <div className="space-y-6">
         <h1 className="text-3xl font-bold">Hồ sơ tư vấn</h1>
         <ConsultationFilters />
         <ConsultationList />
      </div>
   );
}
