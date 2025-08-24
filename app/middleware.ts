import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

enum Role {
   Admin = 1,
   Counselor = 2,
}

export function middleware(req: NextRequest) {
   const { pathname, searchParams } = req.nextUrl;
   const roleCookie = req.cookies.get('role')?.value;
   const role = roleCookie ? Number(roleCookie) : undefined;

   // Các route cần bảo vệ
   const isAdminArea = pathname.startsWith('/admin');
   const isCounselorArea = pathname.startsWith('/counselor');
   const isLogin = pathname === '/login';

   // Chưa đăng nhập mà vào khu vực private -> chuyển về /login
   if ((isAdminArea || isCounselorArea) && !role) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set(
         'redirect',
         pathname +
            (searchParams.toString() ? `?${searchParams.toString()}` : '')
      );
      return NextResponse.redirect(url);
   }

   // Đã đăng nhập mà vào /login -> đẩy về dashboard theo role
   if (isLogin && role) {
      const url = req.nextUrl.clone();
      url.pathname =
         role === Role.Admin ? '/admin/dashboard' : '/counselor/dashboard';
      return NextResponse.redirect(url);
   }

   // Chặn sai vai trò khi vào khu vực role khác
   if (isCounselorArea && role !== Role.Counselor) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/dashboard';
      return NextResponse.redirect(url);
   }
   if (isAdminArea && role !== Role.Admin) {
      const url = req.nextUrl.clone();
      url.pathname = '/counselor/dashboard';
      return NextResponse.redirect(url);
   }

   return NextResponse.next();
}

export const config = {
   matcher: ['/admin/:path*', '/counselor/:path*', '/login'],
};
