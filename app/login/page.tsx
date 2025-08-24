// app/login/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Role } from '@/utils/enum';
import { LoginForm } from '@/components/auth/login-form';

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
   // ⬇️ cookies() là Promise => cần await
   const cookieStore = await cookies();
   const roleCookie = cookieStore.get('role')?.value;

   if (roleCookie) {
      const r = Number(roleCookie);
      redirect(r === Role.Admin ? '/admin/dashboard' : '/counselor/dashboard');
   }

   return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
         <LoginForm />
      </div>
   );
}
