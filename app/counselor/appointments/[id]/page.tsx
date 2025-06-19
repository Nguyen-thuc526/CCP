import { AppointmentDetail } from '@/components/counselor/appointment/appointment-detail';

interface AppointmentDetailPageProps {
   params: {
      id: string;
   };
}

export default function AppointmentDetailPage({
   params,
}: AppointmentDetailPageProps) {
   return (
      <div className="space-y-6">
         <AppointmentDetail appointmentId={params.id} />
      </div>
   );
}
