'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Role } from '@/utils/enum';

type Props = {
   allowed: Role[];
   children: React.ReactNode;
};

export default function RoleGuard({ allowed, children }: Props) {
   const router = useRouter();
   const pathname = usePathname();
   const { role, isAuthenticated } = useSelector((s: RootState) => s.auth);

   useEffect(() => {
      if (!isAuthenticated || !role) {
         router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
         return;
      }
      if (!allowed.includes(role)) {
         if (role === Role.Admin) router.replace('/admin/dashboard');
         else if (role === Role.Counselor)
            router.replace('/counselor/dashboard');
         else router.replace('/login');
      }
   }, [isAuthenticated, role, allowed, router, pathname]);

   if (!isAuthenticated || !role || !allowed.includes(role)) return null;

   return <>{children}</>;
}
