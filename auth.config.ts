import { NextResponse } from "next/server";

// Minimal shapes to satisfy TS without pulling next-auth types
type JwtCbArgs = {
  token: Record<string, any>;
  user?: { id?: string | null } | null;
};

type SessionCbArgs = {
  session: { user?: Record<string, any> | null };
  token: Record<string, any>;
};

type AuthorizedCbArgs = {
  auth: { user?: Record<string, any> | null } | null;
  request: { nextUrl: URL };
};

export const authConfig = {
  pages: { signIn: "/login" },

  callbacks: {
    async jwt({ token, user }: JwtCbArgs) {
      // When a user signs in, NextAuth gives you `user` once.
      if (user?.id) token.id = user.id;
      // On later runs, there is no `user`, so ensure we still have an id.
      if (!token.id && token.sub) token.id = token.sub;
      return token;
    },

    async session({ session, token }: SessionCbArgs) {
      // Copy id onto the session for both server/client usage.
      const id = (token as any).id ?? token.sub;
      if (session.user && id) {
        (session.user as any).id = id as string;
      }
      return session;
    },

    authorized({ auth, request: { nextUrl } }: AuthorizedCbArgs) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) return isLoggedIn;
      if (isLoggedIn)
        return NextResponse.redirect(new URL("/dashboard", nextUrl));
      return true;
    },
  },

  providers: [], // real providers are added in auth.ts
} as const;
