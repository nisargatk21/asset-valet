import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const PUBLIC = ["/login", "/signup", "/api/auth/login", "/api/auth/signup"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("av_token")?.value;
  const isPublic = PUBLIC.some(p => pathname.startsWith(p));

  if (isPublic) {
    if (token && (pathname === "/login" || pathname === "/signup")) {
      const s = await verifyToken(token);
      if (s) return NextResponse.redirect(new URL(s.role === "admin" ? "/dashboard" : "/employee", req.url));
    }
    return NextResponse.next();
  }

  if (!token) return NextResponse.redirect(new URL("/login", req.url));
  const s = await verifyToken(token);
  if (!s) {
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.set("av_token", "", { maxAge: 0, path: "/" });
    return res;
  }
  if (pathname.startsWith("/dashboard") && s.role !== "admin")
    return NextResponse.redirect(new URL("/employee", req.url));
  if (pathname.startsWith("/employee") && s.role === "admin")
    return NextResponse.redirect(new URL("/dashboard", req.url));
  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
