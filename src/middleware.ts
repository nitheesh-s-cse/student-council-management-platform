import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";

// Edge-safe first line of defense: redirect unauthenticated visitors away
// from protected areas before any page code runs. This is a UX shortcut
// only — every server component/route handler independently re-verifies
// the session and role against the database, since client-visible cookies
// must never be trusted for authorization decisions.
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/chat",
  "/tasks",
  "/teams",
  "/polls",
  "/notifications",
  "/profile",
  "/settings",
  "/secure-control",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (!isProtected) return NextResponse.next();

  const hasSession = request.cookies.has(SESSION_COOKIE);
  if (!hasSession) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/chat/:path*",
    "/tasks/:path*",
    "/teams/:path*",
    "/polls/:path*",
    "/notifications/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/secure-control/:path*",
  ],
};
