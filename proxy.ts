import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "luxebeauty_token";
const MEMBER_COOKIE_NAME = "luxebeauty_member_token";

export function proxy(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const memberToken = request.cookies.get(MEMBER_COOKIE_NAME)?.value;
  const { pathname } = request.nextUrl;

  // Protect Admin Panel routes
  if (pathname.startsWith("/panel")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Redirect authenticated admin away from login page
  if (pathname.startsWith("/login")) {
    if (token) {
      return NextResponse.redirect(new URL("/panel", request.url));
    }
  }

  // Protect Member routes
  if (pathname.startsWith("/profil") || pathname.startsWith("/sohbet")) {
    if (!memberToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// Specify matching routes
export const config = {
  matcher: ["/panel/:path*", "/login", "/profil/:path*", "/sohbet/:path*"],
};
