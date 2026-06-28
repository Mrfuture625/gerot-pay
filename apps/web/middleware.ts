import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("KryptPay_session")?.value;
  const pathname = request.nextUrl.pathname;

  const protectedRoutes = [
    "/dashboard",
    "/cards",
    "/activity",
    "/reload",
    "/withdraw",
    "/referrals",
    "/support",
    "/account",
    "/admin",
  ];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/cards/:path*",
    "/activity/:path*",
    "/reload/:path*",
    "/withdraw/:path*",
    "/referrals/:path*",
    "/support/:path*",
    "/account/:path*",
    "/admin/:path*",
  ],
};