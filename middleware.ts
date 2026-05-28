import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0] || "";
  const { pathname } = request.nextUrl;

  if (host.startsWith("kiosk.") && pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/kiosk";
    return NextResponse.rewrite(url);
  }

  if (host.startsWith("admin.") && pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
