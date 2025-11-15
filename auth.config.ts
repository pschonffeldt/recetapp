export const authConfig = {
  pages: { signIn: "/login" },

  callbacks: {
    async jwt({ token, user }: any) {
      // Copy id
      if (user?.id) token.id = user.id;
      if (!token.id && token.sub) token.id = token.sub;

      // Copy role from authorize() into the JWT
      if (user?.user_role) token.user_role = user.user_role;

      return token;
    },

    async session({ session, token }: any) {
      // Expose id + role to the client session
      const id = (token as any).id ?? token.sub;
      if (session.user && id) (session.user as any).id = id as string;
      (session.user as any).user_role = (token as any).user_role ?? "user";
      return session;
    },
  },

  // Providers are attached in auth.ts
  providers: [],
} as const;
