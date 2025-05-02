import { NextResponse } from "next/server";
export async function middleware(req) {
  const pathname = req.nextUrl.pathname;
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/user-profile")) {
    return NextResponse.next();
  }

  try {
    let access_token = req.cookies.get("access_token").value;
    console.log("Du lieu accessToken", access_token);
    const response = await fetch("http://localhost:8080/users/myInfo", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const userData = await response.json();
    console.log("Du lieu userData", userData);
    const isAdmin = userData?.result?.roles.some(
      (role) => role.name === "ADMIN"
    );

    if (!isAdmin) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Token không hợp lệ hoặc đã hết hạn", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/user-profile"],
};
