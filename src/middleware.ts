import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePath = ["/manage"];
const publicPath = ["/login"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log(">>> check pathname: " + pathname);
  const isAuth = Boolean(request.cookies.get("accessToken"));
  if (privatePath.some((path) => pathname.startsWith(path)) && !isAuth) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (publicPath.some((path) => pathname.startsWith(path)) && isAuth) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/manage/:path*", "/login"],
};
