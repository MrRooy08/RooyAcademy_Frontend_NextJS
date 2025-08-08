import { NextResponse } from "next/server";
export async function middleware(req) {

  const protectedRoutes = ['/user-profile', '/admin','/dashboard'];

  const pathname = req.nextUrl.pathname;

  // Redirect root URL '/' to '/courses'
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/courses", req.url));
  }

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  let access_token = req.cookies.get("access_token")?.value;
  if (isProtectedRoute && !access_token) { 
      return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/','/dashboard/:path*'],
};
