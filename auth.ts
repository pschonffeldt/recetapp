import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";
import type { User } from "@/app/lib/definitions";
import bcrypt from "bcryptjs";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function getUserByEmail(email: string): Promise<User | undefined> {
  try {
    const rows = await sql<User[]>`
      SELECT id, name, email, password
      FROM public.users
      WHERE email = ${email}
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
            .object({ email: z.string().email(), password: z.string().min(6) })
            .safeParse(raw);
          if (!parsed.success) return null;

          const { email, password } = parsed.data;
          const user = await getUserByEmail(email.toLowerCase().trim());
          if (!user) return null;

          const hashed = (user as any).password as string | undefined;
          if (!hashed) return null;

          const ok = await bcrypt.compare(password, hashed);
          if (!ok) return null;

          return {
            id: user.id,
            name: user.name ?? null,
            email: user.email ?? null,
          } as any;
        } catch (err) {
          console.error("authorize() failed:", err);
          return null;
        }
      },
    }),
  ],
});

export async function logout() {
  "use server";
  await signOut({ redirectTo: "/login" });
}
