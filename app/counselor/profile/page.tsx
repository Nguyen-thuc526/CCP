import { CounselorProfileForm } from '@/components/counselor/profile/CounselorProfileForm';

export default function CounselorProfilePage() {
   return (
      <div className="space-y-6">
         <h1 className="text-3xl font-bold">Hồ sơ của tôi</h1>
         <CounselorProfileForm />
      </div>
   );
}
