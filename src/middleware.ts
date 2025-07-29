import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value; // <- cookie থেকে নাও
  const url = request.nextUrl.clone();
  const { pathname } = url;

  // Protect /dashboard
  if (pathname.startsWith("/dashboard") && !token) {
    url.pathname = "/login";
    url.searchParams.set("from", pathname); // চাইলে back redirect করতে পারো
    return NextResponse.redirect(url);
  }

  // If logged-in user hits /login, push him to /dashboard
  if (pathname === "/login" && token) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
