import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Role } from '@/utils/enum';
import { LoginForm } from '@/components/auth/login-form';

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
   const cookieStore = await cookies();
   const roleCookie = cookieStore.get('role')?.value;
   const counselorStatusCookie = cookieStore.get('counselor_status')?.value;

   if (roleCookie) {
      const r = Number(roleCookie);
      if (r === Role.Admin) {
         redirect('/admin/dashboard');
      } else if (r === Role.Counselor) {
         const status = Number(counselorStatusCookie);
         if (status === 2) {
            // Counselor bị block: xóa cookie và redirect về login
            cookieStore.set('role', '');
            cookieStore.set('counselor_status', '');
            redirect('/login');
         } else if (status === 0) {
            redirect('/counselor/certificates');
         } else {
            redirect('/counselor/dashboard');
         }
      }
   }

   return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
         <LoginForm />
      </div>
   );
}