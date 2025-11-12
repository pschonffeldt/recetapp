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
  },

  // Leave providers empty here; they’re attached in auth.ts
  providers: [],
} as const;
