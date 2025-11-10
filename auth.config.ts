import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

export const authConfig = {
  pages: { signIn: "/login" },

  callbacks: {
    async jwt({ token, user }) {
      // When a user signs in, NextAuth gives you `user` once.
      if (user?.id) token.id = user.id;
      // On later runs, there is no `user`, so ensure we still have an id.
      if (!token.id && token.sub) token.id = token.sub;
      return token;
    },

    async session({ session, token }) {
      // Copy id onto the session for both server/client usage.
      const id = (token as any).id ?? token.sub;
      if (session.user && id) {
        (session.user as any).id = id as string;
      }
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

  providers: [], // add your real providers in auth.ts
} satisfies NextAuthConfig;
