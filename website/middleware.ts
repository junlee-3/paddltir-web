import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://app.paddltir.com";

/**
 * Legacy path: the Vite SPA used to live under /app on the marketing host.
 * Send those URLs to the dedicated app subdomain.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const dest =
    pathname === "/app" || pathname === "/app/"
      ? APP_URL
      : `${APP_URL}${pathname.replace(/^\/app/, "") || "/"}`;
  return NextResponse.redirect(dest, 308);
}

export const config = {
  matcher: ["/app", "/app/:path*"],
};
