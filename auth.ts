import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";
import type { DbUserRow } from "@/app/lib/types/definitions";
import bcrypt from "bcryptjs";
import postgres from "postgres";

/** Reuse a single SQL client in dev to avoid connection leaks on hot reloads */
const globalForSql = globalThis as unknown as {
  __sql?: ReturnType<typeof postgres>;
};
const sql =
  globalForSql.__sql ?? postgres(process.env.POSTGRES_URL!, { ssl: "require" });
if (process.env.NODE_ENV !== "production") globalForSql.__sql = sql;

async function getUserByEmail(email: string): Promise<DbUserRow | undefined> {
  const emailLower = email.toLowerCase().trim();
  try {
    const rows = await sql<DbUserRow[]>/* sql */ `
      SELECT id, name, last_name, email, password, country, language, user_role
      FROM public.users
      WHERE LOWER(email) = ${emailLower}
      LIMIT 1
    `;
    return rows[0];
  } catch (err) {
    console.error("getUserByEmail failed:", err);
    return undefined;
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        try {
          const parsed = z
            .object({
              email: z.string().email(),
              password: z.string().min(6),
            })
            .safeParse(raw);
          if (!parsed.success) return null;

          const { email, password } = parsed.data;
          const user = await getUserByEmail(email);
          if (!user) {
            console.warn("authorize(): user not found for", email);
            return null;
          }

          if (!user.password) {
            console.warn("authorize(): user has no password set", user.id);
            return null;
          }

          const ok = await bcrypt.compare(password, user.password);
          if (!ok) {
            console.warn("authorize(): bad password for", user.id);
            return null;
          }

          // Minimal session payload (role included)
          return {
            id: user.id,
            name: user.name ?? null,
            email: user.email ?? null,
            user_role: user.user_role ?? "user",
          } as any;
        } catch (err) {
          console.error("authorize() failed:", err);
          return null;
        }
      },
    }),
  ],

  // Track successful logins
  events: {
    async signIn({ user }) {
      try {
        const id = (user as any)?.id;
        if (!id) return;

        await sql/* sql */ `
        UPDATE public.users
        SET last_login_at = NOW()
        WHERE id = ${id}::uuid
      `;
      } catch (err) {
        console.error("Failed to update last_login_at:", err);
      }
    },
  },
});
