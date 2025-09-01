import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

enum Role {
   Admin = 1,
   Counselor = 2,
}

export function middleware(req: NextRequest) {
   const { pathname, searchParams } = req.nextUrl;
   const roleCookie = req.cookies.get('role')?.value;
   const counselorStatusCookie = req.cookies.get('counselor_status')?.value;
   const role = roleCookie ? Number(roleCookie) : undefined;
   const counselorStatus = counselorStatusCookie ? Number(counselorStatusCookie) : undefined;

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
      if (role === Role.Counselor && counselorStatus === 2) {
         // Counselor bị block: xóa cookie và redirect về login
         const response = NextResponse.redirect(new URL('/login', req.url));
         response.cookies.set('role', '');
         response.cookies.set('counselor_status', '');
         return response;
      }
      url.pathname =
         role === Role.Admin
            ? '/admin/dashboard'
            : counselorStatus === 1
            ? '/counselor/dashboard'
            : '/counselor/certificates';
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

   // Xử lý trạng thái counselor
   if (isCounselorArea && role === Role.Counselor) {
      if (counselorStatus === 2) {
         // Counselor bị block: xóa cookie và redirect về login
         const response = NextResponse.redirect(new URL('/login', req.url));
         response.cookies.set('role', '');
         response.cookies.set('counselor_status', '');
         return response;
      }
      if (counselorStatus === 0 && pathname !== '/counselor/certificates') {
         // Counselor chưa duyệt: giới hạn ở /counselor/certificates
         return NextResponse.redirect(new URL('/counselor/certificates', req.url));
      }
   }

   return NextResponse.next();
}

export const config = {
   matcher: ['/admin/:path*', '/counselor/:path*', '/login'],
};