import { NextResponse } from "next/server";
import { parse } from 'cookie'
export async function middleware(req) {
  const cookies = parse(req.headers.get("cookie") || "");
  const token = cookies.accessToken;
  const userNavigatingRoute = req.nextUrl.pathname;

  if (!token) {
    return NextResponse.redirect(new URL("/authentication", req.url));
  }

  console.log("Token:", token);
  try {
    const userResponse = await fetch("http://localhost:8080/users/myInfo", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error(`HTTP error! status: ${userResponse.status}`);
    }

    const userData = await userResponse.json(); // Thông tin người dùng
    console.log("User Data cua middleware:", JSON.stringify(userData));

    const isAdmin = userData?.result?.roles.some((role) => role.name === "ADMIN");

    if (userNavigatingRoute.startsWith("/admin") && !isAdmin){
      return NextResponse.redirect(new URL("/not-found", req.url));
    }
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/authentication", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"], // Các đường dẫn cần kiểm tra
};
