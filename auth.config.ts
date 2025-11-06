import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

export const authConfig = {
  pages: { signIn: "/login" },

  callbacks: {
    // persist the DB id on the JWT
    async jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      return token;
    },

    // expose it on the session so server/client can read it
    async session({ session, token }) {
      if (token?.id) (session.user as any).id = token.id as string;
      return session;
    },

    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) return isLoggedIn;
      if (isLoggedIn)
        return NextResponse.redirect(new URL("/dashboard", nextUrl));
      return true;
    },
  },

  providers: [], // providers are added in auth.ts
} satisfies NextAuthConfig;
