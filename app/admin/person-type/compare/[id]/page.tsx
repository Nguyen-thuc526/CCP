'use client';
import PersonalityComparison from '@/components/admin/person-type/personality-comparison';
import { useParams } from 'next/navigation';

export default function Page() {
   const params = useParams();
   const initialPersonTypeId = params.id as string;

   return <PersonalityComparison initialPersonTypeId={initialPersonTypeId} />;
}
