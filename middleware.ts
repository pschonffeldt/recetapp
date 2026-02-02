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

const AUTH_ROUTES = ["/login", "/signup"];

function isProtectedPath(path: string) {
  return PROTECTED_PREFIXES.some((p) => path === p || path.startsWith(p + "/"));
}

export default auth((req) => {
  const { nextUrl } = req;
  const path = nextUrl.pathname;

  const isLoggedIn = !!req.auth?.user;
  const isAuthRoute = AUTH_ROUTES.includes(path);

  // Redirect unauthenticated users away from protected routes
  if (!isLoggedIn && isProtectedPath(path)) {
    const url = nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(url);
  }

  // Redirect logged-in users away from login/signup
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // protected areas
    "/dashboard/:path*",
    "/recipes/:path*",
    "/shopping-list/:path*",
    "/notifications/:path*",
    "/discover/:path*",
    "/account/:path*",
    "/admin/:path*",
    "/support/:path*",

    // auth routes (so logged-in users get bounced)
    "/login",
    "/signup",
  ],
};
