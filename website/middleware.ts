import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Serve the Vite SPA shell for /app routes without swallowing /app/assets/*.
 * Missing hashed JS/CSS must 404 (not return index.html), or browsers parse
 * HTML as a module and the app goes blank after deploys.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/app" || pathname === "/app/") {
    const url = request.nextUrl.clone();
    url.pathname = "/app/index.html";
    return NextResponse.rewrite(url);
  }

  if (pathname.startsWith("/app/") && !pathname.startsWith("/app/assets/")) {
    const url = request.nextUrl.clone();
    url.pathname = "/app/index.html";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app", "/app/:path*"],
};
