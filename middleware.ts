import { auth } from "@/auth";
import { NextResponse } from "next/server";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/recipes",
  "/shopping-list",
  "/notifications",
  "/discover",
  "/account",
  "/admin",
  "/support",
];

const ADMIN_PREFIXES = ["/admin"];

const AUTH_ROUTES = ["/login", "/signup"];

function matchesPrefix(path: string, prefixes: string[]) {
  return prefixes.some((p) => path === p || path.startsWith(p + "/"));
}

export default auth((req) => {
  const { nextUrl } = req;
  const path = nextUrl.pathname;

  const isLoggedIn = !!req.auth?.user;
  const role = (req.auth?.user as any)?.user_role;
  const isAdmin = role === "admin";

  const isProtected = matchesPrefix(path, PROTECTED_PREFIXES);
  const isAdminRoute = matchesPrefix(path, ADMIN_PREFIXES);
  const isAuthRoute = AUTH_ROUTES.includes(path);

  // Not logged in → block protected routes
  if (!isLoggedIn && isProtected) {
    const url = nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(url);
  }

  // Logged in but NOT admin → block admin routes
  if (isLoggedIn && isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
    // or rewrite to /404 if you prefer
  }

  // Logged in → block login/signup
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/recipes/:path*",
    "/shopping-list/:path*",
    "/notifications/:path*",
    "/discover/:path*",
    "/account/:path*",
    "/admin/:path*",
    "/support/:path*",
    "/login",
    "/signup",
  ],
};
