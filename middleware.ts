import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const publicPaths = [
  "/",
  "/philosophy",
  "/wellness",
  "/arrangements",
  "/memberships",
  "/activities",
  "/contact",
  "/booking",
  "/lunchroom",
  "/eventspace",
  "/signup",
  "/book",
  "/login",
];

const isPublicPath = (pathname: string) => {
  if (pathname === "/") return true;
  return publicPaths.some(
    (path) =>
      path !== "/" && (pathname === path || pathname.startsWith(`${path}/`)),
  );
};

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const role = request.cookies.get("role")?.value;

  if (pathname.startsWith("/admin")) {
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard")) {
    if (role !== "user") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // if (pathname.startsWith("/login") && role) {
  //   const target = role === "admin" ? "/admin" : "/dashboard";
  //   return NextResponse.redirect(new URL(target, request.url));
  // }

  if (!isPublicPath(pathname) && !role) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
