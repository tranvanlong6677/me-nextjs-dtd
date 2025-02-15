import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeToken } from './lib/utils';
import { Role } from './constants/type';

const managePaths = ['/manage'];
const guestPaths = ['/guest'];
const privatePaths = [...managePaths, ...guestPaths];
const unAuthPaths = ['/login'];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // pathname: /manage/dashboard
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  // Chưa đăng nhập thì không cho vào private paths
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const url = new URL('/login', request.url);
    url.searchParams.set('clearTokens', 'true');
    return NextResponse.redirect(url);
  }

  // 2: Đã đăng nhập
  if (refreshToken) {
    // 2.1:Không cho vào trang login nữa
    if (unAuthPaths.some((path) => pathname.startsWith(path)) && refreshToken) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // 2.2: Nhưng Access token lại hết hạn
    if (
      privatePaths.some((path) => pathname.startsWith(path)) &&
      !accessToken
    ) {
      // Truy cập vào trang refresh-token
      const url = new URL('/refresh-token', request.url);
      url.searchParams.set('refreshToken', refreshToken);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    //2.3: Vào trang không đúng quyền hạn thì chuyển về trang chủ
    const role = decodeToken(refreshToken).role;
    if (
      (role === Role.Guest &&
        managePaths.some((path) => pathname.startsWith(path))) ||
      (role !== Role.Guest &&
        guestPaths.some((path) => pathname.startsWith(path)))
    ) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/manage/:path*', '/login'],
};
