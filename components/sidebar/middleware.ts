// middleware.ts (hoặc src/middleware.ts)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// SỬA THEO SỐ THỰC TẾ CỦA BẠN
const Role = { Admin: 1, Counselor: 2 } as const;

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // Bỏ qua static
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/assets')
  ) {
    return NextResponse.next();
  }

  const roleCookie = req.cookies.get('role')?.value;
  const role = roleCookie ? parseInt(roleCookie, 10) : NaN;
  const isLoggedIn = role === Role.Admin || role === Role.Counselor;

  // Đã login mà vào /login => đẩy về dashboard
  if (pathname === '/login' && isLoggedIn) {
    url.pathname = role === Role.Admin ? '/admin/dashboard' : '/counselor/dashboard';
    return NextResponse.redirect(url);
  }

  // Bảo vệ /admin/*
  if (pathname.startsWith('/admin') && role !== Role.Admin) {
    url.pathname = isLoggedIn ? (role === Role.Counselor ? '/counselor/dashboard' : '/login') : '/login';
    return NextResponse.redirect(url);
  }

  // Bảo vệ /counselor/*
  if (pathname.startsWith('/counselor') && role !== Role.Counselor) {
    url.pathname = isLoggedIn ? (role === Role.Admin ? '/admin/dashboard' : '/login') : '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'],
};
