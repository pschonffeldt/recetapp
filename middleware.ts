import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth({
  ...authConfig,
  providers: [], // must be mutable; middleware runs on Edge
}).auth;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
