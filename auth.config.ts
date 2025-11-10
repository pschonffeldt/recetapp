import { NextResponse } from "next/server";

export const authConfig = {
  pages: { signIn: "/login" },

  callbacks: {
    async jwt({ token, user }: any) {
      if (user?.id) token.id = user.id;
      if (!token.id && token.sub) token.id = token.sub;
      return token;
    },
    async session({ session, token }: any) {
      const id = (token as any).id ?? token.sub;
      if (session.user && id) (session.user as any).id = id as string;
      return session;
    },
    authorized({ auth, request: { nextUrl } }: any) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) return isLoggedIn;
      if (isLoggedIn)
        return NextResponse.redirect(new URL("/dashboard", nextUrl));
      return true;
    },
  },

  // KEEP EMPTY HERE; providers are attached in auth.ts only
  providers: [],
};
