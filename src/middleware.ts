import { NextResponse, type NextRequest } from 'next/server'
import { Role } from './constants/type'
import { TokenPayload } from './types/jwt.types'
import jwt from 'jsonwebtoken'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { defaultLocale, locales } from './i18n/config'

export default createMiddleware(routing)
const handleI18nRouting = createMiddleware({
  locales,
  defaultLocale
})

const managePaths = ['/vi/manage', '/en/manage']
const guestPaths = ['/vi/guest', '/en/guest']
const onlyOwnerPaths = ['/vi/manage/accounts', '/en/manage/accounts']
const privatePaths = [...managePaths, ...guestPaths]
const unAuthPaths = ['/vi/login', '/en/login']

export const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayload
}

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  // pathname: /manage/dashboard
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value
  const locale = request.cookies.get('NEXT_LOCALE')?.value ?? defaultLocale

  const response = handleI18nRouting(request)

  // Chưa đăng nhập thì không cho vào private paths
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const url = new URL(`/${locale}/login`, request.url)
    url.searchParams.set('clearTokens', 'true')
    return NextResponse.redirect(url)
    // response.headers.set('x-middleware-rewrite', url.toString())
    // return response
  }

  // 2: Đã đăng nhập
  if (refreshToken) {
    // 2.1:Không cho vào trang login nữa
    if (unAuthPaths.some((path) => pathname.startsWith(path)) && refreshToken) {
      return NextResponse.redirect(new URL(`/${locale}`, request.url))
      // response.headers.set('x-middleware-rewrite', new URL('/', request.url).toString())
      // return response
    }

    // 2.2: Nhưng Access token lại hết hạn
    if (privatePaths.some((path) => pathname.startsWith(path)) && !accessToken) {
      // Truy cập vào trang refresh-token
      const url = new URL(`/${locale}/refresh-token`, request.url)
      url.searchParams.set('refreshToken', refreshToken)
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
      // response.headers.set('x-middleware-rewrite', url.toString())
      // return response
    }

    //2.3: Vào trang không đúng quyền hạn thì chuyển về trang chủ
    const role = decodeToken(refreshToken).role
    const isGuestToManagePath = role === Role.Guest && managePaths.some((path) => pathname.startsWith(path))
    const isNotGuestToGuestPath = role !== Role.Guest && guestPaths.some((path) => pathname.startsWith(path))
    const isNotOwnerToOwnerPath = role !== Role.Owner && onlyOwnerPaths.some((path) => pathname.startsWith(path))
    if (isGuestToManagePath || isNotGuestToGuestPath || isNotOwnerToOwnerPath) {
      return NextResponse.redirect(new URL(`/${locale}`, request.url))
      // response.headers.set('x-middleware-rewrite', new URL('/', request.url).toString())
      // return response
    }

    return response
  }

  // return NextResponse.next()
  return response
}

// See "Matching Paths" below to learn more
export const config = {
  // matcher: ['/manage/:path*', '/login']
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
}
