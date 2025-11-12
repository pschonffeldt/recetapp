// middleware.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const path = nextUrl.pathname;

  // Skip obvious asset requests (handle this in code, not in the matcher)
  // If the request is for a static image file, don’t run any auth/redirect logic—just let it through.
  if (/\.(png|jpg|jpeg|svg|gif|ico)$/i.test(path)) {
    return NextResponse.next();
  }

  const isLoggedIn = !!req.auth?.user;
  const isDashboard = path.startsWith("/dashboard");
  const isAuthRoute = path === "/login" || path === "/signup";

  if (!isLoggedIn && isDashboard) {
    const url = new URL("/login", nextUrl);
    url.searchParams.set("callbackUrl", nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(url);
  }

  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  // Simple, capture-free matcher per Next.js docs
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
  runtime: "nodejs",
};
